import React from 'react';
import { Problem } from '../types';
import { ProblemMap } from '../components/ProblemMap';
import { MapPin, Info } from 'lucide-react';
import { HowItWorksCard } from '../components/HowItWorksCard';

interface MapPageProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ problems, onSelectProblem }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-subtle text-teal uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5" />
            Geographic Spatial Distribution
          </div>
          <h1 className="text-2xl font-bold text-navy-deep mt-1">
            Statewide Innovation Need Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive OpenStreetMap mapping showing citizen reported issues, priority clusters, and active university research deployments.
          </p>
        </div>

        <div className="text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-600">
          Showing {problems.length} Geolocated Problem Reports
        </div>
      </div>

      <HowItWorksCard
        title="Spatial Analysis & Cluster Identification"
        steps={[
          "Each problem submission records village coordinates or administrative block centroids.",
          "High priority and emergency water/health reports are flagged with visual pulsating markers.",
          "District Officers and academic researchers can isolate regional clusters (e.g. iron contamination in Angara or tomato fungal blight in Bero).",
          "Clicking any marker opens full problem details and allows immediate administrative validation."
        ]}
        whyItMatters="Gives policymakers and universities visual spatial intelligence to allocate R&D deployments where human need is densest."
        defaultOpen={false}
      />

      <ProblemMap problems={problems} onSelectProblem={onSelectProblem} />
    </div>
  );
};
