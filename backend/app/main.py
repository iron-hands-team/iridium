from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.auth import manager,verify_password,hash_password
from app.models import User, UserRole
from app.schemas import LoginRequest, UserCreateRequest, UserResponse, TokenResponse
from app.dependencies import require_admin
from app.seed import init_db_and_seed_admin

app = FastAPI(title="Iridium API")

app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Iridium API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db(db: Session=Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database":"connected"}

@app.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()

    if user is None or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Incorrect Usernam or Password,')

    token = manager.create_access_token(data={"sub":user.username})
    return TokenResponse(access_token=token, user=user)

@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(manager)):
    return current_user

@app.post("/users", response_model=UserResponse)
def create_user(
    new_user: UserCreateRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):

    existing = db.query(User).filter(User.username == new_user.username).first()
    if existing is not None:
        raise HTTPException(status_code=400, detail="Username already exists.")

    user = User(
        username=new_user.username,
        hashed_password=hash_password(new_user.password),
        role=new_user.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.on_event("startup")
def on_startup():
    init_db_and_seed_admin()