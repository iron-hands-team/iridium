from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import ScheduleItem, User
from app.schemas import (
    ScheduleItemCreateRequest,
    ScheduleItemResponse,
    ScheduleItemUpdateRequest,
    ScheduleCopyRequest,
)
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

@router.post("/copy", response_model=list[ScheduleItemResponse])
def copy_schedule(
    copy_request: ScheduleCopyRequest,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    source_items = (
        db.query(ScheduleItem)
        .filter(ScheduleItem.user_id == copy_request.from_user_id)
        .all()
    )
    if not source_items:
        raise HTTPException(
            status_code=404,
            detail="That user doesn't have any schedule items to copy.",
        )

    if copy_request.overwrite:
        db.query(ScheduleItem).filter(
            ScheduleItem.user_id == copy_request.to_user_id
        ).delete()

    new_items = [
        ScheduleItem(
            user_id=copy_request.to_user_id,
            period=item.period,
            course_name=item.course_name,
            room=item.room,
            start_time=item.start_time,
            end_time=item.end_time,
        )
        for item in source_items
    ]
    db.add_all(new_items)
    db.commit()
    for item in new_items:
        db.refresh(item)
    return sorted(new_items, key=lambda i: i.period)

@router.patch("/{item_id}", response_model=ScheduleItemResponse)
def update_schedule_item(
    item_id: int,
    updates: ScheduleItemUpdateRequest,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    item = db.query(ScheduleItem).filter(ScheduleItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Schedule item not found.")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

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