from sqlalchemy.orm import Session

from app.models import Notification, NotificationType

def create_notification(
    db: Session,
    user_id: int,
    type: NotificationType,
    title: str,
    body: str | None = None,
    link: str | None=None
) -> Notification:

    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        body=body,
        link=link,
    )
    db.add(notification)
    return notification