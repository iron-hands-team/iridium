from datetime import datetime, time

from pydantic import BaseModel
from app.models import UserRole

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreateRequest(BaseModel):
    username: str
    password: str
    role: UserRole
    first_name: str
    last_name: str
    middle_name: str | None = None

class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    middle_name: str | None = None
    role: UserRole

    class Config:
        from_attributes = True

class UserUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    middle_name: str | None = None
    role: UserRole | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AnnouncementCreateRequest(BaseModel):
    title: str
    content: str

class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    author: UserResponse
    created_at: datetime

    class Config:
        from_attribute = True

class ClubCreateRequest(BaseModel):
    name: str
    description: str | None = None
    sponsor_id: int | None = None

class ClubResponse(BaseModel):
    id: int
    name: str
    description: str | None
    sponsor: UserResponse | None

    class Config:
        from_attributes = True

class ClubMemberResponse(BaseModel):
    id: int
    user: UserResponse

    class Config:
        from_attributes = True

class EventCreateRequest(BaseModel):
    title: str
    description: str | None = None
    location: str | None = None
    start_time: datetime
    end_time: datetime | None = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    location: str | None
    start_time: datetime
    end_time: datetime | None
    created_by: UserResponse

    class Config:
        from_attributes = True

# this is where schedules start, its diff from the other ones on top cuz its per student

class ScheduleItemCreateRequest(BaseModel):
    user_id: int
    period: int
    course_name: str
    room: str | None = None
    start_time: time | None = None
    end_time: time | None = None

class ScheduleItemResponse(BaseModel):
    id: int
    period: int
    course_name: str
    room: str | None
    start_time: time | None
    end_time: time | None

    class Config:
        from_attributes = True

# classes/rosters

class ClassSectionCreateRequest(BaseModel):
    name: str
    teacher_id: int | None = None  # admin only; defaults to the current user

class ClassSectionUpdateRequest(BaseModel):
    name: str | None = None
    teacher_id: int | None = None  # admin only

class ClassSectionResponse(BaseModel):
    id: int
    name: str
    teacher: UserResponse

    class Config:
        from_attributes = True

class AddStudentToClassRequest(BaseModel):
    username: str

class ClassEnrollmentResponse(BaseModel):
    id: int
    student: UserResponse

    class Config:
        from_attributes = True