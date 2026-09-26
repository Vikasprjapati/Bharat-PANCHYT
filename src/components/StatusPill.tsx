import React from 'react';

interface StatusPillProps {
  status: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'Published':
      case 'Government Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Validated':
      case 'Funded':
      case 'Matched':
        return 'bg-teal-subtle text-teal-dark border-teal/20';
      case 'Proposal Created':
      case 'Proposal Submitted':
      case 'In Research':
      case 'Field Pilot':
      case 'Deployed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Validation':
      case 'Submitted':
      case 'AI Analyzed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {status}
    </span>
  );
};
