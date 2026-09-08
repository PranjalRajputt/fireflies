from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/search", tags=["search"])


class GlobalSearchResult(BaseModel):
    meetings: List[schemas.MeetingListItem]
    segments: List[schemas.TranscriptSegment]
    action_items: List[schemas.ActionItem]


@router.get("", response_model=GlobalSearchResult)
def global_search(q: str, db: Session = Depends(get_db)):
    if not q.strip():
        return {"meetings": [], "segments": [], "action_items": []}
    return crud.global_search(db, q)