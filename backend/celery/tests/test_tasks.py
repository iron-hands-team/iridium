from datetime import datetime, timedelta, timezone

import tasks
from models import (
    Announcement,
    AnnouncementLike,
    AnnouncementStar,
    ChatReaction,
    Message,
    Settings,
)

NOW = datetime.now(timezone.utc)


def days_ago(n):
    return NOW - timedelta(days=n)


def set_settings(db, **overrides):
    data = {
        "archive": {"number": 30, "duration": "Days", "never": False},
        "posts": {"number": 30, "duration": "Days", "never": True},
        "messages": {"number": 30, "duration": "Days", "never": False},
    }
    data.update(overrides)
    db.add(Settings(data=data))
    db.commit()


def add_announcement(db, created_days_ago, archived=False, archived_days_ago=None):
    a = Announcement(
        created_at=days_ago(created_days_ago),
        archived=archived,
        archived_at=days_ago(archived_days_ago) if archived_days_ago is not None else None,
    )
    db.add(a)
    db.commit()
    return a.id


def ids(db, model):
    db.expire_all()
    return {row.id for row in db.query(model)}


# ---- archive_posts -----------------------------------------------------------

def test_archive_posts_archives_old_posts_and_records_when(db):
    set_settings(db, archive={"number": 30, "duration": "Days", "never": False})
    old = add_announcement(db, created_days_ago=40)
    recent = add_announcement(db, created_days_ago=5)

    tasks.archive_posts()

    db.expire_all()
    old_row = db.get(Announcement, old)
    assert old_row.archived is True
    assert old_row.archived_at is not None  # needed so delete_posts can age it
    assert db.get(Announcement, recent).archived is False


def test_archive_posts_does_nothing_when_disabled(db):
    set_settings(db, archive={"number": 30, "duration": "Days", "never": True})
    old = add_announcement(db, created_days_ago=400)
    tasks.archive_posts()
    db.expire_all()
    assert db.get(Announcement, old).archived is False


# ---- delete_posts (regression: it used to delete EVERY announcement) ----------

def test_delete_posts_only_removes_old_archived_posts(db):
    set_settings(db, posts={"number": 10, "duration": "Days", "never": False})
    old_archived = add_announcement(db, 100, archived=True, archived_days_ago=60)
    recent_archived = add_announcement(db, 100, archived=True, archived_days_ago=2)
    old_active = add_announcement(db, 100, archived=False)
    fresh_active = add_announcement(db, 1, archived=False)

    db.add_all([AnnouncementLike(announcement_id=old_archived), AnnouncementStar(announcement_id=old_archived)])
    db.add_all([AnnouncementLike(announcement_id=old_active)])
    db.commit()

    tasks.delete_posts()

    assert ids(db, Announcement) == {recent_archived, old_active, fresh_active}
    assert db.query(AnnouncementLike).filter(AnnouncementLike.announcement_id == old_archived).count() == 0
    assert db.query(AnnouncementStar).filter(AnnouncementStar.announcement_id == old_archived).count() == 0
    assert db.query(AnnouncementLike).filter(AnnouncementLike.announcement_id == old_active).count() == 1


def test_delete_posts_does_nothing_when_disabled(db):
    set_settings(db, posts={"number": 1, "duration": "Days", "never": True})
    a = add_announcement(db, 100, archived=True, archived_days_ago=90)
    tasks.delete_posts()
    assert ids(db, Announcement) == {a}


def test_delete_posts_never_touches_archived_posts_without_a_date(db):
    set_settings(db, posts={"number": 1, "duration": "Days", "never": False})
    a = add_announcement(db, 100, archived=True, archived_days_ago=None)
    tasks.delete_posts()
    assert ids(db, Announcement) == {a}


# ---- delete_messages ---------------------------------------------------------

def test_delete_messages_removes_old_chat_messages_and_their_reactions(db):
    set_settings(db, messages={"number": 7, "duration": "Days", "never": False})
    old = Message(created_at=days_ago(30))
    recent = Message(created_at=days_ago(1))
    db.add_all([old, recent])
    db.commit()
    db.add_all([ChatReaction(message_id=old.id), ChatReaction(message_id=recent.id)])
    db.commit()
    old_id, recent_id = old.id, recent.id

    tasks.delete_messages()

    assert ids(db, Message) == {recent_id}
    assert {r.message_id for r in db.query(ChatReaction)} == {recent_id}


def test_delete_messages_does_nothing_when_disabled(db):
    set_settings(db, messages={"number": 1, "duration": "Days", "never": True})
    db.add(Message(created_at=days_ago(300)))
    db.commit()
    tasks.delete_messages()
    assert db.query(Message).count() == 1
