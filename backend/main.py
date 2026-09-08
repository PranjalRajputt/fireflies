"""
FastAPI entrypoint.

Run with:
    uvicorn main:app --reload --port 8000

On startup this creates all tables if they don't already exist. Run
`python seed.py` once to populate sample data (several full meetings
with transcripts, summaries, topics, and action items).
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
load_dotenv()

import models
from database import engine
from routers import meetings, transcripts, action_items, topics, search, export

app = FastAPI(
    title="Fireflies Clone API",
    description="Meeting notes & transcription platform — backend API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

models.Base.metadata.create_all(bind=engine)

# Add prefix="/api" so routes match /api/meetings, /api/transcripts, etc.
app.include_router(meetings.router, prefix="/api")
app.include_router(transcripts.router, prefix="/api")
app.include_router(action_items.router, prefix="/api")
app.include_router(topics.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(export.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Fireflies API is running!"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}