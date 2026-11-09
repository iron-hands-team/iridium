from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Announcement, AnnouncementLike, AnnouncementStar, User, UserRole, NotificationType
from app.schemas import AnnouncementCreateRequest, AnnouncementUpdateRequest, AnnouncementResponse
from app.dependencies import require_staff
from app.notify import create_notification

router = APIRouter(prefix="/announcements", tags=["announcements"])


def add_starred(db: Session, user: User, announcements):
    #Stars are private, so `starred` means like "did THIS user star it?"
    single = not isinstance(announcements, list)
    items = [announcements] if single else announcements
    ids = [a.id for a in items]
    starred_ids = {
        row.announcement_id
        for row in db.query(AnnouncementStar.announcement_id).filter(
            AnnouncementStar.user_id == user.id,
            AnnouncementStar.announcement_id.in_(ids),
        )
    }
    for a in items:
        a.starred = a.id in starred_ids
    return announcements

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
    results = query.order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).all()
    return add_starred(db, current_user, results)

@router.get("/starred", response_model=list[AnnouncementResponse])
def list_starred(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    query = (
        db.query(Announcement)
        .join(AnnouncementStar, AnnouncementStar.announcement_id == Announcement.id)
        .filter(AnnouncementStar.user_id == current_user.id)
    )
    if current_user.role != UserRole.admin:
        query = query.filter(Announcement.archived == False)
        query = query.filter(
            (Announcement.role == "all") | (Announcement.role == current_user.role.value)
        )
    results = query.order_by(Announcement.created_at.desc()).all()
    return add_starred(db, current_user, results)

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

    recipients_query = db.query(User)
    if new_announcement.role != "all":
        recipients_query = recipients_query.filter(User.role == new_announcement.role)
    for recipient in recipients_query.all():
        if recipient.id == current_user.id:
            continue
        create_notification(
            db,
            user_id=recipient.id,
            type=NotificationType.announcement,
            title=f"New announcement: {announcement.title}",
            body=announcement.content[:140],
            link="/",
        )
    db.commit()
    db.refresh(announcement)
    return add_starred(db, current_user, announcement)

@router.patch("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: int,
    updates: AnnouncementUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")
    if current_user.role != UserRole.admin and announcement.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="That's not your announcement.")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(announcement, field, value)
        
    if updates.archived and announcement.archived_at is None:
        announcement.archived_at = datetime.now()

    db.commit()
    db.refresh(announcement)
    return add_starred(db, current_user, announcement)

@router.delete("/{announcement_id}", status_code=204)
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")
    if current_user.role != UserRole.admin and announcement.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="That's not your announcement.")
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
    return add_starred(db, current_user, announcement)

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
    return add_starred(db, current_user, announcement)


@router.post("/{announcement_id}/star", response_model=AnnouncementResponse)
def star_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")
    if current_user.role != UserRole.admin and (
        announcement.archived
        or announcement.role not in ("all", current_user.role.value)
    ):
        raise HTTPException(status_code=404, detail="Announcement not found.")

    existing = (
        db.query(AnnouncementStar)
        .filter(
            AnnouncementStar.announcement_id == announcement_id,
            AnnouncementStar.user_id == current_user.id,
        )
        .first()
    )
    if existing is None:
        db.add(AnnouncementStar(announcement_id=announcement_id, user_id=current_user.id))
        db.commit()
        db.refresh(announcement)
    return add_starred(db, current_user, announcement)

@router.delete("/{announcement_id}/star", response_model=AnnouncementResponse)
def unstar_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found.")

    existing = (
        db.query(AnnouncementStar)
        .filter(
            AnnouncementStar.announcement_id == announcement_id,
            AnnouncementStar.user_id == current_user.id,
        )
        .first()
    )
    if existing is not None:
        db.delete(existing)
        db.commit()
        db.refresh(announcement)
    return add_starred(db, current_user, announcement)