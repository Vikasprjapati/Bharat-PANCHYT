import React, { useState } from 'react';
import { Mail, X, ArrowRight, ShieldCheck, Clock, User } from 'lucide-react';
import { SimulatedEmail } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: SimulatedEmail[];
  onNavigate: (route: string) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, emails, onNavigate }) => {
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(emails[0] || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[620px] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Simulated Ecosystem Email Center</h2>
                <span className="bg-saffron/20 border border-saffron/40 text-saffron text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                  Prototype Demo
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Demonstrates automated transactional notifications sent to researchers, CSR heads & citizens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar list + Detail view */}
        <div className="flex-1 flex overflow-hidden">
          {/* Inbox list */}
          <div className="w-2/5 border-r border-slate-200 overflow-y-auto bg-slate-50 divide-y divide-slate-200">
            <div className="p-3 bg-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Simulated Inbox ({emails.length})</span>
              <span className="text-[10px] lowercase text-teal">Auto-generated</span>
            </div>
            {emails.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No transactional emails triggered yet.
              </div>
            ) : (
              emails.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEmail(e)}
                  className={`w-full p-3.5 text-left transition-colors flex flex-col gap-1.5 ${
                    selectedEmail?.id === e.id
                      ? 'bg-teal-subtle/60 border-l-4 border-teal'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-navy truncate max-w-[170px]">
                      {e.recipient}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {e.recipient_role}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 line-clamp-1">
                    {e.subject}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {e.body}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Email detail viewer */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-white">
            {selectedEmail ? (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal/10 text-teal">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Role: {selectedEmail.recipient_role}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Just now (Prototype)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy-deep leading-tight">
                    {selectedEmail.subject}
                  </h3>
                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium w-12">From:</span>
                      <span className="font-mono text-slate-700">{selectedEmail.sender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium w-12">To:</span>
                      <span className="font-mono text-slate-700">{selectedEmail.recipient}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line font-sans bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {selectedEmail.body}
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate(selectedEmail.action_route);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-xs font-semibold shadow hover:bg-teal-dark transition"
                  >
                    <span>{selectedEmail.action_label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="ml-3 text-[11px] text-slate-400">
                    Simulates recipient clicking email action link
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                Select an email from the inbox to read.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Simulation Mode • No external SMTP credentials transmitted</span>
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-navy"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
