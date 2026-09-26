import React from 'react';
import {
  Users,
  Brain,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { StakeholderRole, EcosystemStats, Problem } from '../types';
import { ProblemMap } from '../components/ProblemMap';

interface OverviewPageProps {
  stats: EcosystemStats | null;
  problems: Problem[];
  onNavigate: (route: string) => void;
  onSwitchRole: (role: StakeholderRole) => void;
  onOpenJudgeDemo: () => void;
  onSelectProblem: (problem: Problem) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  stats,
  problems,
  onNavigate,
  onSwitchRole,
  onOpenJudgeDemo,
  onSelectProblem
}) => {
  const JOURNEY_STEPS = [
    { title: 'Citizen Problem', icon: Users, role: 'citizen', route: '/citizen', desc: 'Grassroots submission with zero account required' },
    { title: 'AI Understanding', icon: Brain, role: 'citizen', route: '/ai-analysis', desc: 'Categorization, duplicate check & domain classification' },
    { title: 'District Validation', icon: ShieldCheck, role: 'district', route: '/district-validation', desc: '48-hour SLA ground truth check by administration' },
    { title: 'Expertise Matching', icon: GraduationCap, role: 'researcher', route: '/research-matching', desc: 'AI Match Score connecting university faculty' },
    { title: 'Research Proposal', icon: TrendingUp, role: 'researcher', route: '/research-proposals', desc: 'Structured technical blueprint & budget estimation' },
    { title: 'CSR / Industry Funding', icon: Briefcase, role: 'industry', route: '/funding-csr', desc: 'Statutory mandate alignment & corporate grants' },
    { title: 'Deployment & Verification', icon: Rocket, role: 'government', route: '/projects', desc: 'Field piloting, sensors & State Board certification' },
    { title: 'Public Outcome Registry', icon: Award, role: 'public', route: '/public-outcomes', desc: 'Public innovation catalog crediting citizen contributor' }
  ];

  const STAKEHOLDERS = [
    {
      role: 'citizen' as StakeholderRole,
      route: '/citizen',
      title: 'Citizen',
      tag: 'No Account Required',
      desc: 'Report real problems without creating an account using text, photos, voice notes and location.',
      cta: 'Submit a Problem',
      icon: Users,
      color: 'border-teal/30 hover:border-teal bg-teal-subtle/30'
    },
    {
      role: 'district' as StakeholderRole,
      route: '/district-validation',
      title: 'District Validation Officer',
      tag: '48h SLA Queue',
      desc: 'Validate genuine citizen problems and eliminate duplicates before research matching begins.',
      cta: 'Open Validation Queue',
      icon: ShieldCheck,
      color: 'border-amber-200 hover:border-amber-400 bg-amber-50/40'
    },
    {
      role: 'researcher' as StakeholderRole,
      route: '/research-matching',
      title: 'Higher Education / Research',
      tag: 'AI Expertise Match',
      desc: 'Discover validated real-world problems and develop practical research proposals.',
      cta: 'Explore Research Matches',
      icon: GraduationCap,
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/40'
    },
    {
      role: 'industry' as StakeholderRole,
      route: '/funding-csr',
      title: 'Industry / CSR',
      tag: 'Mandate Alignment',
      desc: 'Find verified proposals that match CSR mandates and support local tech deployment.',
      cta: 'Discover Proposals',
      icon: Briefcase,
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/40'
    },
    {
      role: 'government' as StakeholderRole,
      route: '/projects',
      title: 'State Government',
      tag: 'Oversight & Verification',
      desc: 'Track statewide innovation pipeline, verify field deployments, and publish public outcomes.',
      cta: 'View State Pipeline',
      icon: Rocket,
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/40'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-deep to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/30 text-saffron text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Smart India Hackathon 2026 Prototype
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight">
            BHARAT-PANCHYT
          </h1>

          <div className="font-mono text-xs sm:text-sm text-teal tracking-wide uppercase font-semibold">
            PEOPLES ACTUALL NEEDS CONNECTED WITH HIGHER EDUCATION YOUTH AND TECHNOLOGY
          </div>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            &ldquo;An AI-powered platform that connects people&apos;s real-world problems with the right research expertise, funding and implementation.&rdquo;
          </p>

          {/* Core Journey Flow Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
            <span className="text-slate-400">Core Journey:</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md text-white">People</span>
            <span className="text-saffron font-bold">→</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md text-teal-light">AI</span>
            <span className="text-saffron font-bold">→</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md text-white">Research</span>
            <span className="text-saffron font-bold">→</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md text-saffron">Funding</span>
            <span className="text-saffron font-bold">→</span>
            <span className="bg-teal px-3 py-1 rounded-md text-white font-bold shadow-sm">Impact</span>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenJudgeDemo}
              className="px-5 py-3 rounded-xl bg-saffron text-navy font-black text-sm shadow-lg hover:brightness-105 active:scale-95 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-navy" />
              <span>JUDGE DEMO: Guided Walkthrough</span>
            </button>
            <button
              onClick={() => {
                onSwitchRole('citizen');
                onNavigate('/citizen');
              }}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 transition flex items-center gap-2"
            >
              <span>Submit Problem as Citizen</span>
              <ArrowRight className="w-4 h-4 text-teal-light" />
            </button>
          </div>
        </div>
      </section>

      {/* KPI Metrics Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Citizen Problems', count: stats?.kpis.total_problems || 21, sub: 'Grassroots Reports' },
          { label: 'Validated', count: stats?.kpis.validated_problems || 15, sub: 'District Verified' },
          { label: 'Research Matches', count: stats?.kpis.research_matches || 8, sub: 'AI Match Scores' },
          { label: 'Proposals', count: stats?.kpis.proposals_submitted || 7, sub: 'R&D Blueprints' },
          { label: 'Funded', count: stats?.kpis.funded_projects || 4, sub: 'CSR Grants' },
          { label: 'Deployed', count: stats?.kpis.deployed_innovations || 3, sub: 'Field Pilots' },
          { label: 'Public Outcomes', count: stats?.kpis.public_outcomes || 5, sub: 'Registry Records' }
        ].map((kpi, idx) => (
          <div key={idx} className="card-gov p-3.5 space-y-1 text-center">
            <div className="text-2xl font-black text-navy font-heading">
              {kpi.count}
            </div>
            <div className="text-xs font-bold text-slate-800 leading-snug">
              {kpi.label}
            </div>
            <div className="text-[10px] text-slate-400">
              {kpi.sub}
            </div>
          </div>
        ))}
      </section>

      {/* Visual Workflow Pipeline (Clickable) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-deep">
              The 8-Stage Innovation Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Click any stage to inspect the live prototype screen and active data state
            </p>
          </div>
          <span className="text-xs font-semibold text-teal bg-teal-subtle px-2.5 py-1 rounded-full">
            Shared Real-Time State
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSwitchRole(step.role as StakeholderRole);
                  onNavigate(step.route);
                }}
                className="card-gov p-4 text-left hover:border-teal transition-all group flex flex-col justify-between h-32"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-saffron uppercase tracking-wider">
                      Stage 0{idx + 1}
                    </span>
                    <Icon className="w-4 h-4 text-teal group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-sm font-bold text-navy leading-snug group-hover:text-teal transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {step.desc}
                  </p>
                </div>
                <div className="flex items-center text-[11px] font-semibold text-teal pt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                  <span>Enter Stage</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Five Stakeholder Entry Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-navy-deep">
            Explore by Stakeholder Persona
          </h2>
          <p className="text-xs text-slate-500">
            Dedicated interfaces for each key actor in the innovation cycle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAKEHOLDERS.map((stk) => {
            const Icon = stk.icon;
            return (
              <div
                key={stk.role}
                className={`rounded-xl border p-4.5 flex flex-col justify-between space-y-3 transition-all ${stk.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-navy">
                      <Icon className="w-5 h-5 text-teal" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700">
                      {stk.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy leading-snug">
                    {stk.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stk.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSwitchRole(stk.role);
                    onNavigate(stk.route);
                  }}
                  className="w-full py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-light transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{stk.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Uniqueness Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold text-teal uppercase tracking-wider">
            Smart India Hackathon 2026 Core Value
          </span>
          <h2 className="text-lg font-bold text-navy-deep">
            What Makes BHARAT-PANCHYT Different?
          </h2>
          <p className="text-xs text-slate-500">
            This is NOT a generic grievance portal. We bridge the gap from public problem to academic R&amp;D and CSR deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-navy">AI Expertise Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connects validated public problems with suitable academic faculty based on past publications, departmental specialization, and research domain similarity scores.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-navy">CSR-Mandate Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connects university research opportunities with statutory CSR mandates (Schedule VII Companies Act), automating corporate grant discovery and transparent milestones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-navy">Public Innovation Outcome Registry</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Makes successful research-to-impact outcomes publicly discoverable, permanent, and explicitly credits the original citizen contributor for highlighting the problem.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Geolocation Map */}
      <section>
        <ProblemMap problems={problems} onSelectProblem={onSelectProblem} />
      </section>
    </div>
  );
};
