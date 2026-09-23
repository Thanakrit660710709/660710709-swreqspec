"""Initial schema migration for booking data."""

from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine) -> None:
    """Create tables required by CON-TECH-01, FR-BKG-01, and FR-BKG-04."""
    Base.metadata.create_all(engine)


def downgrade(engine: Engine) -> None:
    """Remove booking tables created by this migration."""
    Base.metadata.drop_all(engine)
