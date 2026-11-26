import base64
import hashlib
import logging
import os
import secrets

import pyotp
from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger("iridium.twofactor")

RECOVERY_COUNT = 8


def _fernet() -> Fernet:
    key = os.getenv("TOTP_ENCRYPTION_KEY")
    if key:
        return Fernet(key.encode())
    logger.warning("TOTP_ENCRYPTION_KEY is not set; deriving the 2FA key from JWT_SECRET_KEY.")
    digest = hashlib.sha256(os.getenv("JWT_SECRET_KEY", "").encode()).digest()
    return Fernet(base64.urlsafe_b64encode(digest))


def new_secret() -> str:
    return pyotp.random_base32()


def encrypt_secret(secret: str) -> str:
    return _fernet().encrypt(secret.encode()).decode()


def decrypt_secret(token: str) -> str | None:
    try:
        return _fernet().decrypt(token.encode()).decode()
    except InvalidToken:
        return None


def provisioning_uri(secret: str, username: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=username, issuer_name="Iridium")


def verify_code(encrypted_secret: str | None, code: str) -> bool:
    secret = decrypt_secret(encrypted_secret) if encrypted_secret else None
    if secret is None:
        return False
    return pyotp.TOTP(secret).verify(code.strip().replace(" ", ""), valid_window=1)


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.strip().lower().replace("-", "").encode()).hexdigest()


def new_recovery_codes() -> tuple[list[str], list[str]]:
    # returns (codes to show once, hashes to store)
    codes = [f"{secrets.token_hex(3)}-{secrets.token_hex(3)}" for _ in range(RECOVERY_COUNT)]
    return codes, [_hash_code(c) for c in codes]


def use_recovery_code(user, code: str) -> bool:
    hashed = _hash_code(code)
    remaining = list(user.recovery_codes or [])
    if hashed not in remaining:
        return False
    remaining.remove(hashed)
    user.recovery_codes = remaining
    return True
