/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TimelineTask, TaskBucket } from '../types/event';

/**
 * Computes a calendar due date from the master event date and an integer offset.
 * Positive daysBeforeEvent indicates days before event.
 * Offset 0 indicates day of event.
 */
export function computeTaskDueDate(
  eventDateStr: string,
  daysBeforeEvent: number,
  currentSimulatedDate?: Date
): { formattedDate: string; daysRemaining: number; isOverdue: boolean; isoDate: string } {
  const eventDate = new Date(eventDateStr);
  const targetTime = eventDate.getTime() - daysBeforeEvent * 24 * 60 * 60 * 1000;
  const dueDate = new Date(targetTime);

  const referenceDate = currentSimulatedDate || new Date();
  // Normalize dates to midnight for consistent day-diff calculation
  const dueMidnight = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()).getTime();

  const diffMs = dueMidnight - refMidnight;
  const daysRemaining = Math.round(diffMs / (24 * 60 * 60 * 1000));
  const isOverdue = daysRemaining < 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
  const isoDate = dueDate.toISOString().split('T')[0];

  return {
    formattedDate,
    daysRemaining,
    isOverdue,
    isoDate,
  };
}

/**
 * Sorts tasks chronologically from furthest out (highest daysBeforeEvent) down to day-of (0).
 * If same offset, high priority first, then uncompleted before completed.
 */
export function sortTasksChronologically(tasks: TimelineTask[]): TimelineTask[] {
  const priorityWeight: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    // Highest daysBeforeEvent first (e.g. 90 days out comes before 30 days out)
    if (b.daysBeforeEvent !== a.daysBeforeEvent) {
      return b.daysBeforeEvent - a.daysBeforeEvent;
    }
    // High priority first
    const priDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    if (priDiff !== 0) return priDiff;

    // Uncompleted first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    return a.title.localeCompare(b.title);
  });
}

/**
 * Calculates milestone completion percentages and counts.
 */
export function calculateTimelineProgress(tasks: TimelineTask[]): {
  completedCount: number;
  totalCount: number;
  percentage: number;
  pendingCount: number;
} {
  const totalCount = tasks.length;
  if (totalCount === 0) {
    return { completedCount: 0, totalCount: 0, percentage: 0, pendingCount: 0 };
  }
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return {
    completedCount,
    totalCount,
    percentage,
    pendingCount,
  };
}

/**
 * Groups tasks into the 5 core milestone buckets:
 * 6+ Months Out (>= 180 days)
 * 3 Months Out (60 - 179 days)
 * 1 Month Out (15 - 59 days)
 * Week Of (1 - 14 days)
 * Day-Of (0 days or specific hourly)
 */
export function groupTasksByBucket(tasks: TimelineTask[]): Record<TaskBucket, TimelineTask[]> {
  const buckets: Record<TaskBucket, TimelineTask[]> = {
    '6_months_out': [],
    '3_months_out': [],
    '1_month_out': [],
    'week_of': [],
    'day_of': [],
  };

  for (const task of tasks) {
    if (task.daysBeforeEvent >= 180) {
      buckets['6_months_out'].push(task);
    } else if (task.daysBeforeEvent >= 60) {
      buckets['3_months_out'].push(task);
    } else if (task.daysBeforeEvent >= 15) {
      buckets['1_month_out'].push(task);
    } else if (task.daysBeforeEvent >= 1) {
      buckets['week_of'].push(task);
    } else {
      buckets['day_of'].push(task);
    }
  }

  return buckets;
}
