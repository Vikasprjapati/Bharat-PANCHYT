import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FilePlus,
  Building,
  User,
  Send,
  Search,
  Coins,
  Clock,
  ArrowLeft,
  Wand2,
  BookOpen
} from 'lucide-react';
import { Problem, Researcher, ExpertiseMatch, ResearchProposal } from '../types';
import { api } from '../services/api';
import { StatusPill } from '../components/StatusPill';
import { HowItWorksCard } from '../components/HowItWorksCard';
import { CategoryHub } from '../components/CategoryHub';
import { generateAISolutionDraft } from '../services/clientAiService';

interface ResearcherPageProps {
  problems: Problem[];
  researchers: Researcher[];
  matches: ExpertiseMatch[];
  proposals: ResearchProposal[];
  onProposalCreated: (newProposal: ResearchProposal) => void;
  onNavigateToFunding: () => void;
}

export const ResearcherPage: React.FC<ResearcherPageProps> = ({
  problems,
  researchers,
  matches,
  proposals,
  onProposalCreated,
  onNavigateToFunding
}) => {
  // Category Hub state: null means show category hub first
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter for validated problems (ready for research)
  const validatedProblems = problems.filter(
    (p) => p.status !== 'Submitted' && p.status !== 'Pending Validation' && p.status !== 'Rejected'
  );

  const categoryFilteredProblems = selectedCategory && selectedCategory !== 'All'
    ? validatedProblems.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    : validatedProblems;

  const [selectedProblem, setSelectedProblem] = useState<Problem>(
    categoryFilteredProblems[0] || validatedProblems[0] || problems[0]
  );

  // Proposal Builder Modal State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedResearcherId, setSelectedResearcherId] = useState<number>(researchers[0]?.id || 1);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [methodology, setMethodology] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [timelineMonths, setTimelineMonths] = useState(6);
  const [budgetINR, setBudgetINR] = useState(480000);
  const [researchTeam, setResearchTeam] = useState('Dr. Ananya Sharma (PI), 2 M.Tech Research Scholars');
  const [resources, setResources] = useState('Modular filtration components, IoT sensors, water test kits');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProposalId, setSubmittedProposalId] = useState('');
  const [aiDraftMessage, setAiDraftMessage] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Find matches for selected problem, or compute recommendations from university faculty roster
  const problemMatches = React.useMemo(() => {
    if (!selectedProblem) return [];
    const directMatches = matches.filter((m) => m.problem_id === selectedProblem.id);
    if (directMatches.length > 0) return directMatches;

    // Dynamically match relevant faculty by category / keywords
    const cat = selectedProblem.category.toLowerCase();
    const relevantResearchers = researchers.filter(r => 
      r.department.toLowerCase().includes(cat) || 
      r.expertise_areas.toLowerCase().includes(cat) ||
      (cat === 'water' && (r.department.includes('Hydrology') || r.department.includes('Water'))) ||
      (cat === 'agriculture' && (r.department.includes('Agronomy') || r.department.includes('Soil'))) ||
      (cat === 'health' && (r.department.includes('Medicine') || r.department.includes('Biomedical'))) ||
      (cat === 'civic' && (r.department.includes('Civil') || r.department.includes('Mechanical'))) ||
      (cat === 'environment' && (r.department.includes('Environmental') || r.department.includes('Energy'))) ||
      (cat === 'livelihood' && (r.department.includes('Rural') || r.department.includes('Management'))) ||
      (cat === 'education' && (r.department.includes('Computer') || r.department.includes('Education')))
    );

    const candidates = relevantResearchers.length > 0 ? relevantResearchers : researchers.slice(0, 2);

    return candidates.map((r, idx) => ({
      id: 9000 + idx,
      problem_id: selectedProblem.id,
      researcher_id: r.id,
      match_score: 95 - idx * 3,
      match_reason: `AI Match: Departmental alignment in ${r.department} focusing on ${selectedProblem.category} technological solutions.`,
      status: 'Matched' as const,
      created_at: new Date().toISOString(),
      researcher: r,
      problem: selectedProblem
    }));
  }, [matches, selectedProblem, researchers]);

  const handleOpenProposalBuilder = (prob: Problem, matchResearcherId?: number) => {
    setSelectedProblem(prob);
    if (matchResearcherId) {
      setSelectedResearcherId(matchResearcherId);
    }
    // Auto-populate initial draft using AI helper
    const draft = generateAISolutionDraft(prob.title, prob.description, prob.category, prob.location);
    setProposalTitle(draft.title);
    setProposedSolution(draft.proposed_solution);
    setMethodology(draft.methodology);
    setExpectedOutcome(draft.expected_outcome);
    setBudgetINR(draft.estimated_budget_inr);
    setTimelineMonths(draft.estimated_timeline_months);
    setResources(draft.required_resources);
    setResearchTeam(draft.research_team);

    setIsBuilderOpen(true);
    setSubmittedProposalId('');
    setAiDraftMessage('');
  };

  const handleTriggerAIDraft = () => {
    if (!selectedProblem) return;
    const draft = generateAISolutionDraft(selectedProblem.title, selectedProblem.description, selectedProblem.category, selectedProblem.location);
    setProposalTitle(draft.title);
    setProposedSolution(draft.proposed_solution);
    setMethodology(draft.methodology);
    setExpectedOutcome(draft.expected_outcome);
    setBudgetINR(draft.estimated_budget_inr);
    setTimelineMonths(draft.estimated_timeline_months);
    setResources(draft.required_resources);
    setResearchTeam(draft.research_team);
    setAiDraftMessage('AI Draft synthesized! You can review, customize, and adjust before submitting.');
  };

  const handleExpressInterest = async (matchId: number) => {
    try {
      await api.expressInterest(matchId);
      alert('Interest recorded! You are now connected to this problem opportunity.');
    } catch (e) {
      alert('Interest noted.');
    }
  };

  const handleSaveProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !proposedSolution || !methodology || !expectedOutcome) {
      alert('Please fill in all core proposal fields.');
      return;
    }
    setIsSubmitting(true);

    try {
      const newProp = await api.createProposal({
        problem_id: selectedProblem.id,
        researcher_id: selectedResearcherId,
        title: proposalTitle,
        problem_statement: selectedProblem.description,
        proposed_solution: proposedSolution,
        methodology: methodology,
        expected_outcome: expectedOutcome,
        estimated_timeline_months: Number(timelineMonths),
        estimated_budget_inr: Number(budgetINR),
        required_resources: resources,
        research_team: researchTeam
      });

      setIsSubmitting(false);
      setSubmittedProposalId(newProp.id);
      onProposalCreated(newProp);
    } catch (err) {
      setIsSubmitting(false);
      alert('Failed to submit proposal.');
    }
  };

  const filteredProblems = categoryFilteredProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 uppercase tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            Higher Education &amp; Academic Research
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            Research Opportunities &amp; AI Expertise Matching
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connecting verified citizen challenges with university faculty, departmental capabilities, and corporate CSR funding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedProblem && (
            <button
              onClick={() => handleOpenProposalBuilder(selectedProblem)}
              className="px-4 py-2.5 rounded-xl bg-teal text-white font-bold text-xs shadow-md hover:bg-teal-dark transition flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Propose University Solution</span>
            </button>
          )}
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="University Solution Formulation & CSR Routing"
        steps={[
          "Select a domain or category to view validated problems approved by District Officers.",
          "Our AI Expertise Matching Engine compares extracted problem keywords against faculty research databases and computes an 'AI Match Score — Demo'.",
          "Click 'Propose University Solution' or use the 'AI Generate Solution Draft' button to instantly generate a structured R&D proposal with milestones and budget.",
          "Once submitted, this proposal is immediately visible to District Officers, State Government, and corporate CSR partners for grant funding."
        ]}
        whyItMatters="Closes the gap between university laboratories and grassroots societal needs, channeling academic talent toward real-world public impact."
        defaultOpen={false}
      />

      {/* PRIMARY CATEGORY HUB VIEW (When no category is selected) */}
      {!selectedCategory ? (
        <div className="card-gov p-6 space-y-4">
          <CategoryHub
            problems={validatedProblems}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              const firstInCat = validatedProblems.find(p => p.category.toLowerCase() === cat.toLowerCase());
              if (firstInCat) setSelectedProblem(firstInCat);
            }}
            badgeType="opportunities"
            title="Explore Research Opportunities by Domain"
            subtitle="Click a domain to view verified community challenges and AI faculty matches. Badges indicate active R&D opportunities."
          />
        </div>
      ) : (
        /* DRILL-DOWN CATEGORY OPPORTUNITIES VIEW */
        <div className="space-y-4">
          {/* Back button & Category Header */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-navy transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal" />
              <span>Back to All Categories</span>
            </button>

            <span className="font-bold text-xs text-navy">
              Active Category: <span className="text-teal font-extrabold">{selectedCategory}</span> ({filteredProblems.length} Validated Problems)
            </span>
          </div>

          {/* Main Grid: Problem Selector + Matching Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Validated Problems Feed */}
            <div className="lg:col-span-5 space-y-3">
              <div className="card-gov p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-navy-deep">
                    {selectedCategory} Opportunities
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {filteredProblems.length} problems
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="max-h-[580px] overflow-y-auto space-y-2.5 pr-1">
                  {filteredProblems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No validated problems currently in {selectedCategory}.
                    </div>
                  ) : (
                    filteredProblems.map((prob) => {
                      const isSelected = selectedProblem?.id === prob.id;
                      return (
                        <div
                          key={prob.id}
                          onClick={() => setSelectedProblem(prob)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                            isSelected
                              ? 'border-teal bg-teal-subtle/30 ring-2 ring-teal/20 shadow-xs'
                              : 'border-slate-200/80 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-teal">
                              {prob.id}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                                {prob.category}
                              </span>
                              <StatusPill status={prob.status} />
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-navy leading-snug line-clamp-2">
                            {prob.title}
                          </h4>

                          <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {prob.description}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                            <span>{prob.location}</span>
                            <span className="text-teal font-semibold flex items-center gap-1">
                              View Matches <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right: AI Expertise Matching Engine & Matched Faculty */}
            <div className="lg:col-span-7 space-y-4">
              {selectedProblem ? (
                <div className="card-gov p-6 space-y-5">
                  {/* Selected Problem Summary Header */}
                  <div className="border-b border-slate-100 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-teal bg-teal-subtle px-2 py-0.5 rounded">
                          {selectedProblem.id}
                        </span>
                        <span className="text-xs font-bold text-slate-600 uppercase">
                          {selectedProblem.category}
                        </span>
                        <StatusPill status={selectedProblem.priority} />
                      </div>
                      <button
                        onClick={() => handleOpenProposalBuilder(selectedProblem)}
                        className="px-3.5 py-1.5 rounded-lg bg-teal text-white text-xs font-bold hover:bg-teal-dark transition flex items-center gap-1.5 shadow-xs"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>Propose Solution</span>
                      </button>
                    </div>

                    <h2 className="text-base font-bold text-navy-deep leading-snug">
                      {selectedProblem.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {selectedProblem.description}
                    </p>

                    {/* Extracted Keywords */}
                    {selectedProblem.ai_analysis && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                        <span className="text-slate-400 font-semibold">Extracted Keywords:</span>
                        {selectedProblem.ai_analysis.extracted_keywords.split(',').map((kw, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono text-[10px]"
                          >
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Expertise Matching Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-navy-deep flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal" />
                        AI Academic Expertise Matching
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Faculty ranked by departmental specialization, domain similarity &amp; past publications
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-saffron/10 border border-saffron/30 text-saffron-dark px-2 py-0.5 rounded-full uppercase">
                      AI Match Score — Demo
                    </span>
                  </div>

                  {/* Match Cards List */}
                  <div className="space-y-3">
                    {problemMatches.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <p>No matches calculated yet for this problem.</p>
                        <button
                          onClick={() => handleOpenProposalBuilder(selectedProblem)}
                          className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-semibold"
                        >
                          Submit Proposed Solution
                        </button>
                      </div>
                    ) : (
                      problemMatches.map((m) => {
                        const researcher = m.researcher;
                        if (!researcher) return null;

                        return (
                          <div
                            key={m.id}
                            className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs space-y-3 hover:border-teal transition"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-navy">
                                      {researcher.name}
                                    </h4>
                                    <span className="text-[11px] text-slate-500 font-medium">
                                      {researcher.title}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                                    <Building className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{researcher.university?.name || (researcher.university_id === 1 ? 'BIT Mesra' : 'University')}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    Dept: {researcher.department} • {researcher.publications_count} Publications
                                  </div>
                                </div>
                              </div>

                              {/* Match Score Badge (Clearly Labeled) */}
                              <div className="text-right shrink-0">
                                <div className="text-lg font-black text-teal font-heading">
                                  {m.match_score}%
                                </div>
                                <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">
                                  AI Match Score — Demo
                                </div>
                              </div>
                            </div>

                            {/* Match Reason */}
                            <div className="p-2.5 rounded-lg bg-teal-subtle/40 border border-teal/15 text-xs text-slate-700">
                              <strong className="text-navy font-semibold">Match Reason: </strong>
                              {m.match_reason}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-400 font-mono">
                                {researcher.email}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleExpressInterest(m.id)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                                >
                                  Express Interest
                                </button>
                                <button
                                  onClick={() => handleOpenProposalBuilder(selectedProblem, researcher.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-navy hover:bg-navy-light text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                                >
                                  <FilePlus className="w-3.5 h-3.5" />
                                  <span>Propose Solution</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="card-gov p-12 text-center text-slate-400 text-xs">
                  Select an opportunity from the list to view academic faculty matching.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL BUILDER MODAL WITH "AI GENERATE SOLUTION DRAFT" */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-navy px-6 py-4 flex items-center justify-between text-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">University Solution Proposal Formulator</h3>
                  <span className="bg-saffron text-navy text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    R&amp;D Blueprint
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Translating verified problem {selectedProblem?.id} into an actionable CSR-fundable grant proposal
                </p>
              </div>
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {submittedProposalId ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-navy">
                  Research Proposal Successfully Submitted!
                </h4>
                <div className="font-mono text-sm font-bold text-teal bg-slate-100 py-1.5 px-4 rounded-lg inline-block">
                  Proposal ID: {submittedProposalId}
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your proposed solution is now visible to <strong>District Validation Officers</strong>, the <strong>State Government</strong>, and <strong>Corporate CSR Partners</strong> for grant funding.
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsBuilderOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsBuilderOpen(false);
                      onNavigateToFunding();
                    }}
                    className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light flex items-center gap-1.5"
                  >
                    <span>View in Industry / CSR Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProposal} className="p-6 space-y-4 text-xs">
                {/* AI Draft Assist Bar */}
                <div className="p-3 bg-teal-subtle/50 rounded-xl border border-teal/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-navy flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal" />
                      AI Solution Synthesis Assistant
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Need inspiration? AI will synthesize a complete solution title, methodology, budget, and milestones tailored to this problem.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerAIDraft}
                    className="px-3 py-1.5 bg-teal hover:bg-teal-dark text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Generate Solution Draft</span>
                  </button>
                </div>

                {aiDraftMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{aiDraftMessage}</span>
                  </div>
                )}

                {/* Researcher Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Lead Principal Investigator (PI) *
                    </label>
                    <select
                      value={selectedResearcherId}
                      onChange={(e) => setSelectedResearcherId(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-teal focus:outline-none"
                    >
                      {researchers.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} — {r.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Problem Context Reference
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${selectedProblem?.id}: ${selectedProblem?.title}`}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-mono"
                    />
                  </div>
                </div>

                {/* Proposal Title */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Proposed Solution */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Proposed Technological / Scientific Solution *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={proposedSolution}
                    onChange={(e) => setProposedSolution(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Methodology & Expected Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Research Methodology &amp; Milestones *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Expected Measurable Outcome &amp; Beneficiaries *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={expectedOutcome}
                      onChange={(e) => setExpectedOutcome(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Budget & Timeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Estimated Budget (INR) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={10000}
                        required
                        value={budgetINR}
                        onChange={(e) => setBudgetINR(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none font-mono"
                      />
                      <Coins className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Estimated Timeline (Months) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={36}
                        required
                        value={timelineMonths}
                        onChange={(e) => setTimelineMonths(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none font-mono"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Research Team & Resources */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Research Team Composition &amp; Students
                    </label>
                    <input
                      type="text"
                      value={researchTeam}
                      onChange={(e) => setResearchTeam(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Key Equipment &amp; Resources
                    </label>
                    <input
                      type="text"
                      value={resources}
                      onChange={(e) => setResources(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal focus:outline-none"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsBuilderOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-teal hover:bg-teal-dark text-white font-bold shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Proposed Solution to Ecosystem'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
