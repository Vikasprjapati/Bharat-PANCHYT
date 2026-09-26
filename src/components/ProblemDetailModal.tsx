import React from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Clock,
  ShieldCheck,
  User,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Problem, StakeholderRole } from '../types';
import { StatusPill } from './StatusPill';

interface ProblemDetailModalProps {
  problem: Problem | null;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onSwitchRole: (role: StakeholderRole) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  onClose,
  onNavigate,
  onSwitchRole
}) => {
  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-extrabold bg-teal text-white px-2.5 py-0.5 rounded">
              {problem.id}
            </span>
            <span className="text-xs font-bold uppercase text-slate-300">
              {problem.category}
            </span>
            <StatusPill status={problem.priority} />
            <StatusPill status={problem.status} />
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <h2 className="text-base font-bold text-navy-deep leading-snug">
              {problem.title}
            </h2>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{problem.location} ({problem.district}, {problem.state})</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
            <strong className="text-navy block mb-1">Citizen Ground Report:</strong>
            {problem.description}
          </div>

          {/* AI Understanding Synthesis */}
          {problem.ai_analysis && (
            <div className="p-4 bg-teal-subtle/50 rounded-xl border border-teal/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal" />
                  AI Understanding Engine Output
                </span>
                <span className="text-[10px] text-teal font-semibold uppercase">
                  {problem.ai_analysis.is_live_ai ? 'Live Gemini AI' : 'Demo AI Analysis'}
                </span>
              </div>
              <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-teal/15">
                &ldquo;{problem.ai_analysis.summary}&rdquo;
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Research Domain</span>
                  <span className="text-navy font-semibold">{problem.ai_analysis.domain}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Duplicate Check</span>
                  <span className="text-navy font-semibold">{problem.ai_analysis.duplicate_info}</span>
                </div>
              </div>
            </div>
          )}

          {/* Citizen Attribution */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal" />
              <span>
                <strong className="text-navy">Citizen Contributor: </strong>
                {problem.citizen_name && !problem.is_anonymous ? problem.citizen_name : 'Anonymous'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Submitted: {new Date(problem.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Footer Jump CTA */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-600 font-semibold hover:text-navy"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {problem.status === 'Pending Validation' ? (
              <button
                onClick={() => {
                  onClose();
                  onSwitchRole('district');
                  onNavigate('/district-validation');
                }}
                className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light flex items-center gap-1.5"
              >
                <span>Validate in District Panel</span>
                <ArrowRight className="w-3.5 h-3.5 text-saffron" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onSwitchRole('researcher');
                  onNavigate('/research-matching');
                }}
                className="px-4 py-2 rounded-xl bg-teal text-white text-xs font-semibold hover:bg-teal-dark flex items-center gap-1.5"
              >
                <span>View Research Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
