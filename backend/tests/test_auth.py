from app.models import User

from .conftest import login


def test_login_success_returns_token_and_user(client):
    r = client.post("/login", json={"username": "admin", "password": "admin123"})
    assert r.status_code == 200
    body = r.json()
    assert body["user"]["username"] == "admin"
    assert body["user"]["role"] == "admin"
    assert "hashed_password" not in body["user"]


def test_login_wrong_password_and_unknown_user_look_the_same(client):
    wrong = client.post("/login", json={"username": "admin", "password": "nope"})
    unknown = client.post("/login", json={"username": "ghost", "password": "nope"})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json() == unknown.json()


def test_me_requires_auth(client):
    assert client.get("/me").status_code == 401


def test_me_returns_current_user(client, student):
    r = client.get("/me", headers=student)
    assert r.status_code == 200
    assert r.json()["username"] == "student"


def test_logout_revokes_the_token(client, student):
    assert client.get("/me", headers=student).status_code == 200
    assert client.post("/logout", headers=student).status_code == 200
    assert client.get("/me", headers=student).status_code == 401


def test_students_cannot_use_admin_routes(client, student):
    assert client.get("/users", headers=student).status_code == 403
    assert client.get("/audit-log", headers=student).status_code == 403
    body = {"username": "x", "password": "longenough1", "role": "student",
            "first_name": "X", "last_name": "Y", "title": "T"}
    assert client.post("/users", json=body, headers=student).status_code == 403


def test_teachers_cannot_use_admin_routes(client, teacher):
    assert client.get("/users", headers=teacher).status_code == 403
    assert client.get("/audit-log", headers=teacher).status_code == 403


def test_admin_can_create_user_and_new_user_can_log_in(client, admin):
    body = {"username": "newkid", "password": "longenough1", "role": "student",
            "first_name": "New", "last_name": "Kid", "title": "Freshman"}
    assert client.post("/users", json=body, headers=admin).status_code == 200
    login(client, "newkid", "longenough1")


def test_create_user_rejects_short_password_and_duplicate(client, admin):
    body = {"username": "short", "password": "1234567", "role": "student",
            "first_name": "S", "last_name": "P", "title": "T"}
    assert client.post("/users", json=body, headers=admin).status_code == 422
    dup = {**body, "username": "student", "password": "longenough1"}
    assert client.post("/users", json=dup, headers=admin).status_code == 400


def test_passwords_are_stored_hashed(client, db_session):
    user = db_session.query(User).filter(User.username == "admin").one()
    assert user.hashed_password != "admin123"
    assert user.hashed_password.startswith("$2")


def test_paused_platform_blocks_non_admins_only(client, admin, student):
    assert client.post("/pause", json={"password": "admin123"}, headers=admin).status_code == 204
    assert client.get("/announcements", headers=student).status_code == 503
    assert client.get("/announcements", headers=admin).status_code == 200
    assert client.post("/pause", json={"password": "admin123"}, headers=admin).status_code == 204
    assert client.get("/announcements", headers=student).status_code == 200


def test_pause_requires_the_admin_password(client, admin):
    assert client.post("/pause", json={"password": "wrong"}, headers=admin).status_code == 400
