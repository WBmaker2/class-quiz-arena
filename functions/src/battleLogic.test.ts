import { describe, expect, it } from 'vitest';
import { answerReveal, isAutoWinEligible, questionToStored, toPublicQuestion } from './battleLogic';

describe('auto-win timing', () => {
  it('waits for both the silence threshold and the active round deadline', () => {
    expect(isAutoWinEligible(0, 30_000, 29_999)).toBe(false);
    expect(isAutoWinEligible(0, 30_000, 30_000)).toBe(true);

    expect(isAutoWinEligible(0, 60_000, 30_000)).toBe(false);
    expect(isAutoWinEligible(0, 60_000, 59_999)).toBe(false);
    expect(isAutoWinEligible(0, 60_000, 60_000)).toBe(true);
  });
});

const sourceQuestion = {
  text: '물이 얼 때 생기는 변화는?',
  options: ['응고', '증발', '융해', '승화'],
  kind: 'choice',
  answerIndex: 0,
  explanation: '액체가 고체로 바뀌는 현상이에요.',
  standardCode: '[4과04-02]',
};

describe('battle question snapshots', () => {
  it('keeps standard code internally and excludes answer and standard from public questions', () => {
    const stored = questionToStored('problem-1', sourceQuestion);
    expect(stored.standardCode).toBe('[4과04-02]');

    const publicQuestion = toPublicQuestion(stored);
    expect(publicQuestion).toEqual({
      id: 'problem-1',
      text: sourceQuestion.text,
      options: sourceQuestion.options,
      kind: 'choice',
      roundTimeSec: 30,
    });
    expect(publicQuestion).not.toHaveProperty('answerIndex');
    expect(publicQuestion).not.toHaveProperty('standardCode');
  });

  it('preserves the revealed question text and standard for later analytics', () => {
    const stored = questionToStored('problem-1', sourceQuestion);
    expect(answerReveal('problem-1', stored, { student: 0 })).toMatchObject({
      questionId: 'problem-1',
      questionText: sourceQuestion.text,
      standardCode: '[4과04-02]',
      correctAnswer: 0,
      answers: { student: 0 },
    });
  });
});
