import logging
import os
from fastapi_login import LoginManager
import bcrypt
from app.database import SessionLocal
from app.models import User

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError('Please set up secret key.')

if os.getenv("ENVIRONMENT", "development") == "production":
    if SECRET_KEY.startswith("YOUR_"):
        raise RuntimeError("JWT_SECRET_KEY is still the placeholder from .env.example. Generate one with: openssl rand -hex 32")
    if len(SECRET_KEY) < 32:
        logging.getLogger("iridium").warning("JWT_SECRET_KEY is shorter than 32 characters; use `openssl rand -hex 32`.")

manager = LoginManager(token_url="/login", secret=SECRET_KEY, use_cookie=True, cookie_name="access-token")

@manager.user_loader()
def load_user(identity: str):
    username, _, version = identity.rpartition(":")
    if not username or not version.isdigit():
        return None
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if user is None or user.token_version != int(version):
            return None
        return user
    finally:
        db.close()

def hash_password(password: str):
    password = password.encode("utf-8")
    salt4pass = bcrypt.gensalt()
    hashed_pwd = bcrypt.hashpw(password, salt4pass)
    return hashed_pwd.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_password = plain_password.encode("utf-8")
    hashed_password = hashed_password.encode("utf-8")

    return bcrypt.checkpw(plain_password, hashed_password)

