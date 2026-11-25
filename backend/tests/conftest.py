"""Backend test setup.

Tests run against a real PostgreSQL database (the models use JSONB and ARRAY).
Set TEST_DATABASE_URL to an EMPTY, disposable database, e.g.
    postgresql://user:password@localhost:5432/iridium_test
The schema is dropped and rebuilt for every test, so never point this at real data.
"""
import os

import pytest

TEST_DB = os.environ.get("TEST_DATABASE_URL")
if not TEST_DB:
    pytest.skip("TEST_DATABASE_URL is not set", allow_module_level=True)

# Must be set before the app modules are imported.
os.environ["DATABASE_URL"] = TEST_DB
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-that-is-long-enough-for-hs256")
os.environ.setdefault("FRONTEND_URL", "https://localhost")
os.environ.setdefault("GARAGE_ACCESS_KEY", "test")
os.environ.setdefault("GARAGE_SECRET_KEY", "test")
os.environ["ENVIRONMENT"] = "development"
os.environ.pop("ADMIN_PASSWORD", None)
os.environ.pop("SEED_DEMO_DATA", None)

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.database import SessionLocal, engine  # noqa: E402
from app.limiter import limiter  # noqa: E402
from app.main import app  # noqa: E402
from app.seed import init_db_and_seed_admin  # noqa: E402

limiter.enabled = False


def reset_database():
    with engine.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))


@pytest.fixture()
def fresh_db():
    """An empty database with no migrations applied."""
    reset_database()
    yield
    reset_database()


@pytest.fixture()
def db_session(fresh_db):
    init_db_and_seed_admin()
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def raw_client(fresh_db):
    """A client on an empty database; the test decides how to seed it."""
    return TestClient(app)


@pytest.fixture()
def client(db_session):
    # No `with`, so the startup hook does not run a second time.
    return TestClient(app)


def login(client, username, password):
    response = client.post("/login", json={"username": username, "password": password})
    assert response.status_code == 200, response.text
    # The login sets a cookie, which would override the Authorization header of a
    # later login as a different user. Tests authenticate with headers only.
    client.cookies.clear()
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture()
def admin(client):
    return login(client, "admin", "admin123")


@pytest.fixture()
def teacher(client):
    return login(client, "teacher", "teacher123")


@pytest.fixture()
def student(client):
    return login(client, "student", "student123")


@pytest.fixture()
def student2(client):
    return login(client, "student2", "student123")
