from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth import manager, verify_password
from app.audit import log_action
from app.database import get_db
from app.dependencies import require_admin
from app.models import User
from app.twofactor import new_secret, provisioning_uri, verify_code

router = APIRouter()

class CodeRequest(BaseModel):
    code: str

class DisableRequest(BaseModel):
    password: str
    code: str

@router.get("/2fa")
def status(current_user: User = Depends(manager)):
    return {"enabled": bool(current_user.totp_enabled)}

@router.post("/2fa/setup")
def setup(db: Session = Depends(get_db), current_user: User = Depends(manager)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled.")
    user.totp_secret = new_secret()
    db.commit()
    return {"secret": user.totp_secret, "uri": provisioning_uri(user.totp_secret, user.username)}

@router.post("/2fa/enable", status_code=204)
def enable(body: CodeRequest, request: Request, db: Session = Depends(get_db), current_user: User = Depends(manager)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if user.totp_enabled or not user.totp_secret:
        raise HTTPException(status_code=400, detail="Start setup first.")
    if not verify_code(user.totp_secret, body.code):
        raise HTTPException(status_code=400, detail="Invalid code.")
    user.totp_enabled = True
    log_action(db, "2fa_enabled", actor=user, request=request)
    db.commit()

@router.post("/2fa/disable", status_code=204)
def disable(body: DisableRequest, request: Request, db: Session = Depends(get_db), current_user: User = Depends(manager)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA is not enabled.")
    if not verify_password(body.password, user.hashed_password) or not verify_code(user.totp_secret, body.code):
        raise HTTPException(status_code=400, detail="Incorrect password or code.")
    user.totp_enabled = False
    user.totp_secret = None
    log_action(db, "2fa_disabled", actor=user, request=request)
    db.commit()

@router.delete("/users/{username}/2fa", status_code=204)
def admin_reset(username: str, request: Request, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    user.totp_enabled = False
    user.totp_secret = None
    log_action(db, "2fa_reset", actor=admin, target=username, request=request)
    db.commit()
