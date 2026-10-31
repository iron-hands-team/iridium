from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from collections import defaultdict

from app.database import get_db
from app.models import Channel, User, ChatMessage, ClubMembership, ChatReaction, UserRole
from app.schemas import (
    ChannelCreateRequest,
    ChannelResponse,
    ChannelCreateResponse,
    ChannelUpdateRequest,
    MessageSendRequest,
    ChatMessageResponse,
    ChatReactionRequest,
)
from app.dependencies import require_admin, manager

router = APIRouter(prefix="/chat", tags=["chat"])

def get_accessible_channel(channel_id: int, db: Session, current_user: User) -> Channel:
    channel = db.query(Channel).filter(Channel.id == channel_id).first()
    if channel is None:
        raise HTTPException(status_code=404, detail="Channel not found.")
    if current_user.role != UserRole.admin:
        if channel.club_id is not None:
            member = (
                db.query(ClubMembership)            
                .filter(ClubMembership.club_id == channel.club_id,
                        ClubMembership.user_id == current_user.id)
                .first()         
            )
            if member is None:
                raise HTTPException(status_code=403, detail="You're not in this club.")
        if channel.role != "all" and channel.role != current_user.role.value:
            raise HTTPException(status_code=403, detail="You can't access this channel.")
    return channel

@router.get("/channels", response_model=list[ChannelResponse])
def get_channels(db: Session = Depends(get_db), current_user: User = Depends(manager)):
    query = db.query(Channel)

    if current_user.role != "admin":
        clubs = [
            row[0]
            for row in db.query(ClubMembership.club_id)
            .filter(ClubMembership.user_id == current_user.id)
            .all()
        ]
        query = query.filter(or_(Channel.club_id.is_(None), Channel.club_id.in_(clubs)))

    if current_user.role != UserRole.admin:
        query = query.filter(or_(Channel.role == "all", Channel.role == current_user.role.value))

    channels = query.order_by(Channel.name).all()
    for c in channels:
        if c.club_id:
            c.count = (
                db.query(ClubMembership)
                .filter(ClubMembership.club_id == c.club_id)
                .count()
            )
    return channels


@router.post("/channels", response_model=ChannelCreateResponse)
def create_channel(
    channel: ChannelCreateRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    conditions = [Channel.name == channel.name]
    if channel.club is not None:
        conditions.append(Channel.club_id == channel.club)
    existing = db.query(Channel).filter(or_(*conditions)).first()
    if existing is not None:
        raise HTTPException(
            status_code=403,
            detail="A channel with that name or club already exists, please pick a different one.",
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
    existing = get_accessible_channel(channel_id, db, _current_user)
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Channel with ID {channel_id} not found."
        )
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.channel_id == channel_id)
        .order_by(ChatMessage.created_at)
        .all()
    )
    for message in messages:
        emojis: dict[str, list[int]] = defaultdict(list)
        for r in message.reactions:
            emojis[r.emoji].append(r.user_id)
        message.reaction_list = [
            {"emoji": emoji, "users": users} for emoji, users in emojis.items()
        ]
    return messages


@router.patch("/channel/{channel_id}", response_model=ChannelResponse)
def update_channel(
    channel_id: int,
    channel: ChannelUpdateRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    existing = db.query(Channel).filter(Channel.id == channel_id).first()
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Channel with ID {channel_id} not found."
        )
    conditions = [Channel.name == channel.name]
    if channel.club is not None:
        conditions.append(Channel.club_id == channel.club)
    same = db.query(Channel).filter(Channel.id != channel_id, or_(*conditions)).first()
    if same is not None:
        raise HTTPException(
            status_code=403,
            detail="A channel with that name or club already exists, please pick a different one.",
        )

    for field, value in channel.model_dump(exclude_unset=True).items():
        setattr(existing, "club_id" if field == "club" else field, value)
    if channel.club is None:
        existing.club_id = None

    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/channel/{channel_id}", status_code=204)
def delete_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    existing = db.query(Channel).filter(Channel.id == channel_id).first()
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Channel with ID {channel_id} not found."
        )

    db.delete(existing)
    db.commit()


@router.post("/send", status_code=204)
def send_message(
    message: MessageSendRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    if message.channel_id is None:
        raise HTTPException(status_code=400, detail="channel_id is required.")
    get_accessible_channel(message.channel_id, db, current_user)

    if message.replying is not None:
        parent = db.query(ChatMessage).filter(ChatMessage.id == message.replying).first()
        if parent is None or parent.channel_id != message.channel_id:
            raise HTTPException(status_code=400, detail="Invalid reply target.")
        
    chat_message = ChatMessage(
        text=message.message,
        channel_id=message.channel_id,
        replying_to=message.replying,
        user_id=current_user.id,
    )
    db.add(chat_message)
    db.commit()


@router.patch("/message/{message_id}", status_code=204)
def edit_message(
    message_id: int,
    message: MessageSendRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    existing = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Chat message with ID {message_id} not found."
        )
    if existing.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You're not allowed to edit that message."
        )
    existing.text = message.message
    existing.edited = True
    db.commit()


@router.delete("/message/{message_id}", status_code=204)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    existing = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if existing is None:
        raise HTTPException(status_code=404, detail="Message not found.")
    get_accessible_channel(existing.channel_id, db, current_user)
    if current_user.role != "admin" and existing.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You're not allowed to delete that message."
        )
    db.delete(existing)
    db.commit()


@router.post("/react/{message_id}", status_code=204)
def react_message(
    message_id: int,
    reaction: ChatReactionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    target = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if target is None:
        raise HTTPException(status_code=404, detail="Message not found.")
    get_accessible_channel(target.channel_id, db, current_user)
    existing = (
        db.query(ChatReaction)
        .filter(
            ChatReaction.message_id == message_id,
            ChatReaction.user_id == current_user.id,
            ChatReaction.emoji == reaction.emoji,
        )
        .first()
    )
    if existing is not None:
        db.delete(existing)
    else:
        chat_reaction = ChatReaction(
            emoji=reaction.emoji, message_id=message_id, user_id=current_user.id
        )
        db.add(chat_reaction)
    db.commit()
