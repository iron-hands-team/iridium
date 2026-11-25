from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.audit import log_action
from app.database import get_db
from app.dependencies import manager
from app.models import (
    AnnouncementLike,
    AnnouncementStar,
    AttendanceRecord,
    ChatMessage,
    ClassEnrollment,
    ClubMembership,
    EventRSVP,
    Grade,
    Message,
    Notification,
    Report,
    ScheduleItem,
    Submission,
    User,
    UserRole,
)

router = APIRouter(tags=["privacy"])


def _rows(items, fields):
    return [{f: getattr(item, f) for f in fields} for item in items]


@router.get("/users/{username}/export")
def export_user_data(
    username: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    """All personal data Iridium holds about one user, as JSON.

    Allowed for the user themself and for admins. Never includes the password hash.
    """
    user = db.query(User).filter(User.username == username).first()
    if user is None or (current_user.role != UserRole.admin and current_user.id != user.id):
        # Same answer for "missing" and "not allowed" so usernames can't be probed.
        raise HTTPException(status_code=404, detail="User not found.")

    uid = user.id
    data = {
        "profile": {
            "username": user.username,
            "first_name": user.first_name,
            "middle_name": user.middle_name,
            "last_name": user.last_name,
            "role": user.role,
            "title": user.title,
            "has_avatar": bool(user.image),
        },
        "schedule": _rows(
            db.query(ScheduleItem).filter(ScheduleItem.user_id == uid).all(),
            ["period", "course_name", "room", "start_time", "end_time"],
        ),
        "class_enrollments": _rows(
            db.query(ClassEnrollment).filter(ClassEnrollment.student_id == uid).all(),
            ["class_id"],
        ),
        "grades": _rows(
            db.query(Grade).filter(Grade.student_id == uid).all(),
            ["assignment_id", "score"],
        ),
        "submissions": _rows(
            db.query(Submission).filter(Submission.student_id == uid).all(),
            ["assignment_id", "filename", "submitted_at"],
        ),
        "attendance": _rows(
            db.query(AttendanceRecord).filter(AttendanceRecord.student_id == uid).all(),
            ["class_id", "date", "status"],
        ),
        "club_memberships": _rows(
            db.query(ClubMembership).filter(ClubMembership.user_id == uid).all(),
            ["club_id"],
        ),
        "event_rsvps": _rows(
            db.query(EventRSVP).filter(EventRSVP.user_id == uid).all(),
            ["event_id"],
        ),
        "announcement_likes": [r.announcement_id for r in db.query(AnnouncementLike).filter(AnnouncementLike.user_id == uid)],
        "announcement_stars": [r.announcement_id for r in db.query(AnnouncementStar).filter(AnnouncementStar.user_id == uid)],
        "messages_sent": _rows(
            db.query(Message).filter(Message.sender_id == uid).all(),
            ["recipient_id", "subject", "body", "created_at"],
        ),
        "messages_received": _rows(
            db.query(Message).filter(Message.recipient_id == uid).all(),
            ["sender_id", "subject", "body", "created_at"],
        ),
        "chat_messages": _rows(
            db.query(ChatMessage).filter(ChatMessage.user_id == uid).all(),
            ["channel_id", "text", "created_at"],
        ),
        "notifications": _rows(
            db.query(Notification).filter(Notification.user_id == uid).all(),
            ["type", "title", "body", "link", "read", "created_at"],
        ),
        # Anonymous reports are not linked to a user, so they are not included.
        "reports_submitted": _rows(
            db.query(Report).filter(Report.user_id == uid, Report.anonymous == False).all(),  # noqa: E712
            ["type", "title", "description", "resolved"],
        ),
    }

    log_action(db, "data_export", actor=current_user, target=user.username, request=request)
    db.commit()
    return data
