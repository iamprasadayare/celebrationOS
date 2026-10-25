/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EventPlan, BudgetItem } from '../types/event';
import { scaleBudgetByGuestCount, calculateBudgetSummary, formatCurrency } from '../utils/budgetMath';
import {
  Sliders,
  Users,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';

interface GuestSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: EventPlan;
  onApplySimulatedBudget: (scaledItems: BudgetItem[], newGuestCount: number) => void;
  privacyMask: boolean;
}

export const GuestSimulatorModal: React.FC<GuestSimulatorModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  onApplySimulatedBudget,
  privacyMask,
}) => {
  const [simulatedGuests, setSimulatedGuests] = useState<number>(activeEvent.guestCount);

  if (!isOpen) return null;

  const scaledItems = scaleBudgetByGuestCount(
    activeEvent.budgetItems,
    activeEvent.guestCount,
    simulatedGuests
  );

  const originalSummary = calculateBudgetSummary(activeEvent.budgetItems, activeEvent.baselineBudgetCap);
  const simulatedSummary = calculateBudgetSummary(scaledItems, activeEvent.baselineBudgetCap);
  const costDiff = simulatedSummary.totalQuotedOrActual - originalSummary.totalQuotedOrActual;

  const handleApply = () => {
    onApplySimulatedBudget(scaledItems, simulatedGuests);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1b4b]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#eedfd6] shadow-2xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3eae4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6d28d9] to-[#ff5e14] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f2421] font-headline">
                What-If Guest Count & Budget Simulator
              </h2>
              <p className="text-xs text-[#6e726e]">
                Pure deterministic elasticity calculations protecting fixed venue caps.
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

        {/* Guest Count Slider */}
        <div className="mt-4 p-4 bg-[#fbf9f5] rounded-xl border border-[#eedfd6] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1f2421] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#ff5e14]" />
              <span>Simulated Guest Count:</span>
            </span>
            <span className="text-base font-bold text-[#6d28d9] font-mono-data bg-[#f4effe] px-2.5 py-0.5 rounded-md border border-[#ddd6fe]">
              {simulatedGuests} Guests
            </span>
          </div>

          <input
            type="range"
            min={20}
            max={600}
            step={5}
            value={simulatedGuests}
            onChange={(e) => setSimulatedGuests(Number(e.target.value))}
            aria-label="Simulated guest count slider"
            className="w-full accent-[#ff5e14] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-[#6e726e]">
            <span>Intimate (20)</span>
            <span className="font-semibold text-[#1f2421]">Current: {activeEvent.guestCount}</span>
            <span>Grand Utsav (600)</span>
          </div>
        </div>

        {/* Delta Summary Comparison */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-[#fbf9f5] rounded-xl border border-[#eedfd6] shadow-xs">
            <span className="text-[11px] text-[#6e726e] uppercase tracking-wider font-semibold">Baseline Actual</span>
            <p className="text-lg font-bold text-[#1f2421] font-mono-data mt-1">
              {formatCurrency(originalSummary.totalQuotedOrActual, activeEvent.currencySymbol, privacyMask)}
            </p>
            <span className="text-[11px] text-[#6e726e]">
              {activeEvent.guestCount} Confirmed Guests
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#eedfd6] shadow-xs">
            <span className="text-[11px] text-[#6e726e] uppercase tracking-wider font-semibold">Simulated Forecast</span>
            <p className={`text-lg font-bold font-mono-data mt-1 ${
              costDiff > 0 ? 'text-[#b91c1c]' : costDiff < 0 ? 'text-[#00875a]' : 'text-[#1f2421]'
            }`}>
              {formatCurrency(simulatedSummary.totalQuotedOrActual, activeEvent.currencySymbol, privacyMask)}
            </p>
            <span className="text-[11px] flex items-center gap-1 font-semibold">
              {costDiff > 0 ? (
                <span className="text-[#b91c1c] flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{formatCurrency(costDiff, activeEvent.currencySymbol, privacyMask)} variance
                </span>
              ) : costDiff < 0 ? (
                <span className="text-[#00875a] flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> -{formatCurrency(Math.abs(costDiff), activeEvent.currencySymbol, privacyMask)} savings
                </span>
              ) : (
                <span className="text-[#6e726e]">Identical guest count</span>
              )}
            </span>
          </div>
        </div>

        {/* Category Breakdown Delta Table */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-[#1f2421] mb-2 font-headline">Category Sensitivity Matrix</h4>
          <div className="border border-[#eedfd6] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#fbf9f5] text-[#1f2421] text-[11px] border-b border-[#eedfd6]">
                <tr>
                  <th scope="col" className="py-2.5 px-3 font-semibold">Category</th>
                  <th scope="col" className="py-2.5 px-3 text-right font-semibold">Elasticity</th>
                  <th scope="col" className="py-2.5 px-3 text-right font-semibold">Original</th>
                  <th scope="col" className="py-2.5 px-3 text-right font-semibold">Scaled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3eae4]">
                {scaledItems.map((item, idx) => {
                  const orig = activeEvent.budgetItems[idx];
                  const ratio = item.perHeadScalingRatio !== undefined ? item.perHeadScalingRatio : 0.5;

                  return (
                    <tr key={item.id} className="hover:bg-[#fbf9f5]/70 transition-colors">
                      <td className="py-2 px-3 font-medium text-[#1f2421]">{item.name}</td>
                      <td className="py-2 px-3 text-right text-[11px] text-[#6e726e]">
                        {ratio >= 0.8 ? 'High (Variable)' : ratio <= 0.2 ? 'Fixed (Low)' : 'Moderate'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono-data text-[#6e726e]">
                        {formatCurrency(orig.quotedOrActual, activeEvent.currencySymbol, privacyMask)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono-data font-bold text-[#1f2421]">
                        {formatCurrency(item.quotedOrActual, activeEvent.currencySymbol, privacyMask)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f3eae4]">
          <span className="text-[11px] text-[#6e726e] flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#ff5e14]" />
            <span>Deterministic pure math calculations</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[#eedfd6] text-xs font-semibold text-[#6e726e] hover:bg-[#fbf9f5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#5b21b6] hover:to-[#6d28d9] text-white text-xs font-semibold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Scaled Budget</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
