"""
Pydantic schemas — request/response shapes for the API.

Naming convention:
    XCreate  -> payload for creating X
    XUpdate  -> payload for partially updating X (all fields optional)
    X        -> full response shape for X
"""
from __future__ import annotations

import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


# --- Participant ---------------------------------------------------------

class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None
    avatar_color: Optional[str] = "#6C5CE7"


class ParticipantCreate(ParticipantBase):
    pass


class Participant(ParticipantBase):
    model_config = ConfigDict(from_attributes=True)
    id: str


# --- Tag -------------------------------------------------------------------

class Tag(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str


# --- Transcript segment ----------------------------------------------------

class TranscriptSegmentBase(BaseModel):
    speaker: str
    text: str
    start_time: float
    end_time: float


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegment(TranscriptSegmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    meeting_id: str
    order_index: int


# --- Summary -----------------------------------------------------------

class SummaryBase(BaseModel):
    overview: str


class SummaryUpdate(BaseModel):
    overview: Optional[str] = None


class Summary(SummaryBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    meeting_id: str


# --- Topic -------------------------------------------------------------

class TopicBase(BaseModel):
    title: str
    start_time: float = 0.0

    model_config = ConfigDict(populate_by_name=True)

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if isinstance(obj, dict):
            if "timestamp" in obj and "start_time" not in obj:
                obj["start_time"] = obj["timestamp"]
            elif "time" in obj and "start_time" not in obj:
                obj["start_time"] = obj["time"]
        return super().model_validate(obj, *args, **kwargs)


class TopicCreate(BaseModel):
    title: str
    start_time: Optional[float] = 0.0
    timestamp: Optional[float] = None
    time: Optional[float] = None

    model_config = ConfigDict(populate_by_name=True)


class Topic(TopicBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: str
    meeting_id: str


# --- Action item ---------------------------------------------------------

class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    is_completed: bool = False


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    is_completed: Optional[bool] = None


class ActionItem(ActionItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    meeting_id: str
    created_at: datetime.datetime


# --- Meeting -------------------------------------------------------------

class MeetingBase(BaseModel):
    title: str
    date: Optional[datetime.datetime] = None
    duration_seconds: Optional[int] = 0


class MeetingCreate(MeetingBase):
    participant_names: List[str] = []
    tag_names: List[str] = []
    # Optional: paste a raw transcript directly at creation time.
    # Expected format: one line per turn, e.g. "Speaker Name: Some text"
    raw_transcript: Optional[str] = None


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime.datetime] = None
    duration_seconds: Optional[int] = None
    participant_names: Optional[List[str]] = None
    tag_names: Optional[List[str]] = None


class MeetingListItem(BaseModel):
    """Lightweight shape used by the dashboard list — avoids shipping full transcripts."""
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    date: datetime.datetime
    duration_seconds: int
    media_url: str
    participants: List[Participant] = []
    tags: List[Tag] = []


class Meeting(BaseModel):
    """Full meeting detail shape, including nested transcript/summary/topics/action items."""
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    date: datetime.datetime
    duration_seconds: int
    media_url: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    participants: List[Participant] = []
    tags: List[Tag] = []
    segments: List[TranscriptSegment] = []
    summary: Optional[Summary] = None
    topics: List[Topic] = []
    action_items: List[ActionItem] = []