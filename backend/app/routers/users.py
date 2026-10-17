from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.schemas import UserResponse, UserUpdateRequest, UploadResponse, ResetPasswordRequest, StaffResponse
from app.dependencies import require_admin, manager
from app.s3 import s3_client, s3_internal, BUCKET_NAME, ENDPOINT
from app.auth import hash_password

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
    elif role == "teacher":
        query = query.filter(User.role == UserRole.teacher)
    elif role == "admin":
        query = query.filter(User.role == UserRole.admin)
    return query.order_by(User.last_name, User.first_name).all()

@router.get("/users/staff", response_model=list[StaffResponse])
def list_staff(
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    query = db.query(User).filter(User.role != UserRole.student)
    return query.order_by(User.last_name, User.first_name).all()

@router.get("/users/{username}", response_model=UserResponse)
def get_user(
    username: str,
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user

@router.get("/users/upload/{username}", response_model=UploadResponse)
def get_upload_url(
    username: str,
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    if _current_user.role != "admin" and _current_user.username != username:
        raise HTTPException(status_code=403, detail="Insufficient permission")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    object_key = f"avatars/{username}/avatar"

    url = s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": BUCKET_NAME, "Key": object_key},
        ExpiresIn=120,
    ).replace(ENDPOINT, "")

    setattr(user, "image", True)
    db.commit()

    return {"presigned_url": url}

@router.delete("/users/upload/{username}", status_code=204)
def delete_upload_url(
    username: str,
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    if _current_user.role != "admin" and _current_user.username != username:
        raise HTTPException(status_code=403, detail="Insufficient permission")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    if not user.image:
        raise HTTPException(status_code=404, detail="Image not found.")

    s3_internal.delete_object(
        Bucket=BUCKET_NAME,
        Key=f"avatars/{username}/avatar",
    )
    setattr(user, "image", False)
    db.commit()

@router.patch("/users/{username}", response_model=UserResponse)
def update_user(
    username: str,
    updates: UserUpdateRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user

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

@router.post("/users/{username}/request", status_code=202)
def request_reset(
    username: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == username).first()
    if user is not None and not user.requesting:
        user.requesting = True
        db.commit()

    return {"detail":"If the account exists, an admin has been notified to reset the password"}

@router.post("/users/{username}/request-delete", status_code=202)
def request_delete(
    username: str,
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.username != username:
        raise HTTPException(status_code=405, detail="Uh..., what do you think you're doing?")
    user.requesting_delete = True
    db.commit()

@router.patch("/users/{username}/reset", response_model=UserResponse)
def reset_password(
    username: str,
    req: ResetPasswordRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    if not user.requesting:
        raise HTTPException(status_code=405, detail="User is not requesting a password reset.")

    if not req.clear:
        user.hashed_password = hash_password(req.password)
    
    user.requesting = False

    db.commit()
    db.refresh(user)
    return user

@router.patch("/users/{username}/clear", response_model=UserResponse)
def reset_password(
    username: str,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    if not user.requesting_delete:
        raise HTTPException(status_code=405, detail="User is not requesting account deletion.")

    user.requesting_delete = False

    db.commit()
    db.refresh(user)
    return user