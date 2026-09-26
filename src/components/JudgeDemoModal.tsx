import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Users,
  Brain,
  ShieldCheck,
  GraduationCap,
  FileText,
  Briefcase,
  Rocket,
  CheckCircle2,
  Award,
  ExternalLink
} from 'lucide-react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onSwitchRole: (role: any) => void;
}

const STAGES = [
  {
    step: '01',
    title: 'Citizen Reports Problem',
    icon: Users,
    role: 'citizen',
    route: '/citizen',
    caseDetail: 'Case: BP-2026-00421 • Siladon Village, Angara Block, Ranchi',
    whatIsHappening: 'A grassroots citizen reports acute borewell failure and high-iron water without creating an account or logging in.',
    whyItMatters: 'Zero login friction removes barriers for rural citizens, empowering the last-mile public to initiate innovation requests.',
    seedSnippet: 'Citizen: Raj Kumar • Category: Water • Inputs: Text, Photo & Geolocation'
  },
  {
    step: '02',
    title: 'AI Understanding & Classification',
    icon: Brain,
    role: 'citizen',
    route: '/ai-analysis',
    caseDetail: 'AI Engine: Hybrid Heuristic / Google Gemini API',
    whatIsHappening: 'The system automatically parses the citizen report, identifies the technical domain ("Water Resources"), checks for duplicate clusters, sets Priority to High, and recommends academic research fields.',
    whyItMatters: 'Converts messy, unstructured vernacular grievances into structured technical problem statements ready for scientific study.',
    seedSnippet: 'Domain: Water Resources & Rural Infrastructure • Priority: High • Confidence: 94%'
  },
  {
    step: '03',
    title: 'District Officer Validates (48h SLA)',
    icon: ShieldCheck,
    role: 'district',
    route: '/district-validation',
    caseDetail: '48-Hour SLA Timer: 14.2h elapsed • Ground Verification',
    whatIsHappening: 'The District Development Officer verifies the genuine nature of the problem, checks duplicate records, and approves it.',
    whyItMatters: 'Ensures academic researchers work only on genuine, state-verified societal needs rather than frivolous or spam complaints.',
    seedSnippet: 'Officer: Shri A. K. Choudhary • Action: Approved → Status: Validated - Research Matching'
  },
  {
    step: '04',
    title: 'AI Matches Academic Research Expertise',
    icon: GraduationCap,
    role: 'researcher',
    route: '/research-matching',
    caseDetail: 'Knowledge Base: 15+ Faculty across 8 Premier Universities',
    whatIsHappening: 'The AI Expertise Matching Engine compares extracted problem keywords against faculty research profiles and identifies Dr. Ananya Sharma (BIT Mesra, Hydrology Dept) with a 94% Match Score.',
    whyItMatters: 'Eliminates the traditional disconnect between academic labs and rural problems by proactively pushing relevant local challenges to capable scientists.',
    seedSnippet: 'Researcher: Dr. Ananya Sharma (BIT Mesra) • Match Score: 94% (Demo AI Match Score)'
  },
  {
    step: '05',
    title: 'Researcher Submits R&D Proposal',
    icon: FileText,
    role: 'researcher',
    route: '/research-proposals',
    caseDetail: 'Proposal ID: RPR-2026-0017 • Budget: INR 4,80,000',
    whatIsHappening: 'The researcher reviews the validated problem and designs a concrete technological solution: "Solar-Powered Multi-Stage Aeration & Biosand Water Purification Unit" with milestones and budget.',
    whyItMatters: 'Transforms a raw problem into an actionable, budgeted innovation project tailored to regional constraints.',
    seedSnippet: 'Solution: Decentralized solar aeration + biosand filtration delivering 4,000L/day'
  },
  {
    step: '06',
    title: 'Industry / CSR Mandate Matching & Funding',
    icon: Briefcase,
    role: 'industry',
    route: '/funding-csr',
    caseDetail: 'CSR Partner: Tata Steel Rural Development Society (TSRDS)',
    whatIsHappening: 'CSR partners discover proposals aligned with their statutory focus. Tata Steel CSR selects proposal RPR-2026-0017 under their Schedule VII Water Mandate and commits an INR 5,00,000 grant with mentorship.',
    whyItMatters: 'Directs corporate CSR funds directly into vetted university R&D solving ground problems with zero intermediary friction.',
    seedSnippet: 'Relevance: High Alignment with Water Mandate • Status: Funded'
  },
  {
    step: '07',
    title: 'Field Prototyping & Deployment',
    icon: Rocket,
    role: 'government',
    route: '/projects',
    caseDetail: 'Project ID: PRJ-2026-003 • Location: Siladon Village',
    whatIsHappening: 'The research team builds and installs the solar-powered water filtration station in the village. Real-time IoT sensors monitor water purity and track 1,250 beneficiaries.',
    whyItMatters: 'Ensures research doesn\'t stay as a published paper on a shelf, but physically manifests as a functional community asset.',
    seedSnippet: 'Metrics: Iron reduced from 3.6 mg/L to 0.18 mg/L; 4,200 Liters purified daily'
  },
  {
    step: '08',
    title: 'State Government Verification',
    icon: CheckCircle2,
    role: 'government',
    route: '/projects',
    caseDetail: 'Audit: State Innovation Review Board • Director Technical Education',
    whatIsHappening: 'State innovation officials inspect the operational unit, verify water quality lab test compliance against BIS 10500 standards, and officially certify the deployment.',
    whyItMatters: 'Provides government accountability and state-level legitimacy to citizen-originated research solutions.',
    seedSnippet: 'Finding: Meets all BIS potable standards • Verified: Yes'
  },
  {
    step: '09',
    title: 'Public Innovation Outcome Registry',
    icon: Award,
    role: 'public',
    route: '/public-outcomes',
    caseDetail: 'Outcome ID: OUT-2026-001 • Public Visibility & Citizen Credit',
    whatIsHappening: 'The completed project is published to the open Public Innovation Registry. Original citizen reporter Raj Kumar is permanently credited as Citizen Contributor alongside BIT Mesra and Tata Steel.',
    whyItMatters: 'Creates an open, reproducible repository of civic innovations while honoring everyday citizens for highlighting community needs.',
    seedSnippet: 'Citizen Contributor: Raj Kumar • Partner: Tata Steel • Institution: BIT Mesra'
  }
];

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSwitchRole
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const current = STAGES[currentIdx];
  const IconComponent = current.icon;

  const handleGoToScreen = () => {
    onSwitchRole(current.role);
    onNavigate(current.route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Top Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between text-white border-b border-navy-light">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-saffron text-navy flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">SIH 2026 Judge Guided Walkthrough</h2>
                <span className="bg-teal text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                  9 Core Stages
                </span>
              </div>
              <p className="text-xs text-slate-300">
                End-to-End Seeded Story: &ldquo;Drinking Water Shortage in Rural Community&rdquo; (BP-2026-00421)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Progress Stepper */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[560px] gap-2">
            {STAGES.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setCurrentIdx(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  currentIdx === idx
                    ? 'bg-navy text-white shadow-sm ring-2 ring-saffron/50'
                    : idx < currentIdx
                    ? 'bg-teal-subtle text-teal-dark'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                <span>{s.step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stage Content */}
        <div className="p-6 space-y-5 flex-1">
          {/* Stage Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-subtle border border-teal/20 text-teal flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-teal" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-saffron uppercase tracking-wider">
                  Stage {current.step} of 09
                </span>
                <h3 className="text-lg font-bold text-navy-deep leading-snug">
                  {current.title}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {current.caseDetail}
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 capitalize">
              Role: {current.role}
            </span>
          </div>

          {/* Explanation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal"></span>
                WHAT IS HAPPENING?
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                {current.whatIsHappening}
              </p>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-1.5">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saffron"></span>
                WHY IT MATTERS?
              </div>
              <p className="text-xs leading-relaxed text-slate-800">
                {current.whyItMatters}
              </p>
            </div>
          </div>

          {/* Seed Data Preview Box */}
          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] flex items-center justify-between border border-slate-800">
            <span className="truncate mr-2">{current.seedSnippet}</span>
            <span className="text-teal font-semibold text-[10px] shrink-0 uppercase tracking-wider">
              Seeded Story State
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(prev - 1, 0))}
              disabled={currentIdx === 0}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => Math.min(prev + 1, STAGES.length - 1))}
              disabled={currentIdx === STAGES.length - 1}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoToScreen}
              className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold shadow hover:bg-navy-light transition flex items-center gap-1.5"
            >
              <span>Explore Live Screen for Stage {current.step}</span>
              <ExternalLink className="w-3.5 h-3.5 text-saffron" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
