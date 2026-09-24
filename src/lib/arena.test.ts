import { describe, expect, it } from 'vitest';
import { isVisibleArena } from './arena';

describe('isVisibleArena', () => {
  it('hides locked arenas', () => {
    expect(isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: true })).toBe(false);
  });

  it('hides drafts even when unlocked', () => {
    expect(
      isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: false, status: 'draft' }),
    ).toBe(false);
  });

  it('shows published unlocked arenas', () => {
    expect(
      isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: false, status: 'published' }),
    ).toBe(true);
  });

  it('shows legacy arenas without status', () => {
    expect(isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: false })).toBe(true);
  });
});
