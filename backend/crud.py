"""
CRUD layer — all direct DB reads/writes live here so routers stay thin
and focused on HTTP concerns (status codes, request parsing).
"""
from __future__ import annotations

import datetime
from typing import List, Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

import models
import schemas


# --- Participants / Tags (lookup-or-create helpers) -----------------------

def get_or_create_participant(db: Session, name: str) -> models.Participant:
    name = name.strip()
    participant = (
        db.query(models.Participant).filter(models.Participant.name == name).first()
    )
    if participant:
        return participant
    participant = models.Participant(name=name)
    db.add(participant)
    db.flush()
    return participant


def get_or_create_tag(db: Session, name: str) -> models.Tag:
    name = name.strip().lower()
    tag = db.query(models.Tag).filter(models.Tag.name == name).first()
    if tag:
        return tag
    tag = models.Tag(name=name)
    db.add(tag)
    db.flush()
    return tag


# --- Meetings --------------------------------------------------------------

def list_meetings(
    db: Session,
    search: Optional[str] = None,
    participant: Optional[str] = None,
    date_from: Optional[datetime.datetime] = None,
    date_to: Optional[datetime.datetime] = None,
    sort: str = "recent",
) -> List[models.Meeting]:
    query = db.query(models.Meeting)

    if search:
        like = f"%{search}%"
        query = query.filter(models.Meeting.title.ilike(like))

    if participant:
        query = query.join(models.Meeting.participants).filter(
            models.Participant.name.ilike(f"%{participant}%")
        )

    if date_from:
        query = query.filter(models.Meeting.date >= date_from)
    if date_to:
        query = query.filter(models.Meeting.date <= date_to)

    if sort == "oldest":
        query = query.order_by(models.Meeting.date.asc())
    elif sort == "title":
        query = query.order_by(models.Meeting.title.asc())
    else:  # "recent" default
        query = query.order_by(models.Meeting.date.desc())

    return query.distinct().all()


def get_meeting(db: Session, meeting_id: str) -> Optional[models.Meeting]:
    return db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()


def _parse_raw_transcript(raw_transcript: str) -> List[dict]:
    """
    Turns a pasted transcript into segments.

    Supported line format: "Speaker Name: text here" (one turn per line).
    Lines without a colon are treated as a continuation of the previous
    speaker. Each turn is auto-spaced 6 seconds apart since no real
    timestamps exist for pasted text.
    """
    segments = []
    t = 0.0
    current_speaker = "Speaker"
    for raw_line in raw_transcript.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if ":" in line:
            speaker, text = line.split(":", 1)
            speaker = speaker.strip()
            text = text.strip()
            if speaker and len(speaker) < 60:
                current_speaker = speaker
            else:
                text = line
        else:
            text = line
        if not text:
            continue
        segments.append(
            {
                "speaker": current_speaker,
                "text": text,
                "start_time": t,
                "end_time": t + 5.5,
            }
        )
        t += 6.0
    return segments


def create_meeting(db: Session, payload: schemas.MeetingCreate) -> models.Meeting:
    meeting = models.Meeting(
        title=payload.title,
        date=payload.date or datetime.datetime.utcnow(),
        duration_seconds=payload.duration_seconds or 0,
    )
    db.add(meeting)
    db.flush()  # assigns meeting.id so relationship appends below work

    for name in payload.participant_names:
        if name.strip():
            meeting.participants.append(get_or_create_participant(db, name))

    for name in payload.tag_names:
        if name.strip():
            meeting.tags.append(get_or_create_tag(db, name))

    # Always attach an (initially empty) summary shell so the frontend
    # can render the summary panel immediately.
    meeting.summary = models.Summary(meeting_id=meeting.id, overview="")

    if payload.raw_transcript:
        parsed = _parse_raw_transcript(payload.raw_transcript)
        max_end = 0.0
        for idx, seg in enumerate(parsed):
            db.add(
                models.TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker=seg["speaker"],
                    text=seg["text"],
                    start_time=seg["start_time"],
                    end_time=seg["end_time"],
                    order_index=idx,
                )
            )
            max_end = max(max_end, seg["end_time"])
        if not payload.duration_seconds:
            meeting.duration_seconds = int(max_end)

    db.commit()
    db.refresh(meeting)
    return meeting


def update_meeting(
    db: Session, meeting: models.Meeting, payload: schemas.MeetingUpdate
) -> models.Meeting:
    if payload.title is not None:
        meeting.title = payload.title
    if payload.date is not None:
        meeting.date = payload.date
    if payload.duration_seconds is not None:
        meeting.duration_seconds = payload.duration_seconds
    if payload.participant_names is not None:
        meeting.participants = [
            get_or_create_participant(db, n)
            for n in payload.participant_names
            if n.strip()
        ]
    if payload.tag_names is not None:
        meeting.tags = [
            get_or_create_tag(db, n) for n in payload.tag_names if n.strip()
        ]

    meeting.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting


def delete_meeting(db: Session, meeting: models.Meeting) -> None:
    db.delete(meeting)
    db.commit()


# --- Transcript segments ----------------------------------------------------

def add_segment(
    db: Session, meeting_id: str, payload: schemas.TranscriptSegmentCreate
) -> models.TranscriptSegment:
    count = (
        db.query(models.TranscriptSegment)
        .filter(models.TranscriptSegment.meeting_id == meeting_id)
        .count()
    )
    segment = models.TranscriptSegment(
        meeting_id=meeting_id,
        speaker=payload.speaker,
        text=payload.text,
        start_time=payload.start_time,
        end_time=payload.end_time,
        order_index=count,
    )
    db.add(segment)
    db.commit()
    db.refresh(segment)
    return segment


def replace_segments(
    db: Session, meeting_id: str, segments: List[dict]
) -> List[models.TranscriptSegment]:
    """Used by the transcript-file upload endpoint to overwrite existing segments."""
    db.query(models.TranscriptSegment).filter(
        models.TranscriptSegment.meeting_id == meeting_id
    ).delete()

    created = []
    max_end = 0.0
    for idx, seg in enumerate(segments):
        row = models.TranscriptSegment(
            meeting_id=meeting_id,
            speaker=seg["speaker"],
            text=seg["text"],
            start_time=seg["start_time"],
            end_time=seg["end_time"],
            order_index=idx,
        )
        db.add(row)
        created.append(row)
        max_end = max(max_end, seg["end_time"])

    meeting = get_meeting(db, meeting_id)
    if meeting and max_end > meeting.duration_seconds:
        meeting.duration_seconds = int(max_end)

    db.commit()
    for row in created:
        db.refresh(row)
    return created


def search_transcript(db: Session, meeting_id: str, query: str):
    like = f"%{query}%"
    return (
        db.query(models.TranscriptSegment)
        .filter(
            models.TranscriptSegment.meeting_id == meeting_id,
            models.TranscriptSegment.text.ilike(like),
        )
        .order_by(models.TranscriptSegment.order_index)
        .all()
    )


# --- Summary -----------------------------------------------------------

def update_summary(
    db: Session, meeting_id: str, payload: schemas.SummaryUpdate
) -> models.Summary:
    summary = (
        db.query(models.Summary)
        .filter(models.Summary.meeting_id == meeting_id)
        .first()
    )
    if not summary:
        summary = models.Summary(meeting_id=meeting_id, overview="")
        db.add(summary)
    if payload.overview is not None:
        summary.overview = payload.overview
    db.commit()
    db.refresh(summary)
    return summary


# --- Topics --------------------------------------------------------------

def add_topic(
    db: Session, meeting_id: str, payload: schemas.TopicCreate
) -> models.Topic:
    # Resolve start_time from start_time, timestamp, or time
    st = payload.start_time
    if st == 0.0:
        if getattr(payload, "timestamp", None):
            st = payload.timestamp
        elif getattr(payload, "time", None):
            st = payload.time

    topic = models.Topic(
        meeting_id=meeting_id, 
        title=payload.title, 
        start_time=float(st or 0.0)
    )
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


def delete_topic(db: Session, topic: models.Topic) -> None:
    db.delete(topic)
    db.commit()


# --- Action items ----------------------------------------------------------

def add_action_item(
    db: Session, meeting_id: str, payload: schemas.ActionItemCreate
) -> models.ActionItem:
    item = models.ActionItem(
        meeting_id=meeting_id,
        text=payload.text,
        assignee=payload.assignee,
        is_completed=payload.is_completed,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_action_item(db: Session, item_id: str) -> Optional[models.ActionItem]:
    return (
        db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    )


def update_action_item(
    db: Session, item: models.ActionItem, payload: schemas.ActionItemUpdate
) -> models.ActionItem:
    if payload.text is not None:
        item.text = payload.text
    if payload.assignee is not None:
        item.assignee = payload.assignee
    if payload.is_completed is not None:
        item.is_completed = payload.is_completed
    db.commit()
    db.refresh(item)
    return item


def delete_action_item(db: Session, item: models.ActionItem) -> None:
    db.delete(item)
    db.commit()


# --- Global search (bonus) --------------------------------------------------

def global_search(db: Session, query: str) -> dict:
    like = f"%{query}%"
    meetings = (
        db.query(models.Meeting).filter(models.Meeting.title.ilike(like)).all()
    )
    segments = (
        db.query(models.TranscriptSegment)
        .filter(models.TranscriptSegment.text.ilike(like))
        .limit(50)
        .all()
    )
    action_items = (
        db.query(models.ActionItem)
        .filter(models.ActionItem.text.ilike(like))
        .limit(50)
        .all()
    )
    return {
        "meetings": meetings,
        "segments": segments,
        "action_items": action_items,
    }