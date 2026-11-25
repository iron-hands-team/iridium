"""Database migrations, run automatically on startup.

- Fresh database: all migrations are applied.
- Database created by an older Iridium (via create_all, no alembic_version
  table): it is adopted at the baseline revision, then upgraded.
- If an adopted database is missing columns or tables compared with the models,
  a warning listing the differences is logged so an admin can fix it.
"""

import logging
from pathlib import Path

from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext
from sqlalchemy import inspect

from app.database import Base, engine
from app import models  # noqa: F401  (registers all tables on Base.metadata)

logger = logging.getLogger("iridium.migrations")

BASELINE_REVISION = "0001"
ALEMBIC_INI = Path(__file__).resolve().parent.parent / "alembic.ini"


def _config() -> Config:
    return Config(str(ALEMBIC_INI))


def _schema_diff() -> list:
    with engine.connect() as connection:
        context = MigrationContext.configure(connection, opts={"compare_type": True})
        return compare_metadata(context, Base.metadata)


def run_migrations() -> None:
    cfg = _config()
    tables = set(inspect(engine).get_table_names())

    if "alembic_version" not in tables and "users" in tables:
        logger.warning(
            "Existing database without migration history found; adopting it at baseline %s.",
            BASELINE_REVISION,
        )
        diff = _schema_diff()
        if diff:
            logger.warning(
                "The existing schema differs from the current models. "
                "Review and fix these manually before relying on it: %s",
                diff,
            )
        command.stamp(cfg, BASELINE_REVISION)

    command.upgrade(cfg, "head")
