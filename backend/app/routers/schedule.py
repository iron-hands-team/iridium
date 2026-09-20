from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import ScheduleItem, User
from app.schemas import ScheduleItemCreateRequest, ScheduleItemResponse
from app.dependencies import require_staff

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.get("/me", response_model=list[ScheduleItemResponse])
def get_my_schedule(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    return (
        db.query(ScheduleItem)
        .filter(ScheduleItem.user_id == current_user.id)
        .order_by(ScheduleItem.period)
        .all()
    )

@router.get("/{user_id}", response_model=list[ScheduleItemResponse])
def get_user_schedule(
    user_id: int,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    return (
        db.query(ScheduleItem)
        .filter(ScheduleItem.user_id == user_id)
        .order_by(ScheduleItem.period)
        .all()
    )

@router.post("", response_model=ScheduleItemResponse)
def create_schedule_item(
    new_item: ScheduleItemCreateRequest,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    item = ScheduleItem(**new_item.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=204)
def delete_schedule_item(
    item_id: int,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    item = db.query(ScheduleItem).filter(ScheduleItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Schedule item not found.")
    db.delete(item)
    db.commit()