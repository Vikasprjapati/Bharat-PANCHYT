import axios from 'axios';
import {
  Problem,
  ExpertiseMatch,
  ResearchProposal,
  FundingPartner,
  FundingInterest,
  Project,
  PublicOutcome,
  NotificationItem,
  SimulatedEmail,
  EcosystemStats,
  Researcher
} from '../types';
import { mockStore } from './mockStore';
import { classifyProblemSemantics } from './clientAiService';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const hasExplicitApiUrl = Boolean(import.meta.env.VITE_API_URL);

// When running on Vercel or any remote domain without explicit https API,
// operate directly in standalone client-store mode with 0ms latency and no mixed-content blocks!
const isStandalone = isBrowser && !isLocalhost && !hasExplicitApiUrl;

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 2500,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Health
  getHealth: async () => {
    if (isStandalone) {
      return { status: "healthy", platform: "BHARAT-PANCHYT", ai_mode: "client-ai", store: "localStorage-standalone" };
    }
    try {
      const res = await client.get('/health');
      return res.data;
    } catch {
      return { status: "healthy", platform: "BHARAT-PANCHYT", ai_mode: "demo", store: "localStorage" };
    }
  },

  // Stats
  getStats: async (): Promise<EcosystemStats> => {
    if (isStandalone) return mockStore.getStats();
    try {
      const res = await client.get('/stats');
      return res.data;
    } catch {
      return mockStore.getStats();
    }
  },

  // Problems
  getProblems: async (params?: { category?: string; status?: string; priority?: string; district?: string; search?: string }): Promise<Problem[]> => {
    if (isStandalone) return mockStore.getProblems(params);
    try {
      const res = await client.get('/problems', { params });
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getProblems(params);
    } catch {
      return mockStore.getProblems(params);
    }
  },

  getProblem: async (id: string): Promise<Problem> => {
    if (isStandalone) {
      const prob = mockStore.getProblem(id);
      if (prob) return prob;
      throw new Error("Problem not found");
    }
    try {
      const res = await client.get(`/problems/${id}`);
      return res.data;
    } catch {
      const prob = mockStore.getProblem(id);
      if (prob) return prob;
      throw new Error("Problem not found");
    }
  },

  createProblem: async (payload: {
    title: string;
    description: string;
    location: string;
    district: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    citizen_name?: string;
    is_anonymous: boolean;
  }): Promise<Problem> => {
    if (isStandalone) return mockStore.createProblem(payload);
    try {
      const ai = classifyProblemSemantics(payload.title, payload.description, payload.location);
      const res = await client.post('/problems', { ...payload, category: ai.category });
      return res.data;
    } catch {
      return mockStore.createProblem(payload);
    }
  },

  analyzeAI: async (payload: { title: string; description: string; category?: string; location: string }) => {
    if (isStandalone) return classifyProblemSemantics(payload.title, payload.description, payload.location);
    try {
      const res = await client.post('/problems/analyze', payload);
      return res.data;
    } catch {
      return classifyProblemSemantics(payload.title, payload.description, payload.location);
    }
  },

  // District Validations
  getValidationQueue: async (district?: string): Promise<Problem[]> => {
    if (isStandalone) return mockStore.getProblems({ status: 'Pending Validation' });
    try {
      const res = await client.get('/validations/queue', { params: { district } });
      return res.data;
    } catch {
      return mockStore.getProblems({ status: 'Pending Validation' });
    }
  },

  recordValidation: async (payload: {
    problem_id: string;
    officer_name?: string;
    district: string;
    action: string;
    notes?: string;
  }) => {
    if (isStandalone) return mockStore.recordValidation(payload);
    try {
      const res = await client.post('/validations', payload);
      return res.data;
    } catch {
      return mockStore.recordValidation(payload);
    }
  },

  // Research
  getResearchers: async (search?: string): Promise<Researcher[]> => {
    if (isStandalone) return mockStore.getResearchers(search);
    try {
      const res = await client.get('/research/researchers', { params: { search } });
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getResearchers(search);
    } catch {
      return mockStore.getResearchers(search);
    }
  },

  getResearchOpportunities: async (category?: string): Promise<Problem[]> => {
    if (isStandalone) return mockStore.getProblems({ category });
    try {
      const res = await client.get('/research/opportunities', { params: { category } });
      return res.data;
    } catch {
      return mockStore.getProblems({ category });
    }
  },

  getMatches: async (params?: { problem_id?: string; researcher_id?: number }): Promise<ExpertiseMatch[]> => {
    if (isStandalone) return mockStore.getMatches(params);
    try {
      const res = await client.get('/research/matches', { params });
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getMatches(params);
    } catch {
      return mockStore.getMatches(params);
    }
  },

  expressInterest: async (match_id: number) => {
    return { status: "success", message: "Interest expressed successfully" };
  },

  getProposals: async (status?: string): Promise<ResearchProposal[]> => {
    if (isStandalone) return mockStore.getProposals(status);
    try {
      const res = await client.get('/research/proposals', { params: { status } });
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getProposals(status);
    } catch {
      return mockStore.getProposals(status);
    }
  },

  getProposal: async (id: string): Promise<ResearchProposal> => {
    if (isStandalone) {
      const prop = mockStore.getProposals().find(p => p.id === id);
      if (prop) return prop;
      throw new Error("Proposal not found");
    }
    try {
      const res = await client.get(`/research/proposals/${id}`);
      return res.data;
    } catch {
      const prop = mockStore.getProposals().find(p => p.id === id);
      if (prop) return prop;
      throw new Error("Proposal not found");
    }
  },

  createProposal: async (payload: {
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
  }): Promise<ResearchProposal> => {
    if (isStandalone) return mockStore.createProposal(payload);
    try {
      const res = await client.post('/research/proposals', payload);
      return res.data;
    } catch {
      return mockStore.createProposal(payload);
    }
  },

  // Funding & CSR
  getCSRPartners: async (): Promise<FundingPartner[]> => {
    if (isStandalone) return mockStore.getCSRPartners();
    try {
      const res = await client.get('/funding/partners');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getCSRPartners();
    } catch {
      return mockStore.getCSRPartners();
    }
  },

  getFundingInterests: async (proposal_id?: string): Promise<FundingInterest[]> => {
    if (isStandalone) return mockStore.getFundingInterests(proposal_id);
    try {
      const res = await client.get('/funding/interests', { params: { proposal_id } });
      return res.data;
    } catch {
      return mockStore.getFundingInterests(proposal_id);
    }
  },

  recordFundingOffer: async (payload: {
    proposal_id: string;
    partner_id: number;
    funding_amount_inr: number;
    funding_type: string;
    csr_focus_alignment?: string;
    why_match?: string;
    mentorship_offered: boolean;
    milestones?: string;
  }): Promise<FundingInterest> => {
    if (isStandalone) return mockStore.recordFundingOffer(payload);
    try {
      const res = await client.post('/funding/offer', payload);
      return res.data;
    } catch {
      return mockStore.recordFundingOffer(payload);
    }
  },

  // Projects & Deployment
  getProjects: async (status?: string): Promise<Project[]> => {
    if (isStandalone) return mockStore.getProjects(status);
    try {
      const res = await client.get('/projects', { params: { status } });
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getProjects(status);
    } catch {
      return mockStore.getProjects(status);
    }
  },

  verifyProject: async (project_id: string, payload: {
    verifier_name: string;
    verifier_designation: string;
    audit_findings: string;
    is_verified: boolean;
  }) => {
    if (isStandalone) return mockStore.verifyProject(project_id, payload);
    try {
      const res = await client.post(`/projects/${project_id}/verify`, payload);
      return res.data;
    } catch {
      return mockStore.verifyProject(project_id, payload);
    }
  },

  publishOutcome: async (project_id: string, payload: {
    title?: string;
    summary_solution?: string;
    impact_metric?: string;
  }): Promise<PublicOutcome> => {
    if (isStandalone) return mockStore.publishOutcome(project_id, payload);
    try {
      const res = await client.post(`/projects/${project_id}/publish`, payload);
      return res.data;
    } catch {
      return mockStore.publishOutcome(project_id, payload);
    }
  },

  // Public Outcomes Registry
  getPublicOutcomes: async (params?: { search?: string; location?: string; institution?: string }): Promise<PublicOutcome[]> => {
    if (isStandalone) return mockStore.getPublicOutcomes();
    try {
      const res = await client.get('/outcomes', { params });
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getPublicOutcomes();
    } catch {
      return mockStore.getPublicOutcomes();
    }
  },

  // Notifications & Emails
  getNotifications: async (): Promise<NotificationItem[]> => {
    if (isStandalone) return mockStore.getNotifications();
    try {
      const res = await client.get('/notifications');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getNotifications();
    } catch {
      return mockStore.getNotifications();
    }
  },

  markNotificationRead: async (id: number) => {
    mockStore.markNotificationRead(id);
    if (isStandalone) return { status: "success" };
    try {
      const res = await client.patch(`/notifications/${id}/read`);
      return res.data;
    } catch {
      return { status: "success" };
    }
  },

  markAllNotificationsRead: async () => {
    mockStore.markAllNotificationsRead();
    if (isStandalone) return { status: "success" };
    try {
      const res = await client.patch('/notifications/read-all');
      return res.data;
    } catch {
      return { status: "success" };
    }
  },

  getSimulatedEmails: async (): Promise<SimulatedEmail[]> => {
    if (isStandalone) return mockStore.getSimulatedEmails();
    try {
      const res = await client.get('/emails');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getSimulatedEmails();
    } catch {
      return mockStore.getSimulatedEmails();
    }
  },

  resetDemo: async () => {
    if (!isStandalone) {
      try {
        await client.post('/reset-demo');
      } catch {
        // ignore
      }
    }
    mockStore.resetStore();
    return { status: "success", message: "Demo database successfully re-seeded!" };
  }
};
