import { describe, expect, it } from 'vitest';

import {
  isValidProblem,
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
