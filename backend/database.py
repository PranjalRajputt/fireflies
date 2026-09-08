"""
Database configuration.

Uses SQLite for zero-setup local persistence, as required by the assignment.
The DB file (fireflies.db) is created automatically on first run.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./fireflies.db"

# check_same_thread=False is required because FastAPI can access the
# connection from more than one thread when running with multiple workers.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()