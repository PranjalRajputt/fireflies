"""
Parses an uploaded transcript file into a normalized list of segment dicts:
    [{"speaker": str, "text": str, "start_time": float, "end_time": float}, ...]

Supports three formats, detected by file extension:
  - .json : list of {speaker, text, start_time, end_time}
  - .vtt  : standard WebVTT captions (speaker inferred from a "Name:" prefix
            in the cue text if present, otherwise "Speaker")
  - .txt  : one turn per line, "Speaker Name: text"; auto-spaced timestamps
"""
from __future__ import annotations

import json
import re
from typing import List, Dict


def parse_transcript_file(filename: str, content: bytes) -> List[Dict]:
    lower = filename.lower()
    text = content.decode("utf-8", errors="ignore")

    if lower.endswith(".json"):
        return _parse_json(text)
    if lower.endswith(".vtt"):
        return _parse_vtt(text)
    # default to plain text / .txt
    return _parse_txt(text)


def _parse_json(text: str) -> List[Dict]:
    data = json.loads(text)
    segments = []
    for i, item in enumerate(data):
        segments.append(
            {
                "speaker": item.get("speaker", "Speaker"),
                "text": item.get("text", "").strip(),
                "start_time": float(item.get("start_time", i * 6)),
                "end_time": float(item.get("end_time", i * 6 + 5.5)),
            }
        )
    return [s for s in segments if s["text"]]


_VTT_TIME_RE = re.compile(
    r"(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})\s*-->\s*"
    r"(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})"
)


def _vtt_ts_to_seconds(ts: str) -> float:
    parts = ts.split(":")
    if len(parts) == 3:
        h, m, s = parts
    else:
        h = "0"
        m, s = parts
    return int(h) * 3600 + int(m) * 60 + float(s)


def _parse_vtt(text: str) -> List[Dict]:
    lines = text.splitlines()
    segments = []
    i = 0
    while i < len(lines):
        match = _VTT_TIME_RE.search(lines[i])
        if match:
            start = _vtt_ts_to_seconds(match.group(1))
            end = _vtt_ts_to_seconds(match.group(2))
            i += 1
            cue_lines = []
            while i < len(lines) and lines[i].strip() != "":
                cue_lines.append(lines[i].strip())
                i += 1
            cue_text = " ".join(cue_lines).strip()
            speaker = "Speaker"
            if ":" in cue_text:
                possible_speaker, rest = cue_text.split(":", 1)
                if len(possible_speaker) < 40:
                    speaker = possible_speaker.strip()
                    cue_text = rest.strip()
            if cue_text:
                segments.append(
                    {
                        "speaker": speaker,
                        "text": cue_text,
                        "start_time": start,
                        "end_time": end,
                    }
                )
        else:
            i += 1
    return segments


def _parse_txt(text: str) -> List[Dict]:
    segments = []
    t = 0.0
    current_speaker = "Speaker"
    
    # Flexible regex to find [HH:MM:SS] or [MM:SS] anywhere at the start of the line
    ts_regex = re.compile(r"\[(?:(\d{1,2}):)?(\d{2}):(\d{2})\]|\[(\d{1,2}):(\d{2})\]")

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("Meeting:") or line.startswith("Date:") or line.startswith("Attendees:"):
            continue

        start_time = t
        
        # Search for timestamp in the line
        ts_match = ts_regex.search(line)
        if ts_match:
            groups = ts_match.groups()
            if groups[0] is not None:  # [HH:MM:SS] format
                h, m, s = int(groups[0]), int(groups[1]), int(groups[2])
                start_time = h * 3600 + m * 60 + s
            elif groups[3] is not None:  # [MM:SS] format
                m, s = int(groups[3]), int(groups[4])
                start_time = m * 60 + s
            
            # Strip the matched timestamp bracket from the line text
            line = ts_regex.sub("", line).strip()

        # Extract Speaker and Content
        speaker = current_speaker
        content = line
        if ":" in line:
            parts = line.split(":", 1)
            possible_speaker = parts[0].strip()
            if possible_speaker and len(possible_speaker) < 40:
                speaker = possible_speaker
                current_speaker = speaker
                content = parts[1].strip()

        if not content:
            continue

        segments.append(
            {
                "speaker": speaker,
                "text": content,
                "start_time": float(start_time),
                "end_time": float(start_time + 5.0),
            }
        )
        t = start_time + 5.0

    return segments