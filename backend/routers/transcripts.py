from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from services.file_parser import parse_transcript_file
from services.ai_service import generate_meeting_intelligence

router = APIRouter(prefix="/api/meetings/{meeting_id}/transcript", tags=["transcripts"])

def _ensure_meeting(db: Session, meeting_id: str):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@router.post("/upload", response_model=List[schemas.TranscriptSegment])
async def upload_transcript(
    meeting_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    meeting = _ensure_meeting(db, meeting_id)
    content = await file.read()
    text_content = content.decode("utf-8", errors="ignore")
    
    try:
        parsed = parse_transcript_file(file.filename or "transcript.txt", content)
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail=f"Could not parse transcript file: {exc}"
        )
    
    if not parsed:
        raise HTTPException(
            status_code=400, detail="No transcript content found in file"
        )
    
    # 1. Save transcript segments
    segments = crud.replace_segments(db, meeting_id, parsed)

    # 2. Generate AI intelligence
    ai_data = generate_meeting_intelligence(text_content)
    
    # 3. Persist Summary
    summary_text = ai_data.get("summary")
    if summary_text:
        if meeting.summary:
            meeting.summary.overview = summary_text
        else:
            from models import Summary
            new_summary = Summary(meeting_id=meeting_id, overview=summary_text)
            db.add(new_summary)
        db.commit()

    # 4. Persist Topics / Chapters
    if ai_data.get("topics"):
        for topic in ai_data["topics"]:
            try:
                # Normalize keys from AI response (timestamp/time -> start_time)
                if isinstance(topic, dict):
                    if "timestamp" in topic and "start_time" not in topic:
                        topic["start_time"] = topic.pop("timestamp")
                    elif "time" in topic and "start_time" not in topic:
                        topic["start_time"] = topic.pop("time")
                
                crud.add_topic(db, meeting_id, schemas.TopicCreate(**topic))
            except Exception as e:
                print("Failed to add topic:", e)
            
    # 5. Persist Action Items
    if ai_data.get("action_items"):
        for item in ai_data["action_items"]:
            try:
                crud.add_action_item(db, meeting_id, schemas.ActionItemCreate(**item))
            except Exception:
                try:
                    crud.add_action_item(db, meeting_id, item)
                except Exception:
                    pass

    return segments