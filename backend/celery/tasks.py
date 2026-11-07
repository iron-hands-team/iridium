import logging
from datetime import date, datetime, timedelta, timezone

from app import app
from database import SessionLocal
from models import Announcement, Message, Settings
from schemas import SettingsRequest

DURATION_DAYS = {
    "Hours": 1 / 24,
    "Days": 1,
    "Weeks": 7,
    "Months": 30,
    "Years": 365,
}

logger = logging.getLogger(__name__)


def get_cutoff(type: str):
    with SessionLocal() as db:
        settings = db.query(Settings).first()
        data = SettingsRequest.model_validate(settings.data if settings else {})
        amount = getattr(data, type)
        if not amount.never:
            amount_res = amount.number * DURATION_DAYS[amount.duration]
            return (
                datetime.now(timezone.utc)
                - timedelta(days=amount_res)
                + timedelta(days=50)
            )
        else:
            return None


@app.task
def archive_posts():
    with SessionLocal() as db:
        cutoff = get_cutoff("archive")
        if cutoff is None:
            logger.info("Post archiving is disabled")
        else:
            settings = db.query(Settings).first()
            posts = (
                db.query(Announcement)
                .filter(
                    Announcement.created_at < cutoff, Announcement.archived == False
                )
                .all()
            )
            num = len(posts)
            for post in posts:
                post.archived = True
                post.archived_at = datetime.now()
            db.commit()
            logger.info(f"{num} posts have been archived")


@app.task
def delete_posts():
    with SessionLocal() as db:
        cutoff = get_cutoff("posts")
        if cutoff is None:
            logger.info("Archived post deletion is disabled")
        else:
            settings = db.query(Settings).first()
            posts = db.query(Announcement).filter(
                Announcement.archived_at < cutoff, Announcement.archived == True
            )
            num = posts.count()
            posts.delete()
            db.commit()
            logger.info(f"{num} archived posts have been deleted")


@app.task
def delete_messages():
    with SessionLocal() as db:
        cutoff = get_cutoff("messages")
        if cutoff is None:
            logger.info("Message deletion is disabled")
        else:
            messages = db.query(Message).filter(Message.created_at < cutoff)
            num = messages.count()
            messages.delete()
            db.commit()
            logger.info(f"{num} messages have been deleted")
