import React, { useState } from 'react';
import {
  FileText,
  Building,
  User,
  Coins,
  Clock,
  ArrowRight,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { ResearchProposal } from '../types';
import { StatusPill } from '../components/StatusPill';
import { HowItWorksCard } from '../components/HowItWorksCard';

interface ResearchProposalsPageProps {
  proposals: ResearchProposal[];
  onNavigateToFunding: () => void;
  onNavigateToResearch: () => void;
}

export const ResearchProposalsPage: React.FC<ResearchProposalsPageProps> = ({
  proposals,
  onNavigateToFunding,
  onNavigateToResearch
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const STATUSES = ['All', 'Proposal Submitted', 'Funding Required', 'Funded', 'In Execution'];

  const filtered = proposals.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.problem_statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.researcher?.university?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 uppercase tracking-wide">
            <FileText className="w-3.5 h-3.5" />
            University Research Proposals
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            Research Proposal Registry &amp; Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active R&amp;D blueprints formulated by faculty to solve verified community problems across Jharkhand.
          </p>
        </div>

        <button
          onClick={onNavigateToResearch}
          className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <span>Formulate New Proposal</span>
          <ArrowRight className="w-3.5 h-3.5 text-saffron" />
        </button>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="Research Proposal Lifecycle"
        steps={[
          "When a validated problem is matched with university researchers, faculty formulate a structured technical blueprint.",
          "Each proposal details the proposed solution, budget in INR, required timeline, and academic team composition.",
          "Submitting assigns a unique tracking ID (e.g. RPR-2026-0017) and makes it discoverable to corporate CSR partners.",
          "Once sponsored, it automatically transitions into an active project in the State Government deployment pipeline."
        ]}
        whyItMatters="Transforms abstract scientific research into concrete, measurable community solutions funded by corporate CSR."
        defaultOpen={false}
      />

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-600">Status:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 card-gov p-12 text-center text-slate-400 text-xs">
            No proposals match this filter.
          </div>
        ) : (
          filtered.map((prop) => (
            <div
              key={prop.id}
              className="card-gov p-5 flex flex-col justify-between space-y-4 hover:border-teal transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal bg-teal-subtle px-2 py-0.5 rounded">
                      {prop.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {prop.problem?.category || 'R&D'}
                    </span>
                  </div>
                  <StatusPill status={prop.status} />
                </div>

                <h3 className="text-sm font-bold text-navy-deep leading-snug">
                  {prop.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-navy">
                      {prop.researcher?.university?.name || 'Lead Institute'}
                    </span>
                    <span className="text-slate-400 text-[11px] block">
                      Lead PI: {prop.researcher?.name || 'Faculty Lead'} ({prop.researcher?.department})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {prop.proposed_solution}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Budget</span>
                    <span className="font-mono font-bold text-navy">
                      INR {prop.estimated_budget_inr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                    <span className="font-mono font-medium text-slate-700">
                      {prop.estimated_timeline_months} Months
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Ref Problem: {prop.problem_id}
                </span>

                <button
                  onClick={onNavigateToFunding}
                  className="px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy-light flex items-center gap-1 transition shadow-xs"
                >
                  <span>Discover in CSR Panel</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
