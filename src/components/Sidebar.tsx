import React from 'react';
import {
  LayoutDashboard,
  Users,
  Brain,
  ShieldCheck,
  GraduationCap,
  FileText,
  Briefcase,
  Rocket,
  Award,
  MapPin,
  Info
} from 'lucide-react';
import { StakeholderRole } from '../types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentRole: StakeholderRole;
  pendingValidationCount?: number;
  openProposalCount?: number;
  outcomesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  currentRole,
  pendingValidationCount = 0,
  openProposalCount = 0,
  outcomesCount = 0
}) => {
  const NAV_ITEMS = [
    {
      path: '/',
      label: 'Overview & Journey',
      icon: LayoutDashboard,
      badge: null
    },
    {
      path: '/citizen',
      label: '1. Citizen Portal',
      icon: Users,
      badge: 'No Login'
    },
    {
      path: '/ai-analysis',
      label: 'AI Understanding Engine',
      icon: Brain,
      badge: 'Demo AI'
    },
    {
      path: '/district-validation',
      label: '2. District Validation',
      icon: ShieldCheck,
      badge: pendingValidationCount > 0 ? `${pendingValidationCount} Pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      path: '/research-matching',
      label: '3. Research Matching',
      icon: GraduationCap,
      badge: 'AI Score'
    },
    {
      path: '/research-proposals',
      label: 'Research Proposals',
      icon: FileText,
      badge: openProposalCount > 0 ? `${openProposalCount} Active` : null
    },
    {
      path: '/funding-csr',
      label: '4. Industry / CSR',
      icon: Briefcase,
      badge: 'Mandates'
    },
    {
      path: '/projects',
      label: '5. State Gov & Deploy',
      icon: Rocket,
      badge: 'Verify'
    },
    {
      path: '/public-outcomes',
      label: 'Public Outcome Registry',
      icon: Award,
      badge: outcomesCount > 0 ? `${outcomesCount} Verified` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      path: '/map',
      label: 'Geographic Need Map',
      icon: MapPin,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-surface border-r border-borderMuted flex flex-col shrink-0 min-h-[calc(100vh-80px)] select-none">
      {/* Current Active Persona Context Card */}
      <div className="p-3 border-b border-borderMuted bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal"></div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Role
          </span>
        </div>
        <div className="text-xs font-bold text-navy capitalize mt-0.5">
          {currentRole === 'district' ? 'District Validation Officer' :
           currentRole === 'researcher' ? 'Higher Education / Researcher' :
           currentRole === 'industry' ? 'Industry / CSR Partner' :
           currentRole === 'government' ? 'State Government Reviewer' :
           currentRole === 'citizen' ? 'Citizen (Direct Reporter)' :
           'Public Registry Visitor'}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-saffron' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Prototype Transparency Footer */}
      <div className="p-3 border-t border-borderMuted bg-slate-50 text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center gap-1.5 text-navy font-semibold">
          <Info className="w-3.5 h-3.5 text-teal" />
          <span>Prototype Transparency</span>
        </div>
        <p className="text-[10px] leading-tight text-slate-500">
          Prototype / Demo Data. Designed for integration with real government, university and industry systems.
        </p>
      </div>
    </aside>
  );
};
