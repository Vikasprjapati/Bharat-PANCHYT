import random
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/validations", tags=["District Validations"])

@router.get("/queue", response_model=List[schemas.ProblemOut])
def get_validation_queue(district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Problem).filter(models.Problem.status.in_(["Pending Validation", "Submitted"]))
    if district and district != "All":
        query = query.filter(models.Problem.district == district)
    return query.order_by(models.Problem.created_at.desc()).all()

@router.get("/history", response_model=List[schemas.DistrictValidationOut])
def get_validation_history(db: Session = Depends(get_db)):
    return db.query(models.DistrictValidation).order_by(models.DistrictValidation.created_at.desc()).all()

@router.post("", response_model=schemas.DistrictValidationOut)
def record_district_validation(payload: schemas.DistrictValidationCreate, db: Session = Depends(get_db)):
    problem = db.query(models.Problem).filter(models.Problem.id == payload.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    now = datetime.datetime.utcnow()
    hours_spent = (now - problem.created_at).total_seconds() / 3600.0

    validation = models.DistrictValidation(
        problem_id=payload.problem_id,
        officer_name=payload.officer_name or "District Officer",
        district=payload.district,
        action=payload.action,
        notes=payload.notes,
        sla_hours_spent=round(hours_spent, 1),
        created_at=now
    )
    db.add(validation)

    if payload.action == "Approved":
        problem.status = "Validated"
        problem.updated_at = now

        # Trigger AI Expertise Matching across researchers
        researchers = db.query(models.Researcher).all()
        # Find relevant researchers based on category / domain / keywords
        matched_count = 0
        cat_lower = problem.category.lower()

        # Keyword sets
        cat_keywords = {
            "water": ["water", "hydrology", "filtration", "aquifer", "purification", "seepage"],
            "agriculture": ["agri", "crop", "soil", "pest", "horticulture", "irrigation", "storage"],
            "health": ["health", "anemia", "diagnostic", "medicine", "biomedical", "pathology"],
            "civic": ["waste", "civil", "drainage", "gis", "traffic", "composting"],
            "livelihood": ["livelihood", "silk", "handloom", "enterprise", "forest", "cooperative"],
            "education": ["education", "stem", "pedagogy", "vernacular", "learning"],
            "environment": ["environment", "mine", "wetland", "remediation", "air", "emission", "biomass"]
        }
        targets = cat_keywords.get(cat_lower, ["water", "infrastructure"])

        for r in researchers:
            r_text = (r.department + " " + r.expertise_areas + " " + (r.profile_summary or "")).lower()
            score = 65
            matches = [t for t in targets if t in r_text]
            if matches:
                score += len(matches) * 10
                score = min(score, 96)
                score = max(score, 82)
                
                # Check if match already exists
                existing = db.query(models.ExpertiseMatch).filter(
                    models.ExpertiseMatch.problem_id == problem.id,
                    models.ExpertiseMatch.researcher_id == r.id
                ).first()

                if not existing:
                    m_obj = models.ExpertiseMatch(
                        problem_id=problem.id,
                        researcher_id=r.id,
                        match_score=score,
                        match_reason=f"Strong research alignment in {r.department} with key focus on {', '.join(matches[:2])}.",
                        status="Matched"
                    )
                    db.add(m_obj)
                    matched_count += 1

                    # Create a simulated email notification for the top matched researcher
                    if matched_count == 1:
                        email_obj = models.SimulatedEmail(
                            sender="system@bharat-panchyt.gov.in",
                            recipient=r.email,
                            recipient_role="Researcher",
                            subject=f"New Problem Matched: {problem.title} ({problem.id})",
                            body=f"Dear {r.name},\n\nA citizen problem in {problem.location} ({problem.category}) has been validated by the District Administration and matches your expertise ({score}% match).\n\nProblem ID: {problem.id}\nPriority: {problem.priority}\n\nPlease review and formulate a research proposal to unlock CSR/Industry funding.",
                            action_label="View Problem & Match",
                            action_route="/research-matching"
                        )
                        db.add(email_obj)

        # Create system notification
        notif = models.Notification(
            title=f"Problem {problem.id} Validated",
            message=f"District verified '{problem.title}'. Auto-matched with {max(matched_count, 1)} academic research experts.",
            type="success",
            target_role="researcher",
            related_id=problem.id
        )
        db.add(notif)

    elif payload.action == "Rejected":
        problem.status = "Rejected"
        problem.updated_at = now
        notif = models.Notification(
            title=f"Problem {problem.id} Rejected",
            message=f"Validation officer closed report with reason: {payload.notes or 'Out of jurisdictional scope'}.",
            type="warning",
            target_role="citizen",
            related_id=problem.id
        )
        db.add(notif)
    elif payload.action == "Info Requested":
        problem.status = "Info Requested"
        problem.updated_at = now

    db.commit()
    db.refresh(validation)
    return validation
