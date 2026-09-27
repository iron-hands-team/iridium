from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Announcement, AnnouncementLike, User, UserRole
from app.schemas import AnnouncementCreateRequest, AnnouncementUpdateRequest, AnnouncementResponse
from app.dependencies import require_staff

router = APIRouter(prefix="/announcements", tags=["announcements"])

@router.get("", response_model=list[AnnouncementResponse])
def list_announcements(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    query = db.query(Announcement)
    if current_user.role != UserRole.admin:
        query = query.filter(Announcement.archived == False)
        query = query.filter(
            (Announcement.role == "all") | (Announcement.role == current_user.role.value)
        )
    return query.order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).all()

@router.post("", response_model=AnnouncementResponse)
def create_announcement(
    new_announcement: AnnouncementCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    announcement = Announcement(
        title=new_announcement.title,
        content=new_announcement.content,
        pinned=new_announcement.pinned,
        role=new_announcement.role,
        author_id=current_user.id,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

@router.patch("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: int,
    updates: AnnouncementUpdateRequest,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(announcement, field, value)

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

@router.post("/{announcement_id}/like", response_model=AnnouncementResponse)
def like_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")

    existing = (
        db.query(AnnouncementLike)
        .filter(
            AnnouncementLike.announcement_id == announcement_id,
            AnnouncementLike.user_id == current_user.id,
        )
        .first()
    )
    if existing is None:
        db.add(AnnouncementLike(announcement_id=announcement_id, user_id=current_user.id))
        db.commit()
        db.refresh(announcement)
    return announcement

@router.delete("/{announcement_id}/like", response_model=AnnouncementResponse)
def unlike_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")

    existing = (
        db.query(AnnouncementLike)
        .filter(
            AnnouncementLike.announcement_id == announcement_id,
            AnnouncementLike.user_id == current_user.id,
        )
        .first()
    )
    if existing is not None:
        db.delete(existing)
        db.commit()
        db.refresh(announcement)
    return announcement