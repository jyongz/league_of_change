# main.py
from fastapi import FastAPI, HTTPException, Depends
from . import crud, schemas, models, database

# Initialize FastAPI app
app = FastAPI()

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route to get all lesson plans
@app.get("/lesson_plans/", response_model=list[schemas.LessonPlan])
def read_lesson_plans(skip: int = 0, limit: int = 100, db: database.Session = Depends(get_db)):
    lesson_plans = crud.get_lesson_plans(db, skip=skip, limit=limit)
    return lesson_plans

# Route to get a specific lesson plan by ID
@app.get("/lesson_plans/{lesson_plan_id}", response_model=schemas.LessonPlan)
def read_lesson_plan(lesson_plan_id: int, db: database.Session = Depends(get_db)):
    lesson_plan = crud.get_lesson_plan_by_id(db, lesson_plan_id)
    if not lesson_plan:
        raise HTTPException(status_code=404, detail="Lesson plan not found")
    return lesson_plan

# Route to create a new lesson plan
@app.post("/lesson_plans/", response_model=schemas.LessonPlan)
def create_lesson_plan(lesson_plan: schemas.LessonPlanCreate, db: database.Session = Depends(get_db)):
    return crud.create_lesson_plan(db, lesson_plan)

# Route to update an existing lesson plan
@app.put("/lesson_plans/{lesson_plan_id}", response_model=schemas.LessonPlan)
def update_lesson_plan(lesson_plan_id: int, lesson_plan: schemas.LessonPlanUpdate, db: database.Session = Depends(get_db)):
    updated_lesson_plan = crud.update_lesson_plan(db, lesson_plan_id, lesson_plan)
    if not updated_lesson_plan:
        raise HTTPException(status_code=404, detail="Lesson plan not found")
    return updated_lesson_plan

# Route to delete a lesson plan
@app.delete("/lesson_plans/{lesson_plan_id}", response_model=schemas.LessonPlan)
def delete_lesson_plan(lesson_plan_id: int, db: database.Session = Depends(get_db)):
    deleted_lesson_plan = crud.delete_lesson_plan(db, lesson_plan_id)
    if not deleted_lesson_plan:
        raise HTTPException(status_code=404, detail="Lesson plan not found")
    return deleted_lesson_plan
