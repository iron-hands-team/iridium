from datetime import datetime, timezone
from database import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import JSONB


def utcnow():
    return datetime.now(timezone.utc)


class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    archived = Column(Boolean, nullable=False, default=False)


class Message(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSONB, nullable=False, default=dict)
