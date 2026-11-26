import pyotp
import pytest
from datetime import datetime, timedelta, timezone

from app.limiter import limiter
from app.lockout import MAX_FAILED
from app.models import AuditLog, LoginThrottle, User

from .conftest import login


@pytest.fixture(autouse=True)
def no_rate_limit():
    limiter.enabled = False
    yield
    limiter.enabled = True


def bad_login(client, username="student", ip="1.1.1.1"):
    return client.post(
        "/login", json={"username": username, "password": "wrong"}, headers={"x-forwarded-for": ip}
    )


def good_login(client, ip="1.1.1.1", **extra):
    return client.post(
        "/login",
        json={"username": "student", "password": "student123", **extra},
        headers={"x-forwarded-for": ip},
    )


def test_lockout_applies_to_the_offending_ip(client):
    for _ in range(MAX_FAILED):
        assert bad_login(client).status_code == 401
    assert good_login(client).status_code == 429


def test_attacker_cannot_lock_out_the_real_user_elsewhere(client):
    for _ in range(MAX_FAILED):
        bad_login(client, ip="6.6.6.6")
    assert good_login(client, ip="1.1.1.1").status_code == 200


def test_unknown_usernames_get_the_same_treatment(client):
    for _ in range(MAX_FAILED):
        bad_login(client, username="ghost")
    r = bad_login(client, username="ghost")
    assert r.status_code == 429


def test_lock_expires(client, db_session):
    for _ in range(MAX_FAILED):
        bad_login(client)
    row = db_session.query(LoginThrottle).filter_by(username="student").one()
    row.locked_until = datetime.now(timezone.utc) - timedelta(seconds=1)
    db_session.commit()
    assert good_login(client).status_code == 200


def test_success_resets_the_counter(client):
    for _ in range(MAX_FAILED - 1):
        bad_login(client)
    assert good_login(client).status_code == 200
    for _ in range(MAX_FAILED - 1):
        assert bad_login(client).status_code == 401


def test_lockout_is_audited(client, db_session):
    for _ in range(MAX_FAILED):
        bad_login(client)
    assert db_session.query(AuditLog).filter_by(action="account_locked").count() == 1


def enable_2fa(client, headers):
    secret = client.post("/2fa/setup", headers=headers).json()["secret"]
    r = client.post("/2fa/enable", json={"code": pyotp.TOTP(secret).now()}, headers=headers)
    assert r.status_code == 200
    return secret, r.json()["recovery_codes"]


def test_secret_is_encrypted_at_rest(client, student, db_session):
    secret, _ = enable_2fa(client, student)
    stored = db_session.query(User).filter_by(username="student").one().totp_secret
    assert stored and secret not in stored


def test_login_needs_code_once_2fa_is_on(client, student):
    secret, _ = enable_2fa(client, student)
    r = good_login(client)
    assert r.status_code == 401 and r.json()["detail"] == "2fa_required"
    assert good_login(client, code="000000").status_code == 401
    assert good_login(client, code=pyotp.TOTP(secret).now()).status_code == 200


def test_recovery_code_works_once(client, student):
    _, codes = enable_2fa(client, student)
    assert len(codes) == 8
    assert good_login(client, code=codes[0]).status_code == 200
    assert good_login(client, code=codes[0]).status_code == 401
    assert good_login(client, code=codes[1]).status_code == 200


def test_regenerating_recovery_codes_invalidates_old_ones(client, student):
    secret, old = enable_2fa(client, student)
    body = {"password": "student123", "code": pyotp.TOTP(secret).now()}
    r = client.post("/2fa/recovery-codes", json=body, headers=student)
    assert r.status_code == 200 and r.json()["recovery_codes"] != old
    assert good_login(client, code=old[0]).status_code == 401


def test_enable_rejects_wrong_code(client, student):
    client.post("/2fa/setup", headers=student)
    assert client.post("/2fa/enable", json={"code": "000000"}, headers=student).status_code == 400
    assert client.get("/2fa", headers=student).json()["enabled"] is False


def test_wrong_2fa_codes_count_toward_lockout(client, student):
    enable_2fa(client, student)
    for _ in range(MAX_FAILED):
        good_login(client, code="000000")
    assert good_login(client, code="000000").status_code == 429


def test_disable_needs_password_and_code(client, student):
    secret, _ = enable_2fa(client, student)
    code = pyotp.TOTP(secret).now()
    assert client.post("/2fa/disable", json={"password": "bad", "code": code}, headers=student).status_code == 400
    assert client.post("/2fa/disable", json={"password": "student123", "code": code}, headers=student).status_code == 204
    assert client.get("/2fa", headers=student).json()["enabled"] is False


def test_admin_can_reset_2fa(client, admin, student):
    enable_2fa(client, student)
    assert client.delete("/users/student/2fa", headers=student).status_code == 403
    assert client.delete("/users/student/2fa", headers=admin).status_code == 204
    assert good_login(client).status_code == 200
