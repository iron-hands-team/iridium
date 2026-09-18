import os
from fastapi_login import LoginManager
import bcrypt
from app.database import SessionLocal
from app.models import User

SECRET_KEY = os.getenv("SECRET_KEY")

manager = LoginManager(token_url="/login", secret=SECRET_KEY)

@manager.user_loader()
def load_user(username: str):
    db = SessionLocal()
    try:
        return db.query(User).filter(User.username == username).first()
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

