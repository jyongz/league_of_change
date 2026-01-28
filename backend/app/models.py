# models.py
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

# Base class for SQLAlchemy models
Base = declarative_base()

class LessonPlan(Base):
    __tablename__ = 'lesson_plans'

    lesson_plan_id = Column(Integer, primary_key=True, index=True)
    lesson_code = Column(String, index=True)
    lesson_title = Column(String)
    theme_id = Column(Integer)
    product_type_id = Column(Integer)
    duration_minutes = Column(Integer)
    difficulty_level = Column(String)
    delivery_method = Column(String)
    requires_equipment = Column(Boolean)
    max_participants = Column(Integer)
    version = Column(String)
    effective_from = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    data_source = Column(String)
  
