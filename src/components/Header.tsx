/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventPlan } from '../types/event';
import { Calendar, Users, MapPin, Sliders, CheckCircle2, Printer, Sparkles, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeEvent: EventPlan;
  onOpenSimulator: () => void;
  onOpenDiagnostics: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  privacyMask: boolean;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeEvent,
  onOpenSimulator,
  onOpenDiagnostics,
  onToggleCopilot,
  isCopilotOpen,
  privacyMask,
  onExport,
}) => {
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
    <header className="fixed top-0 left-0 lg:left-[250px] right-0 h-16 bg-[#ffffff]/95 backdrop-blur border-b border-[#e5ddcf] z-40 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_1px_8px_rgba(255,94,20,0.04)]">
      {/* Event Title & Festive Badges */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <h1 className="text-base sm:text-lg font-bold text-[#18122b] truncate font-headline" title={activeEvent.title}>
          {activeEvent.title}
        </h1>

        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#b45309]" />
          <span>{dateFormatted} • {diffDays} Days Left</span>
        </span>

        <span className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fff1eb] text-[#c2410c] border border-[#fed7aa] text-xs font-semibold truncate max-w-[210px]">
          <MapPin className="w-3.5 h-3.5 text-[#ff5e14]" />
          <span className="truncate">{activeEvent.location}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-xs font-bold shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>{activeEvent.guestCount} Guests</span>
        </span>

        {privacyMask && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#9f1239] border border-[#fecdd3] text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>₹ Masked</span>
          </span>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSimulator}
          aria-label="Open What-If Guest & Budget Simulator"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5ddcf] bg-[#ffffff] text-[#18122b] text-xs font-semibold hover:bg-[#fff1eb] hover:border-[#ff5e14]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5e14]"
        >
          <Sliders className="w-3.5 h-3.5 text-[#ff5e14]" />
          <span>Simulator</span>
        </button>

        <button
          type="button"
          onClick={onOpenDiagnostics}
          aria-label="Run automated unit and integration self-tests"
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5ddcf] bg-[#ffffff] text-[#18122b] text-xs font-semibold hover:bg-[#d1fae5] hover:border-[#10b981]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#10b981]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00875a]" />
          <span>Self-Tests</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          aria-label="Export or print event summary report"
          className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5ddcf] bg-[#ffffff] text-[#18122b] text-xs font-semibold hover:bg-[#f8f4ed] transition-colors focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
        >
          <Printer className="w-3.5 h-3.5 text-[#544c60]" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onToggleCopilot}
          aria-label={isCopilotOpen ? 'Close AI Co-Pilot drawer' : 'Open AI Co-Pilot drawer'}
          className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
            isCopilotOpen
              ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-sm'
              : 'bg-[#fff1eb] text-[#c2410c] hover:bg-[#fed7aa] border border-[#fed7aa]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-[#ff8a00]" />
          <span>AI Co-Pilot</span>
        </button>

        <div
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff5e14] via-[#ec4899] to-[#7c3aed] text-white flex items-center justify-center font-bold text-xs shadow-xs"
          title="Celebration Director Account"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
