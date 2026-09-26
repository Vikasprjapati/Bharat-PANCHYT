import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(String, primary_key=True, index=True) # e.g. BP-2026-00421
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False) # Civic, Agriculture, Health, Water, Livelihood, Education, Environment
    location = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, default="Jharkhand")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    photo_url = Column(String, nullable=True)
    voice_url = Column(String, nullable=True)
    evidence_url = Column(String, nullable=True)
    citizen_name = Column(String, nullable=True)
    is_anonymous = Column(Boolean, default=False)
    priority = Column(String, default="Medium") # High, Medium, Low
    status = Column(String, default="Submitted") # Submitted, AI Analyzed, Pending Validation, Validated, Rejected, Matched, Proposal Created, Funded, In Research, Pilot, Deployed, Government Verified, Published
    sla_deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    ai_analysis = relationship("AIAnalysis", back_populates="problem", uselist=False, cascade="all, delete-orphan")
    validations = relationship("DistrictValidation", back_populates="problem", cascade="all, delete-orphan")
    matches = relationship("ExpertiseMatch", back_populates="problem", cascade="all, delete-orphan")
    proposals = relationship("ResearchProposal", back_populates="problem", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="problem", cascade="all, delete-orphan")
    outcome = relationship("PublicOutcome", back_populates="problem", uselist=False, cascade="all, delete-orphan")


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False, unique=True)
    summary = Column(Text, nullable=False)
    domain = Column(String, nullable=False) # e.g. Water & Public Health
    extracted_keywords = Column(Text, nullable=False) # JSON or comma-separated string
    duplicate_info = Column(String, nullable=True) # e.g. "2 similar problems nearby"
    is_duplicate = Column(Boolean, default=False)
    priority_suggested = Column(String, default="Medium")
    research_areas = Column(Text, nullable=False) # Comma-separated or JSON list
    is_live_ai = Column(Boolean, default=False)
    confidence_score = Column(Float, default=0.92)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    problem = relationship("Problem", back_populates="ai_analysis")


class DistrictValidation(Base):
    __tablename__ = "district_validations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)
    officer_name = Column(String, default="District Development Officer")
    district = Column(String, nullable=False)
    action = Column(String, nullable=False) # Approved, Rejected, Info Requested
    notes = Column(Text, nullable=True)
    sla_hours_spent = Column(Float, default=12.5)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    problem = relationship("Problem", back_populates="validations")


class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    state = Column(String, default="Jharkhand")
    district = Column(String, nullable=False)
    aishe_code = Column(String, nullable=True)
    nirf_rank = Column(Integer, nullable=True)
    specialization = Column(String, nullable=True)

    researchers = relationship("Researcher", back_populates="university")


class Researcher(Base):
    __tablename__ = "researchers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    title = Column(String, default="Dr. / Professor")
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    department = Column(String, nullable=False)
    email = Column(String, nullable=False)
    expertise_areas = Column(Text, nullable=False) # Comma-separated keywords
    publications_count = Column(Integer, default=24)
    profile_summary = Column(Text, nullable=True)

    university = relationship("University", back_populates="researchers")
    matches = relationship("ExpertiseMatch", back_populates="researcher")
    proposals = relationship("ResearchProposal", back_populates="researcher")


class ExpertiseMatch(Base):
    __tablename__ = "expertise_matches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)
    researcher_id = Column(Integer, ForeignKey("researchers.id"), nullable=False)
    match_score = Column(Integer, default=85) # e.g. 92%
    match_reason = Column(Text, nullable=False)
    status = Column(String, default="Matched") # Matched, Interest Expressed, Shortlisted
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    problem = relationship("Problem", back_populates="matches")
    researcher = relationship("Researcher", back_populates="matches")


class ResearchProposal(Base):
    __tablename__ = "research_proposals"

    id = Column(String, primary_key=True, index=True) # e.g. RPR-2026-0017
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)
    researcher_id = Column(Integer, ForeignKey("researchers.id"), nullable=False)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    proposed_solution = Column(Text, nullable=False)
    methodology = Column(Text, nullable=False)
    expected_outcome = Column(Text, nullable=False)
    estimated_timeline_months = Column(Integer, default=6)
    estimated_budget_inr = Column(Integer, default=450000)
    required_resources = Column(Text, nullable=True)
    research_team = Column(Text, nullable=True)
    status = Column(String, default="Proposal Submitted") # Draft, Proposal Submitted, Funding Required, Funded, In Execution
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    problem = relationship("Problem", back_populates="proposals")
    researcher = relationship("Researcher", back_populates="proposals")
    funding_interests = relationship("FundingInterest", back_populates="proposal")
    project = relationship("Project", back_populates="proposal", uselist=False)


class FundingPartner(Base):
    __tablename__ = "funding_partners"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    type = Column(String, default="Corporate CSR") # Corporate CSR, PSU CSR, Foundation, MSME
    csr_focus_areas = Column(Text, nullable=False) # e.g. "Water & Sanitation, Rural Livelihood"
    contact_email = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    funding_interests = relationship("FundingInterest", back_populates="partner")


class FundingInterest(Base):
    __tablename__ = "funding_interests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    proposal_id = Column(String, ForeignKey("research_proposals.id"), nullable=False)
    partner_id = Column(Integer, ForeignKey("funding_partners.id"), nullable=False)
    funding_amount_inr = Column(Integer, default=500000)
    funding_type = Column(String, default="CSR Grant") # CSR Grant, Research Endowment, Pilot Sponsor
    csr_focus_alignment = Column(String, nullable=True)
    why_match = Column(Text, nullable=True)
    mentorship_offered = Column(Boolean, default=True)
    milestones = Column(Text, nullable=True)
    status = Column(String, default="Interest Recorded") # Interest Recorded, Approved, Disbursed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    proposal = relationship("ResearchProposal", back_populates="funding_interests")
    partner = relationship("FundingPartner", back_populates="funding_interests")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True) # e.g. PRJ-2026-003
    proposal_id = Column(String, ForeignKey("research_proposals.id"), nullable=False)
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)
    title = Column(String, nullable=False)
    status = Column(String, default="In Research") # In Research, Prototype Phase, Field Pilot, Deployed, Government Verified, Published
    deployment_location = Column(String, nullable=False)
    beneficiaries_count = Column(Integer, default=850)
    pilot_metrics = Column(Text, nullable=True)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    target_completion = Column(DateTime, nullable=True)

    proposal = relationship("ResearchProposal", back_populates="project")
    problem = relationship("Problem", back_populates="projects")
    verifications = relationship("ProjectVerification", back_populates="project")
    outcome = relationship("PublicOutcome", back_populates="project", uselist=False)


class ProjectVerification(Base):
    __tablename__ = "project_verifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    verifier_name = Column(String, default="State Innovation Review Board")
    verifier_designation = Column(String, default="Joint Secretary, Higher Education & S&T")
    audit_findings = Column(Text, nullable=False)
    is_verified = Column(Boolean, default=True)
    verification_date = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="verifications")


class PublicOutcome(Base):
    __tablename__ = "public_outcomes"

    id = Column(String, primary_key=True, index=True) # e.g. OUT-2026-001
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)
    proposal_id = Column(String, ForeignKey("research_proposals.id"), nullable=True)
    title = Column(String, nullable=False)
    summary_solution = Column(Text, nullable=False)
    original_problem_text = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    research_institution = Column(String, nullable=False)
    research_team = Column(String, nullable=False)
    industry_partner = Column(String, nullable=False)
    deployment_date = Column(DateTime, default=datetime.datetime.utcnow)
    impact_metric = Column(String, nullable=False) # e.g. "1,200 citizens provided clean water"
    citizen_contributor_name = Column(String, default="Anonymous")
    is_anonymous = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    published_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="outcome")
    problem = relationship("Problem", back_populates="outcome")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info") # info, success, warning, match
    target_role = Column(String, default="all") # citizen, district, researcher, industry, government, all
    related_id = Column(String, nullable=True) # BP-xxx or RPR-xxx
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SimulatedEmail(Base):
    __tablename__ = "simulated_emails"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sender = Column(String, default="system@bharat-panchyt.gov.in")
    recipient = Column(String, nullable=False)
    recipient_role = Column(String, default="Researcher")
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    action_label = Column(String, default="View Match")
    action_route = Column(String, default="/research-matching")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
