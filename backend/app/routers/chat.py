from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Channel, User, ChatMessage
from app.schemas import (
    ChannelCreateRequest,
    ChannelResponse,
    ChannelCreateResponse,
    MessageSendRequest,
    ChatMessageResponse,
)
from app.dependencies import require_admin, manager

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/channels", response_model=list[ChannelResponse])
def get_channels(db: Session = Depends(get_db), _current_user: User = Depends(manager)):
    channels = db.query(Channel).all()
    return channels


@router.post("/channels", response_model=ChannelCreateResponse)
def create_channel(
    channel: ChannelCreateRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    existing = db.query(Channel).filter(Channel.name == channel.name).first()
    if existing is not None:
        raise HTTPException(
            status_code=403,
            detail="That channel name already exists, please pick a different one.",
        )
    channel = Channel(
        name=channel.name,
        description=channel.description,
        club_id=channel.club,
        role=channel.role,
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel


@router.get("/channel/{channel_id}", response_model=list[ChatMessageResponse])
def get_messages(
    channel_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    existing = db.query(Channel).filter(Channel.id == channel_id).first()
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Channel with ID {channel_id} not found."
        )
    messages = db.query(ChatMessage).filter(ChatMessage.channel_id == channel_id).all()
    return messages


@router.post("/send", status_code=204)
def send_message(
    message: MessageSendRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    chat_message = ChatMessage(
        text=message.message, channel_id=message.channel_id, user_id=current_user.id
    )
    db.add(chat_message)
    db.commit()
