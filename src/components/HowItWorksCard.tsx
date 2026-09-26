import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface HowItWorksCardProps {
  title: string;
  steps: string[];
  whyItMatters?: string;
  defaultOpen?: boolean;
}

export const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  title,
  steps,
  whyItMatters,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-2 text-navy-deep">
          <HelpCircle className="w-4 h-4 text-teal" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            How this works: <span className="text-navy">{title}</span>
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <span className="mr-1">{isOpen ? 'Hide' : 'Explain'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 space-y-2.5">
          <ol className="space-y-1.5 list-decimal list-inside text-slate-700">
            {steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
          {whyItMatters && (
            <div className="pt-2 border-t border-dashed border-slate-200 text-slate-500 italic">
              <strong className="text-navy font-semibold not-italic">Why it matters: </strong>
              {whyItMatters}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
