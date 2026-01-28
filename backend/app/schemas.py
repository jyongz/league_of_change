# schemas.py
from pydantic import BaseModel
from datetime import datetime

# Base schema for lesson plans
class LessonPlanBase(BaseModel):
    lesson_code: str
    lesson_title: str
    theme_id: int
    product_type_id: int
    duration_minutes: int
    difficulty_level: str
    delivery_method: str
    requires_equipment: bool
    max_participants: int
    version: str
    effective_from: datetime
    is_active: bool
    data_source: str

# Schema for creating new lesson plans
class LessonPlanCreate(LessonPlanBase):
    pass

# Schema for updating lesson plans
class LessonPlanUpdate(LessonPlanBase):
    lesson_plan_id: int

# Schema for returning lesson plan data
class LessonPlan(LessonPlanBase):
    lesson_plan_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
