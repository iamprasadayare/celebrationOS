/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetItem, BudgetSummary, BudgetCategorySummary } from '../types/event';

/**
 * Calculates deterministic budget aggregations, category breakdowns, variance status, and reserve health.
 * LLM math is NEVER used for financial calculations.
 */
export function calculateBudgetSummary(
  items: BudgetItem[],
  baselineBudgetCap: number
): BudgetSummary {
  let totalAllocated = 0;
  let totalQuotedOrActual = 0;
  let totalPaid = 0;

  const categoryMap = new Map<string, {
    allocated: number;
    quotedOrActual: number;
    paid: number;
    count: number;
  }>();

  for (const item of items) {
    totalAllocated += item.allocated;
    totalQuotedOrActual += item.quotedOrActual;
    totalPaid += item.paid;

    const existing = categoryMap.get(item.category) || {
      allocated: 0,
      quotedOrActual: 0,
      paid: 0,
      count: 0,
    };

    existing.allocated += item.allocated;
    existing.quotedOrActual += item.quotedOrActual;
    existing.paid += item.paid;
    existing.count += 1;
    categoryMap.set(item.category, existing);
  }

  const categories: BudgetCategorySummary[] = [];
  const overrunCategories: string[] = [];

  categoryMap.forEach((val, category) => {
    const variance = val.allocated - val.quotedOrActual;
    let status: 'under_budget' | 'on_cap' | 'over_budget' = 'on_cap';
    if (variance > 0) {
      status = 'under_budget';
    } else if (variance < 0) {
      status = 'over_budget';
      overrunCategories.push(category);
    }

    categories.push({
      category,
      allocated: Math.round(val.allocated * 100) / 100,
      quotedOrActual: Math.round(val.quotedOrActual * 100) / 100,
      paid: Math.round(val.paid * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      status,
      itemCount: val.count,
    });
  });

  const unallocatedReserve = Math.max(0, baselineBudgetCap - totalQuotedOrActual);
  const netConsolidatedSurplus = totalAllocated - totalQuotedOrActual;
  const isOverBudget = totalQuotedOrActual > baselineBudgetCap;

  const percentConsumed = baselineBudgetCap > 0
    ? Math.min(100, Math.round((totalQuotedOrActual / baselineBudgetCap) * 1000) / 10)
    : 0;

  const percentReserveSafe = baselineBudgetCap > 0
    ? Math.max(0, Math.round((unallocatedReserve / baselineBudgetCap) * 1000) / 10)
    : 0;

  return {
    totalBudgetCap: Math.round(baselineBudgetCap * 100) / 100,
    totalAllocated: Math.round(totalAllocated * 100) / 100,
    totalQuotedOrActual: Math.round(totalQuotedOrActual * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    unallocatedReserve: Math.round(unallocatedReserve * 100) / 100,
    netConsolidatedSurplus: Math.round(netConsolidatedSurplus * 100) / 100,
    percentConsumed,
    percentReserveSafe,
    isOverBudget,
    categories,
    overrunCategories,
  };
}

/**
 * Deterministically scales budget items based on guest count variations.
 * Uses each item's perHeadScalingRatio (e.g. 0.9 for catering/bar, 0.1 for fixed venue)
 * so fixed expenses are protected while variable per-head costs dynamically adjust.
 */
export function scaleBudgetByGuestCount(
  items: BudgetItem[],
  originalGuests: number,
  newGuests: number
): BudgetItem[] {
  if (originalGuests <= 0 || newGuests <= 0) return items;
  const guestRatio = newGuests / originalGuests;

  return items.map((item) => {
    const elasticity = item.perHeadScalingRatio !== undefined ? item.perHeadScalingRatio : 0.5;
    // Scale variable portion by guest ratio, keep fixed portion unchanged
    const variablePortionAllocated = item.allocated * elasticity;
    const fixedPortionAllocated = item.allocated * (1 - elasticity);
    const scaledAllocated = Math.round(fixedPortionAllocated + variablePortionAllocated * guestRatio);

    const variablePortionActual = item.quotedOrActual * elasticity;
    const fixedPortionActual = item.quotedOrActual * (1 - elasticity);
    const scaledActual = Math.round(fixedPortionActual + variablePortionActual * guestRatio);

    let status: 'under_budget' | 'on_cap' | 'over_budget' = 'on_cap';
    if (scaledAllocated > scaledActual) {
      status = 'under_budget';
    } else if (scaledAllocated < scaledActual) {
      status = 'over_budget';
    }

    return {
      ...item,
      allocated: scaledAllocated,
      quotedOrActual: scaledActual,
      status,
    };
  });
}

/**
 * Returns any category names currently exceeding their allocated financial cap.
 */
export function detectCategoryOverruns(summary: BudgetSummary): string[] {
  return summary.overrunCategories;
}

/**
 * Formats a currency number cleanly with privacy masking support.
 */
export function formatCurrency(
  amount: number,
  currencySymbol = '$',
  isMasked = false
): string {
  if (isMasked) {
    return '••••••';
  }
  return `${currencySymbol}${Math.abs(amount).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
}
