from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db, Base, engine
import models
import schemas
from services.seed_data import seed_database

router = APIRouter(prefix="/api", tags=["Stats & Notifications"])

@router.get("/stats")
def get_ecosystem_stats(db: Session = Depends(get_db)):
    total_problems = db.query(models.Problem).count()
    validated = db.query(models.Problem).filter(models.Problem.status.notin_(["Submitted", "Pending Validation", "Rejected"])).count()
    matches = db.query(models.ExpertiseMatch).count()
    proposals = db.query(models.ResearchProposal).count()
    funded = db.query(models.ResearchProposal).filter(models.ResearchProposal.status.in_(["Funded", "In Execution"])).count()
    deployed = db.query(models.Project).filter(models.Project.status.in_(["Deployed", "Government Verified", "Published"])).count()
    outcomes = db.query(models.PublicOutcome).filter(models.PublicOutcome.is_published == True).count()

    # Category counts
    cat_counts = (
        db.query(models.Problem.category, func.count(models.Problem.id))
        .group_by(models.Problem.category)
        .all()
    )
    category_distribution = [{"name": cat, "count": count} for cat, count in cat_counts]

    # District counts
    dist_counts = (
        db.query(models.Problem.district, func.count(models.Problem.id))
        .group_by(models.Problem.district)
        .all()
    )
    district_distribution = [{"district": dist, "count": count} for dist, count in dist_counts]

    return {
        "kpis": {
            "total_problems": total_problems,
            "validated_problems": validated,
            "research_matches": matches,
            "proposals_submitted": proposals,
            "funded_projects": funded,
            "deployed_innovations": deployed,
            "public_outcomes": outcomes
        },
        "category_distribution": category_distribution,
        "district_distribution": district_distribution,
        "disclaimer": "Prototype Demo Data — Designed for live state & higher education integration."
    }

@router.get("/notifications", response_model=List[schemas.NotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.created_at.desc()).limit(20).all()

@router.patch("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}

@router.get("/emails", response_model=List[schemas.SimulatedEmailOut])
def get_simulated_emails(db: Session = Depends(get_db)):
    return db.query(models.SimulatedEmail).order_by(models.SimulatedEmail.created_at.desc()).all()

@router.post("/reset-demo")
def reset_demo_database(db: Session = Depends(get_db)):
    # Drop all and re-create schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database(db)
    return {"status": "success", "message": "Demo database successfully re-seeded to initial state!"}
