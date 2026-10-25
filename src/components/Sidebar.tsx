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
      className="fixed left-0 top-0 h-full w-[250px] bg-[#ffffff] border-r border-[#e5ddcf] z-50 flex flex-col justify-between overflow-y-auto shadow-[2px_0_12px_rgba(255,94,20,0.03)]"
    >
      <div className="flex flex-col">
        {/* Brand Header with Trending Saffron to Violet Gradient */}
        <div className="h-16 px-4 border-b border-[#e5ddcf] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff5e14] via-[#ec4899] to-[#7c3aed] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-[#6d28d9] via-[#ec4899] to-[#ff5e14] bg-clip-text text-transparent tracking-tight font-headline">
              CelebrationOS
            </span>
          </div>
          <button
            type="button"
            aria-label="Collapse navigation"
            className="text-[#544c60] hover:text-[#18122b] p-1 rounded hover:bg-[#fff1eb] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5e14]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-3">
          <p className="px-1 mb-1.5 text-[11px] uppercase text-[#544c60] tracking-wider font-bold">
            Active Event Mode
          </p>
          <div
            role="radiogroup"
            aria-label="Event Type Switcher"
            className="grid grid-cols-3 gap-1 p-1 bg-[#f8f4ed] rounded-xl border border-[#e5ddcf]"
          >
            <button
              type="button"
              role="radio"
              aria-checked={activeEvent.type === 'wedding'}
              onClick={() => onSelectEventType('wedding')}
              className={`py-1 text-center text-xs rounded-lg transition-all font-bold ${
                activeEvent.type === 'wedding'
                  ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                  : 'text-[#544c60] hover:text-[#18122b] hover:bg-[#fff1eb]'
              }`}
            >
              Shaadi
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={activeEvent.type === 'birthday'}
              onClick={() => onSelectEventType('birthday')}
              className={`py-1 text-center text-xs rounded-lg transition-all font-bold ${
                activeEvent.type === 'birthday'
                  ? 'bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white shadow-xs'
                  : 'text-[#544c60] hover:text-[#18122b] hover:bg-[#ffe4e6]'
              }`}
            >
              B'day
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={activeEvent.type === 'community'}
              onClick={() => onSelectEventType('community')}
              className={`py-1 text-center text-xs rounded-lg transition-all font-bold ${
                activeEvent.type === 'community'
                  ? 'bg-gradient-to-r from-[#00875a] to-[#10b981] text-white shadow-xs'
                  : 'text-[#544c60] hover:text-[#18122b] hover:bg-[#d1fae5]'
              }`}
            >
              Utsav
            </button>
          </div>

          {/* Quick Active Event Info Card */}
          <div className="mt-2.5 px-3 py-2 rounded-xl bg-gradient-to-br from-[#fff1eb] to-[#fef3c7] border border-[#fed7aa] flex items-center gap-2.5">
            {activeEvent.type === 'wedding' && <Heart className="w-4 h-4 text-[#e11d48] shrink-0" />}
            {activeEvent.type === 'birthday' && <PartyPopper className="w-4 h-4 text-[#ec4899] shrink-0" />}
            {activeEvent.type === 'community' && <Users2 className="w-4 h-4 text-[#00875a] shrink-0" />}
            <div className="truncate">
              <p className="text-xs text-[#18122b] font-bold truncate">{activeEvent.title}</p>
              <p className="text-[11px] text-[#544c60] truncate">{activeEvent.guestCount} Confirmed Guests</p>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Primary Navigation" className="px-3 mt-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-2.5" />
            <span>Overview Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('budget')}
            className={`w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
              activeTab === 'budget'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            <Wallet className="w-4 h-4 mr-2.5" />
            <span>Budget & Kharcha</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('timeline')}
            className={`w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            <Clock className="w-4 h-4 mr-2.5" />
            <span>Timeline & Run-Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('vendors')}
            className={`w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
              activeTab === 'vendors'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            <CheckSquare className="w-4 h-4 mr-2.5" />
            <span>Vendor Checklists</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('ideas')}
            className={`w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
              activeTab === 'ideas'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            <Palette className="w-4 h-4 mr-2.5" />
            <span>Personalized Ideas Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('diagnostics')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
              activeTab === 'diagnostics'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2.5" />
              <span>Diagnostics</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] text-[10px] font-bold border border-[#a7f3d0]">
              12/12
            </span>
          </button>
        </nav>
      </div>

      {/* Footer Settings & New Event Button with Popping Saffron */}
      <div className="p-3 border-t border-[#e5ddcf] flex flex-col gap-2.5 bg-[#ffffff]">
        <div className="flex items-center justify-between px-1">
          <label
            htmlFor="high-contrast-toggle"
            className="text-xs text-[#544c60] flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <span>Contrast AA</span>
          </label>
          <input
            id="high-contrast-toggle"
            type="checkbox"
            checked={highContrast}
            onChange={onToggleHighContrast}
            aria-label="Toggle High Contrast AA Accessibility Mode"
            className="w-4 h-4 rounded text-[#ff5e14] focus:ring-[#ff5e14] cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <label
            htmlFor="privacy-mask-toggle"
            className="text-xs text-[#544c60] flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            {privacyMask ? <EyeOff className="w-3.5 h-3.5 text-[#ff5e14]" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Privacy Mask (₹)</span>
          </label>
          <input
            id="privacy-mask-toggle"
            type="checkbox"
            checked={privacyMask}
            onChange={onTogglePrivacyMask}
            aria-label="Toggle Privacy Mask for financial screen-sharing"
            className="w-4 h-4 rounded text-[#ff5e14] focus:ring-[#ff5e14] cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={onOpenNewEventWizard}
          aria-label="Launch AI New Event Creation Wizard"
          className="w-full mt-1 flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-gradient-to-r from-[#ff5e14] via-[#ff7a00] to-[#ffa000] hover:from-[#ea580c] hover:to-[#f97316] text-white text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shadow-[0_2px_10px_rgba(255,94,20,0.3)] active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Event Wizard</span>
        </button>
      </div>
    </aside>
  );
};
