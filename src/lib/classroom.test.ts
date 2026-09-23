import { describe, expect, it } from 'vitest';
import { normalizeInviteCode } from './classroom';

describe('normalizeInviteCode', () => {
  it('trims and uppercases', () => {
    expect(normalizeInviteCode('  ab12cd ')).toBe('AB12CD');
  });

  it('removes inner spaces and dashes', () => {
    expect(normalizeInviteCode('AB-12 CD')).toBe('AB12CD');
  });
});
