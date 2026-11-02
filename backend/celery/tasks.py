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
    settings = db.query(Settings).first()
    amount = settings.data.get(type, {})
    if not amount.get("never", {}):
        amount_res = (
            amount.get("number", {}) * DURATION_DAYS[amount.get("duration", {})]
        )
        return datetime.now(timezone.utc) - timedelta(days=amount_res)
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
            data = settings.data.model_dump(mode="json")
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
            db.commit()
            logger.info(f"{num} posts have been archived")


@app.task
def delete_messages():
    with SessionLocal() as db:
        cutoff = get_cutoff("message")
        if cutoff is None:
            logger.info("Message deletion is disabled")
        else:
            messages = db.query(Message).filter(Message.created_at < cutoff)
            num = len(messages)
            messages.delete()
            db.commit()
            logger.info(f"{num} messages have been deleted")
