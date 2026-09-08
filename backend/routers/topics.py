from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from database import get_db

router = APIRouter(tags=["topics-and-summary"])


# --- Topics / chapters -----------------------------------------------------

@router.get("/api/meetings/{meeting_id}/topics", response_model=List[schemas.Topic])
def list_topics(meeting_id: str, db: Session = Depends(get_db)):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting.topics


@router.post(
    "/api/meetings/{meeting_id}/topics", response_model=schemas.Topic, status_code=201
)
def create_topic(
    meeting_id: str, payload: schemas.TopicCreate, db: Session = Depends(get_db)
):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.add_topic(db, meeting_id, payload)


@router.delete("/api/topics/{topic_id}", status_code=204)
def delete_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.get(models.Topic, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    crud.delete_topic(db, topic)
    return None


# --- Summary -----------------------------------------------------------

@router.put("/api/meetings/{meeting_id}/summary", response_model=schemas.Summary)
def update_summary(
    meeting_id: str, payload: schemas.SummaryUpdate, db: Session = Depends(get_db)
):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.update_summary(db, meeting_id, payload)