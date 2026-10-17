from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Message, User
from app.schemas import MessageCreateRequest, MessageResponse

router = APIRouter(tags=["messages"])

@router.post("/messages", response_model=MessageResponse)
def send_message(
    new_message: MessageCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    recipient = (
        db.query(User)
        .filter(User.username == new_message.recipient_username)
        .first()
    )
    if recipient is None:
        raise HTTPException(status_code=404, detail="Recipient not found.")
    if recipient.id == current_user.id:
        raise HTTPException(status_code=400, detail="You can't message yourself.")

    message = Message(
        sender_id=current_user.id,
        recipient_id=recipient.id,
        subject=new_message.subject,
        body=new_message.body,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

@router.get("/messages", response_model=list[MessageResponse])
def get_inbox(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    return (
        db.query(Message)
        .filter(Message.recipient_id == current_user.id)
        .order_by(Message.created_at.desc())
        .all()
    )

@router.get("/messages/sent", response_model=list[MessageResponse])
def get_sent(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    return (
        db.query(Message)
        .filter(Message.sender_id == current_user.id)
        .order_by(Message.created_at.desc())
        .all()
    )

@router.get("/messages/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    count = (
        db.query(Message)
        .filter(Message.recipient_id == current_user.id, Message.read == False)
        .count()
    )
    return {"count": count}

@router.patch("/messages/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    db.query(Message).filter(
        Message.recipient_id == current_user.id, Message.read == False
    ).update({"read": True})
    db.commit()
    return {"message": "All messages marked as read."}

@router.patch("/messages/{message_id}/read", response_model=MessageResponse)
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    message = db.query(Message).filter(Message.id == message_id).first()
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found.")
    if message.recipient_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You can only mark your own messages as read."
        )
    message.read = True
    db.commit()
    db.refresh(message)
    return message