"""Celery task tests. Run from backend/celery:  pytest

Needs TEST_DATABASE_URL pointing at an EMPTY, disposable PostgreSQL database.
The schema is dropped and rebuilt for every test.
"""
import os

import pytest

TEST_DB = os.environ.get("TEST_DATABASE_URL")
if not TEST_DB:
    pytest.skip("TEST_DATABASE_URL is not set", allow_module_level=True)

os.environ["DATABASE_URL"] = TEST_DB
os.environ.setdefault("CELERY_BROKER_URL", "redis://localhost:6379/0")

from sqlalchemy import text  # noqa: E402

import models  # noqa: E402,F401
from database import Base, SessionLocal, engine  # noqa: E402


@pytest.fixture()
def db():
    with engine.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        with engine.begin() as conn:
            conn.execute(text("DROP SCHEMA public CASCADE"))
            conn.execute(text("CREATE SCHEMA public"))
