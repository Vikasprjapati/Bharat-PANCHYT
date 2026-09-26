import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/funding", tags=["Industry & CSR Funding"])

@router.get("/partners", response_model=List[schemas.FundingPartnerOut])
def get_csr_partners(db: Session = Depends(get_db)):
    return db.query(models.FundingPartner).all()

@router.get("/interests", response_model=List[schemas.FundingInterestOut])
def get_funding_interests(proposal_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.FundingInterest)
    if proposal_id:
        query = query.filter(models.FundingInterest.proposal_id == proposal_id)
    return query.order_by(models.FundingInterest.created_at.desc()).all()

@router.post("/offer", response_model=schemas.FundingInterestOut)
def record_funding_offer(payload: schemas.FundingInterestCreate, db: Session = Depends(get_db)):
    proposal = db.query(models.ResearchProposal).filter(models.ResearchProposal.id == payload.proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    partner = db.query(models.FundingPartner).filter(models.FundingPartner.id == payload.partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    now = datetime.datetime.utcnow()

    # Determine automated why_match explanation if none provided
    why_match = payload.why_match
    if not why_match:
        why_match = f"Strong alignment between {partner.name}'s priority area ({partner.csr_focus_areas}) and proposal objectives ({proposal.title})."

    interest = models.FundingInterest(
        proposal_id=payload.proposal_id,
        partner_id=payload.partner_id,
        funding_amount_inr=payload.funding_amount_inr,
        funding_type=payload.funding_type,
        csr_focus_alignment=payload.csr_focus_alignment or partner.csr_focus_areas,
        why_match=why_match,
        mentorship_offered=payload.mentorship_offered,
        milestones=payload.milestones or "Phase 1 Prototype & Field Trial handover",
        status="Approved",
        created_at=now
    )
    db.add(interest)

    # Transition Proposal & Problem statuses to Funded
    proposal.status = "Funded"
    proposal.updated_at = now
    
    if proposal.problem:
        proposal.problem.status = "Funded"
        proposal.problem.updated_at = now

    # Auto-initialize or link Project for State Government tracking
    existing_project = db.query(models.Project).filter(models.Project.proposal_id == proposal.id).first()
    if not existing_project:
        project_count = db.query(models.Project).count() + 1
        proj_id = f"PRJ-2026-{project_count + 2:03d}"
        project = models.Project(
            id=proj_id,
            proposal_id=proposal.id,
            problem_id=proposal.problem_id,
            title=proposal.title,
            status="Field Pilot",
            deployment_location=proposal.problem.location,
            beneficiaries_count=850,
            pilot_metrics="Initial prototype fabricated; pilot installation and sensor calibration underway.",
            start_date=now,
            target_completion=now + datetime.timedelta(days=180)
        )
        db.add(project)

    # Create Notifications
    notif = models.Notification(
        title=f"Funding Secured for {proposal.id}",
        message=f"{partner.name} committed INR {payload.funding_amount_inr:,} ({payload.funding_type}) for '{proposal.title}'.",
        type="success",
        target_role="researcher",
        related_id=proposal.id
    )
    db.add(notif)

    # Create simulated email to researcher
    email = models.SimulatedEmail(
        sender="csr-grants@bharat-panchyt.gov.in",
        recipient=proposal.researcher.email,
        recipient_role="Researcher",
        subject=f"Funding Offer Approved: INR {payload.funding_amount_inr:,} from {partner.name}",
        body=f"Dear {proposal.researcher.name},\n\nWe are delighted to inform you that {partner.name} has approved funding for your proposal '{proposal.title}'.\n\nGrant Amount: INR {payload.funding_amount_inr:,}\nFunding Type: {payload.funding_type}\nMentorship: {'Yes' if payload.mentorship_offered else 'No'}\n\nYour project is now authorized to proceed to field prototyping and pilot testing.",
        action_label="View Project Dashboard",
        action_route="/projects"
    )
    db.add(email)

    db.commit()
    db.refresh(interest)
    return interest
