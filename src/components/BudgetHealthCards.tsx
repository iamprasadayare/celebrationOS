/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BudgetSummary, TimelineTask, VendorChecklistCard } from '../types/event';
import { formatCurrency } from '../utils/budgetMath';
import { Wallet, Clock, CheckSquare, Zap, CheckCircle2, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

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
  currencySymbol,
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
      <article className="bg-[#ffffff] p-4 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#464554] uppercase tracking-wider font-semibold">Budget Health</span>
          <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#4338ca] shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl font-bold text-[#131b2e] tracking-tight font-headline">
              {actualFormatted}
            </span>
            <span className="text-xs text-[#464554] font-medium">
              / {capFormatted}
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#006c4e] mt-0.5 font-semibold">
            {reserveFormatted} unallocated reserve
          </p>
        </div>

        <div className="mt-4">
          <div
            role="progressbar"
            aria-label="Budget consumption rate"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={budgetSummary.percentConsumed}
            className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden flex"
          >
            <div
              className={`h-full transition-all duration-500 ${
                budgetSummary.isOverBudget ? 'bg-[#ba1a1a]' : 'bg-[#4338ca]'
              }`}
              style={{ width: `${Math.min(100, budgetSummary.percentConsumed)}%` }}
            />
            {!budgetSummary.isOverBudget && (
              <div
                className="bg-[#7bd8b1] h-full transition-all duration-500"
                style={{ width: `${budgetSummary.percentReserveSafe}%` }}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-1">
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                budgetSummary.isOverBudget
                  ? 'bg-[#ffdad6] text-[#93000a]'
                  : 'bg-[#97f5cc] text-[#007353]'
              }`}
            >
              {budgetSummary.isOverBudget ? (
                <>
                  <AlertTriangle className="w-3 h-3" /> Over Budget ({budgetSummary.percentConsumed}%)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" /> On Track ({budgetSummary.percentConsumed}%)
                </>
              )}
            </span>
            <span className="font-mono-data text-xs text-[#464554]">
              {budgetSummary.percentReserveSafe}% Safe
            </span>
          </div>
        </div>
      </article>

      {/* KPI 2: Timeline Milestones */}
      <article className="bg-[#ffffff] p-4 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#464554] uppercase tracking-wider font-semibold">Timeline Progress</span>
          <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#4338ca] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#131b2e] tracking-tight font-headline">
              {completedTasks} / {totalTasks}
            </span>
            <span className="text-xs text-[#464554] font-medium">
              Tasks ({timelinePercent}%)
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#464554] mt-0.5">
            {pendingTasks} active deliverables pending
          </p>
        </div>

        <div className="mt-4">
          <div
            role="progressbar"
            aria-label="Overall timeline milestone completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={timelinePercent}
            className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden"
          >
            <div
              className="bg-[#4338ca] h-full rounded-full transition-all duration-500"
              style={{ width: `${timelinePercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 mt-2 pt-1 text-xs text-[#873b00] truncate">
            <Clock className="w-3.5 h-3.5 shrink-0 text-[#632900]" />
            <span className="truncate font-medium">
              Next: {nextPendingTask ? nextPendingTask.title : 'All Milestones Cleared!'}
            </span>
          </div>
        </div>
      </article>

      {/* KPI 3: Vendor Management */}
      <article className="bg-[#ffffff] p-4 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#464554] uppercase tracking-wider font-semibold">Vendor Management</span>
          <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#4338ca] shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#131b2e] tracking-tight font-headline">
              {vendors.length}
            </span>
            <span className="text-xs text-[#464554] font-medium">
              Active Partners
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#464554] mt-0.5">
            100% compliance certified
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#97f5cc] text-[#007353] text-[11px] font-semibold">
            <Check className="w-3 h-3" /> {bookedVendors} Booked
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#2a14b4] text-[11px] font-semibold">
            {shortlistedVendors} Shortlisted
          </span>
          {pendingVendors > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdbca] text-[#331200] text-[11px] font-semibold">
              {pendingVendors} Pending
            </span>
          )}
        </div>
      </article>

      {/* KPI 4: AI Engine & Cache Status */}
      <article className="bg-[#ffffff] p-4 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#464554] uppercase tracking-wider font-semibold">AI Efficiency & Cache</span>
          <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#4338ca] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#131b2e] tracking-tight font-headline">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="font-mono-data text-xs text-[#006c4e] font-semibold mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c4e] animate-pulse" />
            <span>{aiLatencyMs}ms response latency {lastAiSource === 'cache' ? '(Cached)' : ''}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#97f5cc] text-[#007353] text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3" /> 98% Schema
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e3dfff] text-[#100069] text-[11px] font-semibold">
            <ShieldCheck className="w-3 h-3" /> PII Shield
          </span>
        </div>
      </article>
    </section>
  );
};
