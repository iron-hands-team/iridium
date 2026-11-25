import os

from app.models import Channel, Info, Settings, User
from app.seed import init_db_and_seed_admin

from .conftest import SessionLocal


def _count(model):
    with SessionLocal() as db:
        return db.query(model).count()


def test_development_seed_includes_demo_accounts(db_session):
    usernames = {u.username for u in db_session.query(User)}
    assert {"admin", "teacher", "student"} <= usernames


def test_production_seed_has_only_the_admin(fresh_db, monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ADMIN_PASSWORD", "a-long-production-password")
    init_db_and_seed_admin()
    assert _count(User) == 1
    assert _count(Channel) == 1
    assert _count(Info) == 1
    assert _count(Settings) == 1


def test_production_uses_admin_password_from_env(monkeypatch, raw_client):
    client = raw_client
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ADMIN_PASSWORD", "a-long-production-password")
    init_db_and_seed_admin()
    ok = client.post("/login", json={"username": "admin", "password": "a-long-production-password"})
    default = client.post("/login", json={"username": "admin", "password": "admin123"})
    assert ok.status_code == 200
    assert default.status_code == 401


def test_production_without_password_generates_a_random_one(monkeypatch, capsys, raw_client):
    client = raw_client
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.delenv("ADMIN_PASSWORD", raising=False)
    init_db_and_seed_admin()
    printed = capsys.readouterr().out
    assert "Generated admin password" in printed
    password = printed.split(":", 1)[1].strip().split()[0]
    assert len(password) >= 16
    assert client.post("/login", json={"username": "admin", "password": password}).status_code == 200
    assert client.post("/login", json={"username": "admin", "password": "admin123"}).status_code == 401


def test_production_can_still_seed_demo_data_when_asked(fresh_db, monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ADMIN_PASSWORD", "a-long-production-password")
    monkeypatch.setenv("SEED_DEMO_DATA", "true")
    init_db_and_seed_admin()
    assert _count(User) > 1


def test_seed_is_idempotent(db_session):
    before = db_session.query(User).count()
    init_db_and_seed_admin()
    assert db_session.query(User).count() == before
