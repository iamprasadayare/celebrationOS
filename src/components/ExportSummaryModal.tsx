/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EventPlan, BudgetSummary } from '../types/event';
import { formatCurrency } from '../utils/budgetMath';
import { Printer, Copy, Check, X, FileText } from 'lucide-react';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: EventPlan;
  budgetSummary: BudgetSummary;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  budgetSummary,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    title: activeEvent.title,
    eventType: activeEvent.type,
    targetDate: activeEvent.targetDate,
    location: activeEvent.location,
    guestCount: activeEvent.guestCount,
    budget: {
      cap: budgetSummary.totalBudgetCap,
      allocated: budgetSummary.totalAllocated,
      actual: budgetSummary.totalQuotedOrActual,
      unallocatedReserve: budgetSummary.unallocatedReserve,
      netSurplus: budgetSummary.netConsolidatedSurplus,
      items: activeEvent.budgetItems.map((i) => ({
        category: i.category,
        name: i.name,
        allocated: i.allocated,
        actual: i.quotedOrActual,
        paid: i.paid,
      })),
    },
    timelineTasks: activeEvent.timelineTasks.map((t) => ({
      title: t.title,
      phase: t.phase,
      daysBeforeEvent: t.daysBeforeEvent,
      completed: t.completed,
      priority: t.priority,
    })),
    vendors: activeEvent.vendors.map((v) => ({
      name: v.name,
      service: v.serviceCategory,
      cap: v.capAmount,
      status: v.status,
    })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1b4b]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#eedfd6] shadow-2xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3eae4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6d28d9] to-[#ff5e14] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f2421] font-headline">
                Export Event Dossier
              </h2>
              <p className="text-xs text-[#6e726e]">
                Executive summary for family elders, committee leads, and wedding planners.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#6e726e] hover:text-[#1f2421] p-1.5 rounded-lg hover:bg-[#fbf9f5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-[#fbf9f5] p-4 rounded-xl border border-[#eedfd6]">
            <h3 className="text-sm font-bold text-[#1f2421]">{activeEvent.title}</h3>
            <p className="text-xs text-[#6e726e] mt-1">
              {activeEvent.location} • {activeEvent.targetDate} • {activeEvent.guestCount} Confirmed Guests
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#eedfd6] text-xs">
              <span>Budget Cap: <strong className="text-[#1f2421]">{formatCurrency(budgetSummary.totalBudgetCap, activeEvent.currencySymbol)}</strong></span>
              <span>Committed: <strong className="text-[#6d28d9]">{formatCurrency(budgetSummary.totalQuotedOrActual, activeEvent.currencySymbol)}</strong></span>
              <span className="text-[#00875a]">Reserve: <strong>{formatCurrency(budgetSummary.unallocatedReserve, activeEvent.currencySymbol)}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2421] mb-1">JSON Structured Export</label>
            <textarea
              readOnly
              rows={8}
              value={jsonString}
              className="w-full p-3 text-xs rounded-xl border border-[#eedfd6] bg-[#fbf9f5] font-mono-data text-[#1f2421] resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#f3eae4]">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#eedfd6] text-xs font-semibold text-[#1f2421] hover:bg-[#fbf9f5] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#ff5e14]" />
            <span>Print View</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[#eedfd6] text-xs font-semibold text-[#6e726e] hover:bg-[#fbf9f5] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#5b21b6] hover:to-[#6d28d9] text-white text-xs font-semibold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#86efac]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
