export type StakeholderRole = 
  | 'citizen' 
  | 'district' 
  | 'researcher' 
  | 'industry' 
  | 'government' 
  | 'public';

export interface AIAnalysis {
  id: number;
  problem_id: string;
  summary: string;
  domain: string;
  extracted_keywords: string;
  duplicate_info?: string;
  is_duplicate: boolean;
  priority_suggested: string;
  research_areas: string;
  is_live_ai: boolean;
  confidence_score: number;
  created_at: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: 'Civic' | 'Agriculture' | 'Health' | 'Water' | 'Livelihood' | 'Education' | 'Environment';
  location: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  voice_url?: string;
  evidence_url?: string;
  citizen_name?: string;
  is_anonymous: boolean;
  priority: 'High' | 'Medium' | 'Low';
  status: 
    | 'Submitted' 
    | 'AI Analyzed' 
    | 'Pending Validation' 
    | 'Validated' 
    | 'Rejected' 
    | 'Info Requested'
    | 'Matched' 
    | 'Proposal Created' 
    | 'Funded' 
    | 'In Research' 
    | 'Field Pilot' 
    | 'Deployed' 
    | 'Government Verified' 
    | 'Published';
  sla_deadline?: string;
  created_at: string;
  updated_at: string;
  ai_analysis?: AIAnalysis;
}

export interface University {
  id: number;
  name: string;
  state: string;
  district: string;
  aishe_code?: string;
  nirf_rank?: number;
  specialization?: string;
}

export interface Researcher {
  id: number;
  name: string;
  title: string;
  university_id: number;
  department: string;
  email: string;
  expertise_areas: string;
  publications_count: number;
  profile_summary?: string;
  university?: University;
}

export interface ExpertiseMatch {
  id: number;
  problem_id: string;
  researcher_id: number;
  match_score: number;
  match_reason: string;
  status: string;
  created_at: string;
  researcher?: Researcher;
  problem?: Problem;
}

export interface ResearchProposal {
  id: string;
  problem_id: string;
  researcher_id: number;
  title: string;
  problem_statement: string;
  proposed_solution: string;
  methodology: string;
  expected_outcome: string;
  estimated_timeline_months: number;
  estimated_budget_inr: number;
  required_resources?: string;
  research_team?: string;
  status: 'Draft' | 'Proposal Submitted' | 'Funding Required' | 'Funded' | 'In Execution';
  created_at: string;
  researcher?: Researcher;
  problem?: Problem;
}

export interface FundingPartner {
  id: number;
  name: string;
  type: string;
  csr_focus_areas: string;
  contact_email: string;
  description?: string;
}

export interface FundingInterest {
  id: number;
  proposal_id: string;
  partner_id: number;
  funding_amount_inr: number;
  funding_type: string;
  csr_focus_alignment?: string;
  why_match?: string;
  mentorship_offered: boolean;
  milestones?: string;
  status: string;
  created_at: string;
  partner?: FundingPartner;
  proposal?: ResearchProposal;
}

export interface Project {
  id: string;
  proposal_id: string;
  problem_id: string;
  title: string;
  status: 'In Research' | 'Prototype Phase' | 'Field Pilot' | 'Deployed' | 'Government Verified' | 'Published';
  deployment_location: string;
  beneficiaries_count: number;
  pilot_metrics?: string;
  start_date: string;
  target_completion?: string;
  proposal?: ResearchProposal;
  problem?: Problem;
}

export interface PublicOutcome {
  id: string;
  project_id: string;
  problem_id: string;
  proposal_id?: string;
  title: string;
  summary_solution: string;
  original_problem_text: string;
  location: string;
  research_institution: string;
  research_team: string;
  industry_partner: string;
  deployment_date: string;
  impact_metric: string;
  citizen_contributor_name?: string;
  is_anonymous: boolean;
  is_published: boolean;
  published_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'match';
  target_role: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface SimulatedEmail {
  id: number;
  sender: string;
  recipient: string;
  recipient_role: string;
  subject: string;
  body: string;
  action_label: string;
  action_route: string;
  created_at: string;
}

export interface EcosystemStats {
  kpis: {
    total_problems: number;
    validated_problems: number;
    research_matches: number;
    proposals_submitted: number;
    funded_projects: number;
    deployed_innovations: number;
    public_outcomes: number;
  };
  category_distribution: { name: string; count: number }[];
  district_distribution: { district: string; count: number }[];
  disclaimer: string;
}
