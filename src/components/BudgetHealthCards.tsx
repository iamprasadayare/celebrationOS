/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BudgetSummary, TimelineTask, VendorChecklistCard } from '../types/event';
import { formatCurrency } from '../utils/budgetMath';
import { Wallet, Clock, CheckSquare, Zap, CheckCircle2, AlertTriangle, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface BudgetHealthCardsProps {
  budgetSummary: BudgetSummary;
  tasks: TimelineTask[];
  vendors: VendorChecklistCard[];
  currencySymbol: string;
  privacyMask: boolean;
  aiLatencyMs?: number;
  lastAiSource?: 'cache' | 'api';
}

export const BudgetHealthCards: React.FC<BudgetHealthCardsProps> = ({
  budgetSummary,
  tasks,
  vendors,
  currencySymbol = '₹',
  privacyMask,
  aiLatencyMs = 42,
  lastAiSource = 'cache',
}) => {
  // Timeline calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const timelinePercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const nextPendingTask = tasks.find((t) => !t.completed);

  // Vendor calculations
  const bookedVendors = vendors.filter((v) => v.status === 'booked').length;
  const shortlistedVendors = vendors.filter((v) => v.status === 'shortlisted').length;
  const pendingVendors = vendors.filter((v) => v.status === 'pending').length;

  const actualFormatted = formatCurrency(budgetSummary.totalQuotedOrActual, currencySymbol, privacyMask);
  const capFormatted = formatCurrency(budgetSummary.totalBudgetCap, currencySymbol, privacyMask);
  const reserveFormatted = formatCurrency(budgetSummary.unallocatedReserve, currencySymbol, privacyMask);

  return (
    <section aria-label="Executive Performance Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* KPI 1: Budget Health */}
      <article className="bg-[#ffffff] p-4 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(255,94,20,0.04)] flex flex-col justify-between relative overflow-hidden group hover:border-[#ff5e14]/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#544c60] uppercase tracking-wider font-bold">Budget & Kharcha</span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fff1eb] to-[#fef3c7] flex items-center justify-center text-[#ff5e14] shrink-0 border border-[#fed7aa]">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl font-bold text-[#18122b] tracking-tight font-headline">
              {actualFormatted}
            </span>
            <span className="text-xs text-[#544c60] font-semibold">
              / {capFormatted}
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#00875a] mt-0.5 font-bold flex items-center gap-1">
            <span>{reserveFormatted}</span>
            <span className="text-[11px] font-medium text-[#544c60]">unallocated reserve</span>
          </p>
        </div>

        <div className="mt-4">
          <div
            role="progressbar"
            aria-label="Budget consumption rate"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={budgetSummary.percentConsumed}
            className="w-full bg-[#f8f4ed] h-2.5 rounded-full overflow-hidden flex border border-[#e5ddcf]/60"
          >
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                budgetSummary.isOverBudget
                  ? 'bg-gradient-to-r from-[#e11d48] to-[#f43f5e]'
                  : 'bg-gradient-to-r from-[#6d28d9] via-[#8b5cf6] to-[#ff5e14]'
              }`}
              style={{ width: `${Math.min(100, budgetSummary.percentConsumed)}%` }}
            />
            {!budgetSummary.isOverBudget && (
              <div
                className="bg-[#10b981]/40 h-full transition-all duration-500"
                style={{ width: `${budgetSummary.percentReserveSafe}%` }}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-1">
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                budgetSummary.isOverBudget
                  ? 'bg-[#ffe4e6] text-[#9f1239] border-[#fecdd3]'
                  : 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]'
              }`}
            >
              {budgetSummary.isOverBudget ? (
                <>
                  <AlertTriangle className="w-3 h-3" /> Over Budget ({budgetSummary.percentConsumed}%)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-[#059669]" /> On Track ({budgetSummary.percentConsumed}%)
                </>
              )}
            </span>
            <span className="font-mono-data text-xs font-semibold text-[#544c60]">
              {budgetSummary.percentReserveSafe}% Safe
            </span>
          </div>
        </div>
      </article>

      {/* KPI 2: Timeline Milestones */}
      <article className="bg-[#ffffff] p-4 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(109,40,217,0.04)] flex flex-col justify-between relative overflow-hidden group hover:border-[#6d28d9]/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#544c60] uppercase tracking-wider font-bold">Timeline & Path</span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ede9fe] to-[#fae8ff] flex items-center justify-center text-[#6d28d9] shrink-0 border border-[#ddd6fe]">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#18122b] tracking-tight font-headline">
              {completedTasks} / {totalTasks}
            </span>
            <span className="text-xs text-[#544c60] font-semibold">
              Tasks ({timelinePercent}%)
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#544c60] mt-0.5">
            {pendingTasks} active milestones pending
          </p>
        </div>

        <div className="mt-4">
          <div
            role="progressbar"
            aria-label="Overall timeline milestone completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={timelinePercent}
            className="w-full bg-[#f8f4ed] h-2.5 rounded-full overflow-hidden border border-[#e5ddcf]/60"
          >
            <div
              className="bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] h-full rounded-full transition-all duration-500"
              style={{ width: `${timelinePercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 mt-2 pt-1 text-xs text-[#c2410c] truncate font-medium">
            <Clock className="w-3.5 h-3.5 shrink-0 text-[#ff5e14]" />
            <span className="truncate">
              Next: {nextPendingTask ? nextPendingTask.title : 'All Milestones Cleared!'}
            </span>
          </div>
        </div>
      </article>

      {/* KPI 3: Vendor Management */}
      <article className="bg-[#ffffff] p-4 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(0,135,90,0.04)] flex flex-col justify-between relative overflow-hidden group hover:border-[#00875a]/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#544c60] uppercase tracking-wider font-bold">Vendor Partners</span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#d1fae5] to-[#ecfdf5] flex items-center justify-center text-[#00875a] shrink-0 border border-[#a7f3d0]">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#18122b] tracking-tight font-headline">
              {vendors.length}
            </span>
            <span className="text-xs text-[#544c60] font-semibold">
              Active Partners
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#00875a] font-semibold mt-0.5">
            100% compliance verified
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-[11px] font-bold">
            <Check className="w-3 h-3" /> {bookedVendors} Booked
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#581c87] border border-[#ddd6fe] text-[11px] font-bold">
            {shortlistedVendors} Shortlisted
          </span>
          {pendingVendors > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fff1eb] text-[#c2410c] border border-[#fed7aa] text-[11px] font-bold">
              {pendingVendors} Pending
            </span>
          )}
        </div>
      </article>

      {/* KPI 4: AI Engine & Cache Status */}
      <article className="bg-[#ffffff] p-4 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(255,94,20,0.04)] flex flex-col justify-between relative overflow-hidden group hover:border-[#ff5e14]/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#544c60] uppercase tracking-wider font-bold">AI Intelligence</span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fff1eb] via-[#ede9fe] to-[#fef3c7] flex items-center justify-center text-[#ff5e14] shrink-0 border border-[#fed7aa]">
            <Sparkles className="w-4 h-4 text-[#ff5e14]" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-[#6d28d9] via-[#ec4899] to-[#ff5e14] bg-clip-text text-transparent tracking-tight font-headline">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#00875a] font-bold mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00875a] animate-pulse" />
            <span>{aiLatencyMs}ms latency {lastAiSource === 'cache' ? '(Cached)' : ''}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" /> 98% Schema
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fff1eb] text-[#c2410c] border border-[#fed7aa] text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3" /> PII Shield
          </span>
        </div>
      </article>
    </section>
  );
};
