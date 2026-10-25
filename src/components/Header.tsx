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
  const dateFormatted = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="fixed top-0 left-0 lg:left-[250px] right-0 h-16 bg-[#ffffff]/95 backdrop-blur border-b border-[#c7c4d7] z-40 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Event Title & Key Badges */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <h1 className="text-base sm:text-lg font-bold text-[#131b2e] truncate" title={activeEvent.title}>
          {activeEvent.title}
        </h1>

        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f3ff] text-[#464554] text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#4338ca]" />
          <span>{dateFormatted} • {diffDays} Days Left</span>
        </span>

        <span className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f3ff] text-[#464554] text-xs font-medium truncate max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 text-[#4338ca]" />
          <span className="truncate">{activeEvent.location}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#97f5cc] text-[#00513a] text-xs font-semibold shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>{activeEvent.guestCount} Guests</span>
        </span>

        {privacyMask && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdbca] text-[#632900] text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>Masked</span>
          </span>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSimulator}
          aria-label="Open What-If Guest & Budget Simulator"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#c7c4d7] bg-[#ffffff] text-[#131b2e] text-xs font-medium hover:bg-[#f2f3ff] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
        >
          <Sliders className="w-3.5 h-3.5 text-[#4338ca]" />
          <span>Simulator</span>
        </button>

        <button
          type="button"
          onClick={onOpenDiagnostics}
          aria-label="Run automated unit and integration self-tests"
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#c7c4d7] bg-[#ffffff] text-[#131b2e] text-xs font-medium hover:bg-[#f2f3ff] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#006c4e]" />
          <span>Self-Tests</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          aria-label="Export or print event summary report"
          className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#c7c4d7] bg-[#ffffff] text-[#131b2e] text-xs font-medium hover:bg-[#f2f3ff] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
        >
          <Printer className="w-3.5 h-3.5 text-[#464554]" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onToggleCopilot}
          aria-label={isCopilotOpen ? 'Close AI Co-Pilot drawer' : 'Open AI Co-Pilot drawer'}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
            isCopilotOpen
              ? 'bg-[#4338ca] text-white shadow-sm'
              : 'bg-[#e2e7ff] text-[#2a14b4] hover:bg-[#dae2fd]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#006c4e] animate-pulse" />
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Co-Pilot</span>
        </button>

        <div
          className="w-8 h-8 rounded-full bg-[#2a14b4] text-white flex items-center justify-center font-bold text-xs shadow-xs"
          title="Celebration Director Account"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
