from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.auth import manager
from app.models import User, UserRole, Settings
from app.schemas import SettingsRequest
from app.database import get_db


def require_admin(current_user=Depends(manager)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Ya need to be an admin for that.")
    else:
        return current_user


def require_staff(current_user: User = Depends(manager)):
    if current_user.role not in (UserRole.admin, UserRole.teacher):
        raise HTTPException(status_code=403, detail="Ya need to be staff for that.")
    return current_user


def pause_guard(
    request: Request,
    db: Session = Depends(get_db),
    user: User | None = Depends(manager.optional),
):
    if user is None or request.url.path == "/logout":
        return
    settings = db.query(Settings).first()
    if settings is None:
        return
    settings = SettingsRequest.model_validate(settings.data)
    if not settings.paused or user.role == UserRole.admin:
        return
    raise HTTPException(
        status_code=503,
        detail="Iridium is paused either for maintenance or other circumstances, all normal operations are currently unavailable",
    )
