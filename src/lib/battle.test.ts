import { describe, expect, it } from 'vitest';
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
  joinRoomData,
  roundRemainingMs,
  setReadyData,
  startPlayingData,
  submitAnswerData,
  advanceData,
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
    r = advanceData(r, 0, 8000, 30, 3);
    expect(r.players[0].score).toBe(1);
    expect(r.players[1].score).toBe(0);
    expect(r.currentRound).toBe(1);
    expect(r.status).toBe('playing');
  });

  it('finishes after last round with winner', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    r = submitAnswerData(r, 'u2', 1, 7000);
    r = advanceData(r, 0, 8000, 30, 1);
    expect(r.status).toBe('finished');
    const f = finishData(r, 9000);
    expect(f.winnerUid).toBe('u1');
  });

  it('draws on tie', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    r = submitAnswerData(r, 'u2', 0, 7000);
    r = advanceData(r, 0, 8000, 30, 1);
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
});
