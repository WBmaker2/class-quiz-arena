import { describe, expect, it } from 'vitest';
import {
  countCorrectAnswers,
  countUserAnswers,
  isAnswerValid,
  isCorrect,
  isStoredQuestionValid,
  normalizeTimestamp,
  pickQuestionIds,
  questionToStored,
  recordFirstAnswer,
  toPublicQuestion,
} from '../../functions/src/battleLogic';

describe('server battle rules', () => {
  it('keeps the first submitted answer unchanged', () => {
    const first = recordFirstAnswer({}, 2, 1);
    const second = recordFirstAnswer(first.answers, 2, 0);
    expect(first).toEqual({ accepted: true, answers: { '2': 1 } });
    expect(second).toEqual({ accepted: false, answers: { '2': 1 } });
  });

  it('does not serialize answer keys or explanations to students before reveal', () => {
    const stored = questionToStored('p1', {
      text: '2 + 2 = ?', options: ['3', '4', '5', '6'], kind: 'choice',
      answerIndex: 1, explanation: '2와 2를 더하면 4입니다.', roundTimeSec: 30,
    });
    expect(toPublicQuestion(stored)).toEqual({
      id: 'p1', text: '2 + 2 = ?', options: ['3', '4', '5', '6'], kind: 'choice', roundTimeSec: 30,
    });
  });

  it('validates answer formats and grades normalized short answers', () => {
    const short = questionToStored('p2', { text: '왕 이름', options: [], kind: 'short', answerIndex: -1, answerText: '세종 대왕' });
    expect(isAnswerValid(' 세종대왕 ', short)).toBe(true);
    expect(isAnswerValid('', short)).toBe(false);
    expect(isCorrect('세종대왕', short)).toBe(true);
  });

  it('rejects a room snapshot with missing answer data', () => {
    const broken = questionToStored('p3', { text: 'Q', options: ['a', 'b', 'c', 'd'], answerIndex: 5 });
    expect(isStoredQuestionValid(broken)).toBe(false);
  });

  it('selects ten distinct questions from the available set', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `p${i}`);
    const picked = pickQuestionIds(ids, 10);
    expect(picked).toHaveLength(10);
    expect(new Set(picked).size).toBe(10);
  });

  it('counts only non-null answers and normalizes short text', () => {
    const reveals = [
      { answers: { u1: null }, correctAnswer: 0 },
      { answers: { u1: '세종대왕' }, correctAnswer: '세종 대왕' },
      { answers: { u1: 0 }, correctAnswer: 0 },
    ];
    expect(countCorrectAnswers(reveals, 'u1')).toBe(2);
    expect(countUserAnswers(reveals, 'u1')).toBe(2);
  });

  it('converts Timestamp objects with toMillis without numeric coercion', () => {
    expect(normalizeTimestamp({ toMillis: () => 1234 })).toBe(1234);
    expect(normalizeTimestamp(1234)).toBe(1234);
    expect(normalizeTimestamp({ valueOf: () => 999999 })).toBe(0);
  });
});
