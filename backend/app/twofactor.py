import pyotp
from datetime import datetime, timedelta, timezone

MAX_FAILED = 5
LOCK_MINUTES = 15

def is_locked(user) -> bool:
    return user.locked_until is not None and user.locked_until > datetime.now(timezone.utc)

def register_failure(user) -> bool:
    # returns True if this failure locked the account
    user.failed_logins = (user.failed_logins or 0) + 1
    if user.failed_logins >= MAX_FAILED:
        user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCK_MINUTES)
        user.failed_logins = 0
        return True
    return False

def register_success(user) -> None:
    user.failed_logins = 0
    user.locked_until = None

def new_secret() -> str:
    return pyotp.random_base32()

def provisioning_uri(secret: str, username: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=username, issuer_name="Iridium")

def verify_code(secret: str, code: str) -> bool:
    return pyotp.TOTP(secret).verify(code.strip().replace(" ", ""), valid_window=1)
