/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EventPlan, EventType } from '../types/event';
import {
  Sparkles,
  X,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Heart,
  PartyPopper,
  Users2,
} from 'lucide-react';

interface NewEventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventPlan) => void;
}

export const NewEventWizardModal: React.FC<NewEventWizardModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [targetDate, setTargetDate] = useState('2026-11-20');
  const [guestCount, setGuestCount] = useState(150);
  const [budgetCap, setBudgetCap] = useState(20000);
  const [customVision, setCustomVision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI synthesis delay
    await new Promise((r) => setTimeout(r, 600));

    const finalTitle = title.trim() || (eventType === 'wedding' ? 'Kavya & Rohan’s Wedding' : eventType === 'birthday' ? 'Leo’s 40th Gala' : 'Oakridge Neighborhood Fair');
    const finalLocation = location.trim() || 'Heritage Waterfront Pavilion';

    // Generate comprehensive synchronized event plan
    const newPlan: EventPlan = {
      id: `evt_custom_${Date.now()}`,
      type: eventType,
      title: finalTitle,
      targetDate,
      location: finalLocation,
      guestCount: Number(guestCount),
      baselineBudgetCap: Number(budgetCap),
      currencySymbol: '$',
      contextNote: customVision.trim() || 'Custom celebratory experience orchestrated with CelebrationOS AI.',
      budgetItems: [
        {
          id: `b_new_1`,
          category: 'Venue & Facilities',
          name: `${finalLocation} Grand Hall`,
          allocated: Math.round(budgetCap * 0.35),
          quotedOrActual: Math.round(budgetCap * 0.34),
          paid: Math.round(budgetCap * 0.15),
          status: 'under_budget',
          perHeadScalingRatio: 0.1,
        },
        {
          id: `b_new_2`,
          category: 'Catering & Bar',
          name: 'Artisan Banquet & Specialty Beverage Service',
          allocated: Math.round(budgetCap * 0.32),
          quotedOrActual: Math.round(budgetCap * 0.33),
          paid: Math.round(budgetCap * 0.1),
          status: 'over_budget',
          perHeadScalingRatio: 0.95,
        },
        {
          id: `b_new_3`,
          category: 'Decor & Florals',
          name: 'Custom Themed Staging & Lighting',
          allocated: Math.round(budgetCap * 0.16),
          quotedOrActual: Math.round(budgetCap * 0.15),
          paid: Math.round(budgetCap * 0.05),
          status: 'under_budget',
          perHeadScalingRatio: 0.3,
        },
        {
          id: `b_new_4`,
          category: 'Entertainment & Production',
          name: 'Live Music Ensemble & Master of Ceremonies',
          allocated: Math.round(budgetCap * 0.12),
          quotedOrActual: Math.round(budgetCap * 0.11),
          paid: Math.round(budgetCap * 0.08),
          status: 'under_budget',
          perHeadScalingRatio: 0.1,
        },
        {
          id: `b_new_5`,
          category: 'Logistics & Guest Experience',
          name: 'Welcome Signage, Favors & Shuttles',
          allocated: Math.round(budgetCap * 0.05),
          quotedOrActual: Math.round(budgetCap * 0.05),
          paid: 0,
          status: 'on_cap',
          perHeadScalingRatio: 0.7,
        },
      ],
      timelineTasks: [
        {
          id: `t_new_1`,
          title: `Reserve ${finalLocation} & Submit Initial Deposit`,
          phase: '3_months_out',
          daysBeforeEvent: 90,
          priority: 'high',
          completed: true,
          assignedVendorOrLead: 'Venue Director',
        },
        {
          id: `t_new_2`,
          title: 'Approve Food & Tasting Menu with Caterer',
          phase: '1_month_out',
          daysBeforeEvent: 45,
          priority: 'high',
          completed: false,
          assignedVendorOrLead: 'Lead Chef',
        },
        {
          id: `t_new_3`,
          title: 'Review Production & Sound Layout Walkthrough',
          phase: '1_month_out',
          daysBeforeEvent: 30,
          priority: 'medium',
          completed: false,
          assignedVendorOrLead: 'AV Team',
        },
        {
          id: `t_new_4`,
          title: 'Lock Final Headcount & Table Chart',
          phase: 'week_of',
          daysBeforeEvent: 10,
          priority: 'high',
          completed: false,
          assignedVendorOrLead: 'Host Lead',
        },
        {
          id: `t_new_5`,
          title: 'Event Kickoff & Guest Welcome Doors Open',
          phase: 'day_of',
          daysBeforeEvent: 0,
          dueTimeOfDay: '05:00 PM',
          priority: 'high',
          completed: false,
          assignedVendorOrLead: 'Stage Lead',
        },
      ],
      vendors: [
        {
          id: `v_new_1`,
          name: `${finalLocation} Operations`,
          serviceCategory: 'Venue & Facilities',
          capAmount: Math.round(budgetCap * 0.35),
          depositAmount: Math.round(budgetCap * 0.15),
          paidAmount: Math.round(budgetCap * 0.15),
          status: 'booked',
          complianceCertified: true,
          checklist: [
            { id: 'vc_n1_1', label: 'Contract Executed', completed: true, type: 'contract' },
            { id: 'vc_n1_2', label: 'Deposit Paid', completed: true, type: 'deposit' },
            { id: 'vc_n1_3', label: 'Sound Curfew Verified', completed: true, type: 'safety_or_backup' },
          ],
        },
        {
          id: `v_new_2`,
          name: 'Gourmet Artisans Culinary',
          serviceCategory: 'Catering & Beverage',
          capAmount: Math.round(budgetCap * 0.32),
          depositAmount: Math.round(budgetCap * 0.1),
          paidAmount: Math.round(budgetCap * 0.1),
          status: 'booked',
          complianceCertified: true,
          checklist: [
            { id: 'vc_n2_1', label: 'Menu Signed', completed: true, type: 'contract' },
            { id: 'vc_n2_2', label: 'Dietary Plan Confirmed', completed: false, type: 'custom' },
          ],
        },
      ],
      personalizedIdeas: [
        {
          id: `idea_new_1`,
          title: 'Interactive Guest Welcome Wall',
          category: 'theme_decor',
          tags: ['Personalized', 'Photo Moment'],
          description: 'A custom entrance display inviting each attendee to sign and discover table allocations.',
          costImpactDollars: -250,
          impactSummary: 'Impact: -$250 decor savings',
          applied: false,
        },
        {
          id: `idea_new_2`,
          title: 'Zero-Waste Locally Sourced Favors',
          category: 'cost_eco_swaps',
          tags: ['Eco-Friendly', 'Artisanal'],
          description: 'Miniature locally made organic honey or flower seed packets in recycled jute pouches.',
          costImpactDollars: -150,
          impactSummary: 'Impact: -$150 favor savings',
          applied: false,
        },
      ],
    };

    setIsGenerating(false);
    onCreateEvent(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#c7c4d7] shadow-xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#131b2e] font-headline">
                New Event Wizard with AI
              </h2>
              <p className="text-xs text-[#464554]">
                Generate a synchronized Budget, Timeline, Vendor checklist, and Ideas Studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#464554] hover:text-[#131b2e] p-1 rounded hover:bg-[#f2f3ff]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          {/* Event Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-2">Event Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEventType('wedding')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  eventType === 'wedding'
                    ? 'border-[#4338ca] bg-[#e2e7ff] text-[#4338ca] font-bold shadow-xs'
                    : 'border-[#c7c4d7] hover:bg-[#f2f3ff] text-[#464554]'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="text-xs">Wedding</span>
              </button>
              <button
                type="button"
                onClick={() => setEventType('birthday')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  eventType === 'birthday'
                    ? 'border-[#4338ca] bg-[#e2e7ff] text-[#4338ca] font-bold shadow-xs'
                    : 'border-[#c7c4d7] hover:bg-[#f2f3ff] text-[#464554]'
                }`}
              >
                <PartyPopper className="w-5 h-5" />
                <span className="text-xs">Milestone Birthday</span>
              </button>
              <button
                type="button"
                onClick={() => setEventType('community')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  eventType === 'community'
                    ? 'border-[#4338ca] bg-[#e2e7ff] text-[#4338ca] font-bold shadow-xs'
                    : 'border-[#c7c4d7] hover:bg-[#f2f3ff] text-[#464554]'
                }`}
              >
                <Users2 className="w-5 h-5" />
                <span className="text-xs">Community / Fest</span>
              </button>
            </div>
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={eventType === 'wedding' ? "e.g. Liam & Chloe's Coastal Wedding" : "e.g. Jordan's 40th Rooftop Soiree"}
                className="w-full h-10 px-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">Target Location / Venue</label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#464554] absolute left-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Carmel Valley Estate, CA"
                  className="w-full h-10 pl-8 pr-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Date, Guests, Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">Event Date</label>
              <div className="relative flex items-center">
                <Calendar className="w-3.5 h-3.5 text-[#464554] absolute left-3" />
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-10 pl-8 pr-2 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">Expected Guests</label>
              <div className="relative flex items-center">
                <Users className="w-3.5 h-3.5 text-[#464554] absolute left-3" />
                <input
                  type="number"
                  min={10}
                  max={2000}
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-10 pl-8 pr-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">Budget Cap ($)</label>
              <div className="relative flex items-center">
                <DollarSign className="w-3.5 h-3.5 text-[#464554] absolute left-3" />
                <input
                  type="number"
                  min={1000}
                  step={500}
                  required
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  className="w-full h-10 pl-8 pr-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Custom Vision Prompt */}
          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Custom Vision & Priorities (Optional)
            </label>
            <textarea
              rows={2}
              value={customVision}
              onChange={(e) => setCustomVision(e.target.value)}
              placeholder="e.g. Sunset outdoor cocktail hour, sustainable plant-based menu, live jazz trio, zero-waste focus."
              className="w-full p-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-[#c7c4d7] text-xs font-medium text-[#464554] hover:bg-[#f2f3ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 h-9 px-5 rounded-lg bg-[#4338ca] hover:bg-[#372abf] text-white text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#4338ca] shadow-xs disabled:opacity-60"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Orchestrating Event Plan...' : 'Generate Plan with AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
