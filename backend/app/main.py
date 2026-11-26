import os
from datetime import timedelta
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from slowapi import _rate_limit_exceeded_handler
from app.limiter import limiter
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.auth import manager,verify_password,hash_password
from app.models import User, UserRole
from app.s3 import s3_internal, BUCKET_NAME
from app.schemas import LoginRequest, UserCreateRequest, UserResponse, TokenResponse
from app.dependencies import require_admin, pause_guard
from app.seed import init_db_and_seed_admin
from app.routers import users, announcements, clubs, events, schedule, classes, info, grades, attendance, messages, chat, notifications, guides, settings, buses, audit, privacy, twofactor
from app.audit import log_action
from app import lockout
from app.limiter import client_ip
from app.twofactor import use_recovery_code, verify_code

IS_PROD = os.getenv("ENVIRONMENT", "development") == "production"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title="Iridium API",
    docs_url=None if IS_PROD else "/docs",
    redoc_url=None,
    openapi_url=None if IS_PROD else "/openapi.json",
    dependencies=[Depends(pause_guard)]
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
app.include_router(info.router)
app.include_router(grades.router)
app.include_router(attendance.router)
app.include_router(messages.router)
app.include_router(chat.router)
app.include_router(notifications.router)
app.include_router(guides.router)
app.include_router(settings.router)
app.include_router(buses.router)
app.include_router(audit.router)
app.include_router(privacy.router)
app.include_router(twofactor.router)

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

@app.get("/health/storage")
def health_storage():
    try:
        s3_internal.head_bucket(Bucket=BUCKET_NAME)
    except Exception:
        raise HTTPException(status_code=503, detail="Storage unavailable.")
    return {"status": "ok", "storage": "connected"}

DUMMY_HASH = hash_password("not-a-real-password")

@app.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()

    name = credentials.username[:80]
    ip = client_ip(request)

    if lockout.is_locked(db, name, ip):
        if user is not None:
            log_action(db, "login_blocked", actor=user, request=request)
            db.commit()
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in a few minutes.")

    password_ok = verify_password(
        credentials.password, user.hashed_password if user else DUMMY_HASH
    )
    if user is None or not password_ok:
        if lockout.register_failure(db, name, ip) and user is not None:
            log_action(db, "account_locked", actor=user, request=request)
        log_action(db, "login_failed", actor=user, actor_username=name, request=request)
        db.commit()
        raise HTTPException(status_code=401, detail='Incorrect username or password')

    if user.totp_enabled:
        if not credentials.code:
            raise HTTPException(status_code=401, detail="2fa_required")
        code_ok = verify_code(user.totp_secret, credentials.code)
        used_recovery = not code_ok and use_recovery_code(user, credentials.code)
        if not code_ok and not used_recovery:
            if lockout.register_failure(db, name, ip):
                log_action(db, "account_locked", actor=user, request=request)
            log_action(db, "login_failed", actor=user, detail="bad 2fa code", request=request)
            db.commit()
            raise HTTPException(status_code=401, detail="Incorrect 2FA code")
        if used_recovery:
            log_action(db, "2fa_recovery_used", actor=user, request=request)

    lockout.register_success(db, name, ip)
    log_action(db, "login_success", actor=user, request=request)
    db.commit()

    token_expiry = timedelta(minutes=45) 
    token = manager.create_access_token(
        data={"sub": f"{user.username}:{user.token_version}"},expires=token_expiry
    )

    response.set_cookie(
        key="access-token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=IS_PROD,
        max_age=int(token_expiry.total_seconds()),
    ) 

    return TokenResponse(access_token=token, user=user)

@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(manager)):
    return current_user

@app.post("/logout")
def logout(
    response: Response,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(manager.optional),
):
    if current_user is not None:
        user = db.query(User).filter(User.id == current_user.id).first()
        user.token_version += 1
        db.commit()
    response.delete_cookie(key="access-token")
    return {"message": "Logged out."}

@app.post("/users", response_model=UserResponse)
def create_user(
    new_user: UserCreateRequest,
    request: Request,
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
        middle_name=new_user.middle_name,
        title=new_user.title,
    )
    db.add(user)
    log_action(db, "user_create", actor=_admin, target=new_user.username, detail=f"role={new_user.role.value}", request=request)
    db.commit()
    db.refresh(user)
    return user

@app.on_event("startup")
def on_startup():
    init_db_and_seed_admin()