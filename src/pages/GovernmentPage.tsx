import React, { useState } from 'react';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  MapPin,
  Building,
  User,
  Search,
  ArrowLeft,
  BookOpen,
  Coins
} from 'lucide-react';
import { Project, PublicOutcome, EcosystemStats, Problem, ResearchProposal } from '../types';
import { api } from '../services/api';
import { StatusPill } from '../components/StatusPill';
import { HowItWorksCard } from '../components/HowItWorksCard';
import { CategoryHub } from '../components/CategoryHub';

interface GovernmentPageProps {
  projects: Project[];
  problems?: Problem[];
  proposals?: ResearchProposal[];
  stats: EcosystemStats | null;
  onProjectUpdated: (project: Project) => void;
  onOutcomePublished: (outcome: PublicOutcome) => void;
  onNavigateToRegistry: () => void;
}

export const GovernmentPage: React.FC<GovernmentPageProps> = ({
  projects,
  problems = [],
  proposals = [],
  stats,
  onProjectUpdated,
  onOutcomePublished,
  onNavigateToRegistry
}) => {
  // Category Hub state: null means show category hub first
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [verifierName, setVerifierName] = useState('Dr. S. C. Murmu (State Innovation Council)');
  const [designation, setDesignation] = useState('Director of Technical Education & S&T');
  const [auditFindings, setAuditFindings] = useState('Comprehensive field inspection completed. Water samples verified against BIS 10500 standards with 0% coliform and < 0.2 mg/L iron.');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedOutcome, setPublishedOutcome] = useState<PublicOutcome | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const LIFECYCLE_STAGES = [
    { label: 'Problems', count: stats?.kpis.total_problems || problems.length || 21, color: 'bg-slate-100 text-slate-700' },
    { label: 'Validated', count: stats?.kpis.validated_problems || 15, color: 'bg-amber-100 text-amber-800' },
    { label: 'Research', count: stats?.kpis.research_matches || 8, color: 'bg-blue-100 text-blue-800' },
    { label: 'Funded', count: stats?.kpis.funded_projects || 4, color: 'bg-purple-100 text-purple-800' },
    { label: 'Deployed', count: stats?.kpis.deployed_innovations || projects.length || 3, color: 'bg-teal-subtle text-teal-dark' },
    { label: 'Verified', count: projects.filter(p => p.status === 'Government Verified' || p.status === 'Published').length, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Public Outcome', count: stats?.kpis.public_outcomes || 5, color: 'bg-emerald-600 text-white font-bold' }
  ];

  const handleVerifyDeployment = async () => {
    if (!selectedProject) return;
    setIsVerifying(true);

    try {
      await api.verifyProject(selectedProject.id, {
        verifier_name: verifierName,
        verifier_designation: designation,
        audit_findings: auditFindings,
        is_verified: true
      });

      const updated: Project = {
        ...selectedProject,
        status: 'Government Verified'
      };
      setSelectedProject(updated);
      onProjectUpdated(updated);
      alert(`Project ${selectedProject.id} verified by State Innovation Review Board!`);
    } catch (err) {
      alert('Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePublishToRegistry = async () => {
    if (!selectedProject) return;
    setIsPublishing(true);

    try {
      const outcome = await api.publishOutcome(selectedProject.id, {
        title: selectedProject.title,
        summary_solution: selectedProject.proposal?.proposed_solution || 'Field implemented community technology.',
        impact_metric: `${selectedProject.beneficiaries_count} citizens provided verified public benefits.`
      });

      const updated: Project = {
        ...selectedProject,
        status: 'Published'
      };
      setSelectedProject(updated);
      onProjectUpdated(updated);
      setPublishedOutcome(outcome);
      onOutcomePublished(outcome);
    } catch (err) {
      alert('Failed to publish outcome to public registry.');
    } finally {
      setIsPublishing(false);
    }
  };

  const categoryFilteredProjects = selectedCategory && selectedCategory !== 'All'
    ? projects.filter(p => p.problem?.category.toLowerCase() === selectedCategory.toLowerCase())
    : projects;

  const filteredProjects = categoryFilteredProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deployment_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 uppercase tracking-wide">
            <Rocket className="w-3.5 h-3.5" />
            State Innovation Council &amp; Higher Education Department
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            State Government Oversight &amp; Deployment Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end statewide lifecycle tracking, ground deployment audits, and public registry certification.
          </p>
        </div>

        <button
          onClick={onNavigateToRegistry}
          className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition flex items-center gap-2 shadow-xs shrink-0"
        >
          <Award className="w-4 h-4 text-saffron" />
          <span>View Public Innovation Registry</span>
        </button>
      </div>

      {/* Statewide Lifecycle Visualization Strip */}
      <div className="card-gov p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-navy">
          <span>Statewide Innovation Progression Lifecycle</span>
          <span className="text-slate-400 font-normal">Real-Time Aggregation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {LIFECYCLE_STAGES.map((stg, idx) => (
            <div
              key={stg.label}
              className={`p-3 rounded-xl text-center space-y-1 ${stg.color}`}
            >
              <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                0{idx + 1}. {stg.label}
              </div>
              <div className="text-xl font-extrabold font-heading">
                {stg.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Accordion */}
      <HowItWorksCard
        title="State Government Verification & Registry Publication"
        steps={[
          "Select a domain or category to view field deployments across districts.",
          "State Government Review Officers inspect deployment performance metrics and independent laboratory sample results.",
          "Clicking 'Verify Deployment' certifies the installation under state innovation quality standards.",
          "Clicking 'Publish to Public Registry' generates an open, permanent record in the Public Innovation Outcome Registry that honors the original citizen reporter."
        ]}
        whyItMatters="Guarantees government accountability, verifies real societal impact, and closes the citizen feedback loop with public honor."
        defaultOpen={false}
      />

      {/* PRIMARY CATEGORY HUB VIEW (When no category is selected) */}
      {!selectedCategory ? (
        <div className="card-gov p-6 space-y-4">
          <CategoryHub
            problems={problems}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              const firstInCat = projects.find(p => p.problem?.category.toLowerCase() === cat.toLowerCase());
              if (firstInCat) setSelectedProject(firstInCat);
            }}
            badgeType="projects"
            title="Statewide Innovation Pipeline by Domain"
            subtitle="Click a domain to inspect active field trials and verify deployments. Badges indicate active field projects."
          />
        </div>
      ) : (
        /* DRILL-DOWN PROJECTS VIEW */
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
              Active Category: <span className="text-teal font-extrabold">{selectedCategory}</span> ({filteredProjects.length} Projects)
            </span>
          </div>

          {publishedOutcome && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Outcome Published to Public Registry!
                </span>
                <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {publishedOutcome.id}
                </span>
              </div>
              <h4 className="text-sm font-bold text-navy">{publishedOutcome.title}</h4>
              <p className="text-xs text-slate-700">
                Citizen Contributor: <strong>{publishedOutcome.citizen_contributor_name}</strong> is now credited on the open public registry!
              </p>
              <div className="pt-2">
                <button
                  onClick={onNavigateToRegistry}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span>View in Public Outcome Registry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Main Grid: Projects List + Verification Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Projects List */}
            <div className="lg:col-span-6 space-y-3">
              <div className="card-gov p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-navy-deep">
                    {selectedCategory} Deployment Projects
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {filteredProjects.length} active deployments
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="max-h-[560px] overflow-y-auto space-y-2.5 pr-1">
                  {filteredProjects.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No active deployment projects in {selectedCategory}.
                    </div>
                  ) : (
                    filteredProjects.map((p) => {
                      const isSelected = selectedProject?.id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProject(p);
                            setPublishedOutcome(null);
                          }}
                          className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'border-slate-200/80 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-teal">
                              {p.id}
                            </span>
                            <StatusPill status={p.status} />
                          </div>

                          <h4 className="text-xs font-bold text-navy leading-snug">
                            {p.title}
                          </h4>

                          <div className="text-[11px] text-slate-500 line-clamp-2">
                            {p.pilot_metrics}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {p.deployment_location}
                            </span>
                            <span className="font-semibold text-slate-600">
                              {p.beneficiaries_count} Beneficiaries
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right: Inspection & Verification Drawer */}
            <div className="lg:col-span-6">
              <div className="card-gov p-5 sticky top-20 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-navy-deep flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Deployment Audit &amp; Verification
                  </h3>
                  {selectedProject && (
                    <span className="font-mono text-xs font-bold text-teal">
                      {selectedProject.id}
                    </span>
                  )}
                </div>

                {selectedProject ? (
                  <div className="space-y-4">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Stage</span>
                        <StatusPill status={selectedProject.status} />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Citizen Beneficiaries</span>
                        <span className="font-bold text-navy font-mono text-sm">
                          {selectedProject.beneficiaries_count} Citizens Reached
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-navy text-sm leading-snug">
                        {selectedProject.title}
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                        <strong className="text-navy block mb-0.5">Field Pilot Telemetry &amp; Metrics:</strong>
                        {selectedProject.pilot_metrics || 'Pilot installation operational; continuous sensor streaming active.'}
                      </div>
                    </div>

                    {/* Problem & Research Attribution */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Original Problem</span>
                        <span className="font-mono font-semibold text-teal">{selectedProject.problem_id}</span>
                        <p className="text-slate-600 line-clamp-1 mt-0.5">{selectedProject.problem?.title}</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Originating Citizen</span>
                        <span className="font-semibold text-navy">
                          {selectedProject.problem?.citizen_name && !selectedProject.problem.is_anonymous ? selectedProject.problem.citizen_name : 'Anonymous'}
                        </span>
                        <p className="text-slate-400 text-[10px]">Credited on final public outcome</p>
                      </div>
                    </div>

                    {/* Verification Form Inputs */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <span className="font-bold text-navy block text-xs">
                        State Innovation Review Certification
                      </span>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                          Verifier Name &amp; Committee
                        </label>
                        <input
                          type="text"
                          value={verifierName}
                          onChange={(e) => setVerifierName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                          Audit Findings &amp; Lab Compliance Notes
                        </label>
                        <textarea
                          rows={2}
                          value={auditFindings}
                          onChange={(e) => setAuditFindings(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Actions: Verify & Publish */}
                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button
                        onClick={handleVerifyDeployment}
                        disabled={isVerifying || selectedProject.status === 'Government Verified' || selectedProject.status === 'Published'}
                        className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isVerifying ? 'Verifying...' : 'Verify Deployment'}</span>
                      </button>

                      <button
                        onClick={handlePublishToRegistry}
                        disabled={isPublishing || selectedProject.status === 'Published'}
                        className="py-2.5 px-3 bg-navy hover:bg-navy-light text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <Award className="w-4 h-4 text-saffron" />
                        <span>{isPublishing ? 'Publishing...' : 'Publish to Registry'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Select a project to inspect deployment metrics and certify public outcome.
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
