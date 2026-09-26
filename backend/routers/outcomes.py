from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/outcomes", tags=["Public Outcomes Registry"])

@router.get("", response_model=List[schemas.PublicOutcomeOut])
def get_public_outcomes(
    search: Optional[str] = None,
    location: Optional[str] = None,
    institution: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.PublicOutcome).filter(models.PublicOutcome.is_published == True)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.PublicOutcome.title.ilike(s)) |
            (models.PublicOutcome.summary_solution.ilike(s)) |
            (models.PublicOutcome.original_problem_text.ilike(s)) |
            (models.PublicOutcome.location.ilike(s)) |
            (models.PublicOutcome.research_institution.ilike(s)) |
            (models.PublicOutcome.industry_partner.ilike(s)) |
            (models.PublicOutcome.citizen_contributor_name.ilike(s))
        )
    if location and location != "All":
        query = query.filter(models.PublicOutcome.location.ilike(f"%{location}%"))
    if institution and institution != "All":
        query = query.filter(models.PublicOutcome.research_institution.ilike(f"%{institution}%"))

    return query.order_by(models.PublicOutcome.published_at.desc()).all()

@router.get("/{outcome_id}", response_model=schemas.PublicOutcomeOut)
def get_public_outcome(outcome_id: str, db: Session = Depends(get_db)):
    outcome = db.query(models.PublicOutcome).filter(models.PublicOutcome.id == outcome_id).first()
    if not outcome:
        raise HTTPException(status_code=404, detail="Outcome not found in registry")
    return outcome
