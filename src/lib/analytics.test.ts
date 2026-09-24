import { describe, expect, it } from 'vitest';
import { activeStudents, avgCorrectVsWrong, hardProblems, problemStats, type RoundRecord } from './analytics';

const rounds: RoundRecord[] = [
  { roomId: 'r1', arenaId: 'a1', problemIndex: 0, answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: false }] },
  { roomId: 'r1', arenaId: 'a1', problemIndex: 1, answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: true }] },
  { roomId: 'r2', arenaId: 'a1', problemIndex: 0, answers: [{ uid: 'u1', correct: false }, { uid: 'u3', correct: false }] },
];

describe('analytics', () => {
  it('builds problem stats', () => {
    expect(problemStats(rounds)).toEqual([
      { problemIndex: 0, asked: 2, correct: 1 },
      { problemIndex: 1, asked: 1, correct: 2 },
    ]);
  });

  it('finds hard problems', () => {
    expect(hardProblems(problemStats(rounds), 1)).toEqual([{ problemIndex: 0, asked: 2, correct: 1 }]);
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
