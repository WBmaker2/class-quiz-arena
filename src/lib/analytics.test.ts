import { describe, expect, it } from 'vitest';
import { activeStudents, avgCorrectVsWrong, hardProblems, problemStats, resolveRevealProblemMetadata, weakStandards, type RoundRecord } from './analytics';

const rounds: RoundRecord[] = [
  { roomId: 'r1', arenaId: 'a1', problemId: 'p1', problemTitle: '한 문제', problemIndex: 0, answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: false }] },
  { roomId: 'r1', arenaId: 'a1', problemId: 'p2', problemTitle: '두 문제', problemIndex: 1, answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: true }] },
  { roomId: 'r2', arenaId: 'a1', problemId: 'p1', problemTitle: '한 문제', problemIndex: 0, answers: [{ uid: 'u1', correct: false }, { uid: 'u3', correct: false }] },
];

describe('analytics', () => {
  it('builds problem stats', () => {
    expect(problemStats(rounds)).toEqual([
      { problemId: 'p1', problemTitle: '한 문제', problemIndex: 0, asked: 4, correct: 1, correctPercent: 25 },
      { problemId: 'p2', problemTitle: '두 문제', problemIndex: 1, asked: 2, correct: 2, correctPercent: 100 },
    ]);
  });

  it('finds hard problems', () => {
    expect(hardProblems(problemStats(rounds), 1)).toMatchObject([{ problemId: 'p1', asked: 4, correct: 1, correctPercent: 25 }]);
  });

  it('keeps edited versions of the same problem id in separate groups', () => {
    const editedVersions: RoundRecord[] = [
      { roomId: 'old', arenaId: 'a1', problemId: 'p1', problemTitle: '수정 전 문제', problemIndex: 0, standardCode: '[4수01-01]', answers: [{ uid: 'u1', correct: true }] },
      { roomId: 'new', arenaId: 'a1', problemId: 'p1', problemTitle: '수정 후 문제', problemIndex: 0, standardCode: '[4수01-02]', answers: [{ uid: 'u2', correct: false }] },
    ];

    expect(problemStats(editedVersions)).toEqual([
      { problemId: 'p1', problemTitle: '수정 전 문제', problemIndex: 0, asked: 1, correct: 1, correctPercent: 100 },
      { problemId: 'p1', problemTitle: '수정 후 문제', problemIndex: 0, asked: 1, correct: 0, correctPercent: 0 },
    ]);
  });

  it('averages correct vs wrong', () => {
    expect(avgCorrectVsWrong(rounds)).toEqual({ avgCorrect: 1, avgWrong: 1 });
  });

  it('finds active students', () => {
    expect(activeStudents(rounds, 3)).toEqual(['u1']);
    expect(activeStudents(rounds, 5)).toEqual([]);
  });

  it('handles empty rounds', () => {
    expect(avgCorrectVsWrong([])).toEqual({ avgCorrect: 0, avgWrong: 0 });
    expect(hardProblems([], 3)).toEqual([]);
  });
});

describe('weakStandards', () => {
  it('ranks standards by lowest correct rate', () => {
    const rounds: RoundRecord[] = [
      { roomId: 'r1', arenaId: 'a', problemId: 'p1', problemTitle: '1', problemIndex: 0, standardCode: '[4수01-03]', answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: false }] },
      { roomId: 'r1', arenaId: 'a', problemId: 'p2', problemTitle: '2', problemIndex: 1, standardCode: '[4수01-09]', answers: [{ uid: 'u1', correct: false }, { uid: 'u2', correct: false }] },
      { roomId: 'r1', arenaId: 'a', problemId: 'p3', problemTitle: '3', problemIndex: 2, answers: [{ uid: 'u1', correct: false }] },
    ];
    const weak = weakStandards(rounds, 3);
    expect(weak.map((w) => w.code)).toEqual(['[4수01-09]', '[4수01-03]']);
    expect(weak[0]).toMatchObject({ asked: 2, correct: 0, rate: 0 });
    expect(weak[1].rate).toBe(0.5);
  });

  it('does not rank standards with no submitted answers as 0%', () => {
    const rounds: RoundRecord[] = [
      { roomId: 'r1', arenaId: 'a', problemId: 'p1', problemTitle: '미응답', problemIndex: 0, standardCode: '[4수02-01]', answers: [] },
      { roomId: 'r2', arenaId: 'a', problemId: 'p2', problemTitle: '응답', problemIndex: 0, standardCode: '[4수02-02]', answers: [{ uid: 'u1', correct: true }] },
    ];

    expect(weakStandards(rounds, 3)).toEqual([
      { code: '[4수02-02]', asked: 1, correct: 1, rate: 1 },
    ]);
  });
});

describe('resolveRevealProblemMetadata', () => {
  it('prefers the reveal snapshot when the current problem has changed', () => {
    expect(resolveRevealProblemMetadata(
      { questionText: '대결 당시 문구', standardCode: '[4과01-01]' },
      { text: '현재 문구', standardCode: '[4과01-02]' },
    )).toEqual({ problemTitle: '대결 당시 문구', standardCode: '[4과01-01]' });
  });

  it('uses current problem data for older reveals without a snapshot', () => {
    expect(resolveRevealProblemMetadata(
      {},
      { text: '현재 문제 문구', standardCode: '[4과01-02]' },
    )).toEqual({ problemTitle: '현재 문제 문구', standardCode: '[4과01-02]' });
  });

  it('keeps snapshot metadata when the problem document was deleted', () => {
    expect(resolveRevealProblemMetadata(
      { questionText: '저장된 문제 문구', standardCode: '[4과01-01]' },
      undefined,
    )).toEqual({ problemTitle: '저장된 문제 문구', standardCode: '[4과01-01]' });
  });

  it('does not backfill a missing standard on a new snapshot', () => {
    expect(resolveRevealProblemMetadata(
      { questionText: '당시 문제 문구' },
      { text: '수정된 문제 문구', standardCode: '[4과01-09]' },
    )).toEqual({ problemTitle: '당시 문제 문구' });
  });

  it('separates versions when the answer changes but the question wording stays the same', () => {
    const changedAnswer: RoundRecord[] = [
      { roomId: 'old', arenaId: 'a1', problemId: 'p1', problemTitle: '같은 문구', problemIndex: 0, standardCode: '[4수01-01]', correctAnswer: 0, answers: [{ uid: 'u1', correct: true }] },
      { roomId: 'new', arenaId: 'a1', problemId: 'p1', problemTitle: '같은 문구', problemIndex: 0, standardCode: '[4수01-01]', correctAnswer: 1, answers: [{ uid: 'u2', correct: false }] },
    ];

    expect(problemStats(changedAnswer)).toEqual([
      { problemId: 'p1', problemTitle: '같은 문구', problemIndex: 0, asked: 1, correct: 1, correctPercent: 100 },
      { problemId: 'p1', problemTitle: '같은 문구', problemIndex: 0, asked: 1, correct: 0, correctPercent: 0 },
    ]);
  });
});
