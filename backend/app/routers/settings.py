from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth import verify_password
from app.database import get_db, Base
from app.models import User, Settings
from app.schemas import SettingsRequest, SlowResponse, ClearRequest
from app.dependencies import require_admin, manager
from app.audit import log_action

router = APIRouter()

DURATIONS = {"Seconds": 1, "Minutes": 60, "Hours": 3600}


@router.get("/settings", response_model=SettingsRequest)
def get_settings(db: Session = Depends(get_db), _current_user: User = Depends(manager)):
    settings = db.query(Settings).first()
    data = settings.data if settings else {}
    return {**data, "id": settings.id if settings else None}


@router.post("/settings", status_code=204)
def save_settings(
    settings: SettingsRequest,
    request: Request,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    existing = db.query(Settings).first()
    paused = bool(existing.data.get("paused")) if existing else False
    db.query(Settings).delete()
    data = settings.model_dump(mode="json")
    data["paused"] = paused
    db.add(Settings(data=data))
    log_action(db, "settings_update", actor=_current_user, request=request)
    db.commit()


@router.delete("/settings", status_code=204)
def reset_settings(
    db: Session = Depends(get_db), _current_user: User = Depends(require_admin)
):
    db.query(Settings).delete()
    db.commit()


@router.post("/pause", status_code=204)
def pause_operations(
    clear: ClearRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    password = clear.password
    if not verify_password(password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    settings = db.query(Settings).first()
    if settings is None:
        settings = Settings(data={})
        db.add(settings)
    data = SettingsRequest.model_validate(settings.data)
    data.paused = not data.paused
    settings.data = data.model_dump(mode="json")
    log_action(db, "platform_pause" if data.paused else "platform_resume", actor=current_user, request=request)
    db.commit()


@router.post("/clear", status_code=204)
def clear_data(
    clear: ClearRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    password = clear.password
    if not verify_password(password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    for table in reversed(Base.metadata.sorted_tables):
        if table.name in ("alembic_version", "audit_log"):
            continue  # keep migration state and the audit trail
        if table.name == "users":
            db.execute(table.delete().where(table.c.id != current_user.id))
        else:
            db.execute(table.delete())
    log_action(db, "data_clear", actor=current_user, request=request)
    db.commit()


@router.get("/slow", response_model=SlowResponse)
def get_slow(
    db: Session = Depends(get_db), _current_user: User = Depends(require_admin)
):
    settings = db.query(Settings).first()
    slow = SettingsRequest.model_validate(settings.data if settings else {}).slow
    if not slow.enabled:
        raise HTTPException(status_code=404, detail="Slow mode settings not found")
    return {"seconds": slow.number * DURATIONS[slow.duration]}
