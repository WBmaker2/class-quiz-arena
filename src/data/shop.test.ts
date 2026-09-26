import { describe, expect, it } from 'vitest';
import {
  AVATAR_GOODS,
  TITLE_GOODS,
  avatarPrice,
  canAfford,
  ownsAvatar,
  ownsTitle,
  titlePrice,
} from './shop';

describe('shop catalog', () => {
  it('has free starter avatar and title', () => {
    expect(avatarPrice('frog')).toBe(0);
    expect(titlePrice('sprout')).toBe(0);
  });

  it('owns free goods without unlock list', () => {
    expect(ownsAvatar(undefined, 'frog')).toBe(true);
    expect(ownsTitle(undefined, 'sprout')).toBe(true);
    expect(ownsAvatar(undefined, 'dragon')).toBe(false);
  });

  it('owns paid goods only when unlocked', () => {
    expect(ownsAvatar(['dragon'], 'dragon')).toBe(true);
    expect(ownsTitle(['legend'], 'legend')).toBe(true);
    expect(ownsAvatar([], 'dragon')).toBe(false);
  });

  it('checks affordability', () => {
    expect(canAfford(100, 100)).toBe(true);
    expect(canAfford(99, 100)).toBe(false);
  });

  it('has no gambling mechanics (all fixed prices)', () => {
    for (const g of [...AVATAR_GOODS, ...TITLE_GOODS]) {
      expect(g.price).toBeGreaterThanOrEqual(0);
    }
    expect(AVATAR_GOODS).toHaveLength(15);
    expect(TITLE_GOODS).toHaveLength(6);
  });
});
