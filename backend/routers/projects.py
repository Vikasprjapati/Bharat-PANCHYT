import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/projects", tags=["State Government Projects & Deployments"])

@router.get("", response_model=List[schemas.ProjectOut])
def get_projects(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if status and status != "All":
        query = query.filter(models.Project.status == status)
    return query.order_by(models.Project.start_date.desc()).all()

@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    proj = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.post("/{project_id}/verify")
def verify_project_deployment(project_id: str, payload: schemas.ProjectVerificationCreate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    now = datetime.datetime.utcnow()
    verification = models.ProjectVerification(
        project_id=project_id,
        verifier_name=payload.verifier_name,
        verifier_designation=payload.verifier_designation,
        audit_findings=payload.audit_findings,
        is_verified=payload.is_verified,
        verification_date=now
    )
    db.add(verification)

    project.status = "Government Verified"
    if project.problem:
        project.problem.status = "Government Verified"
        project.problem.updated_at = now

    # Notification
    notif = models.Notification(
        title=f"Project {project_id} Verified by Government",
        message=f"{payload.verifier_designation} validated field implementation metrics. Ready for public registry.",
        type="success",
        target_role="all",
        related_id=project_id
    )
    db.add(notif)

    db.commit()
    return {"status": "success", "message": "Deployment verified successfully. Ready to publish outcome."}

@router.post("/{project_id}/publish", response_model=schemas.PublicOutcomeOut)
def publish_to_public_registry(project_id: str, payload: dict, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Generate Outcome ID
    count = db.query(models.PublicOutcome).count() + 1
    out_id = f"OUT-2026-{count + 5:03d}"

    now = datetime.datetime.utcnow()
    problem = project.problem
    proposal = project.proposal
    researcher = proposal.researcher if proposal else None
    funding_interest = proposal.funding_interests[0] if (proposal and proposal.funding_interests) else None
    partner_name = funding_interest.partner.name if funding_interest else "State Innovation Fund"

    outcome = models.PublicOutcome(
        id=out_id,
        project_id=project.id,
        problem_id=problem.id if problem else "BP-2026-000",
        proposal_id=proposal.id if proposal else None,
        title=payload.get("title", project.title),
        summary_solution=payload.get("summary_solution", proposal.proposed_solution if proposal else "Field engineered solution deployed."),
        original_problem_text=problem.description if problem else "Community reported problem.",
        location=project.deployment_location,
        research_institution=researcher.university.name if researcher else "Lead Research Institute",
        research_team=proposal.research_team if proposal else (researcher.name if researcher else "State Research Team"),
        industry_partner=partner_name,
        deployment_date=now,
        impact_metric=payload.get("impact_metric", f"{project.beneficiaries_count} citizens directly impacted with verified field outcomes."),
        citizen_contributor_name=problem.citizen_name if (problem and not problem.is_anonymous) else "Anonymous",
        is_anonymous=problem.is_anonymous if problem else True,
        is_published=True,
        published_at=now
    )
    db.add(outcome)

    project.status = "Published"
    if problem:
        problem.status = "Published"
        problem.updated_at = now

    # Notification
    notif = models.Notification(
        title=f"Outcome Published: {out_id}",
        message=f"Solution for '{problem.title if problem else project.title}' is now public. Contributor: {outcome.citizen_contributor_name}.",
        type="success",
        target_role="all",
        related_id=out_id
    )
    db.add(notif)

    # Congratulatory simulated email to the citizen
    if problem and problem.citizen_name and not problem.is_anonymous:
        email = models.SimulatedEmail(
            sender="impact@bharat-panchyt.gov.in",
            recipient=f"{problem.citizen_name.lower().replace(' ', '.')}@demo-citizen.in",
            recipient_role="Citizen",
            subject=f"Congratulations! Your Problem Report has produced a Verified Public Innovation ({out_id})",
            body=f"Namaste {problem.citizen_name},\n\nYour civic problem report regarding '{problem.title}' has achieved full lifecycle success.\n\nKey Achievements:\n• Research Lead: {outcome.research_institution}\n• Industry Partner: {outcome.industry_partner}\n• Impact: {outcome.impact_metric}\n\nYou are credited as Citizen Contributor in the Public Innovation Outcome Registry.",
            action_label="View Registry Entry",
            action_route="/public-outcomes"
        )
        db.add(email)

    db.commit()
    db.refresh(outcome)
    return outcome
