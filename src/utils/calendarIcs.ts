/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventPlan, TimelineTask } from '../types/event';
import { computeTaskDueDate } from './timelineMath';

/**
 * Escapes special characters for RFC 5545 iCalendar syntax.
 */
function escapeIcsText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Formats a Date object as an iCalendar UTC string: YYYYMMDDTHHMMSSZ
 */
function formatIcsDateTime(date: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Formats a Date object as an iCalendar all-day date: YYYYMMDD
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}${month}${day}`;
}

/**
 * Generates an RFC 5545 compliant .ics calendar string containing all timeline milestones.
 * Suitable for direct import into Google Calendar, Apple Calendar, Outlook, and mobile devices.
 */
export function generateTimelineIcs(event: EventPlan): string {
  const now = new Date();
  const dtstamp = formatIcsDateTime(now);
  const eventTitleEscaped = escapeIcsText(event.title);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CelebrationOS//Event Milestone Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${eventTitleEscaped} - Milestones & Run-Sheet`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  event.timelineTasks.forEach((task: TimelineTask) => {
    const dueDateInfo = computeTaskDueDate(event.targetDate, task.daysBeforeEvent);
    const dueDate = new Date(dueDateInfo.isoDate);
    const nextDay = new Date(dueDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const uid = `${task.id}@celebrationos.app`;
    const summary = `[${task.priority.toUpperCase()}] ${escapeIcsText(task.title)}`;

    const phaseLabels: Record<string, string> = {
      '6_months_out': '6+ Months Out',
      '3_months_out': '3 Months Out',
      '1_month_out': '1 Month Out',
      week_of: 'Week Of Celebration',
      day_of: 'Day-Of Hourly Run-Sheet',
    };

    const descriptionParts = [
      `CelebrationOS Milestone: ${task.title}`,
      `Event: ${event.title}`,
      `Phase: ${phaseLabels[task.phase] || task.phase}`,
      `Priority: ${task.priority.toUpperCase()}`,
      `Status: ${task.completed ? 'COMPLETED' : 'PENDING'}`,
    ];

    if (task.assignedVendorOrLead) {
      descriptionParts.push(`Assigned Lead/Partner: ${task.assignedVendorOrLead}`);
    }
    if (task.details) {
      descriptionParts.push(`Notes: ${task.details}`);
    }
    if (task.metrics) {
      descriptionParts.push(`Target Metrics: ${task.metrics}`);
    }
    if (task.dueTimeOfDay) {
      descriptionParts.push(`Scheduled Time: ${task.dueTimeOfDay}`);
    }

    const description = escapeIcsText(descriptionParts.join('\n'));

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);

    if (task.dueTimeOfDay && task.phase === 'day_of') {
      // Day of specific time: parse time e.g. "10:00 AM"
      const timeMatch = task.dueTimeOfDay.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const meridiem = (timeMatch[3] || '').toUpperCase();
        if (meridiem === 'PM' && hour < 12) hour += 12;
        if (meridiem === 'AM' && hour === 12) hour = 0;

        const taskStart = new Date(dueDate);
        taskStart.setHours(hour, minute, 0, 0);

        const taskEnd = new Date(taskStart);
        taskEnd.setHours(taskStart.getHours() + 1); // 1-hour default block

        lines.push(`DTSTART:${formatIcsDateTime(taskStart)}`);
        lines.push(`DTEND:${formatIcsDateTime(taskEnd)}`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(dueDate)}`);
        lines.push(`DTEND;VALUE=DATE:${formatIcsDate(nextDay)}`);
      }
    } else {
      // All-day milestone event
      lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(dueDate)}`);
      lines.push(`DTEND;VALUE=DATE:${formatIcsDate(nextDay)}`);
    }

    lines.push(`SUMMARY:${summary}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    lines.push(`STATUS:${task.completed ? 'COMPLETED' : 'CONFIRMED'}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Initiates a browser download of the generated .ics file for the given event.
 */
export function downloadTimelineIcs(event: EventPlan): void {
  const icsContent = generateTimelineIcs(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_');
  const filename = `${sanitizedTitle}_Milestones.ics`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
