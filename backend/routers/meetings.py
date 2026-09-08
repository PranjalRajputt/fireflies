import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.get("", response_model=List[schemas.MeetingListItem])
def list_meetings(
    search: Optional[str] = Query(None, description="Filter by title"),
    participant: Optional[str] = Query(None, description="Filter by participant name"),
    date_from: Optional[datetime.datetime] = Query(None),
    date_to: Optional[datetime.datetime] = Query(None),
    sort: str = Query("recent", pattern="^(recent|oldest|title)$"),
    db: Session = Depends(get_db),
):
    return crud.list_meetings(
        db,
        search=search,
        participant=participant,
        date_from=date_from,
        date_to=date_to,
        sort=sort,
    )


@router.post("", response_model=schemas.Meeting, status_code=201)
def create_meeting(payload: schemas.MeetingCreate, db: Session = Depends(get_db)):
    return crud.create_meeting(db, payload)


@router.get("/{meeting_id}", response_model=schemas.Meeting)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.patch("/{meeting_id}", response_model=schemas.Meeting)
def update_meeting(
    meeting_id: str, payload: schemas.MeetingUpdate, db: Session = Depends(get_db)
):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.update_meeting(db, meeting, payload)


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    crud.delete_meeting(db, meeting)
    return None