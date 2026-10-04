import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Enum, Text, DateTime, Time, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from app.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class UserRole(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True)
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    image = Column(Boolean, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)

    announcements = relationship("Announcement", back_populates="author")
    clubs_sponsored = relationship("Club", back_populates="sponsor")
    club_memberships = relationship("ClubMembership", back_populates="user")
    events_created = relationship("Event", back_populates="created_by")
    schedule_items = relationship("ScheduleItem", back_populates="user")
    classes_taught = relationship("ClassSection", back_populates="teacher")
    class_enrollments = relationship("ClassEnrollment", back_populates="student")
    announcement_likes = relationship("AnnouncementLike", back_populates="user")
    event_rsvps = relationship("EventRSVP", back_populates="user")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    pinned = Column(Boolean, nullable=False, default=False)
    archived = Column(Boolean, nullable=False, default=False)
    role = Column(String, nullable=False, default="all")  # "all", "student", "teacher", or "admin"

    author = relationship("User", back_populates="announcements")
    like_records = relationship(
        "AnnouncementLike", back_populates="announcement", cascade="all, delete-orphan"
    )

    @property
    def likes(self):
        return [like.user.username for like in self.like_records]

class AnnouncementLike(Base):
    __tablename__ = "announcement_likes"
    id = Column(Integer, primary_key=True, index=True)
    announcement_id = Column(Integer, ForeignKey("announcements.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    announcement = relationship("Announcement", back_populates="like_records")
    user = relationship("User", back_populates="announcement_likes")

class Club(Base):
    __tablename__ = "clubs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    sponsor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    categories = Column(ARRAY(String), nullable=False, default=list)

    sponsor = relationship("User", back_populates="clubs_sponsored")
    members = relationship("ClubMembership", back_populates="club")

class ClubMembership(Base):
    __tablename__ = "club_memberships"
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    club = relationship("Club", back_populates="members")
    user = relationship("User", back_populates="club_memberships")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_by = relationship("User", back_populates="events_created")
    rsvp_records = relationship(
        "EventRSVP", back_populates="event", cascade="all, delete-orphan"
    )

    @property
    def attendees(self):
        return [rsvp.user.username for rsvp in self.rsvp_records]

class EventRSVP(Base):
    __tablename__ = "event_rsvps"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    event = relationship("Event", back_populates="rsvp_records")
    user = relationship("User", back_populates="event_rsvps")

class ScheduleItem(Base):
    __tablename__ = "schedule_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    period = Column(Integer, nullable=False)
    course_name = Column(String, nullable=False)
    room = Column(String, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)

    user = relationship("User", back_populates="schedule_items")

class ClassSection(Base):
    __tablename__ = "class_sections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    teacher = relationship("User", back_populates="classes_taught")
    enrollments = relationship(
        "ClassEnrollment", back_populates="class_section", cascade="all, delete-orphan"
    )

class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("class_sections.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    class_section = relationship("ClassSection", back_populates="enrollments")
    student = relationship("User", back_populates="class_enrollments")

class MapItem(Base):
    __tablename__ = "map_items"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, nullable=True)