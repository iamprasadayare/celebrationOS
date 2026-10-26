/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { EventPlan, UserProfile } from '../types/event';
import {
  Calendar,
  Users,
  MapPin,
  Sliders,
  CheckCircle2,
  Printer,
  Sparkles,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Mail,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  activeEvent: EventPlan;
  onOpenSimulator: () => void;
  onOpenDiagnostics: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  privacyMask: boolean;
  onExport: () => void;
  user?: UserProfile | null;
  onOpenSignInModal: () => void;
  onSignOut: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeEvent,
  onOpenSimulator,
  onOpenDiagnostics,
  onToggleCopilot,
  isCopilotOpen,
  privacyMask,
  onExport,
  user,
  onOpenSignInModal,
  onSignOut,
  theme = 'light',
  onToggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  // Format event date
  const eventDate = new Date(activeEvent.targetDate);
  const now = new Date();
  const diffDays = Math.max(0, Math.round((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const dateFormatted = eventDate.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="fixed top-0 left-0 lg:left-[250px] right-0 h-16 bg-[#ffffff]/95 dark:bg-[#120e22]/95 backdrop-blur border-b border-[#e5ddcf] dark:border-[#2d2442] z-40 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 shadow-[0_1px_8px_rgba(255,94,20,0.04)]">
      {/* Event Title & Festive Badges */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#18122b] dark:text-[#f5f3ff] truncate font-headline" title={activeEvent.title}>
          {activeEvent.title}
        </h1>

        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef3c7] dark:bg-[#451a03] text-[#92400e] dark:text-[#fde68a] border border-[#fde68a] dark:border-[#78350f] text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#b45309] dark:text-[#f59e0b]" />
          <span>{dateFormatted} • {diffDays} Days Left</span>
        </span>

        <span className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fff1eb] dark:bg-[#3d1704] text-[#c2410c] dark:text-[#ffbc99] border border-[#fed7aa] dark:border-[#7c2d12] text-xs font-semibold truncate max-w-[210px]">
          <MapPin className="w-3.5 h-3.5 text-[#ff5e14]" />
          <span className="truncate">{activeEvent.location}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d1fae5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] border border-[#a7f3d0] dark:border-[#047857] text-xs font-bold shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>{activeEvent.guestCount} Guests</span>
        </span>

        {privacyMask && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffe4e6] dark:bg-[#4c0519] text-[#9f1239] dark:text-[#fecdd3] border border-[#fecdd3] dark:border-[#9f1239] text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>₹ Masked</span>
          </span>
        )}
      </div>

      {/* Action Controls & Google User Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 h-9 w-9 flex items-center justify-center rounded-xl border border-[#e5ddcf] dark:border-[#382d54] bg-[#ffffff] dark:bg-[#1a142c] text-[#544c60] dark:text-[#c4b5fd] hover:text-[#ff5e14] dark:hover:text-[#ff8a00] hover:bg-[#fff1eb] dark:hover:bg-[#281f3d] transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shadow-xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#f59e0b]" />
          ) : (
            <Moon className="w-4 h-4 text-[#6d28d9]" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSimulator}
          aria-label="Open What-If Guest & Budget Simulator"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#e5ddcf] dark:border-[#382d54] bg-[#ffffff] dark:bg-[#1a142c] text-[#18122b] dark:text-[#f5f3ff] text-xs font-semibold hover:bg-[#fff1eb] dark:hover:bg-[#281f3d] hover:border-[#ff5e14]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5e14]"
        >
          <Sliders className="w-3.5 h-3.5 text-[#ff5e14]" />
          <span>Simulator</span>
        </button>

        <button
          type="button"
          onClick={onOpenDiagnostics}
          aria-label="Run automated unit and integration self-tests"
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#e5ddcf] dark:border-[#382d54] bg-[#ffffff] dark:bg-[#1a142c] text-[#18122b] dark:text-[#f5f3ff] text-xs font-semibold hover:bg-[#d1fae5] dark:hover:bg-[#064e3b] hover:border-[#10b981]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#10b981]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00875a] dark:text-[#10b981]" />
          <span>Self-Tests</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          aria-label="Export or print event summary report"
          className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#e5ddcf] dark:border-[#382d54] bg-[#ffffff] dark:bg-[#1a142c] text-[#18122b] dark:text-[#f5f3ff] text-xs font-semibold hover:bg-[#f8f4ed] dark:hover:bg-[#281f3d] transition-colors focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
        >
          <Printer className="w-3.5 h-3.5 text-[#544c60] dark:text-[#c4b5fd]" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onToggleCopilot}
          aria-label={isCopilotOpen ? 'Close AI Co-Pilot drawer' : 'Open AI Co-Pilot drawer'}
          className={`inline-flex items-center gap-1.5 h-9 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
            isCopilotOpen
              ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-sm'
              : 'bg-[#fff1eb] dark:bg-[#3d1704] text-[#c2410c] dark:text-[#ffbc99] hover:bg-[#fed7aa] dark:hover:bg-[#521e06] border border-[#fed7aa] dark:border-[#7c2d12]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-[#ff8a00]" />
          <span className="hidden sm:inline">AI Co-Pilot</span>
        </button>

        {/* GOOGLE SIGN IN BUTTON / USER PROFILE DROPDOWN */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="User Account Menu"
              aria-expanded={isMenuOpen}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-[#eedfd6] dark:border-[#382d54] bg-white dark:bg-[#1a142c] hover:bg-[#fbf9f5] dark:hover:bg-[#281f3d] transition-all shadow-xs"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#e5ddcf]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff5e14] to-[#6d28d9] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden md:inline text-xs font-bold text-[#1f2421] max-w-[110px] truncate">
                {user.name}
              </span>
              <span title="Verified Google Account">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00875a]" />
              </span>
              <ChevronDown className="w-3 h-3 text-[#6e726e]" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#eedfd6] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f3eae4]">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#e5ddcf]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff5e14] to-[#6d28d9] text-white flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1f2421] dark:text-[#f5f3ff] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#6e726e] dark:text-[#a8a1b7] truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#ff5e14]" />
                      <span>{user.email}</span>
                    </p>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] px-1 py-1 rounded bg-[#fbf9f5] dark:bg-[#120e22]">
                    <span className="text-[#6e726e] dark:text-[#a8a1b7]">Role:</span>
                    <span className="font-semibold text-[#c2410c] dark:text-[#ffbc99]">{user.role || 'Host Lead'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] px-1 py-1">
                    <span className="text-[#6e726e] dark:text-[#a8a1b7]">Status:</span>
                    <span className="text-[#00875a] dark:text-[#10b981] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00875a] dark:bg-[#10b981] animate-pulse" />
                      Google Connected
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f3eae4] dark:border-[#2d2442] space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSignInModal();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#1f2421] dark:text-[#f5f3ff] hover:bg-[#fbf9f5] dark:hover:bg-[#281f3d] transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#ff5e14]" />
                    <span>Switch / Re-authenticate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#b91c1c] dark:text-[#fb7185] hover:bg-[#fef2f2] dark:hover:bg-[#4c0519] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* OFFICIAL "SIGN IN WITH GOOGLE" BUTTON */
          <button
            type="button"
            onClick={onOpenSignInModal}
            aria-label="Sign in with Google or Gmail account"
            className="inline-flex items-center gap-2 h-9 px-3 sm:px-3.5 rounded-xl border border-[#eedfd6] dark:border-[#382d54] bg-white dark:bg-[#1a142c] hover:bg-[#fbf9f5] dark:hover:bg-[#281f3d] text-[#1f2421] dark:text-[#f5f3ff] text-xs font-bold transition-all shadow-xs hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#4285F4]"
          >
            {/* Google Multi-Color G Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
};
