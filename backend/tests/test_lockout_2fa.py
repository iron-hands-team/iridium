from datetime import datetime, timedelta, timezone

import pyotp
import pytest

from app.limiter import limiter
from app.models import AuditLog, User
from app.twofactor import MAX_FAILED

from .conftest import login


@pytest.fixture(autouse=True)
def no_rate_limit():
    limiter.enabled = False
    yield
    limiter.enabled = True


def bad_login(client, username="student"):
    return client.post("/login", json={"username": username, "password": "wrong"})


def test_account_locks_after_repeated_failures(client):
    for _ in range(MAX_FAILED):
        assert bad_login(client).status_code == 401
    r = client.post("/login", json={"username": "student", "password": "student123"})
    assert r.status_code == 429


def test_lock_expires(client, db_session):
    for _ in range(MAX_FAILED):
        bad_login(client)
    user = db_session.query(User).filter_by(username="student").one()
    user.locked_until = datetime.now(timezone.utc) - timedelta(seconds=1)
    db_session.commit()
    assert client.post("/login", json={"username": "student", "password": "student123"}).status_code == 200


def test_success_resets_the_counter(client):
    for _ in range(MAX_FAILED - 1):
        bad_login(client)
    login(client, "student", "student123")
    for _ in range(MAX_FAILED - 1):
        assert bad_login(client).status_code == 401


def test_lockout_is_audited(client, db_session):
    for _ in range(MAX_FAILED):
        bad_login(client)
    bad = db_session.query(AuditLog).filter_by(action="account_locked").count()
    assert bad == 1


def enable_2fa(client, headers):
    secret = client.post("/2fa/setup", headers=headers).json()["secret"]
    r = client.post("/2fa/enable", json={"code": pyotp.TOTP(secret).now()}, headers=headers)
    assert r.status_code == 204
    return secret


def test_login_needs_code_once_2fa_is_on(client, student):
    secret = enable_2fa(client, student)
    creds = {"username": "student", "password": "student123"}
    r = client.post("/login", json=creds)
    assert r.status_code == 401 and r.json()["detail"] == "2fa_required"
    assert client.post("/login", json={**creds, "code": "000000"}).status_code == 401
    ok = client.post("/login", json={**creds, "code": pyotp.TOTP(secret).now()})
    assert ok.status_code == 200


def test_enable_rejects_wrong_code(client, student):
    client.post("/2fa/setup", headers=student)
    assert client.post("/2fa/enable", json={"code": "000000"}, headers=student).status_code == 400
    assert client.get("/2fa", headers=student).json() == {"enabled": False}


def test_wrong_2fa_codes_count_toward_lockout(client, student):
    enable_2fa(client, student)
    creds = {"username": "student", "password": "student123", "code": "000000"}
    for _ in range(MAX_FAILED):
        client.post("/login", json=creds)
    assert client.post("/login", json=creds).status_code == 429


def test_disable_needs_password_and_code(client, student):
    secret = enable_2fa(client, student)
    code = pyotp.TOTP(secret).now()
    assert client.post("/2fa/disable", json={"password": "bad", "code": code}, headers=student).status_code == 400
    assert client.post("/2fa/disable", json={"password": "student123", "code": code}, headers=student).status_code == 204
    assert client.get("/2fa", headers=student).json() == {"enabled": False}


def test_admin_can_reset_2fa(client, admin, student):
    enable_2fa(client, student)
    assert client.delete("/users/student/2fa", headers=student).status_code == 403
    assert client.delete("/users/student/2fa", headers=admin).status_code == 204
    assert client.post("/login", json={"username": "student", "password": "student123"}).status_code == 200
