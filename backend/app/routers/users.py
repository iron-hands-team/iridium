from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.schemas import UserResponse
from app.dependencies import require_admin

router = APIRouter()

@router.get("/users", response_model=list[UserResponse])
def list_users(
    role: str | None = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = db.query(User)
    if role == "student":
        query = query.filter(User.role == UserRole.student)
    elif role == "staff":
        query = query.filter(User.role.in_([UserRole.teacher, UserRole.admin]))
    return query.order_by(User.last_name, User.first_name).all()

@router.delete("/users/{username}", status_code=204)
def delete_user(
    username: str,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()