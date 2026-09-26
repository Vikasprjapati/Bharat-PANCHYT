import random
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services.ai_service import analyze_problem_content

router = APIRouter(prefix="/api/problems", tags=["Problems"])

@router.post("/analyze")
def test_ai_analysis(payload: dict):
    title = payload.get("title", "")
    description = payload.get("description", "")
    category = payload.get("category", "Water")
    location = payload.get("location", "Jharkhand")
    return analyze_problem_content(title, description, category, location)

@router.get("", response_model=List[schemas.ProblemOut])
def get_problems(
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Problem)
    if category and category != "All":
        query = query.filter(models.Problem.category == category)
    if status and status != "All":
        query = query.filter(models.Problem.status == status)
    if priority and priority != "All":
        query = query.filter(models.Problem.priority == priority)
    if district and district != "All":
        query = query.filter(models.Problem.district == district)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Problem.title.ilike(s)) |
            (models.Problem.description.ilike(s)) |
            (models.Problem.location.ilike(s)) |
            (models.Problem.id.ilike(s))
        )
    return query.order_by(models.Problem.created_at.desc()).all()

@router.get("/{problem_id}", response_model=schemas.ProblemOut)
def get_problem(problem_id: str, db: Session = Depends(get_db)):
    prob = db.query(models.Problem).filter(models.Problem.id == problem_id).first()
    if not prob:
        raise HTTPException(status_code=404, detail="Problem not found")
    return prob

@router.post("", response_model=schemas.ProblemOut)
def create_citizen_problem(payload: schemas.ProblemCreate, db: Session = Depends(get_db)):
    # 1. Generate unique Problem ID: BP-2026-XXXXX
    count = db.query(models.Problem).count() + 1
    prob_id = f"BP-2026-{count + 420:05d}"

    # 2. AI Understanding & Classification
    ai_result = analyze_problem_content(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        location=payload.location
    )

    # 3. Create Problem instance
    now = datetime.datetime.utcnow()
    sla_deadline = now + datetime.timedelta(hours=48) # 48h SLA timer

    problem = models.Problem(
        id=prob_id,
        title=payload.title,
        description=payload.description,
        category=ai_result["category"],
        location=payload.location,
        district=payload.district,
        state=payload.state or "Jharkhand",
        latitude=payload.latitude or 23.3441,
        longitude=payload.longitude or 85.3096,
        photo_url=payload.photo_url,
        voice_url=payload.voice_url,
        evidence_url=payload.evidence_url,
        citizen_name=payload.citizen_name if not payload.is_anonymous else "Anonymous",
        is_anonymous=payload.is_anonymous,
        priority=ai_result["priority_suggested"],
        status="Pending Validation",
        sla_deadline=sla_deadline,
        created_at=now,
        updated_at=now
    )
    db.add(problem)
    db.flush()

    # 4. Save AI Analysis result
    ai_analysis = models.AIAnalysis(
        problem_id=prob_id,
        summary=ai_result["summary"],
        domain=ai_result["domain"],
        extracted_keywords=ai_result["extracted_keywords"],
        duplicate_info=ai_result["duplicate_info"],
        is_duplicate=ai_result["is_duplicate"],
        priority_suggested=ai_result["priority_suggested"],
        research_areas=ai_result["research_areas"],
        is_live_ai=ai_result["is_live_ai"],
        confidence_score=ai_result["confidence_score"],
        created_at=now
    )
    db.add(ai_analysis)

    # 5. Create In-App Notification
    notif = models.Notification(
        title=f"New Problem Submitted: {prob_id}",
        message=f"Citizen report '{payload.title}' received for {payload.location}. Priority: {ai_result['priority_suggested']}.",
        type="info",
        target_role="district",
        related_id=prob_id
    )
    db.add(notif)

    db.commit()
    db.refresh(problem)
    return problem
