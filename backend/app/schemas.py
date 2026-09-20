from pydantic import BaseModel
from app.models import UserRole

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreateRequest(BaseModel):
    username: str
    password: str
    role: UserRole

class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    role: UserRole

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse