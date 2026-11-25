from fastapi import Request
from sqlalchemy.orm import Session

from app.limiter import client_ip
from app.models import AuditLog, User


def log_action(
    db: Session,
    action: str,
    actor: User | None = None,
    target: str | None = None,
    detail: str | None = None,
    request: Request | None = None,
    actor_username: str | None = None,
) -> None:
    """Add an audit entry to the current session.

    The caller commits it together with its own change, so an action that
    fails and rolls back leaves no entry. Never put passwords, tokens or other
    secrets in `target` or `detail`.
    """
    db.add(
        AuditLog(
            actor_id=actor.id if actor is not None else None,
            actor_username=actor.username if actor is not None else actor_username,
            action=action,
            target=target,
            detail=detail,
            ip=client_ip(request) if request is not None else None,
        )
    )
