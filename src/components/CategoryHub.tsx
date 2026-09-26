import React from 'react';
import {
  Droplets,
  Sprout,
  HeartPulse,
  Building2,
  Trees,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Problem } from '../types';

export interface CategoryHubProps {
  problems: Problem[];
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
  badgeType?: 'new' | 'pending' | 'total' | 'opportunities' | 'projects';
  title?: string;
  subtitle?: string;
}

const CATEGORIES_CONFIG = [
  {
    id: 'Water',
    label: 'Water & Sanitation',
    domain: 'Hydrology, Aquifers & Purification Tech',
    icon: Droplets,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200 hover:border-sky-400',
    badgeBg: 'bg-sky-100 text-sky-800'
  },
  {
    id: 'Agriculture',
    label: 'Agriculture & AgriTech',
    domain: 'Crop Pathology, Soil Science & Post-Harvest',
    icon: Sprout,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'Health',
    label: 'Healthcare & Diagnostics',
    domain: 'Point-of-Care, Maternal Care & Biomedical',
    icon: HeartPulse,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200 hover:border-rose-400',
    badgeBg: 'bg-rose-100 text-rose-800'
  },
  {
    id: 'Civic',
    label: 'Civic Systems & Waste',
    domain: 'Municipal GIS, Solid Waste & Infrastructure',
    icon: Building2,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200 hover:border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'Environment',
    label: 'Environment & Climate',
    domain: 'Acid Mine Drainage, Effluents & Remediation',
    icon: Trees,
    color: 'text-teal',
    bgColor: 'bg-teal-subtle/50',
    borderColor: 'border-teal/30 hover:border-teal',
    badgeBg: 'bg-teal/15 text-teal-dark'
  },
  {
    id: 'Livelihood',
    label: 'Rural Livelihood & Craft',
    domain: 'Tasar Silk Mechanization, SHGs & Enterprise',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200 hover:border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'Education',
    label: 'Education & STEM',
    domain: 'Vernacular Pedagogy & Offline Learning Labs',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200 hover:border-indigo-400',
    badgeBg: 'bg-indigo-100 text-indigo-800'
  }
];

export const CategoryHub: React.FC<CategoryHubProps> = ({
  problems,
  onSelectCategory,
  selectedCategory,
  badgeType = 'new',
  title = 'Browse by Domain & Category',
  subtitle = 'Select a thematic category to inspect regional challenges and active R&D interventions'
}) => {
  // Count items per category
  const getCategoryStats = (catId: string) => {
    const catProblems = problems.filter(p => p.category.toLowerCase() === catId.toLowerCase());
    const total = catProblems.length;
    
    // Count pending / new (submitted in last 48h or status Pending Validation)
    const pending = catProblems.filter(p => p.status === 'Pending Validation' || p.status === 'Submitted').length;
    
    // Validated ready for research
    const validated = catProblems.filter(p => ['Validated', 'Matched', 'Proposal Created', 'In Research'].includes(p.status)).length;

    // Active deployment / verified
    const deployed = catProblems.filter(p => ['Deployed', 'Government Verified', 'Published'].includes(p.status)).length;

    const latestProblem = catProblems.length > 0 ? catProblems[0] : null;

    return { total, pending, validated, deployed, latestProblem };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-navy-deep flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal" />
            {title}
          </h2>
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
            selectedCategory === 'All'
              ? 'bg-navy text-white border-navy shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          View All Domains ({problems.length})
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {CATEGORIES_CONFIG.map((cat) => {
          const stats = getCategoryStats(cat.id);
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                isSelected
                  ? 'bg-white border-teal shadow-md ring-2 ring-teal/20'
                  : `bg-white ${cat.borderColor} shadow-xs hover:shadow`
              }`}
            >
              {/* Category Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Numbered marks: 1, 2, 3 etc. for new added / pending / opportunities */}
                  {badgeType === 'pending' && stats.pending > 0 ? (
                    <div className="flex items-center gap-1.5 animate-pulse-subtle">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                        {stats.pending}
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        Pending Review
                      </span>
                    </div>
                  ) : badgeType === 'opportunities' && stats.validated > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-teal text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                        {stats.validated}
                      </span>
                      <span className="text-[10px] font-bold text-teal-dark bg-teal-subtle px-2 py-0.5 rounded-full">
                        Opportunities
                      </span>
                    </div>
                  ) : badgeType === 'projects' && stats.deployed > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                        {stats.deployed}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Deployed
                      </span>
                    </div>
                  ) : stats.pending > 0 ? (
                    <div className="flex items-center gap-1.5 animate-pulse-subtle">
                      <span className="w-5 h-5 rounded-full bg-saffron text-navy font-black text-[11px] flex items-center justify-center shadow-xs">
                        {stats.pending}
                      </span>
                      <span className="text-[10px] font-extrabold text-navy bg-saffron/25 border border-saffron/40 px-2 py-0.5 rounded-full">
                        New Added
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {stats.total} total
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-navy-deep group-hover:text-teal transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.domain}
                  </p>
                </div>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-600">
                  {stats.total} {stats.total === 1 ? 'Problem' : 'Problems'}
                </span>
                <span className="text-teal font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[11px]">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
