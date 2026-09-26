import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { CitizenPage } from './pages/CitizenPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { DistrictOfficerPage } from './pages/DistrictOfficerPage';
import { ResearcherPage } from './pages/ResearcherPage';
import { ResearchProposalsPage } from './pages/ResearchProposalsPage';
import { IndustryCSRPage } from './pages/IndustryCSRPage';
import { GovernmentPage } from './pages/GovernmentPage';
import { PublicRegistryPage } from './pages/PublicRegistryPage';
import { MapPage } from './pages/MapPage';

import { JudgeDemoModal } from './components/JudgeDemoModal';
import { EmailModal } from './components/EmailModal';
import { ProblemDetailModal } from './components/ProblemDetailModal';

import { api } from './services/api';
import {
  StakeholderRole,
  Problem,
  Researcher,
  ExpertiseMatch,
  ResearchProposal,
  FundingPartner,
  FundingInterest,
  Project,
  PublicOutcome,
  NotificationItem,
  SimulatedEmail,
  EcosystemStats
} from './types';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentRole, setCurrentRole] = useState<StakeholderRole>('citizen');

  // Core Data States
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [matches, setMatches] = useState<ExpertiseMatch[]>([]);
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [partners, setPartners] = useState<FundingPartner[]>([]);
  const [fundingInterests, setFundingInterests] = useState<FundingInterest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [outcomes, setOutcomes] = useState<PublicOutcome[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [emails, setEmails] = useState<SimulatedEmail[]>([]);

  // Modals
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedProblemForDetail, setSelectedProblemForDetail] = useState<Problem | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Load all initial data from backend
  const loadAllData = async () => {
    try {
      const [
        statsData,
        problemsData,
        researchersData,
        matchesData,
        proposalsData,
        partnersData,
        fundingData,
        projectsData,
        outcomesData,
        notifsData,
        emailsData
      ] = await Promise.all([
        api.getStats().catch(() => null),
        api.getProblems().catch(() => []),
        api.getResearchers().catch(() => []),
        api.getMatches().catch(() => []),
        api.getProposals().catch(() => []),
        api.getCSRPartners().catch(() => []),
        api.getFundingInterests().catch(() => []),
        api.getProjects().catch(() => []),
        api.getPublicOutcomes().catch(() => []),
        api.getNotifications().catch(() => []),
        api.getSimulatedEmails().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      setProblems(problemsData);
      setResearchers(researchersData);
      setMatches(matchesData);
      setProposals(proposalsData);
      setPartners(partnersData);
      setFundingInterests(fundingData);
      setProjects(projectsData);
      setOutcomes(outcomesData);
      setNotifications(notifsData);
      setEmails(emailsData);
    } catch (e) {
      console.warn("API loaded with local fallback or partial response.");
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      await loadAllData();
      alert("Database reset to fresh demo state!");
    } catch (err) {
      alert("Reset executed.");
    } finally {
      setIsResetting(false);
    }
  };

  // State update handlers for real-time reactivity
  const handleProblemCreated = (newProblem: Problem) => {
    setProblems((prev) => [newProblem, ...prev]);
    // Refresh stats
    api.getStats().then(setStats).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
  };

  const handleProblemUpdated = (updated: Problem) => {
    setProblems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    api.getMatches().then(setMatches).catch(() => {});
    api.getStats().then(setStats).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
    api.getSimulatedEmails().then(setEmails).catch(() => {});
  };

  const handleProposalCreated = (newProp: ResearchProposal) => {
    setProposals((prev) => [newProp, ...prev]);
    api.getProblems().then(setProblems).catch(() => {});
    api.getStats().then(setStats).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
    api.getSimulatedEmails().then(setEmails).catch(() => {});
  };

  const handleProposalUpdated = (updatedProp: ResearchProposal) => {
    setProposals((prev) => prev.map((p) => (p.id === updatedProp.id ? updatedProp : p)));
    api.getProjects().then(setProjects).catch(() => {});
    api.getStats().then(setStats).catch(() => {});
  };

  const handleFundingRecorded = (interest: FundingInterest) => {
    setFundingInterests((prev) => [interest, ...prev]);
    api.getProjects().then(setProjects).catch(() => {});
    api.getProblems().then(setProblems).catch(() => {});
    api.getProposals().then(setProposals).catch(() => {});
    api.getStats().then(setStats).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
    api.getSimulatedEmails().then(setEmails).catch(() => {});
  };

  const handleProjectUpdated = (updatedProj: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
    api.getStats().then(setStats).catch(() => {});
  };

  const handleOutcomePublished = (outcome: PublicOutcome) => {
    setOutcomes((prev) => [outcome, ...prev]);
    api.getProjects().then(setProjects).catch(() => {});
    api.getProblems().then(setProblems).catch(() => {});
    api.getStats().then(setStats).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
    api.getSimulatedEmails().then(setEmails).catch(() => {});
  };

  // Route switcher mapper
  const renderCurrentView = () => {
    switch (currentPath) {
      case '/':
        return (
          <OverviewPage
            stats={stats}
            problems={problems}
            onNavigate={setCurrentPath}
            onSwitchRole={setCurrentRole}
            onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
            onSelectProblem={setSelectedProblemForDetail}
          />
        );
      case '/citizen':
        return (
          <CitizenPage
            problems={problems}
            onProblemCreated={handleProblemCreated}
            onSelectProblem={setSelectedProblemForDetail}
          />
        );
      case '/ai-analysis':
        return <AIAnalysisPage />;
      case '/district-validation':
        return (
          <DistrictOfficerPage
            problems={problems}
            proposals={proposals}
            onProblemUpdated={handleProblemUpdated}
            onNavigateToResearch={() => {
              setCurrentRole('researcher');
              setCurrentPath('/research-matching');
            }}
          />
        );
      case '/research-matching':
        return (
          <ResearcherPage
            problems={problems}
            researchers={researchers}
            matches={matches}
            proposals={proposals}
            onProposalCreated={handleProposalCreated}
            onNavigateToFunding={() => {
              setCurrentRole('industry');
              setCurrentPath('/funding-csr');
            }}
          />
        );
      case '/research-proposals':
        return (
          <ResearchProposalsPage
            proposals={proposals}
            onNavigateToFunding={() => {
              setCurrentRole('industry');
              setCurrentPath('/funding-csr');
            }}
            onNavigateToResearch={() => {
              setCurrentRole('researcher');
              setCurrentPath('/research-matching');
            }}
          />
        );
      case '/funding-csr':
        return (
          <IndustryCSRPage
            proposals={proposals}
            partners={partners}
            fundingInterests={fundingInterests}
            onProposalUpdated={handleProposalUpdated}
            onFundingRecorded={handleFundingRecorded}
            onNavigateToProjects={() => {
              setCurrentRole('government');
              setCurrentPath('/projects');
            }}
          />
        );
      case '/projects':
        return (
          <GovernmentPage
            projects={projects}
            problems={problems}
            proposals={proposals}
            stats={stats}
            onProjectUpdated={handleProjectUpdated}
            onOutcomePublished={handleOutcomePublished}
            onNavigateToRegistry={() => {
              setCurrentRole('public');
              setCurrentPath('/public-outcomes');
            }}
          />
        );
      case '/public-outcomes':
        return <PublicRegistryPage outcomes={outcomes} />;
      case '/map':
        return <MapPage problems={problems} onSelectProblem={setSelectedProblemForDetail} />;
      default:
        return (
          <OverviewPage
            stats={stats}
            problems={problems}
            onNavigate={setCurrentPath}
            onSwitchRole={setCurrentRole}
            onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
            onSelectProblem={setSelectedProblemForDetail}
          />
        );
    }
  };

  const pendingValidations = problems.filter((p) => p.status === 'Pending Validation' || p.status === 'Submitted').length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal font-sans antialiased">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'citizen') setCurrentPath('/citizen');
          if (role === 'district') setCurrentPath('/district-validation');
          if (role === 'researcher') setCurrentPath('/research-matching');
          if (role === 'industry') setCurrentPath('/funding-csr');
          if (role === 'government') setCurrentPath('/projects');
          if (role === 'public') setCurrentPath('/public-outcomes');
        }}
        onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        notifications={notifications}
        emailCount={emails.length}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
        onNavigate={setCurrentPath}
        onMarkAllNotificationsRead={async () => {
          await api.markAllNotificationsRead();
          const refreshed = await api.getNotifications();
          setNotifications(refreshed);
        }}
      />

      {/* Main Layout: Sidebar + Dynamic Main View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          currentRole={currentRole}
          pendingValidationCount={pendingValidations}
          openProposalCount={proposals.length}
          outcomesCount={outcomes.length}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Standardized Government-Tech Footer */}
      <footer className="bg-navy-deep text-slate-400 text-xs border-t border-white/5 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-heading font-bold text-white text-sm">
              BHARAT-PANCHYT
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              PEOPLES ACTUALL NEEDS CONNECTED WITH HIGHER EDUCATION YOUTH AND TECHNOLOGY
            </div>
            <div className="text-[11px] text-teal">
              People → AI → Research → Funding → Impact
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 text-[11px]">
            <span className="bg-white/10 px-2.5 py-0.5 rounded text-slate-300 font-semibold uppercase">
              Prototype Demo
            </span>
            <span className="text-slate-500">
              Smart India Hackathon 2026 • Designed for State Government &amp; Higher Education Integration
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onNavigate={setCurrentPath}
        onSwitchRole={setCurrentRole}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emails={emails}
        onNavigate={setCurrentPath}
      />

      <ProblemDetailModal
        problem={selectedProblemForDetail}
        onClose={() => setSelectedProblemForDetail(null)}
        onNavigate={setCurrentPath}
        onSwitchRole={setCurrentRole}
      />
    </div>
  );
};

export default App;
