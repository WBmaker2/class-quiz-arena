import { describe, expect, it } from 'vitest';
import { normalizeInviteCode, isValidInviteCode, generateInviteCode } from './classroom';

describe('normalizeInviteCode', () => {
  it('trims and uppercases', () => {
    expect(normalizeInviteCode('  ab12cd ')).toBe('AB12CD');
  });

  it('removes inner spaces and dashes', () => {
    expect(normalizeInviteCode('AB-12 CD')).toBe('AB12CD');
  });

  it('rejects non-alphanumeric code', () => {
    expect(isValidInviteCode('AB!@#%')).toBe(false);
  });

  it('generates 6-char alphanumeric codes', () => {
    expect(generateInviteCode()).toMatch(/^[A-Z0-9]{6}$/);
  });

  it('generates unique codes', () => {
    const set = new Set(Array.from({ length: 100 }, () => generateInviteCode()));
    expect(set.size).toBeGreaterThan(90);
  });
});
