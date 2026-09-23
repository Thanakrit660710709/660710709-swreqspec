"""SQLAlchemy models for the booking feature."""

from datetime import date, datetime, time

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all booking database models."""


class Slot(Base):
    """A package-specific slot supporting FR-BKG-01 and FR-BKG-06."""

    __tablename__ = "slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slot_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    package_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    remaining: Mapped[int] = mapped_column(Integer, nullable=False)

    bookings: Mapped[list["Booking"]] = relationship(back_populates="slot")


class Booking(Base):
    """A booking supporting FR-BKG-04 and IF-HIS-01 through HN only."""

    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    hn: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    slot_id: Mapped[int] = mapped_column(
        ForeignKey("slots.id"), nullable=False, index=True
    )
    booking_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    # Queue format and allocation remain unspecified until Q-02 is answered.
    queue_no: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    slot: Mapped[Slot] = relationship(back_populates="bookings")


class AuditLog(Base):
    """Audit record for access to a patient's booking data (DOM-PDPA-01)."""

    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_id: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    hn: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    accessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
