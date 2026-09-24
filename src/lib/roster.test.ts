import { describe, expect, it } from 'vitest';
import { buildRosterCsv, byXpDesc } from './roster';

describe('buildRosterCsv', () => {
  it('builds csv with header', () => {
    expect(buildRosterCsv([{ uid: 'u1', nickname: '일호', xp: 120 }])).toBe('이름,XP\n일호,120');
  });

  it('sorts by xp descending', () => {
    const students = [
      { uid: 'u1', nickname: '일호', xp: 120 },
      { uid: 'u2', nickname: '이호', xp: 300 },
    ];
    expect([...students].sort(byXpDesc).map((s) => s.nickname)).toEqual(['이호', '일호']);
  });
});
