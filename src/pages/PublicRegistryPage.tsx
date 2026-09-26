import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Search,
  Building,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Share2,
  ExternalLink
} from 'lucide-react';
import { PublicOutcome } from '../types';
import { HowItWorksCard } from '../components/HowItWorksCard';

interface PublicRegistryPageProps {
  outcomes: PublicOutcome[];
}

export const PublicRegistryPage: React.FC<PublicRegistryPageProps> = ({ outcomes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const DISTRICTS = ['All', 'Ranchi', 'Khunti', 'East Singhbhum', 'Dhanbad'];

  const filteredOutcomes = outcomes.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.summary_solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.original_problem_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.research_institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.industry_partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.citizen_contributor_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict =
      selectedDistrict === 'All' || o.location.toLowerCase().includes(selectedDistrict.toLowerCase());

    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-deep to-teal-dark text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/30 text-saffron text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-saffron" />
          Open Public Access • No Login Required
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
          Public Innovation Outcome Registry
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
          A transparent statewide catalog of successfully implemented grassroots technological solutions. 
          Every outcome permanently documents the original citizen problem, the university research team, 
          the corporate CSR sponsor, and honors the citizen contributor who first brought the issue to light.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-teal-light">
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Government Verified
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
            <User className="w-3.5 h-3.5 text-saffron" /> Citizen Contributor Credit
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
            <Building className="w-3.5 h-3.5 text-sky-400" /> Academic &amp; CSR Collaboration
          </span>
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="Public Recognition & Open Replicability"
        steps={[
          "When a research project passes State Government verification, it is published to this open public registry.",
          "Citizens who initially reported the challenge are permanently credited by name (e.g. 'Raj Kumar') or as Anonymous if requested.",
          "All technical specifications, participating universities, and CSR grant partners are publicly discoverable.",
          "Other panchayats, districts, and states can replicate verified innovations with direct links to the research blueprints."
        ]}
        whyItMatters="Closes the full loop of democratic innovation: citizens highlight needs, academia solves them, industry funds them, and the public reaps the reward."
        defaultOpen={false}
      />

      {/* Search & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-600">District:</span>
          {DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedDistrict === d
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by problem, solution, university, or citizen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Outcomes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOutcomes.length === 0 ? (
          <div className="col-span-2 card-gov p-12 text-center text-slate-400 text-xs">
            No public outcomes matching this search criteria.
          </div>
        ) : (
          filteredOutcomes.map((out) => (
            <div
              key={out.id}
              className="card-gov p-6 flex flex-col justify-between space-y-4 hover:border-teal transition-all shadow-sm"
            >
              <div className="space-y-3.5">
                {/* Header: ID & Verification Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-teal bg-teal-subtle px-2.5 py-1 rounded-md">
                    {out.id}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Government Verified
                  </span>
                </div>

                {/* Outcome Title */}
                <h3 className="text-base font-bold text-navy-deep leading-snug">
                  {out.title}
                </h3>

                {/* Implemented Technological Solution */}
                <div className="p-3 bg-teal-subtle/30 rounded-xl border border-teal/15 space-y-1">
                  <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                    Deployed Technological Solution
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {out.summary_solution}
                  </p>
                </div>

                {/* Original Citizen Problem Reference */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Original Citizen Problem Solved
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    &ldquo;{out.original_problem_text}&rdquo;
                  </p>
                </div>

                {/* Ecosystem Stakeholder Badges Strip */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      <strong className="text-navy">Research Partner: </strong>
                      {out.research_institution} ({out.research_team})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Building className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>
                      <strong className="text-navy">Industry / CSR Sponsor: </strong>
                      {out.industry_partner}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong className="text-navy">Deployment Site: </strong>
                      {out.location}
                    </span>
                  </div>
                </div>

                {/* Measurable Impact Metric Pill */}
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Impact: {out.impact_metric}</span>
                </div>
              </div>

              {/* Footer: Prominent Citizen Contributor Credit */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 bg-saffron/10 border border-saffron/30 px-3 py-1.5 rounded-xl text-navy">
                  <User className="w-4 h-4 text-saffron shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block leading-none">
                      Citizen Contributor
                    </span>
                    <span className="font-bold text-navy text-xs">
                      {out.citizen_contributor_name && !out.is_anonymous
                        ? `Problem reported by ${out.citizen_contributor_name}`
                        : 'Citizen Contributor — Anonymous'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Verified {new Date(out.deployment_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
