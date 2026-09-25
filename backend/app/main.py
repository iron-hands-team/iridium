import os
from fastapi import Depends, FastAPI, HTTPException, Response
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
from app.routers import users, announcements, clubs, events, schedule, classes

IS_PROD = os.getenv("ENVIRONMENT", "development") == "production"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(title="Iridium API")

app.add_middleware(
        CORSMiddleware,
        allow_origins=[FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(announcements.router)
app.include_router(clubs.router)
app.include_router(events.router)
app.include_router(schedule.router)
app.include_router(classes.router)

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
def login(credentials: LoginRequest,response:Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()

    if user is None or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Incorrect username or password')

    token = manager.create_access_token(data={"sub":user.username})

    response.set_cookie(key="access-token",value=token,httponly=True,samesite="lax",secure=IS_PROD) # TODO: increase expiration time?

    return TokenResponse(access_token=token, user=user)

@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(manager)):
    return current_user

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access-token")
    return {"message": "Logged out."}

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
        first_name=new_user.first_name,
        last_name=new_user.last_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.on_event("startup")
def on_startup():
    init_db_and_seed_admin()