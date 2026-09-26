import datetime
from typing import List, Optional
from pydantic import BaseModel

# AI Analysis Schema
class AIAnalysisBase(BaseModel):
    summary: str
    domain: str
    extracted_keywords: str
    duplicate_info: Optional[str] = None
    is_duplicate: bool = False
    priority_suggested: str = "Medium"
    research_areas: str
    is_live_ai: bool = False
    confidence_score: float = 0.92

class AIAnalysisOut(AIAnalysisBase):
    id: int
    problem_id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Problem Schemas
class ProblemCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    location: str
    district: str
    state: Optional[str] = "Jharkhand"
    latitude: Optional[float] = 23.3441
    longitude: Optional[float] = 85.3096
    photo_url: Optional[str] = None
    voice_url: Optional[str] = None
    evidence_url: Optional[str] = None
    citizen_name: Optional[str] = None
    is_anonymous: bool = False

class ProblemOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    location: str
    district: str
    state: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_url: Optional[str] = None
    voice_url: Optional[str] = None
    evidence_url: Optional[str] = None
    citizen_name: Optional[str] = None
    is_anonymous: bool = False
    priority: str
    status: str
    sla_deadline: Optional[datetime.datetime] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    ai_analysis: Optional[AIAnalysisOut] = None

    class Config:
        from_attributes = True

# District Validation Schemas
class DistrictValidationCreate(BaseModel):
    problem_id: str
    officer_name: Optional[str] = "District Officer"
    district: str
    action: str # Approved, Rejected, Info Requested
    notes: Optional[str] = None

class DistrictValidationOut(BaseModel):
    id: int
    problem_id: str
    officer_name: str
    district: str
    action: str
    notes: Optional[str] = None
    sla_hours_spent: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# University & Researcher Schemas
class UniversityOut(BaseModel):
    id: int
    name: str
    state: str
    district: str
    aishe_code: Optional[str] = None
    nirf_rank: Optional[int] = None
    specialization: Optional[str] = None

    class Config:
        from_attributes = True

class ResearcherOut(BaseModel):
    id: int
    name: str
    title: str
    university_id: int
    department: str
    email: str
    expertise_areas: str
    publications_count: int
    profile_summary: Optional[str] = None
    university: Optional[UniversityOut] = None

    class Config:
        from_attributes = True

class ExpertiseMatchOut(BaseModel):
    id: int
    problem_id: str
    researcher_id: int
    match_score: int
    match_reason: str
    status: str
    created_at: datetime.datetime
    researcher: Optional[ResearcherOut] = None
    problem: Optional[ProblemOut] = None

    class Config:
        from_attributes = True

# Proposal Schemas
class ResearchProposalCreate(BaseModel):
    problem_id: str
    researcher_id: int
    title: str
    problem_statement: str
    proposed_solution: str
    methodology: str
    expected_outcome: str
    estimated_timeline_months: int = 6
    estimated_budget_inr: int = 450000
    required_resources: Optional[str] = None
    research_team: Optional[str] = None

class ResearchProposalOut(BaseModel):
    id: str
    problem_id: str
    researcher_id: int
    title: str
    problem_statement: str
    proposed_solution: str
    methodology: str
    expected_outcome: str
    estimated_timeline_months: int
    estimated_budget_inr: int
    required_resources: Optional[str] = None
    research_team: Optional[str] = None
    status: str
    created_at: datetime.datetime
    researcher: Optional[ResearcherOut] = None
    problem: Optional[ProblemOut] = None

    class Config:
        from_attributes = True

# Funding Schemas
class FundingPartnerOut(BaseModel):
    id: int
    name: str
    type: str
    csr_focus_areas: str
    contact_email: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class FundingInterestCreate(BaseModel):
    proposal_id: str
    partner_id: int
    funding_amount_inr: int
    funding_type: str = "CSR Grant"
    csr_focus_alignment: Optional[str] = None
    why_match: Optional[str] = None
    mentorship_offered: bool = True
    milestones: Optional[str] = None

class FundingInterestOut(BaseModel):
    id: int
    proposal_id: str
    partner_id: int
    funding_amount_inr: int
    funding_type: str
    csr_focus_alignment: Optional[str] = None
    why_match: Optional[str] = None
    mentorship_offered: bool
    milestones: Optional[str] = None
    status: str
    created_at: datetime.datetime
    partner: Optional[FundingPartnerOut] = None
    proposal: Optional[ResearchProposalOut] = None

    class Config:
        from_attributes = True

# Project & Outcome Schemas
class ProjectOut(BaseModel):
    id: str
    proposal_id: str
    problem_id: str
    title: str
    status: str
    deployment_location: str
    beneficiaries_count: int
    pilot_metrics: Optional[str] = None
    start_date: datetime.datetime
    target_completion: Optional[datetime.datetime] = None
    proposal: Optional[ResearchProposalOut] = None
    problem: Optional[ProblemOut] = None

    class Config:
        from_attributes = True

class ProjectVerificationCreate(BaseModel):
    project_id: str
    verifier_name: str = "State Innovation Review Board"
    verifier_designation: str = "Joint Secretary, S&T"
    audit_findings: str
    is_verified: bool = True

class PublicOutcomeCreate(BaseModel):
    project_id: str
    problem_id: str
    proposal_id: Optional[str] = None
    title: str
    summary_solution: str
    original_problem_text: str
    location: str
    research_institution: str
    research_team: str
    industry_partner: str
    impact_metric: str
    citizen_contributor_name: Optional[str] = "Anonymous"
    is_anonymous: bool = False
    is_published: bool = True

class PublicOutcomeOut(BaseModel):
    id: str
    project_id: str
    problem_id: str
    proposal_id: Optional[str] = None
    title: str
    summary_solution: str
    original_problem_text: str
    location: str
    research_institution: str
    research_team: str
    industry_partner: str
    deployment_date: datetime.datetime
    impact_metric: str
    citizen_contributor_name: Optional[str] = "Anonymous"
    is_anonymous: bool
    is_published: bool
    published_at: datetime.datetime

    class Config:
        from_attributes = True

# Notification & Email
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    target_role: str
    related_id: Optional[str] = None
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class SimulatedEmailOut(BaseModel):
    id: int
    sender: str
    recipient: str
    recipient_role: str
    subject: str
    body: str
    action_label: str
    action_route: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
