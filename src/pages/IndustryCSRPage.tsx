import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Coins,
  ChevronDown,
  ChevronUp,
  Building,
  User,
  CheckCircle2,
  Filter,
  Send,
  ArrowRight,
  Handshake,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { ResearchProposal, FundingPartner, FundingInterest } from '../types';
import { api } from '../services/api';
import { StatusPill } from '../components/StatusPill';
import { HowItWorksCard } from '../components/HowItWorksCard';

interface IndustryCSRPageProps {
  proposals: ResearchProposal[];
  partners: FundingPartner[];
  fundingInterests: FundingInterest[];
  onProposalUpdated: (proposal: ResearchProposal) => void;
  onFundingRecorded: (interest: FundingInterest) => void;
  onNavigateToProjects: () => void;
}

export const IndustryCSRPage: React.FC<IndustryCSRPageProps> = ({
  proposals,
  partners,
  fundingInterests,
  onProposalUpdated,
  onFundingRecorded,
  onNavigateToProjects
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<number>(partners[0]?.id || 1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWhyMatchId, setExpandedWhyMatchId] = useState<string | null>(null);

  // Funding Modal State
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [fundingTargetProposal, setFundingTargetProposal] = useState<ResearchProposal | null>(null);
  const [fundingAmount, setFundingAmount] = useState<number>(500000);
  const [fundingType, setFundingType] = useState('CSR Grant');
  const [csrFocus, setCsrFocus] = useState('Water & Sanitation (Schedule VII)');
  const [mentorship, setMentorship] = useState(true);
  const [milestones, setMilestones] = useState('Milestone 1: Prototyping & Lab Validation; Milestone 2: Field Trial & Village Handover.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const activePartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const CSR_FOCUS_AREAS = [
    'All',
    'Water',
    'Health',
    'Agriculture',
    'Environment',
    'Livelihood',
    'Education'
  ];

  // Helper function to calculate CSR Mandate Match
  const getCSRMatchInfo = (prop: ResearchProposal, partner: FundingPartner) => {
    const partnerFocus = partner ? partner.csr_focus_areas.toLowerCase() : '';
    const probCat = prop.problem?.category.toLowerCase() || '';

    if (partnerFocus.includes(probCat) || partnerFocus.includes('water') && probCat.includes('water')) {
      return {
        level: 'High Relevance Match',
        score: '96%',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        reason: `Matches ${partner.name}'s primary CSR mandate in ${prop.problem?.category || 'rural infrastructure'}. Directly qualifies under Schedule VII Companies Act.`
      };
    } else {
      return {
        level: 'Moderate Synergy',
        score: '82%',
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
        reason: `Secondary synergy with ${partner.name}'s community development & rural technology interventions.`
      };
    }
  };

  const handleOpenFundingModal = (prop: ResearchProposal) => {
    setFundingTargetProposal(prop);
    setFundingAmount(prop.estimated_budget_inr || 480000);
    setCsrFocus(`${prop.problem?.category || 'Community'} Mandate (Schedule VII)`);
    setIsFundingModalOpen(true);
    setSuccessMessage('');
  };

  const handleSubmitFundingOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundingTargetProposal || !activePartner) return;
    setIsSubmitting(true);

    try {
      const result = await api.recordFundingOffer({
        proposal_id: fundingTargetProposal.id,
        partner_id: activePartner.id,
        funding_amount_inr: Number(fundingAmount),
        funding_type: fundingType,
        csr_focus_alignment: csrFocus,
        mentorship_offered: mentorship,
        milestones: milestones
      });

      setIsSubmitting(false);
      setIsFundingModalOpen(false);
      onFundingRecorded(result);

      // Update proposal status locally
      const updatedProp: ResearchProposal = {
        ...fundingTargetProposal,
        status: 'Funded'
      };
      onProposalUpdated(updatedProp);

      setSuccessMessage(`Funding of INR ${Number(fundingAmount).toLocaleString('en-IN')} successfully pledged for ${fundingTargetProposal.id}! This project has now advanced to Field Prototyping & State Government Deployment.`);
    } catch (err) {
      setIsSubmitting(false);
      alert('Error recording simulated funding interest.');
    }
  };

  // Filter proposals
  const filteredProposals = proposals.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.problem?.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.problem_statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.researcher?.university?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 uppercase tracking-wide">
            <Briefcase className="w-3.5 h-3.5" />
            Corporate CSR &amp; Industry Partnership
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            Discover Research Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect statutory Schedule VII CSR capital with vetted university research solving verified ground challenges.
          </p>
        </div>

        {/* Active Partner Persona Switcher */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
          <Building className="w-4 h-4 text-purple-600 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Simulated CSR Entity</span>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-navy focus:outline-none cursor-pointer"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="CSR Mandate Matching & Non-Transactional Workflow"
        steps={[
          "Corporate foundations and PSUs register statutory CSR focus areas (e.g. Schedule VII Water, Healthcare, Rural Livelihoods).",
          "The engine compares proposal parameters against corporate focus areas to produce 'Why this match?' qualitative synergy notes.",
          "Clicking 'Offer Funding' triggers a simulated corporate grant approval workflow with milestones and optional technical mentorship.",
          "Once pledged, the proposal moves to 'Funded' status and immediately enters the State Government Deployment pipeline."
        ]}
        whyItMatters="Enables corporate CSR funds to bypass middlemen and directly sponsor university-led grassroots technological solutions with complete auditability."
        defaultOpen={false}
      />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={onNavigateToProjects}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 ml-3"
          >
            <span>Track in State Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 text-xs mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Focus:
          </span>
          {CSR_FOCUS_AREAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
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
        {filteredProposals.length === 0 ? (
          <div className="col-span-2 card-gov p-12 text-center text-slate-400 text-xs">
            No research proposals matching this CSR focus filter.
          </div>
        ) : (
          filteredProposals.map((prop) => {
            const matchInfo = getCSRMatchInfo(prop, activePartner);
            const isWhyMatchOpen = expandedWhyMatchId === prop.id;

            return (
              <div
                key={prop.id}
                className="card-gov p-5 flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"
              >
                <div className="space-y-3">
                  {/* Top Header: ID, Category, Status */}
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

                  {/* Institution & Researcher Details */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-navy">
                        {prop.researcher?.university?.name || 'Lead University'}
                      </span>
                      <span className="text-slate-400 text-[11px] block">
                        PI: {prop.researcher?.name || 'Principal Investigator'} ({prop.researcher?.department})
                      </span>
                    </div>
                  </div>

                  {/* Proposed Solution snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prop.proposed_solution}
                  </p>

                  {/* Impact & Budget Strip */}
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

                  {/* CSR Mandate Matching Banner */}
                  <div className={`p-2.5 rounded-xl border ${matchInfo.badgeColor} space-y-1.5`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {matchInfo.level} ({matchInfo.score})
                      </span>
                      <button
                        onClick={() => setExpandedWhyMatchId(isWhyMatchOpen ? null : prop.id)}
                        className="text-[10px] font-semibold underline flex items-center gap-0.5"
                      >
                        <span>{isWhyMatchOpen ? 'Hide' : 'Why this match?'}</span>
                        {isWhyMatchOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {isWhyMatchOpen && (
                      <p className="text-[11px] leading-relaxed pt-1 border-t border-current/15">
                        {matchInfo.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Problem Ref: {prop.problem_id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenFundingModal(prop)}
                      className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5 text-saffron" />
                      <span>Offer Funding</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FUNDING OFFER MODAL */}
      {isFundingModalOpen && fundingTargetProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-navy px-6 py-4 flex items-center justify-between text-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">Simulate CSR Grant Commitment</h3>
                  <span className="bg-saffron text-navy text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Prototype Workflow
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Partner: {activePartner.name} • Proposal: {fundingTargetProposal.id}
                </p>
              </div>
              <button
                onClick={() => setIsFundingModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFundingOffer} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  <strong>Prototype Funding Workflow — No real transaction.</strong> This action simulates corporate board sanction and activates state deployment milestones.
                </span>
              </div>

              {/* Proposal info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Proposal</span>
                <div className="font-bold text-navy text-xs mt-0.5">{fundingTargetProposal.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Lead PI: {fundingTargetProposal.researcher?.name} ({fundingTargetProposal.researcher?.university?.name})
                </div>
              </div>

              {/* Funding Amount & Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Grant Commitment Amount (INR) *
                  </label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-purple-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Funding Instrument *
                  </label>
                  <select
                    value={fundingType}
                    onChange={(e) => setFundingType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="CSR Grant">CSR Grant (Schedule VII)</option>
                    <option value="Research Endowment">Research Endowment</option>
                    <option value="Pilot Sponsor">Field Pilot Sponsorship</option>
                  </select>
                </div>
              </div>

              {/* CSR Alignment Mandate */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  CSR Mandate Alignment Area
                </label>
                <input
                  type="text"
                  value={csrFocus}
                  onChange={(e) => setCsrFocus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Milestones */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tranche Milestones &amp; Deliverables
                </label>
                <textarea
                  rows={2}
                  value={milestones}
                  onChange={(e) => setMilestones(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Mentorship Option Checkbox */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <input
                  type="checkbox"
                  id="mentorship"
                  checked={mentorship}
                  onChange={(e) => setMentorship(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-600"
                />
                <label htmlFor="mentorship" className="font-semibold text-slate-800 cursor-pointer">
                  Provide Industry Engineering Mentorship &amp; Subject Matter Advisory
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFundingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Handshake className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording...' : 'Authorize CSR Grant Commitment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
