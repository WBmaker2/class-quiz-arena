import { describe, expect, it } from 'vitest';
import { mapLeaderboard } from './useLeaderboard';

describe('mapLeaderboard', () => {
  it('sorts by xp desc and limits to top 20', () => {
    const docs = Array.from({ length: 25 }, (_, i) => ({
      uid: `u${i}`,
      nickname: `친구${i}`,
      xp: 100 + i,
    }));
    const { top20 } = mapLeaderboard(docs, null);
    expect(top20).toHaveLength(20);
    expect(top20[0].xp).toBe(124);
    expect(top20[0].rank).toBe(1);
    expect(top20[19].rank).toBe(20);
  });

  it('computes own rank even outside top20 with highlight', () => {
    const docs = Array.from({ length: 25 }, (_, i) => ({
      uid: `u${i}`,
      nickname: `친구${i}`,
      xp: 100 + i,
    }));
    const { myRank, top20 } = mapLeaderboard(docs, 'u0');
    expect(myRank).toBe(25);
    expect(top20.find((e) => e.uid === 'u0')).toBeUndefined();

    const inside = mapLeaderboard(docs, 'u24');
    expect(inside.myRank).toBe(1);
    expect(inside.top20[0].isMe).toBe(true);
  });

  it('preserves answer counts so an unplayed student differs from a true zero percent', () => {
    const { top20 } = mapLeaderboard([
      { uid: 'none', correctRate: 0 },
      { uid: 'played', correctRate: 0, answerCount: 4 },
    ], null);
    expect(top20.find((entry) => entry.uid === 'none')?.answerCount).toBeUndefined();
    expect(top20.find((entry) => entry.uid === 'played')?.answerCount).toBe(4);
    expect(top20.find((entry) => entry.uid === 'played')?.correctRate).toBe(0);
  });
});
