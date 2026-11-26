from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from sqlalchemy import inspect, text

from app.database import Base, engine
from app.migrations import run_migrations


def _tables():
    return set(inspect(engine).get_table_names())


def test_fresh_database_gets_every_table(fresh_db):
    run_migrations()
    assert {"users", "announcements", "audit_log", "alembic_version"} <= _tables()


def test_models_and_migrations_agree(fresh_db):
    """Fails if someone changes a model without adding a migration (run `alembic revision --autogenerate`)."""
    run_migrations()
    with engine.connect() as conn:
        ctx = MigrationContext.configure(conn, opts={"compare_type": True})
        diff = compare_metadata(ctx, Base.metadata)
    assert diff == [], f"Models differ from migrations: {diff}"


def test_running_twice_is_safe(fresh_db):
    run_migrations()
    run_migrations()
    with engine.connect() as conn:
        assert conn.execute(text("select count(*) from alembic_version")).scalar() == 1


def _make_legacy_schema():
    tables = [t for t in Base.metadata.sorted_tables if t.name not in ("audit_log", "login_throttle")]
    Base.metadata.create_all(bind=engine, tables=tables)
    with engine.begin() as conn:
        for col in ("totp_secret", "totp_enabled", "recovery_codes"):
            conn.execute(text(f"alter table users drop column {col}"))


def test_legacy_database_is_adopted_and_upgraded(fresh_db):
    """A database made by the old create_all() startup has no alembic_version."""
    from app import models  # noqa: F401

    _make_legacy_schema()
    assert "alembic_version" not in _tables()
    assert "audit_log" not in _tables()

    with engine.begin() as conn:
        conn.execute(text(
            "insert into users (username, last_name, first_name, hashed_password, role, title, token_version) "
            "values ('keep', 'Me', 'Keep', 'x', 'student', 'T', 0)"
        ))

    run_migrations()

    assert "audit_log" in _tables()
    with engine.connect() as conn:
        assert conn.execute(text("select count(*) from users where username='keep'")).scalar() == 1


def test_schema_drift_in_a_legacy_database_is_reported(fresh_db, caplog):
    from app import models  # noqa: F401

    # A legacy database predates the audit_log table.
    _make_legacy_schema()
    with engine.begin() as conn:
        conn.execute(text("alter table announcements drop column archived_at"))
    with caplog.at_level("WARNING", logger="iridium.migrations"):
        run_migrations()
    assert any("differs from the current models" in r.message for r in caplog.records)
