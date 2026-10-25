import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Enum, Text, DateTime, Time, Date, Boolean, Float, ForeignKey, UniqueConstraint
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
    title = Column(String, nullable=False)
    requesting = Column(Boolean, nullable=True)
    requesting_delete = Column(Boolean, nullable=True)

    announcements = relationship("Announcement", back_populates="author", cascade="all, delete-orphan")
    clubs_sponsored = relationship("Club", back_populates="sponsor")
    club_memberships = relationship("ClubMembership", back_populates="user", cascade="all, delete-orphan")
    club_favorites = relationship("ClubFavorite", back_populates="user", cascade="all, delete-orphan")
    events_created = relationship("Event", back_populates="created_by", cascade="all, delete-orphan")
    schedule_items = relationship("ScheduleItem", back_populates="user", cascade="all, delete-orphan")
    classes_taught = relationship("ClassSection", back_populates="teacher", cascade="all, delete-orphan")
    class_enrollments = relationship("ClassEnrollment", back_populates="student", cascade="all, delete-orphan")
    announcement_likes = relationship("AnnouncementLike", back_populates="user", cascade="all, delete-orphan")
    event_rsvps = relationship("EventRSVP", back_populates="user", cascade="all, delete-orphan")
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="student", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user")
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")
    messages_sent = relationship("Message", back_populates="sender", cascade="all, delete-orphan", foreign_keys="Message.sender_id")
    messages_received = relationship("Message", back_populates="recipient", cascade="all, delete-orphan", foreign_keys="Message.recipient_id")
    chat_messages = relationship("ChatMessage", back_populates="user")
    chat_reactions = relationship("ChatReaction", back_populates="user")
    notifications = relationship("Notification", back_populates="user", cascade="all")

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
    channel = relationship("Channel", back_populates="club", uselist=False)
    favorite_records = relationship("ClubFavorite", back_populates="club", cascade="all, delete-orphan")

    @property
    def favorite(self):
        return [fav.user.username for fav in self.favorite_records]

class ClubMembership(Base):
    __tablename__ = "club_memberships"
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    club = relationship("Club", back_populates="members")
    user = relationship("User", back_populates="club_memberships")

class ClubFavorite(Base):
    __tablename__ = "club_favorites"
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    club = relationship("Club", back_populates="favorite_records")
    user = relationship("User", back_populates="club_favorites")

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
    assignments = relationship(
        "Assignment", back_populates="class_section", cascade="all, delete-orphan"
    )
    attendance_records = relationship(
        "AttendanceRecord", back_populates="class_section", cascade="all, delete-orphan"
    )

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("class_sections.id"), nullable=False)
    name = Column(String, nullable=False)
    max_score = Column(Float, nullable=False, default=100)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    class_section = relationship("ClassSection", back_populates="assignments")
    grades = relationship(
        "Grade", back_populates="assignment", cascade="all, delete-orphan"
    )
    submissions = relationship(
        "Submission", back_populates="assignment", cascade="all, delete-orphan"
    )

class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=True)

    assignment = relationship("Assignment", back_populates="grades")
    student = relationship("User", back_populates="grades")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    submitted_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")

class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("class_sections.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    class_section = relationship("ClassSection", back_populates="enrollments")
    student = relationship("User", back_populates="class_enrollments")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint("class_id", "student_id", "date", name="uq_attendance_class_student_date"),
    )
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("class_sections.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="present")  # present | absent | tardy | excused

    class_section = relationship("ClassSection", back_populates="attendance_records")
    student = relationship("User", back_populates="attendance_records")

class MapItem(Base):
    __tablename__ = "map_items"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, nullable=True)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    read = Column(Boolean, nullable=False, default=False)

    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="messages_received", foreign_keys=[recipient_id])

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    anonymous = Column(Boolean, nullable=False, default=True)
    type = Column(String, nullable=False)
    role = Column(String, nullable=True)
    resolved = Column(Boolean, nullable=False, default=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="reports")

class Channel(Base):
    __tablename__ = "channels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    role = Column(String, nullable=False)

    club_id = Column(Integer, ForeignKey("clubs.id"),nullable=True, unique=True)
    club = relationship("Club", back_populates="channel")
    messages = relationship("ChatMessage", back_populates="channel")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    replying_to = Column(Integer, nullable=True)
    edited = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="chat_messages")
    channel_id = Column(Integer, ForeignKey("channels.id"))
    channel = relationship("Channel", back_populates="messages")
    reactions = relationship("ChatReaction", back_populates="message")

class ChatReaction(Base):
    __tablename__ = "chat_reactions"
    id = Column(Integer, primary_key=True, index=True)
    emoji = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="chat_reactions")
    message_id = Column(Integer, ForeignKey("chat_messages.id"))
    message = relationship("ChatMessage", back_populates="reactions")

class NotificationType(str, enum.Enum):
    message = "message"
    announcement = "announcement"
    grade = "grade"

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String, nullable=False)
    body = Column(String, nullable=True)
    link = Column(String, nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    user = relationship("User", back_populates="notifications")

class Link(Base):
    __tablename__ = "links"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, nullable=False)
    href = Column(String, nullable=False)
    blank = Column(Boolean, default=False)

class FileType(str, enum.Enum):
    all = "All"
    image = "Image"
    video = "Video"
    pdf = "PDF"
    document = "Document"
    other = "Other"

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(Enum(FileType), nullable=False)