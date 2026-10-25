/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventPlan, EventType } from '../types/event';
import {
  Sparkles,
  LayoutDashboard,
  Wallet,
  Clock,
  CheckSquare,
  Palette,
  ShieldCheck,
  Eye,
  EyeOff,
  Plus,
  Heart,
  PartyPopper,
  Users2,
  ChevronLeft,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'ideas'
  | 'diagnostics';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeEvent: EventPlan;
  onSelectEventType: (type: EventType) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  privacyMask: boolean;
  onTogglePrivacyMask: () => void;
  onOpenNewEventWizard: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeEvent,
  onSelectEventType,
  highContrast,
  onToggleHighContrast,
  privacyMask,
  onTogglePrivacyMask,
  onOpenNewEventWizard,
}) => {
  return (
    <aside
      aria-label="Application Navigation"
      className="fixed left-0 top-0 h-full w-[250px] bg-[#ffffff] border-r border-[#c7c4d7] z-50 flex flex-col justify-between overflow-y-auto"
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[#c7c4d7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-[#4338ca] tracking-tight">
              CelebrationOS
            </span>
          </div>
          <button
            type="button"
            aria-label="Collapse navigation"
            className="text-[#464554] hover:text-[#131b2e] p-1 rounded hover:bg-[#f2f3ff] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-3">
          <p className="px-1 mb-1.5 text-[11px] uppercase text-[#464554] tracking-wider font-semibold">
            Active Event Mode
          </p>
          <div
            role="radiogroup"
            aria-label="Event Type Switcher"
            className="grid grid-cols-3 gap-1 p-1 bg-[#f2f3ff] rounded-lg"
          >
            <button
              type="button"
              role="radio"
              aria-checked={activeEvent.type === 'wedding'}
              onClick={() => onSelectEventType('wedding')}
              className={`py-1 text-center text-xs rounded transition-all font-semibold ${
                activeEvent.type === 'wedding'
                  ? 'bg-white text-[#2a14b4] font-bold shadow-xs'
                  : 'text-[#464554] hover:text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              Wed
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={activeEvent.type === 'birthday'}
              onClick={() => onSelectEventType('birthday')}
              className={`py-1 text-center text-xs rounded transition-all font-semibold ${
                activeEvent.type === 'birthday'
                  ? 'bg-white text-[#2a14b4] font-bold shadow-xs'
                  : 'text-[#464554] hover:text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              B'day
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={activeEvent.type === 'community'}
              onClick={() => onSelectEventType('community')}
              className={`py-1 text-center text-xs rounded transition-all font-semibold ${
                activeEvent.type === 'community'
                  ? 'bg-white text-[#2a14b4] font-bold shadow-xs'
                  : 'text-[#464554] hover:text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              Public
            </button>
          </div>

          {/* Quick Active Event Info Card */}
          <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] flex items-center gap-2.5">
            {activeEvent.type === 'wedding' && <Heart className="w-4 h-4 text-[#4338ca] shrink-0" />}
            {activeEvent.type === 'birthday' && <PartyPopper className="w-4 h-4 text-[#873b00] shrink-0" />}
            {activeEvent.type === 'community' && <Users2 className="w-4 h-4 text-[#006c4e] shrink-0" />}
            <div className="truncate">
              <p className="text-xs text-[#131b2e] font-bold truncate">{activeEvent.title}</p>
              <p className="text-[11px] text-[#464554] truncate">{activeEvent.guestCount} Confirmed Guests</p>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Primary Navigation" className="px-3 mt-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
              activeTab === 'overview'
                ? 'bg-[#4338ca] text-white shadow-xs'
                : 'text-[#464554] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-2.5" />
            <span>Overview Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('budget')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
              activeTab === 'budget'
                ? 'bg-[#4338ca] text-white shadow-xs'
                : 'text-[#464554] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <Wallet className="w-4 h-4 mr-2.5" />
            <span>Budget Tracker</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('timeline')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
              activeTab === 'timeline'
                ? 'bg-[#4338ca] text-white shadow-xs'
                : 'text-[#464554] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <Clock className="w-4 h-4 mr-2.5" />
            <span>Timeline & Run-Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('vendors')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
              activeTab === 'vendors'
                ? 'bg-[#4338ca] text-white shadow-xs'
                : 'text-[#464554] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <CheckSquare className="w-4 h-4 mr-2.5" />
            <span>Vendor Checklists</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('ideas')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
              activeTab === 'ideas'
                ? 'bg-[#4338ca] text-white shadow-xs'
                : 'text-[#464554] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <Palette className="w-4 h-4 mr-2.5" />
            <span>Personalized Ideas Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('diagnostics')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
              activeTab === 'diagnostics'
                ? 'bg-[#4338ca] text-white shadow-xs'
                : 'text-[#464554] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2.5" />
              <span>Diagnostics</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-[#97f5cc] text-[#00513a] text-[10px] font-bold">
              12/12
            </span>
          </button>
        </nav>
      </div>

      {/* Footer Settings & New Event Button */}
      <div className="p-3 border-t border-[#c7c4d7] flex flex-col gap-2.5 bg-white">
        <div className="flex items-center justify-between px-1">
          <label
            htmlFor="high-contrast-toggle"
            className="text-xs text-[#464554] flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <span>Contrast AA</span>
          </label>
          <input
            id="high-contrast-toggle"
            type="checkbox"
            checked={highContrast}
            onChange={onToggleHighContrast}
            aria-label="Toggle High Contrast AA Accessibility Mode"
            className="w-4 h-4 rounded text-[#4338ca] focus:ring-[#4338ca] cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <label
            htmlFor="privacy-mask-toggle"
            className="text-xs text-[#464554] flex items-center gap-1.5 cursor-pointer font-medium"
          >
            {privacyMask ? <EyeOff className="w-3.5 h-3.5 text-[#632900]" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Privacy Mask</span>
          </label>
          <input
            id="privacy-mask-toggle"
            type="checkbox"
            checked={privacyMask}
            onChange={onTogglePrivacyMask}
            aria-label="Toggle Privacy Mask for financial screen-sharing"
            className="w-4 h-4 rounded text-[#4338ca] focus:ring-[#4338ca] cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={onOpenNewEventWizard}
          aria-label="Launch AI New Event Creation Wizard"
          className="w-full mt-1 flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#372abf] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Event Wizard</span>
        </button>
      </div>
    </aside>
  );
};
