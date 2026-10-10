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
    image: bool | None = None
    requesting: bool | None = None
    requesting_delete: bool | None = None
    role: UserRole

    class Config:
        from_attributes = True

class UserUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    middle_name: str | None = None
    role: UserRole | None = None
    image: bool | None = None
    requesting: bool | None = None

class ResetPasswordRequest(BaseModel):
    password: str | None = None
    clear: bool | None = None

class UploadResponse(BaseModel):
    presigned_url: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AnnouncementCreateRequest(BaseModel):
    title: str
    content: str
    pinned: bool = False
    role: str = "all"

class AnnouncementUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    pinned: bool | None = None
    archived: bool | None = None
    role: str | None = None

class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    author: UserResponse
    created_at: datetime
    pinned: bool
    archived: bool
    role: str
    likes: list[str]

    class Config:
        from_attributes = True

class ClubCreateRequest(BaseModel):
    name: str
    description: str | None = None
    sponsor_id: int | None = None
    categories: list[str] = []

class ClubUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    sponsor_id: int | None = None
    categories: list[str] | None = None

class ClubResponse(BaseModel):
    id: int
    name: str
    description: str | None
    sponsor: UserResponse | None
    categories: list[str]

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

class EventUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    location: str | None
    start_time: datetime
    end_time: datetime | None
    created_by: UserResponse
    attendees: list[str]

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

class ScheduleItemUpdateRequest(BaseModel):
    period: int | None = None
    course_name: str | None = None
    room: str | None = None
    start_time: time | None = None
    end_time: time | None = None

class ScheduleCopyRequest(BaseModel):
    from_user_id: int
    to_user_id: int
    overwrite: bool = False

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

# general school info

class AddMapItemsRequest(BaseModel):
    labels: list[str]

class MapUploadResponse(BaseModel):
    uploads: list[str]

class MapResponse(BaseModel):
    id: int
    label: str

# gradebook

class AssignmentCreateRequest(BaseModel):
    name: str
    max_score: float = 100

class GradeResponse(BaseModel):
    id: int
    student: UserResponse
    score: float | None

    class Config:
        from_attributes = True

class AssignmentResponse(BaseModel):
    id: int
    name: str
    max_score: float
    class_id: int
    grades: list[GradeResponse]

    class Config:
        from_attributes = True

class GradeUpdateRequest(BaseModel):
    score: float | None = None

class StudentAssignmentGrade(BaseModel):
    id: int
    name: str
    max_score: float
    score: float | None

class StudentClassGrades(BaseModel):
    class_id: int
    class_name: str
    assignments: list[StudentAssignmentGrade]

class RuleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

class SearchResponse(BaseModel):
    users: list[StaffResponse]
    announcements: list[AnnouncementResponse]
    events: list[EventResponse]
    clubs: list[ClubResponse]

    class Config:
        from_attributes = True