from datetime import datetime, timezone
from database import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB


def utcnow():
    return datetime.now(timezone.utc)


class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    archived = Column(Boolean, nullable=False, default=False)
    archived_at = Column(DateTime(timezone=True), nullable=True)

class AnnouncementLike(Base):
    __tablename__ = "announcement_likes"
    id = Column(Integer, primary_key=True, index=True)
    announcement_id = Column(Integer, ForeignKey("announcements.id"), nullable=False)

class AnnouncementStar(Base):
    __tablename__ = "announcement_stars"
    id = Column(Integer, primary_key=True, index=True)
    announcement_id = Column(Integer, ForeignKey("announcements.id"), nullable=False)

class ChatReaction(Base):
    __tablename__ = "chat_reactions"
    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer)

class Message(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSONB, nullable=False, default=dict)