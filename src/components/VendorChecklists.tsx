/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VendorChecklistCard } from '../types/event';
import { formatCurrency } from '../utils/budgetMath';
import {
  Mail,
  CheckCircle2,
  Clock,
  Info,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface VendorChecklistsProps {
  vendors: VendorChecklistCard[];
  currencySymbol: string;
  privacyMask: boolean;
  onOpenEmailDrafter: (vendor?: VendorChecklistCard) => void;
  onToggleChecklistItem: (vendorId: string, itemId: string) => void;
}

export const VendorChecklists: React.FC<VendorChecklistsProps> = ({
  vendors,
  currencySymbol = '₹',
  privacyMask,
  onOpenEmailDrafter,
  onToggleChecklistItem,
}) => {
  // Compute overall due-diligence check completion
  let totalChecks = 0;
  let clearedChecks = 0;

  vendors.forEach((v) => {
    v.checklist.forEach((item) => {
      totalChecks += 1;
      if (item.completed) clearedChecks += 1;
    });
  });

  const readinessPercent = totalChecks > 0 ? Math.round((clearedChecks / totalChecks) * 100) : 100;

  return (
    <div className="bg-[#ffffff] dark:bg-[#151024] p-4 sm:p-6 rounded-2xl border border-[#e5ddcf] dark:border-[#2d2442] shadow-[0_2px_12px_rgba(255,94,20,0.03)] flex flex-col justify-between w-full">
      <div>
        {/* Header & AI Inquiry Draft */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0eae1] dark:border-[#2d2442]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#18122b] dark:text-[#f5f3ff] font-headline">
                Vendor Checklists & Deliverables
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d1fae5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] font-bold text-xs border border-[#a7f3d0] dark:border-[#047857]">
                {readinessPercent}% Verified
              </span>
            </div>
            <p className="text-xs text-[#544c60] dark:text-[#a8a1b7] mt-0.5">
              Contract execution, payment milestones, FSSAI compliance, and sound curfew verifications
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenEmailDrafter()}
            aria-label="Launch AI Vendor Inquiry & Negotiation Email Drafter"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#fff1eb] to-[#fef3c7] dark:from-[#3d1704] dark:to-[#451a03] hover:from-[#fed7aa] hover:to-[#fde68a] text-[#c2410c] dark:text-[#ffbc99] border border-[#fed7aa] dark:border-[#7c2d12] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shrink-0 self-start sm:self-auto shadow-xs"
          >
            <Mail className="w-4 h-4 text-[#ff5e14]" />
            <span>AI Draft Terms</span>
          </button>
        </div>

        {/* Expanded Vendor Cards Grid (Full Width & Spacious) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {vendors.map((vendor) => {
            return (
              <article
                key={vendor.id}
                className="p-4 rounded-xl bg-[#f8f4ed] dark:bg-[#1a142c] border border-[#e5ddcf] dark:border-[#2d2442] flex flex-col justify-between hover:border-[#fed7aa] dark:hover:border-[#7c2d12] transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 className="text-sm font-bold text-[#18122b] dark:text-[#f5f3ff] leading-tight font-headline">
                      {vendor.name}
                    </h3>
                    <span className="font-mono-data text-[11px] font-bold text-[#6d28d9] dark:text-[#c4b5fd] shrink-0 bg-[#ede9fe] dark:bg-[#2e1065] px-2 py-0.5 rounded-full border border-[#ddd6fe] dark:border-[#581c87]">
                      {formatCurrency(vendor.capAmount, currencySymbol, privacyMask)} Cap
                    </span>
                  </div>
                  <p className="text-xs text-[#544c60] dark:text-[#a8a1b7] mt-0.5 font-medium">
                    {vendor.serviceCategory}
                  </p>
                </div>

                {/* Sub-checklists */}
                <div className="mt-4 flex flex-col gap-2 text-xs">
                  {vendor.checklist.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => onToggleChecklistItem(vendor.id, item.id)}
                        aria-label={`Toggle ${item.label} for ${vendor.name}`}
                        className="flex items-center gap-2 text-left group hover:opacity-90 transition-opacity p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#140e22]"
                      >
                        {item.completed ? (
                          <span className="flex items-center gap-1.5 text-[#00875a] dark:text-[#10b981] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#059669] dark:text-[#10b981]" />
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[#c2410c] dark:text-[#ffbc99] font-bold">
                            <Clock className="w-3.5 h-3.5 shrink-0 text-[#ff5e14]" />
                            <span>{item.label}</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer Readiness */}
      <div className="mt-4 pt-3 border-t border-[#f0eae1] flex items-center justify-between text-[#544c60] text-xs">
        <span className="font-semibold">Overall Verification Readiness</span>
        <span className="font-mono-data font-bold text-[#00875a] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          <span>{clearedChecks} of {totalChecks} Checks Cleared ({readinessPercent}%)</span>
        </span>
      </div>
    </div>
  );
};
