import enum

from sqlalchemy import Column, Integer, String, Enum
from app.database import Base

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
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)

