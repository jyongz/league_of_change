# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .config import settings

# Database URL from configuration
DATABASE_URL = settings.DATABASE_URL

# Create engine and session local for SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
