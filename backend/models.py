"""
SQLAlchemy models — the database schema for the app.

Relationships:
    Meeting 1---N TranscriptSegment
    Meeting 1---1 Summary
    Meeting 1---N Topic
    Meeting 1---N ActionItem
    Meeting N---N Participant   (via meeting_participants)
    Meeting N---N Tag           (via meeting_tags)
"""
import datetime
import uuid

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship

from database import Base


def gen_id() -> str:
    return uuid.uuid4().hex[:12]


# --- Association tables (many-to-many) ---------------------------------

meeting_participants = Table(
    "meeting_participants",
    Base.metadata,
    Column("meeting_id", String, ForeignKey("meetings.id"), primary_key=True),
    Column("participant_id", String, ForeignKey("participants.id"), primary_key=True),
)

meeting_tags = Table(
    "meeting_tags",
    Base.metadata,
    Column("meeting_id", String, ForeignKey("meetings.id"), primary_key=True),
    Column("tag_id", String, ForeignKey("tags.id"), primary_key=True),
)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, default=gen_id)
    title = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration_seconds = Column(Integer, default=0)
    media_url = Column(String, default="/static/sample-media/sample-meeting.mp3")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

    participants = relationship(
        "Participant", secondary=meeting_participants, back_populates="meetings"
    )
    segments = relationship(
        "TranscriptSegment",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="TranscriptSegment.start_time",
    )
    summary = relationship(
        "Summary",
        back_populates="meeting",
        uselist=False,
        cascade="all, delete-orphan",
    )
    topics = relationship(
        "Topic",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="Topic.start_time",
    )
    action_items = relationship(
        "ActionItem", back_populates="meeting", cascade="all, delete-orphan"
    )
    tags = relationship("Tag", secondary=meeting_tags, back_populates="meetings")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    avatar_color = Column(String, default="#6C5CE7")

    meetings = relationship(
        "Meeting", secondary=meeting_participants, back_populates="participants"
    )


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(String, primary_key=True, default=gen_id)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    speaker = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    start_time = Column(Float, nullable=False)  # seconds
    end_time = Column(Float, nullable=False)  # seconds
    order_index = Column(Integer, default=0)

    meeting = relationship("Meeting", back_populates="segments")


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(String, primary_key=True, default=gen_id)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False, unique=True)
    overview = Column(Text, nullable=False, default="")

    meeting = relationship("Meeting", back_populates="summary")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(String, primary_key=True, default=gen_id)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    title = Column(String, nullable=False)
    start_time = Column(Float, default=0)  # seconds, chapter marker

    meeting = relationship("Meeting", back_populates="topics")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(String, primary_key=True, default=gen_id)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    text = Column(String, nullable=False)
    assignee = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    meeting = relationship("Meeting", back_populates="action_items")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False, unique=True)

    meetings = relationship("Meeting", secondary=meeting_tags, back_populates="tags")