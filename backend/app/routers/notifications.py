from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Notification, User
from app.schemas import NotificationResponse

router = APIRouter(tags=["notifications"])

@router.get("/notifications", response_model=list[NotificationResponse])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )

@router.get("/notifications/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
): 
    count = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.read == False)
        .count() 
    )
    return {"count": count}

@router.patch("/notifications/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id, Notification.read == False
    ).update({"read": True})
    db.commit()
    return {"message": "All notifications marked as read."}

@router.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found.")
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You can only mark your own notifications as read."
        )
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification