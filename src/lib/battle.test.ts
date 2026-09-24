import { describe, expect, it, vi } from 'vitest';
import {
  AUTO_WIN_AFTER_MS,
  XP_PER_CORRECT,
  XP_WIN,
  XP_DRAW,
  allReady,
  bothAnswered,
  canClaimWin,
  canJoin,
  computeLevel,
  createRoomData,
  finishData,
  isCorrectAnswer,
  joinRoomData,
  normalizeAnswerText,
  pickRandom,
  roundRemainingMs,
  setReadyData,
  startPlayingData,
  submitAnswerData,
  advanceData,
  pickBattleProblems,
  xpAward,
} from './battle';

const host = { uid: 'u1', nickname: '일호', avatar: 'cat' };
const guest = { uid: 'u2', nickname: '이호', avatar: 'dog' };

function readyRoom() {
  let r = createRoomData('a1', host, 1000);
  r = joinRoomData(r, guest, 2000)!;
  r = setReadyData(r, 'u1', 3000);
  r = setReadyData(r, 'u2', 4000);
  return startPlayingData(r, 5000, 30);
}

describe('matching', () => {
  it('creates a waiting room with host only', () => {
    const r = createRoomData('a1', host, 1000);
    expect(r.status).toBe('waiting');
    expect(r.players).toHaveLength(1);
    expect(r.winnerUid).toBeNull();
  });

  it('rejects self-join and full rooms', () => {
    const r = createRoomData('a1', host, 1000);
    expect(canJoin(r, 'u1')).toBe(false);
    const full = joinRoomData(r, guest, 2000)!;
    expect(canJoin(full, 'u3')).toBe(false);
    expect(joinRoomData(full, { uid: 'u3', nickname: '삼호', avatar: 'tiger' }, 3000)).toBeNull();
  });

  it('requires both ready to start', () => {
    let r = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    expect(allReady(r)).toBe(false);
    r = setReadyData(r, 'u1', 3000);
    expect(allReady(r)).toBe(false);
    r = setReadyData(r, 'u2', 4000);
    expect(allReady(r)).toBe(true);
    const p = startPlayingData(r, 5000, 30);
    expect(p.status).toBe('playing');
    expect(p.roundEndsAt).toBe(5000 + 30 * 1000);
  });
});

describe('rounds', () => {
  it('counts down and detects timeout', () => {
    const r = readyRoom();
    expect(roundRemainingMs(r, 20000)).toBe(15000);
    expect(roundRemainingMs(r, 40000)).toBe(0);
  });

  it('advances when both answer', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    expect(bothAnswered(r)).toBe(false);
    r = submitAnswerData(r, 'u2', 1, 7000);
    expect(bothAnswered(r)).toBe(true);
    r = advanceData(r, { answerIndex: 0 }, 8000, 30, 3);
    expect(r.players[0].score).toBe(1);
    expect(r.players[1].score).toBe(0);
    expect(r.currentRound).toBe(1);
    expect(r.status).toBe('playing');
  });

  it('finishes after last round with winner', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    r = submitAnswerData(r, 'u2', 1, 7000);
    r = advanceData(r, { answerIndex: 0 }, 8000, 30, 1);
    expect(r.status).toBe('finished');
    const f = finishData(r, 9000);
    expect(f.winnerUid).toBe('u1');
  });

  it('draws on tie', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    r = submitAnswerData(r, 'u2', 0, 7000);
    r = advanceData(r, { answerIndex: 0 }, 8000, 30, 1);
    expect(finishData(r, 9000).winnerUid).toBeNull();
  });
});

describe('xp and level', () => {
  it('awards xp', () => {
    expect(XP_PER_CORRECT).toBe(10);
    expect(XP_WIN).toBe(50);
    expect(XP_DRAW).toBe(20);
    expect(xpAward(true, false, 3)).toBe(50 + 30);
    expect(xpAward(false, true, 2)).toBe(20 + 20);
    expect(xpAward(false, false, 1)).toBe(10);
  });

  it('computes level', () => {
    expect(computeLevel(0)).toEqual({ level: 1, xpIntoLevel: 0, xpToNext: 100 });
    expect(computeLevel(250)).toEqual({ level: 3, xpIntoLevel: 50, xpToNext: 50 });
  });

  it('allows auto-win after 30s of silence', () => {
    expect(AUTO_WIN_AFTER_MS).toBe(30000);
    const r = readyRoom();
    expect(canClaimWin(r, 'u1', 5000 + 30001)).toBe(true);
    expect(canClaimWin(r, 'u1', 5000 + 10000)).toBe(false);
  });

  it('picks 10 unique ids fixed per room', () => {
    const all = Array.from({ length: 20 }, (_, i) => `p${i + 1}`);
    const a = pickBattleProblems(all, 'roomA', 10);
    const b = pickBattleProblems(all, 'roomA', 10);
    expect(a).toHaveLength(10);
    expect(new Set(a).size).toBe(10);
    expect(a).toEqual(b);
  });
});

describe('mixed question grading', () => {
  it('grades choice by index (missing kind counts as choice)', () => {
    expect(isCorrectAnswer(2, { answerIndex: 2 })).toBe(true);
    expect(isCorrectAnswer(1, { answerIndex: 2 })).toBe(false);
    expect(isCorrectAnswer(null, { answerIndex: 2 })).toBe(false);
  });

  it('grades ox by index', () => {
    expect(isCorrectAnswer(0, { kind: 'ox', answerIndex: 0 })).toBe(true);
    expect(isCorrectAnswer(1, { kind: 'ox', answerIndex: 0 })).toBe(false);
  });

  it('grades short answers ignoring spaces and case', () => {
    expect(isCorrectAnswer('세종대왕', { kind: 'short', answerIndex: 0, answerText: '세종대왕' })).toBe(true);
    expect(isCorrectAnswer('세종 대왕', { kind: 'short', answerIndex: 0, answerText: '세종대왕' })).toBe(true);
    expect(isCorrectAnswer('am', { kind: 'short', answerIndex: 0, answerText: 'AM' })).toBe(true);
    expect(isCorrectAnswer('', { kind: 'short', answerIndex: 0, answerText: '세종대왕' })).toBe(false);
    expect(isCorrectAnswer(0, { kind: 'short', answerIndex: 0, answerText: '세종대왕' })).toBe(false);
  });

  it('normalizes answer text', () => {
    expect(normalizeAnswerText('  Hello World ')).toBe('helloworld');
  });

  it('scores short answers through advanceData', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', '세종대왕', 6000);
    r = submitAnswerData(r, 'u2', '이순신', 7000);
    r = advanceData(r, { kind: 'short', answerIndex: 0, answerText: '세종대왕' }, 8000, 30, 1);
    expect(r.players[0].score).toBe(1);
    expect(r.players[1].score).toBe(0);
  });
});

describe('pickRandom', () => {
  it('returns null for empty list', () => {
    expect(pickRandom([])).toBeNull();
  });

  it('picks by Math.random', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(pickRandom(['a', 'b', 'c'])).toBe('a');
    spy.mockReturnValue(0.99);
    expect(pickRandom(['a', 'b', 'c'])).toBe('c');
    spy.mockRestore();
  });
});
