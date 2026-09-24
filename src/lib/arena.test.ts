import { describe, expect, it } from 'vitest';
import { isVisibleArena, subjectTheme } from './arena';

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

describe('subjectTheme', () => {
  it('assigns the same theme as the default 6', () => {
    expect(subjectTheme('수학')).toEqual({ bg: '#E3F2FD', emoji: '➗' });
    expect(subjectTheme('국어')).toEqual({ bg: '#FCE4EC', emoji: '📖' });
    expect(subjectTheme('사회')).toEqual({ bg: '#E8F5E9', emoji: '🗺️' });
    expect(subjectTheme('과학')).toEqual({ bg: '#E1F5FE', emoji: '💧' });
    expect(subjectTheme('영어')).toEqual({ bg: '#FFF3E0', emoji: '🔤' });
  });

  it('falls back for unknown subjects', () => {
    expect(subjectTheme('체육')).toEqual({ bg: '#E8ECF3', emoji: '🎲' });
  });
});
