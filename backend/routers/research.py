import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/research", tags=["Research"])

@router.get("/researchers", response_model=List[schemas.ResearcherOut])
def get_researchers(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Researcher)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Researcher.name.ilike(s)) |
            (models.Researcher.department.ilike(s)) |
            (models.Researcher.expertise_areas.ilike(s))
        )
    return query.all()

@router.get("/opportunities", response_model=List[schemas.ProblemOut])
def get_research_opportunities(category: Optional[str] = None, db: Session = Depends(get_db)):
    # Validated problems that are ready for research intervention
    query = db.query(models.Problem).filter(
        models.Problem.status.in_(["Validated", "Matched", "In Research", "Proposal Created", "Funded"])
    )
    if category and category != "All":
        query = query.filter(models.Problem.category == category)
    return query.order_by(models.Problem.updated_at.desc()).all()

@router.get("/matches", response_model=List[schemas.ExpertiseMatchOut])
def get_matches(problem_id: Optional[str] = None, researcher_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.ExpertiseMatch)
    if problem_id:
        query = query.filter(models.ExpertiseMatch.problem_id == problem_id)
    if researcher_id:
        query = query.filter(models.ExpertiseMatch.researcher_id == researcher_id)
    return query.order_by(models.ExpertiseMatch.match_score.desc()).all()

@router.post("/express-interest")
def express_interest(payload: dict, db: Session = Depends(get_db)):
    match_id = payload.get("match_id")
    match = db.query(models.ExpertiseMatch).filter(models.ExpertiseMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match record not found")
    match.status = "Interest Expressed"
    
    # Notify ecosystem
    notif = models.Notification(
        title=f"Researcher Expressed Interest",
        message=f"{match.researcher.name} ({match.researcher.university.name}) expressed active interest in {match.problem.id}.",
        type="match",
        target_role="all",
        related_id=match.problem_id
    )
    db.add(notif)
    db.commit()
    return {"status": "success", "message": "Interest expressed successfully"}

@router.get("/proposals", response_model=List[schemas.ResearchProposalOut])
def get_proposals(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.ResearchProposal)
    if status and status != "All":
        query = query.filter(models.ResearchProposal.status == status)
    return query.order_by(models.ResearchProposal.created_at.desc()).all()

@router.get("/proposals/{proposal_id}", response_model=schemas.ResearchProposalOut)
def get_proposal(proposal_id: str, db: Session = Depends(get_db)):
    proposal = db.query(models.ResearchProposal).filter(models.ResearchProposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal

@router.post("/proposals", response_model=schemas.ResearchProposalOut)
def create_proposal(payload: schemas.ResearchProposalCreate, db: Session = Depends(get_db)):
    # 1. Generate unique proposal ID: RPR-2026-XXXX
    count = db.query(models.ResearchProposal).count() + 1
    prop_id = f"RPR-2026-{count + 16:04d}"

    now = datetime.datetime.utcnow()
    proposal = models.ResearchProposal(
        id=prop_id,
        problem_id=payload.problem_id,
        researcher_id=payload.researcher_id,
        title=payload.title,
        problem_statement=payload.problem_statement,
        proposed_solution=payload.proposed_solution,
        methodology=payload.methodology,
        expected_outcome=payload.expected_outcome,
        estimated_timeline_months=payload.estimated_timeline_months,
        estimated_budget_inr=payload.estimated_budget_inr,
        required_resources=payload.required_resources,
        research_team=payload.research_team,
        status="Proposal Submitted",
        created_at=now,
        updated_at=now
    )
    db.add(proposal)

    # 2. Update problem status
    problem = db.query(models.Problem).filter(models.Problem.id == payload.problem_id).first()
    if problem:
        problem.status = "Proposal Created"
        problem.updated_at = now

    # 3. Create Notification for Industry / CSR
    notif = models.Notification(
        title=f"New Research Proposal: {prop_id}",
        message=f"Proposal '{payload.title}' submitted for citizen issue {payload.problem_id}. Available for CSR funding.",
        type="info",
        target_role="industry",
        related_id=prop_id
    )
    db.add(notif)

    # 4. Create Simulated Email for CSR partners
    csr_lead = db.query(models.FundingPartner).first()
    if csr_lead:
        email = models.SimulatedEmail(
            sender="proposals@bharat-panchyt.gov.in",
            recipient=csr_lead.contact_email,
            recipient_role="Industry / CSR",
            subject=f"New Validated Research Proposal Ready for Funding: {prop_id}",
            body=f"Dear {csr_lead.name},\n\nA validated high-impact research proposal '{payload.title}' has been submitted.\n\nBudget: INR {payload.estimated_budget_inr:,}\nTimeline: {payload.estimated_timeline_months} Months\n\nReview proposal objectives and express funding interest.",
            action_label="Review Proposal",
            action_route="/funding-csr"
        )
        db.add(email)

    db.commit()
    db.refresh(proposal)
    return proposal
