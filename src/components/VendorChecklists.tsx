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
  currencySymbol,
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
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between">
      <div>
        {/* Header & AI Inquiry Draft */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e] font-headline">
              Vendor Checklists & Deliverables
            </h2>
            <p className="text-xs text-[#464554] mt-0.5">
              Contract execution, payment milestones, and safety verifications
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenEmailDrafter()}
            aria-label="Launch AI Vendor Inquiry & Negotiation Email Drafter"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] shrink-0 self-start sm:self-auto border border-[#c7c4d7]"
          >
            <Mail className="w-4 h-4 text-[#4338ca]" />
            <span>AI Draft Inquiry</span>
          </button>
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {vendors.map((vendor) => {
            return (
              <article
                key={vendor.id}
                className="p-3.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 className="text-xs font-bold text-[#131b2e] leading-tight font-headline">
                      {vendor.name}
                    </h3>
                    <span className="font-mono-data text-[11px] font-bold text-[#4338ca] shrink-0">
                      {formatCurrency(vendor.capAmount, currencySymbol, privacyMask)} Cap
                    </span>
                  </div>
                  <p className="text-[11px] text-[#464554] mt-0.5">
                    {vendor.serviceCategory}
                  </p>
                </div>

                {/* Sub-checklists */}
                <div className="mt-3 flex flex-col gap-1.5 text-[11px]">
                  {vendor.checklist.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => onToggleChecklistItem(vendor.id, item.id)}
                        aria-label={`Toggle ${item.label} for ${vendor.name}`}
                        className="flex items-center gap-1.5 text-left group hover:opacity-90 transition-opacity"
                      >
                        {item.completed ? (
                          <span className="flex items-center gap-1.5 text-[#006c4e] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[#873b00] font-semibold">
                            <Clock className="w-3.5 h-3.5 shrink-0 text-[#632900]" />
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
      <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-[#464554] text-xs">
        <span className="font-medium">Overall Verification Readiness</span>
        <span className="font-mono-data font-bold text-[#006c4e] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{clearedChecks} of {totalChecks} Checks Cleared ({readinessPercent}%)</span>
        </span>
      </div>
    </div>
  );
};
