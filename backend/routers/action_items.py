from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(tags=["action-items"])


@router.get("/api/meetings/{meeting_id}/action-items", response_model=List[schemas.ActionItem])
def list_action_items(meeting_id: str, db: Session = Depends(get_db)):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting.action_items


@router.post(
    "/api/meetings/{meeting_id}/action-items",
    response_model=schemas.ActionItem,
    status_code=201,
)
def create_action_item(
    meeting_id: str, payload: schemas.ActionItemCreate, db: Session = Depends(get_db)
):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.add_action_item(db, meeting_id, payload)


@router.patch("/api/action-items/{item_id}", response_model=schemas.ActionItem)
def update_action_item(
    item_id: str, payload: schemas.ActionItemUpdate, db: Session = Depends(get_db)
):
    item = crud.get_action_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return crud.update_action_item(db, item, payload)


@router.delete("/api/action-items/{item_id}", status_code=204)
def delete_action_item(item_id: str, db: Session = Depends(get_db)):
    item = crud.get_action_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    crud.delete_action_item(db, item)
    return None