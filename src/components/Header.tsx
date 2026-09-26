import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Bell,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { StakeholderRole, NotificationItem } from '../types';

interface HeaderProps {
  currentRole: StakeholderRole;
  onRoleChange: (role: StakeholderRole) => void;
  onOpenJudgeDemo: () => void;
  onOpenEmailModal: () => void;
  notifications: NotificationItem[];
  emailCount: number;
  onResetDemo: () => void;
  isResetting?: boolean;
  onNavigate?: (route: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

const ROLES: { id: StakeholderRole; label: string; sub: string }[] = [
  { id: 'citizen', label: '1. Citizen', sub: 'No login required' },
  { id: 'district', label: '2. District Officer', sub: '48h SLA Validation' },
  { id: 'researcher', label: '3. Higher Ed / Research', sub: 'Expertise Matching' },
  { id: 'industry', label: '4. Industry / CSR', sub: 'Mandate Grants' },
  { id: 'government', label: '5. State Government', sub: 'Verify & Publish' },
  { id: 'public', label: 'Public Registry', sub: 'Citizen Credit' }
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenJudgeDemo,
  onOpenEmailModal,
  notifications,
  emailCount,
  onResetDemo,
  isResetting = false,
  onNavigate,
  onMarkAllNotificationsRead
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (n: NotificationItem) => {
    if (n.target_role === 'district') {
      onRoleChange('district');
      onNavigate?.('/district-validation');
    } else if (n.target_role === 'researcher') {
      onRoleChange('researcher');
      onNavigate?.('/research-matching');
    } else if (n.target_role === 'industry') {
      onRoleChange('industry');
      onNavigate?.('/funding-csr');
    } else if (n.target_role === 'government') {
      onRoleChange('government');
      onNavigate?.('/projects');
    } else if (n.target_role === 'public') {
      onRoleChange('public');
      onNavigate?.('/public-outcomes');
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy text-white border-b border-navy-light shadow-md">
      {/* Top micro bar for branding statement */}
      <div className="bg-navy-deep px-4 py-1 flex items-center justify-between text-[11px] text-slate-300 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-saffron">BHARAT-PANCHYT</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline font-mono tracking-tight text-[10px] text-slate-300">
            PEOPLES ACTUALL NEEDS CONNECTED WITH HIGHER EDUCATION YOUTH AND TECHNOLOGY
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-teal font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Demo AI Mode Active
          </span>
          <span className="text-slate-400 hidden md:inline">SIH 2026 Prototype</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-inner border border-teal-light/40">
            <span className="font-heading font-black text-xl text-white tracking-wider">BP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-lg text-white tracking-tight leading-none">
                BHARAT-PANCHYT
              </h1>
              <span className="bg-saffron text-navy font-bold text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase">
                Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5 hidden sm:block">
              Connecting People&apos;s Real Problems With Research, Funding &amp; Implementation.
            </p>
          </div>
        </div>

        {/* Center: Role Switcher Buttons */}
        <div className="hidden lg:flex items-center bg-navy-deep p-1 rounded-xl border border-white/10">
          {ROLES.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-teal text-white shadow-sm ring-1 ring-teal-light/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="leading-tight">{r.label}</div>
                <div className={`text-[9px] ${isActive ? 'text-teal-subtle' : 'text-slate-400'}`}>
                  {r.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Action Tools: Judge Demo, Email, Notifications, Reset */}
        <div className="flex items-center gap-2">
          {/* JUDGE DEMO BUTTON */}
          <button
            onClick={onOpenJudgeDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all transform animate-pulse-subtle"
            title="Open 9-stage guided walkthrough for judges"
          >
            <Sparkles className="w-4 h-4 text-navy fill-navy" />
            <span className="tracking-wide">JUDGE DEMO</span>
          </button>

          {/* Simulated Email Button */}
          <button
            onClick={onOpenEmailModal}
            className="relative p-2 rounded-xl bg-navy-deep border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition"
            title="Open Simulated Email Notifications"
          >
            <Mail className="w-4 h-4" />
            {emailCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal text-white text-[10px] font-bold flex items-center justify-center">
                {emailCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-navy-deep border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-92 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-navy">
                  <div className="flex items-center gap-2">
                    <span>Notifications ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && onMarkAllNotificationsRead && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[10px] font-bold text-teal hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => {
                      const isTargetForMe = n.target_role === 'all' || n.target_role === currentRole;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 text-xs transition-colors cursor-pointer ${
                            !n.is_read
                              ? 'bg-amber-50/60 hover:bg-amber-100/50'
                              : isTargetForMe
                              ? 'bg-teal-subtle/20 hover:bg-teal-subtle/30'
                              : 'hover:bg-slate-50 opacity-80'
                          }`}
                        >
                          <div className="font-semibold text-slate-900 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              {!n.is_read && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-teal font-mono">{n.related_id}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                          <div className="flex items-center justify-between pt-1.5 text-[10px] text-slate-400">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase text-slate-600">
                              Target: {n.target_role}
                            </span>
                            <span className="text-teal font-semibold flex items-center gap-1">
                              <span>Open Stage</span>
                              <span>→</span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="bg-slate-50 p-2 text-center border-t border-slate-200">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-semibold text-teal hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={() => {
              if (window.confirm("Reset demo database to fresh initial state?")) {
                onResetDemo();
              }
            }}
            disabled={isResetting}
            className="p-2 rounded-xl bg-navy-deep border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition"
            title="Reset Demo Data to Initial Clean State"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-teal' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher Bar */}
      <div className="lg:hidden bg-navy-deep px-2 py-1.5 flex items-center overflow-x-auto gap-1 border-t border-white/5">
        {ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => onRoleChange(r.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${
              currentRole === r.id ? 'bg-teal text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </header>
  );
};
