// vitest test runner for CelebrationOS test suite
import { describe, it, expect } from 'vitest';
import { runCelebrationOSTests } from './testSuite';

describe('CelebrationOS Automated Tests', () => {
  it('should pass all defined tests', async () => {
    const results = await runCelebrationOSTests();
    const failed = results.filter((r) => !r.passed);
    // Fail the test if any individual test failed
    expect(failed).toHaveLength(0);
  });
});
