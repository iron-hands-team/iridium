from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth import verify_password
from app.database import get_db, Base
from app.models import User, Settings
from app.schemas import SettingsRequest, SettingsResponse
from app.dependencies import require_admin

router = APIRouter()


class PasswordConfirm(BaseModel):
    password: str


@router.get("/settings", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db), _current_user: User = Depends(require_admin)
):
    settings = db.query(Settings).first()
    return SettingsResponse.model_validate(settings.data if settings else {})


@router.post("/settings", status_code=204)
def save_settings(
    settings: SettingsRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    db.query(Settings).delete()
    data = settings.model_dump(mode="json")
    db.add(Settings(data=data))
    db.commit()


@router.post("/pause", status_code=204)
def pause_operations(
    confirm: PasswordConfirm,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    if not verify_password(confirm.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    settings = db.query(Settings).first()
    if settings is None:
        settings = Settings(data={})
        db.add(settings)
    data = settings.data if settings.data else {}
    data["paused"] = True
    settings.data = data
    db.commit()


@router.delete("/clear", status_code=204)
def clear_data(
    confirm: PasswordConfirm,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    if not verify_password(confirm.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    for table in reversed(Base.metadata.sorted_tables):
        if table.name == "alembic_version":
            continue
        if table.name == "users":
            db.execute(table.delete().where(table.c.id != current_user.id))
        else:
            db.execute(table.delete())
    db.commit()