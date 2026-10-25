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
  const [guestCount, setGuestCount] = useState(250);
  const [budgetCap, setBudgetCap] = useState(2500000); // ₹25 Lakhs
  const [customVision, setCustomVision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI synthesis delay
    await new Promise((r) => setTimeout(r, 600));

    const finalTitle = title.trim() || (eventType === 'wedding' ? 'Kavya & Rohan’s Shaadi' : eventType === 'birthday' ? 'Aarav’s 25th Milestone Birthday' : 'Bengaluru Community Utsav');
    const finalLocation = location.trim() || 'Royal Orchid Palace, Jaipur';

    // Generate comprehensive synchronized event plan in INR (₹)
    const newPlan: EventPlan = {
      id: `evt_custom_${Date.now()}`,
      type: eventType,
      title: finalTitle,
      targetDate,
      location: finalLocation,
      guestCount: Number(guestCount),
      baselineBudgetCap: Number(budgetCap),
      currencySymbol: '₹',
      contextNote: customVision.trim() || 'Custom celebratory experience orchestrated with CelebrationOS AI.',
      budgetItems: [
        {
          id: `b_new_1`,
          category: 'Venue & Facilities',
          name: `${finalLocation} Courtyard & Grand Lawn`,
          allocated: Math.round(budgetCap * 0.35),
          quotedOrActual: Math.round(budgetCap * 0.34),
          paid: Math.round(budgetCap * 0.15),
          status: 'under_budget',
          perHeadScalingRatio: 0.1,
        },
        {
          id: `b_new_2`,
          category: 'Catering & Bar',
          name: 'Royal Banquet & Live Chaat Counter',
          allocated: Math.round(budgetCap * 0.32),
          quotedOrActual: Math.round(budgetCap * 0.33),
          paid: Math.round(budgetCap * 0.1),
          status: 'over_budget',
          perHeadScalingRatio: 0.95,
        },
        {
          id: `b_new_3`,
          category: 'Decor & Florals',
          name: 'Floral Mandap & Marigold Staging',
          allocated: Math.round(budgetCap * 0.16),
          quotedOrActual: Math.round(budgetCap * 0.15),
          paid: Math.round(budgetCap * 0.05),
          status: 'under_budget',
          perHeadScalingRatio: 0.3,
        },
        {
          id: `b_new_4`,
          category: 'Entertainment & Production',
          name: 'Dhol Troupe, DJ & Sangeet Sound Truss',
          allocated: Math.round(budgetCap * 0.12),
          quotedOrActual: Math.round(budgetCap * 0.11),
          paid: Math.round(budgetCap * 0.08),
          status: 'under_budget',
          perHeadScalingRatio: 0.1,
        },
        {
          id: `b_new_5`,
          category: 'Logistics & Guest Experience',
          name: 'Mithai Gift Hampers & AC Shuttles',
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
          title: 'Approve Banquet Food & Chaat Tasting Menu',
          phase: '1_month_out',
          daysBeforeEvent: 45,
          priority: 'high',
          completed: false,
          assignedVendorOrLead: 'Lead Caterer',
        },
        {
          id: `t_new_3`,
          title: 'Review Sangeet Light & Dance Floor Acoustics',
          phase: '1_month_out',
          daysBeforeEvent: 30,
          priority: 'medium',
          completed: false,
          assignedVendorOrLead: 'AV Team',
        },
        {
          id: `t_new_4`,
          title: 'Lock Final Headcount & Seating Chart',
          phase: 'week_of',
          daysBeforeEvent: 10,
          priority: 'high',
          completed: false,
          assignedVendorOrLead: 'Host Lead',
        },
        {
          id: `t_new_5`,
          title: 'Baraat Arrival & Guest Welcome Doors Open',
          phase: 'day_of',
          daysBeforeEvent: 0,
          dueTimeOfDay: '04:30 PM',
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
            { id: 'vc_n1_3', label: 'Sound Curfew Verified (10 PM)', completed: true, type: 'safety_or_backup' },
          ],
        },
        {
          id: `v_new_2`,
          name: 'Shree Krishna Caterers',
          serviceCategory: 'Catering & Beverage',
          capAmount: Math.round(budgetCap * 0.32),
          depositAmount: Math.round(budgetCap * 0.1),
          paidAmount: Math.round(budgetCap * 0.1),
          status: 'booked',
          complianceCertified: true,
          checklist: [
            { id: 'vc_n2_1', label: 'Menu Signed', completed: true, type: 'contract' },
            { id: 'vc_n2_2', label: 'Jain/Vegan Diet Counter Confirmed', completed: false, type: 'custom' },
          ],
        },
      ],
      personalizedIdeas: [
        {
          id: `idea_new_1`,
          title: 'Traditional Floral Rangoli Entrance',
          category: 'theme_decor',
          tags: ['Saffron & Marigold', 'Heritage'],
          description: 'A grand petal floor welcome with brass urlis and floating diya lights.',
          costImpactDollars: -25000,
          impactSummary: 'Impact: -₹25,000 decor savings',
          applied: false,
        },
        {
          id: `idea_new_2`,
          title: 'Artisanal Clay Matka Chilled Thandai Bar',
          category: 'food_beverage',
          tags: ['Traditional Eco', 'Crowd Favorite'],
          description: 'Refreshing kesar thandai and spiced buttermilk served in biodegradable earthen kulhads.',
          costImpactDollars: 15000,
          impactSummary: 'Impact: +₹15,000 welcome drink add-on',
          applied: false,
        },
      ],
    };

    setIsGenerating(false);
    onCreateEvent(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18122b]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e5ddcf] shadow-xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff5e14] to-[#7c3aed] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#18122b] font-headline">
                New Event Wizard with AI (₹ INR)
              </h2>
              <p className="text-xs text-[#544c60]">
                Generate a synchronized Budget, Timeline, Vendor checklist, and Ideas Studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#544c60] hover:text-[#18122b] p-1 rounded-lg hover:bg-[#fff1eb]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          {/* Event Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-[#18122b] mb-2">Event Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEventType('wedding')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  eventType === 'wedding'
                    ? 'border-[#ff5e14] bg-[#fff1eb] text-[#c2410c] font-bold shadow-xs'
                    : 'border-[#e5ddcf] hover:bg-[#f8f4ed] text-[#544c60]'
                }`}
              >
                <Heart className="w-5 h-5 text-[#ff5e14]" />
                <span className="text-xs">Shaadi / Wedding</span>
              </button>
              <button
                type="button"
                onClick={() => setEventType('birthday')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  eventType === 'birthday'
                    ? 'border-[#ec4899] bg-[#ffe4e6] text-[#9f1239] font-bold shadow-xs'
                    : 'border-[#e5ddcf] hover:bg-[#f8f4ed] text-[#544c60]'
                }`}
              >
                <PartyPopper className="w-5 h-5 text-[#ec4899]" />
                <span className="text-xs">Milestone Birthday</span>
              </button>
              <button
                type="button"
                onClick={() => setEventType('community')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  eventType === 'community'
                    ? 'border-[#00875a] bg-[#d1fae5] text-[#065f46] font-bold shadow-xs'
                    : 'border-[#e5ddcf] hover:bg-[#f8f4ed] text-[#544c60]'
                }`}
              >
                <Users2 className="w-5 h-5 text-[#00875a]" />
                <span className="text-xs">Community Utsav</span>
              </button>
            </div>
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18122b] mb-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={eventType === 'wedding' ? "e.g. Liam & Chloe's Shaadi" : "e.g. Rajiv's 50th Birthday Bash"}
                className="w-full h-10 px-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18122b] mb-1">Target Location / City</label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#ff5e14] absolute left-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Oberoi Udaivilas, Udaipur"
                  className="w-full h-10 pl-8 pr-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Date, Guests, Budget in INR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18122b] mb-1">Event Date</label>
              <div className="relative flex items-center">
                <Calendar className="w-3.5 h-3.5 text-[#ff5e14] absolute left-3" />
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-10 pl-8 pr-2 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none bg-white font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18122b] mb-1">Expected Guests</label>
              <div className="relative flex items-center">
                <Users className="w-3.5 h-3.5 text-[#ff5e14] absolute left-3" />
                <input
                  type="number"
                  min={10}
                  max={5000}
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-10 pl-8 pr-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18122b] mb-1">Budget Cap (₹ INR)</label>
              <div className="relative flex items-center">
                <span className="font-bold text-[#ff5e14] absolute left-3 text-sm">₹</span>
                <input
                  type="number"
                  min={10000}
                  step={50000}
                  required
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  className="w-full h-10 pl-7 pr-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data font-bold"
                />
              </div>
            </div>
          </div>

          {/* Custom Vision Prompt */}
          <div>
            <label className="block text-xs font-bold text-[#18122b] mb-1">
              Custom Vision & Priorities (Optional)
            </label>
            <textarea
              rows={2}
              value={customVision}
              onChange={(e) => setCustomVision(e.target.value)}
              placeholder="e.g. Sangeet with live dhol, Rajasthani royal buffet, organic marigold decor, zero-waste favors."
              className="w-full p-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0eae1]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-[#e5ddcf] text-xs font-semibold text-[#544c60] hover:bg-[#f8f4ed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] hover:from-[#ea580c] hover:to-[#f97316] text-white text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shadow-xs disabled:opacity-60"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Orchestrating Plan...' : 'Generate Plan with AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
