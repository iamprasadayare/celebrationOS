// vitest test runner for CelebrationOS test suite
import { describe, it, expect } from 'vitest';
import { runCelebrationOSTests } from './testSuite';
import { generateTimelineIcs } from './calendarIcs';
import { WEDDING_EVENT } from '../data/mockEvents';
import { UserProfile } from '../types/event';

describe('CelebrationOS Automated Tests', () => {
  it('should pass all core unit and integration tests', async () => {
    const results = await runCelebrationOSTests();
    const failed = results.filter((r) => !r.passed);
    expect(failed).toHaveLength(0);
  });

  it('should generate valid RFC 5545 iCalendar (.ics) format with all milestones', () => {
    const ics = generateTimelineIcs(WEDDING_EVENT);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//CelebrationOS//Event Milestone Planner//EN');
    expect(ics).toContain('X-WR-TIMEZONE:Asia/Kolkata');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');

    // Confirm tasks are present as events
    expect(ics).toContain('Aarav & Meera');
    expect(ics).toContain('SUMMARY:');
    expect(ics).toContain('DESCRIPTION:');
  });

  it('should structure and serialize UserProfile for Google/Gmail authentication', () => {
    const mockUser: UserProfile = {
      id: 'g_1029384756',
      name: 'Prasad Ayare',
      email: 'prasadayare1996@gmail.com',
      role: 'Lead Event Director',
      verifiedEmail: true,
      provider: 'google',
      authTimestamp: new Date().toISOString(),
    };

    expect(mockUser.email).toContain('@gmail.com');
    expect(mockUser.verifiedEmail).toBe(true);
    expect(mockUser.role).toBe('Lead Event Director');

    const serialized = JSON.stringify(mockUser);
    const parsed = JSON.parse(serialized) as UserProfile;
    expect(parsed.name).toBe('Prasad Ayare');
    expect(parsed.provider).toBe('google');
  });
});
