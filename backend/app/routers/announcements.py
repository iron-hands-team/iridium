from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Announcement, User
from app.schemas import AnnouncementCreateRequest, AnnouncementResponse
from app.dependencies import require_staff

router = APIRouter(prefix="/announcements", tags=["announcements"])

@router.get("", response_model=list[AnnouncementResponse])
def list_announcements(
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()

@router.post("", response_model=AnnouncementResponse)
def create_announcement(
    new_announcement: AnnouncementCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    announcement = Announcement(
        title=new_announcement.title,
        content=new_announcement.content,
        author_id=current_user.id,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

@router.delete("/{announcement_id}", status_code=204)
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")
    db.delete(announcement)
    db.commit()