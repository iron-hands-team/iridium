from datetime import datetime, time, date

from pydantic import BaseModel, Field
from app.models import UserRole

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreateRequest(BaseModel):
    username: str = Field(min_length=1, max_length=40)
    password: str = Field(min_length=8, max_length=128)
    role: UserRole
    first_name: str
    last_name: str
    middle_name: str | None = None
    title: str

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
    title: str

    class Config:
        from_attributes = True

class StaffResponse(BaseModel):
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

class BulkDeleteUsersRequest(BaseModel):
    usernames: list[str]

class UserUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    middle_name: str | None = None
    role: UserRole | None = None
    image: bool | None = None
    requesting: bool | None = None

class ResetPasswordRequest(BaseModel):
    password: str | None = Field(default=None, min_length=10, max_length=128)
    clear: bool | None = None

class UploadResponse(BaseModel):
    presigned_url: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AnnouncementCreateRequest(BaseModel):
    title: str = Field(max_length=200)
    content: str = Field(max_length=10000)
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
    archived_at: datetime | None = None
    pinned: bool
    archived: bool
    role: str
    likes: list[str]
    starred: bool = False

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
    sponsor_id: int | None = None
    categories: list[str]
    favorites: list[str] = []
    location: str | None = None
    managers: list[dict] | None = None
    schedule: list[dict] | None = None
    tags: list[dict] | None = None

    joined: bool = False

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
    due_at: datetime | None = None

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
    due_at: datetime | None
    grades: list[GradeResponse]

    class Config:
        from_attributes = True

class GradeUpdateRequest(BaseModel):
    score: float | None = Field(default=None, ge=0)

class SubmissionResponse(BaseModel):
    id: int
    student: UserResponse
    filename: str
    submitted_at: datetime

    class Config:
        from_attributes = True

class SubmissionCreateRequest(BaseModel):
    filename: str

class StudentAssignmentGrade(BaseModel):
    id: int
    name: str
    max_score: float
    score: float | None
    due_at: datetime | None = None
    submitted_at: datetime | None = None

class StudentClassGrades(BaseModel):
    class_id: int
    class_name: str
    assignments: list[StudentAssignmentGrade]

class AttendanceRecordResponse(BaseModel):
    id: int
    student: UserResponse
    date: date
    status: str

    class Config:
        from_attributes = True

class AttendanceStatusUpdateRequest(BaseModel):
    status: str

class StudentAttendanceDay(BaseModel):
    date: date
    status: str

class StudentClassAttendance(BaseModel):
    class_id: int
    class_name: str
    records: list[StudentAttendanceDay]

class MessageCreateRequest(BaseModel):
    recipient_username: str
    subject: str = Field(max_length=200)
    body: str = Field(max_length=10000)

class MessageResponse(BaseModel):
    id: int
    subject: str
    body: str
    created_at: datetime
    read: bool
    sender: UserResponse
    recipient: UserResponse

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    body: str | None = None 
    link: str | None = None
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RuleResponse(BaseModel):
    id: int
    name: str
    description: str | None=None

class ReportResponse(BaseModel):
    id: int | None = None
    title: str
    description: str
    anonymous: bool = True
    type: str
    role: str | None = None
    user: UserResponse | None = None
    resolved: bool = False

    class Config:
        from_attributes = True

class ReportUpdateRequest(BaseModel):
    resolved: bool 

class SearchResponse(BaseModel):
    users: list[StaffResponse]
    announcements: list[AnnouncementResponse]
    events: list[EventResponse]
    clubs: list[ClubResponse]
    classes: list[ClassSectionResponse]

    class Config:
        from_attributes = True

class ChannelCreateRequest(BaseModel):
    name: str
    description: str | None = None
    role: str
    club: int | None = None

class ChannelUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    role: str | None = None
    club: int | None = None

class ChannelResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    role: str
    club: ClubResponse | None = None
    count: int | None = None

    class Config:
        from_attributes = True

class ChannelCreateResponse(BaseModel):
    id: int

class MessageSendRequest(BaseModel):
    message: str = Field(max_length=4000)
    channel_id: int | None = None
    replying: int | None = None

class ChatReactionRequest(BaseModel):
    emoji: str

class ChatReactionResponse(BaseModel):
    emoji: str
    users: list[int]

class ChatMessageResponse(BaseModel):
    id: int
    text: str
    created_at: datetime
    replying_to: int | None = None
    edited: bool
    user_id: int
    user: UserResponse
    channel_id: int
    reaction_list: list[ChatReactionResponse]

    class Config:
        from_attributes = True

class LinkResponse(BaseModel):
    id: int | None = None
    label: str
    href: str
    blank: bool | None = None

class FileResponse(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None
    type: str

class FileUploadResponse(BaseModel):
    uploads: list[str]

class SocialRequest(BaseModel):
    id: int | None = None
    name: str
    link: str

class SchoolRequest(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None
    address: str | None = None
    email: str | None = None
    number: str | None = None
    socials: list[SocialRequest]

    class Config:
        from_attributes = True

class SchoolResponse(BaseModel):
    logo: str
    banner: str

class ArchiveSetting(BaseModel):
    number: int = 30
    duration: str = "Days"
    never: bool = False

class PostSetting(BaseModel):
    number: int = 30
    duration: str = "Days"
    never: bool = True

class SlowSetting(BaseModel):
    number: int = 30
    duration: str = "Seconds"
    enabled: bool = False

class CensoredSetting(BaseModel):
    words: list[str] = []
    sensitive: bool = False

class SettingsRequest(BaseModel):
    id: int | None = None
    features: list[str] = []
    archive: ArchiveSetting = Field(default_factory=ArchiveSetting)
    posts: PostSetting = Field(default_factory=PostSetting)
    messages: ArchiveSetting = Field(default_factory=ArchiveSetting)
    slow: SlowSetting = Field(default_factory=SlowSetting)
    censored: CensoredSetting = Field(default_factory=CensoredSetting)
    paused: bool = False

    class Config:
        from_attributes = True

class SettingsResponse(SettingsRequest):
    pass

class GuideSection(BaseModel):
    subheading: str = Field(max_length=200)
    text: str = Field(max_length=10000)

class GuideRequest(BaseModel):
    id: int | None = None
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    sections: list[GuideSection] = Field(max_length=50)
    label: str | None = Field(default=None, max_length=50)

    class Config:
        from_attributes = True

class GuideEditRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    sections: list[GuideSection] | None = Field(default=None, max_length=50)
    label: str | None = Field(default=None, max_length=50)

    class Config:
        from_attributes = True

class SlowResponse(BaseModel):
    seconds: int

class ClearRequest(BaseModel):
    password: str

class DestinationRequest(BaseModel):
    location: str
    beforeSchoolTime: str
    afterSchoolTime: str
    color: str | None = None

class DestinationResponse(BaseModel): 
    location: str
    before_school_time: str
    after_school_time: str
    color: str | None = None

class BusRequest(BaseModel):
    name: str
    desc: str | None = None
    destinations: list[DestinationRequest]
    color: str | None = None

    class Config:
        from_attributes = True

class BusResponse(BaseModel):
    id: int | None = None
    name: str
    description: str | None = None
    destinations: list[DestinationResponse]
    color: str | None = None

    class Config:
        from_attributes = True

class QuizQuestionResponse(BaseModel):
    name: str | None = None
    choices: list[str] = []
    answers: list[str] = []
    can_show: bool | None = None
    question: str | None = None

class QuizResponse(BaseModel):
    id: int
    name: str
    questions: list[QuizQuestionResponse] = []
    class_section_id: int

    class Config:
        from_attributes = True

class QuizRequest(BaseModel):
    name: str | None = None
    questions: list[QuizQuestionResponse] = []
    class_section_id: int = 1

    class Config:
        from_attributes = True

class ClubSystemManager(BaseModel):
    name: str
    desc: str | None = None

class ClubSystemSchedule(BaseModel):
    day: str
    startingTime: str
    endingTime: str

class ClubSystemTag(BaseModel):
    color: str
    name: str

class ClubSystemRequest(BaseModel):
    desc: str | None = None
    location: str | None = None
    managers: list[ClubSystemManager]
    name: str | None = None
    schedule: list[ClubSystemSchedule]
    tags: list[ClubSystemTag]

    class Config:
        from_attributes = True