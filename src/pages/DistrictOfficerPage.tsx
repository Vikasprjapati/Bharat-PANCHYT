import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck2,
  Search,
  ArrowLeft,
  Building,
  Coins,
  BookOpen
} from 'lucide-react';
import { Problem, ResearchProposal } from '../types';
import { api } from '../services/api';
import { StatusPill } from '../components/StatusPill';
import { HowItWorksCard } from '../components/HowItWorksCard';
import { CategoryHub } from '../components/CategoryHub';

interface DistrictOfficerPageProps {
  problems: Problem[];
  proposals?: ResearchProposal[];
  onProblemUpdated: (updatedProblem: Problem) => void;
  onNavigateToResearch: () => void;
}

export const DistrictOfficerPage: React.FC<DistrictOfficerPageProps> = ({
  problems,
  proposals = [],
  onProblemUpdated,
  onNavigateToResearch
}) => {
  // Category Hub state: null means show category hub first
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'pending' | 'validated' | 'rejected' | 'all'>('pending');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [isActing, setIsActing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Filter problems by category first if selected
  const categoryFilteredProblems = selectedCategory && selectedCategory !== 'All'
    ? problems.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    : problems;

  // Filter based on status tabs
  const pendingProblems = categoryFilteredProblems.filter(p => p.status === 'Pending Validation' || p.status === 'Submitted');
  const validatedProblems = categoryFilteredProblems.filter(p => p.status !== 'Pending Validation' && p.status !== 'Submitted' && p.status !== 'Rejected');
  const rejectedProblems = categoryFilteredProblems.filter(p => p.status === 'Rejected');

  let displayList = categoryFilteredProblems;
  if (activeTab === 'pending') displayList = pendingProblems;
  if (activeTab === 'validated') displayList = validatedProblems;
  if (activeTab === 'rejected') displayList = rejectedProblems;

  if (searchTerm) {
    displayList = displayList.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Calculate SLA countdown
  const calculateSLARemaining = (createdAtStr: string) => {
    const created = new Date(createdAtStr).getTime();
    const deadline = created + 48 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = deadline - now;
    if (diff <= 0) return { label: 'SLA Expired', isCritical: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      label: `${hours}h ${mins}m remaining`,
      isCritical: hours < 12
    };
  };

  const handleAction = async (action: 'Approved' | 'Rejected' | 'Info Requested') => {
    if (!selectedProblem) return;
    setIsActing(true);
    setActionSuccessMsg('');

    try {
      await api.recordValidation({
        problem_id: selectedProblem.id,
        officer_name: 'District Planning Officer (Ranchi)',
        district: selectedProblem.district,
        action: action,
        notes: officerNotes || (action === 'Approved' ? 'Field verification confirmed urgent community requirement.' : 'Out of administrative jurisdiction.')
      });

      // Update local state
      const updated: Problem = {
        ...selectedProblem,
        status: action === 'Approved' ? 'Validated' : action === 'Rejected' ? 'Rejected' : 'Info Requested',
        updated_at: new Date().toISOString()
      };
      onProblemUpdated(updated);
      setSelectedProblem(updated);

      if (action === 'Approved') {
        setActionSuccessMsg(`Problem ${selectedProblem.id} Validated! It is now instantly routed to the Higher Education Research Matching Panel.`);
      } else {
        setActionSuccessMsg(`Problem marked as ${action}.`);
      }
    } catch (err) {
      alert('Error updating validation record.');
    } finally {
      setIsActing(false);
      setOfficerNotes('');
    }
  };

  // Find any proposed university solutions for the selected problem
  const linkedProposals = selectedProblem
    ? proposals.filter(pr => pr.problem_id === selectedProblem.id)
    : [];

  const pendingCountAll = problems.filter(p => p.status === 'Pending Validation' || p.status === 'Submitted').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            District Administration Oversight • 48h SLA
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            District Validation Officer Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict 48-hour ground truth verification gateway ensuring only genuine community needs enter the Higher Education R&amp;D pipeline.
          </p>
        </div>

        {/* SLA Summary Badge */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-xs font-bold text-navy">Validation SLA: 48 Hours</div>
            <div className="text-[11px] text-slate-500">
              {pendingCountAll} total problems pending across all districts
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="District Verification Gateway"
        steps={[
          "Select a domain or category to view submissions waiting for verification.",
          "Check the 48-hour SLA countdown timer to prevent administrative escalation.",
          "The Officer reviews the citizen description, attached photo/voice evidence, and AI duplicate checks.",
          "Clicking 'Approve' immediately updates the problem status to 'Validated - Research Matching', making it available to university researchers.",
          "Inspect 'Proposed University Solutions' to see what technologies universities are proposing for your district's problems."
        ]}
        whyItMatters="Prevents duplicate, frivolous, or fraudulent claims from wasting university research capacity while establishing state government accountability."
        defaultOpen={false}
      />

      {/* PRIMARY CATEGORY HUB VIEW (When no category is selected) */}
      {!selectedCategory ? (
        <div className="card-gov p-6 space-y-4">
          <CategoryHub
            problems={problems}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            badgeType="pending"
            title="District Review Queue by Category"
            subtitle="Click a category card to inspect problems in that domain. Marks indicate items pending review under 48h SLA."
          />
        </div>
      ) : (
        /* DRILL-DOWN CATEGORY QUEUE & INSPECTION VIEW */
        <div className="space-y-4">
          {/* Back button & Queue Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedProblem(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-navy transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-teal" />
                <span>All Categories</span>
              </button>
              <span className="font-bold text-xs text-navy border-l pl-3 border-slate-200">
                {selectedCategory} Queue ({categoryFilteredProblems.length})
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pending ({pendingProblems.length})
              </button>
              <button
                onClick={() => setActiveTab('validated')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'validated'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Validated ({validatedProblems.length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'rejected'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Rejected ({rejectedProblems.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({categoryFilteredProblems.length})
              </button>
            </div>

            <div className="relative w-56">
              <input
                type="text"
                placeholder="Search queue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {actionSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccessMsg}</span>
              </div>
              <button
                onClick={onNavigateToResearch}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold flex items-center gap-1"
              >
                <span>Jump to Research Matching</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Main Grid: Problem Cards + Inspection Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cards List */}
            <div className="lg:col-span-7 space-y-3">
              {displayList.length === 0 ? (
                <div className="card-gov p-8 text-center text-slate-400 text-xs">
                  No problems found under this filter for {selectedCategory}.
                </div>
              ) : (
                displayList.map((prob) => {
                  const sla = calculateSLARemaining(prob.created_at);
                  const isSelected = selectedProblem?.id === prob.id;

                  return (
                    <div
                      key={prob.id}
                      onClick={() => {
                        setSelectedProblem(prob);
                        setActionSuccessMsg('');
                      }}
                      className={`card-gov p-4.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal ring-2 ring-teal/20 shadow-md'
                          : 'hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-teal">
                              {prob.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                              {prob.category}
                            </span>
                            <StatusPill status={prob.priority} />
                            <StatusPill status={prob.status} />
                          </div>
                          <h3 className="text-sm font-bold text-navy-deep mt-1 leading-snug">
                            {prob.title}
                          </h3>
                        </div>

                        {/* SLA countdown badge */}
                        <div
                          className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shrink-0 ${
                            sla.isCritical
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{sla.label}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {prob.description}
                      </p>

                      {/* AI Summary Snippet */}
                      {prob.ai_analysis && (
                        <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                          <span className="italic leading-snug">
                            AI Summary: {prob.ai_analysis.summary}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {prob.location} ({prob.district})
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProblem(prob);
                            setActionSuccessMsg('');
                          }}
                          className="text-teal font-semibold flex items-center gap-1 hover:underline cursor-pointer bg-teal-subtle/60 hover:bg-teal-subtle px-2.5 py-1 rounded-md transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Problem &amp; Solutions
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Inspection Drawer */}
            <div className="lg:col-span-5">
              <div className="card-gov p-5 sticky top-20 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-navy-deep flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-teal" />
                    Problem Verification Inspection
                  </h3>
                  {selectedProblem && (
                    <span className="font-mono text-xs font-bold text-teal">
                      {selectedProblem.id}
                    </span>
                  )}
                </div>

                {selectedProblem ? (
                  <div className="space-y-4 text-xs">
                    {/* Status & Priority */}
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Current State</span>
                        <StatusPill status={selectedProblem.status} />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Priority</span>
                        <StatusPill status={selectedProblem.priority} />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-navy text-sm leading-snug">
                        {selectedProblem.title}
                      </div>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedProblem.description}
                      </p>
                    </div>

                    {/* Geolocation & Citizen Info */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Location</span>
                        <span className="text-navy font-medium">{selectedProblem.location}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Citizen Reporter</span>
                        <span className="text-navy font-medium">
                          {selectedProblem.citizen_name && !selectedProblem.is_anonymous ? selectedProblem.citizen_name : 'Anonymous'}
                        </span>
                      </div>
                    </div>

                    {/* AI Analysis Insight */}
                    {selectedProblem.ai_analysis && (
                      <div className="p-3 bg-teal-subtle/50 rounded-xl border border-teal/20 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
                          <Sparkles className="w-3.5 h-3.5 text-teal" />
                          <span>AI Semantic Classification</span>
                        </div>
                        <div className="text-[11px] text-slate-700 space-y-1">
                          <div><strong className="text-navy">Research Domain:</strong> {selectedProblem.ai_analysis.domain}</div>
                          <div><strong className="text-navy">Keywords:</strong> {selectedProblem.ai_analysis.extracted_keywords}</div>
                          <div><strong className="text-navy">Duplicate Check:</strong> {selectedProblem.ai_analysis.duplicate_info}</div>
                        </div>
                      </div>
                    )}

                    {/* PROPOSED UNIVERSITY SOLUTIONS SECTION */}
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          Proposed University Solutions ({linkedProposals.length})
                        </span>
                        <span className="text-[10px] text-blue-700 font-semibold uppercase">
                          Academic Solutions
                        </span>
                      </div>

                      {linkedProposals.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic">
                          No research solutions submitted yet for this problem. Once approved, matched universities will formulate proposals here.
                        </p>
                      ) : (
                        linkedProposals.map((prop) => (
                          <div key={prop.id} className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-teal">{prop.id}</span>
                              <StatusPill status={prop.status} />
                            </div>
                            <div className="font-bold text-navy leading-snug">{prop.title}</div>
                            <div className="text-slate-600 line-clamp-2">{prop.proposed_solution}</div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <span>Lead: {prop.researcher?.name || 'Faculty PI'}</span>
                              <span className="font-mono font-bold text-navy">INR {prop.estimated_budget_inr.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Officer Notes Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Administrative Verification Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Field verification confirmed urgent community requirement. Dispatched to university research pipeline."
                        value={officerNotes}
                        onChange={(e) => setOfficerNotes(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleAction('Approved')}
                        disabled={isActing || selectedProblem.status === 'Validated'}
                        className="py-2.5 px-2 bg-teal hover:bg-teal-dark text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleAction('Rejected')}
                        disabled={isActing || selectedProblem.status === 'Rejected'}
                        className="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleAction('Info Requested')}
                        disabled={isActing}
                        className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Request Info</span>
                      </button>
                    </div>

                    {selectedProblem.status === 'Validated' && (
                      <div className="pt-2 text-center">
                        <button
                          onClick={onNavigateToResearch}
                          className="text-xs font-semibold text-teal hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                          <span>View in Higher Education Research Matching</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Select a problem card from the queue to view ground evidence and perform verification.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
