import io

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

import crud
from database import get_db

router = APIRouter(prefix="/api/meetings/{meeting_id}/export", tags=["export"])


def _seconds_to_clock(seconds: float) -> str:
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def _build_markdown(meeting) -> str:
    lines = [f"# {meeting.title}", ""]
    lines.append(f"_{meeting.date.strftime('%B %d, %Y')} · {len(meeting.participants)} participants_")
    lines.append("")
    if meeting.summary and meeting.summary.overview:
        lines += ["## Summary", meeting.summary.overview, ""]
    if meeting.topics:
        lines.append("## Topics")
        for t in meeting.topics:
            lines.append(f"- {_seconds_to_clock(t.start_time)} — {t.title}")
        lines.append("")
    if meeting.action_items:
        lines.append("## Action Items")
        for a in meeting.action_items:
            box = "x" if a.is_completed else " "
            who = f" (@{a.assignee})" if a.assignee else ""
            lines.append(f"- [{box}] {a.text}{who}")
        lines.append("")
    lines.append("## Transcript")
    for seg in meeting.segments:
        lines.append(f"**{seg.speaker}** _{_seconds_to_clock(seg.start_time)}_  ")
        lines.append(seg.text)
        lines.append("")
    return "\n".join(lines)


def _build_txt(meeting) -> str:
    lines = [meeting.title, meeting.date.strftime("%B %d, %Y"), "=" * 40, ""]
    if meeting.summary and meeting.summary.overview:
        lines += ["SUMMARY", meeting.summary.overview, ""]
    if meeting.action_items:
        lines.append("ACTION ITEMS")
        for a in meeting.action_items:
            status = "DONE" if a.is_completed else "TODO"
            lines.append(f"[{status}] {a.text}")
        lines.append("")
    lines.append("TRANSCRIPT")
    for seg in meeting.segments:
        lines.append(f"[{_seconds_to_clock(seg.start_time)}] {seg.speaker}: {seg.text}")
    return "\n".join(lines)


@router.get("")
def export_meeting(
    meeting_id: str,
    format: str = Query("txt", pattern="^(txt|md|pdf)$"),
    db: Session = Depends(get_db),
):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    safe_name = "".join(c for c in meeting.title if c.isalnum() or c in " -_").strip() or "meeting"

    if format == "md":
        content = _build_markdown(meeting)
        return StreamingResponse(
            io.BytesIO(content.encode("utf-8")),
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{safe_name}.md"'},
        )

    if format == "pdf":
        from fpdf import FPDF
        from fpdf.enums import XPos, YPos

        def line(text: str, size: float, bold: bool = False, gap_after: float = 0):
            pdf.set_font("Helvetica", "B" if bold else "", size)
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(
                pdf.epw, size * 0.5 + 2, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT
            )
            if gap_after:
                pdf.ln(gap_after)

        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        line(meeting.title, 18, bold=True)
        line(meeting.date.strftime("%B %d, %Y"), 10, gap_after=4)

        if meeting.summary and meeting.summary.overview:
            line("Summary", 13, bold=True)
            line(meeting.summary.overview, 11, gap_after=3)

        if meeting.action_items:
            line("Action Items", 13, bold=True)
            for a in meeting.action_items:
                mark = "[x]" if a.is_completed else "[ ]"
                line(f"{mark} {a.text}", 11)
            pdf.ln(3)

        line("Transcript", 13, bold=True)
        for seg in meeting.segments:
            line(f"{seg.speaker}  ({_seconds_to_clock(seg.start_time)})", 10, bold=True)
            line(seg.text, 10, gap_after=1.5)

        output = bytes(pdf.output())
        return StreamingResponse(
            io.BytesIO(output),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{safe_name}.pdf"'},
        )

    content = _build_txt(meeting)
    return StreamingResponse(
        io.BytesIO(content.encode("utf-8")),
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{safe_name}.txt"'},
    )