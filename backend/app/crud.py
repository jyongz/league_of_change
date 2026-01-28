# crud.py
from sqlalchemy.orm import Session
from . import models, schemas

# Get all lesson plans
def get_lesson_plans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LessonPlan).offset(skip).limit(limit).all()

# Get a lesson plan by ID
def get_lesson_plan_by_id(db: Session, lesson_plan_id: int):
    return db.query(models.LessonPlan).filter(models.LessonPlan.lesson_plan_id == lesson_plan_id).first()

# Create a new lesson plan
def create_lesson_plan(db: Session, lesson_plan: schemas.LessonPlanCreate):
    db_lesson_plan = models.LessonPlan(**lesson_plan.dict())
    db.add(db_lesson_plan)
    db.commit()
    db.refresh(db_lesson_plan)
    return db_lesson_plan

# Update an existing lesson plan
def update_lesson_plan(db: Session, lesson_plan_id: int, lesson_plan: schemas.LessonPlanUpdate):
    db_lesson_plan = db.query(models.LessonPlan).filter(models.LessonPlan.lesson_plan_id == lesson_plan_id).first()
    if db_lesson_plan:
        for key, value in lesson_plan.dict(exclude_unset=True).items():
            setattr(db_lesson_plan, key, value)
        db.commit()
        db.refresh(db_lesson_plan)
        return db_lesson_plan
    return None

# Delete a lesson plan
def delete_lesson_plan(db: Session, lesson_plan_id: int):
    db_lesson_plan = db.query(models.LessonPlan).filter(models.LessonPlan.lesson_plan_id == lesson_plan_id).first()
    if db_lesson_plan:
        db.delete(db_lesson_plan)
        db.commit()
        return db_lesson_plan
    return None
