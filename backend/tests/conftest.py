"""Shared database fixtures for backend tests."""

from importlib import import_module

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.db.models import Base

migration_001_init = import_module("app.db.migrations.001_init")


@pytest.fixture
def db_engine():
    """Provide an isolated SQLite database for each test."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    migration_001_init.upgrade(engine)
    try:
        yield engine
    finally:
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture
def db_session(db_engine) -> Session:
    """Provide a session against the migrated test database."""
    with Session(db_engine) as session:
        yield session
