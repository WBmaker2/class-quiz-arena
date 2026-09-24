import { describe, expect, it } from 'vitest';

import {
  isValidProblem,
  kindMix,
  nextUsage,
  normalizeOxOption,
  requireAuth,
  validateGenerateArenaInput,
  validateProblems,
} from './validate';

describe('validateGenerateArenaInput', () => {
  const base = {
    grade: 3,
    subject: '수학',
    standards: ['3수01-01'],
    count: 10,
    topic: '덧셈',
  };

  it('accepts a valid input (count 10, one standard)', () => {
    const res = validateGenerateArenaInput(base);
    expect(res.ok).toBe(true);
  });

  it('accepts count 20 (upper bound)', () => {
    expect(validateGenerateArenaInput({ ...base, count: 20 }).ok).toBe(true);
  });

  it('rejects count below 10', () => {
    const res = validateGenerateArenaInput({ ...base, count: 9 });
    expect(res.ok).toBe(false);
  });

  it('rejects count above 20', () => {
    const res = validateGenerateArenaInput({ ...base, count: 21 });
    expect(res.ok).toBe(false);
  });

  it('rejects empty standards', () => {
    const res = validateGenerateArenaInput({ ...base, standards: [] });
    expect(res.ok).toBe(false);
  });
});

describe('problem validation', () => {
  const good = {
    text: '3 + 4 = ?',
    options: ['5', '6', '7', '8'],
    answerIndex: 2,
    explanation: '3에 4를 더하면 7이야.',
  };

  it('accepts a problem with 4 options and in-range answerIndex', () => {
    expect(isValidProblem(good)).toBe(true);
  });

  it('rejects options length !== 4', () => {
    expect(isValidProblem({ ...good, options: ['5', '6', '7'] })).toBe(false);
  });

  it('rejects out-of-range answerIndex', () => {
    expect(isValidProblem({ ...good, answerIndex: 4 })).toBe(false);
    expect(isValidProblem({ ...good, answerIndex: -1 })).toBe(false);
  });

  it('drops empty problems (empty text / empty options)', () => {
    const raw = [
      good,
      { text: '   ', options: ['a', 'b', 'c', 'd'], answerIndex: 0 },
      { text: '빈 보기', options: ['a', '', 'c', 'd'], answerIndex: 0 },
    ];
    const out = validateProblems(raw);
    expect(out).toHaveLength(1);
    expect(out[0].text).toBe(good.text);
  });
});

describe('requireAuth', () => {
  it('rejects calls without auth', () => {
    expect(requireAuth({})).toEqual({ ok: false, error: 'sign-in required' });
  });

  it('accepts calls with auth', () => {
    expect(requireAuth({ auth: { uid: 'u1' } })).toEqual({ ok: true });
  });
});

describe('nextUsage', () => {
  it('allows first use of the day', () => {
    expect(nextUsage(null, '2026-09-24')).toEqual({ allowed: true, next: { date: '2026-09-24', count: 1 } });
  });

  it('resets count on a new day', () => {
    expect(nextUsage({ date: '2026-09-23', count: 20 }, '2026-09-24')).toEqual({
      allowed: true,
      next: { date: '2026-09-24', count: 1 },
    });
  });

  it('blocks over the daily limit without incrementing', () => {
    expect(nextUsage({ date: '2026-09-24', count: 20 }, '2026-09-24')).toEqual({
      allowed: false,
      next: { date: '2026-09-24', count: 20 },
    });
  });

  it('allows the last remaining use', () => {
    expect(nextUsage({ date: '2026-09-24', count: 19 }, '2026-09-24').allowed).toBe(true);
  });
});

describe('mixed question kinds', () => {
  it('accepts ox with O/X options and index 0-1', () => {
    expect(
      isValidProblem({ kind: 'ox', text: 'Q', options: ['O', 'X'], answerIndex: 1 }),
    ).toBe(true);
    expect(
      isValidProblem({ kind: 'ox', text: 'Q', options: ['O', 'X'], answerIndex: 2 }),
    ).toBe(false);
  });

  it('accepts ox option variants and normalizes them', () => {
    expect(normalizeOxOption('o')).toBe('O');
    expect(normalizeOxOption('×')).toBe('X');
    expect(normalizeOxOption('maybe')).toBeNull();
    const out = validateProblems([{ kind: 'ox', text: 'Q', options: ['o', 'x'], answerIndex: 0 }]);
    expect(out).toHaveLength(1);
    expect(out[0].options).toEqual(['O', 'X']);
  });

  it('accepts short answers with answerText and empty options', () => {
    expect(
      isValidProblem({ kind: 'short', text: 'Q', options: [], answerText: '세종대왕' }),
    ).toBe(true);
    expect(isValidProblem({ kind: 'short', text: 'Q', options: [], answerText: '' })).toBe(false);
    expect(
      isValidProblem({ kind: 'short', text: 'Q', options: [], answerText: 'x'.repeat(31) }),
    ).toBe(false);
  });

  it('treats missing kind as choice', () => {
    const out = validateProblems([{ text: 'Q', options: ['1', '2', '3', '4'], answerIndex: 0 }]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe('choice');
  });

  it('distributes kinds by count', () => {
    expect(kindMix(20)).toEqual({ choice: 14, ox: 3, short: 3 });
    expect(kindMix(10)).toEqual({ choice: 6, ox: 2, short: 2 });
  });
});
