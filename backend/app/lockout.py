from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models import LoginThrottle

MAX_FAILED = 5
LOCK_MINUTES = 15
STALE_DAYS = 1


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _get(db: Session, username: str, ip: str) -> LoginThrottle | None:
    return db.query(LoginThrottle).filter_by(username=username, ip=ip).first()


def is_locked(db: Session, username: str, ip: str) -> bool:
    row = _get(db, username, ip)
    return row is not None and row.locked_until is not None and row.locked_until > _now()


def register_failure(db: Session, username: str, ip: str) -> bool:
    # per username + ip, so a stranger can't lock the real user out from elsewhere
    row = _get(db, username, ip)
    if row is None:
        row = LoginThrottle(username=username, ip=ip, failed=0)
        db.add(row)
    row.failed += 1
    row.updated_at = _now()
    locked = row.failed >= MAX_FAILED
    if locked:
        row.locked_until = _now() + timedelta(minutes=LOCK_MINUTES)
        row.failed = 0
    db.query(LoginThrottle).filter(LoginThrottle.updated_at < _now() - timedelta(days=STALE_DAYS)).delete()
    return locked


def register_success(db: Session, username: str, ip: str) -> None:
    db.query(LoginThrottle).filter_by(username=username, ip=ip).delete()
