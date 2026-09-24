export type RoomStatus = 'waiting' | 'ready' | 'playing' | 'finished' | 'abandoned';

export interface PlayerState {
  uid: string;
  nickname: string;
  avatar: string;
  score: number;
  ready: boolean;
  answers: (number | null)[];
}

export interface RoomData {
  arenaId: string;
  status: RoomStatus;
  players: PlayerState[];
  currentRound: number;
  roundEndsAt: number;
  winnerUid: string | null;
  updatedAt: number;
}

export const XP_PER_CORRECT = 10;
export const XP_WIN = 50;
export const XP_DRAW = 20;
export const AUTO_WIN_AFTER_MS = 30000;

export function createRoomData(
  arenaId: string,
  host: { uid: string; nickname: string; avatar: string },
  nowMs: number,
): RoomData {
  return {
    arenaId,
    status: 'waiting',
    players: [{ ...host, score: 0, ready: false, answers: [] }],
    currentRound: 0,
    roundEndsAt: 0,
    winnerUid: null,
    updatedAt: nowMs,
  };
}

export function canJoin(room: RoomData, uid: string): boolean {
  return room.status === 'waiting' && room.players.length === 1 && room.players[0].uid !== uid;
}

export function joinRoomData(
  room: RoomData,
  guest: { uid: string; nickname: string; avatar: string },
  nowMs: number,
): RoomData | null {
  if (!canJoin(room, guest.uid)) return null;
  return {
    ...room,
    status: 'ready',
    players: [...room.players, { ...guest, score: 0, ready: false, answers: [] }],
    updatedAt: nowMs,
  };
}

export function setReadyData(room: RoomData, uid: string, nowMs: number): RoomData {
  return {
    ...room,
    players: room.players.map((p) => (p.uid === uid ? { ...p, ready: true } : p)),
    updatedAt: nowMs,
  };
}

export function allReady(room: RoomData): boolean {
  return room.players.length === 2 && room.players.every((p) => p.ready);
}

export function startPlayingData(room: RoomData, nowMs: number, roundSec: number): RoomData {
  return {
    ...room,
    status: 'playing',
    currentRound: 0,
    roundEndsAt: nowMs + roundSec * 1000,
    players: room.players.map((p) => ({ ...p, answers: [] })),
    updatedAt: nowMs,
  };
}

export function roundRemainingMs(room: RoomData, nowMs: number): number {
  return Math.max(0, room.roundEndsAt - nowMs);
}

export function submitAnswerData(room: RoomData, uid: string, answerIdx: number, nowMs: number): RoomData {
  return {
    ...room,
    players: room.players.map((p) => {
      if (p.uid !== uid) return p;
      const answers = [...p.answers];
      answers[room.currentRound] = answerIdx;
      return { ...p, answers };
    }),
    updatedAt: nowMs,
  };
}

export function bothAnswered(room: RoomData): boolean {
  return (
    room.players.length === 2 &&
    room.players.every((p) => p.answers[room.currentRound] !== undefined && p.answers[room.currentRound] !== null)
  );
}

export function advanceData(
  room: RoomData,
  correctIdx: number,
  nowMs: number,
  roundSec: number,
  totalRounds: number,
): RoomData {
  const players = room.players.map((p) => ({
    ...p,
    score: p.score + (p.answers[room.currentRound] === correctIdx ? 1 : 0),
  }));
  const last = room.currentRound >= totalRounds - 1;
  return {
    ...room,
    players,
    currentRound: last ? room.currentRound : room.currentRound + 1,
    roundEndsAt: last ? room.roundEndsAt : nowMs + roundSec * 1000,
    status: last ? 'finished' : 'playing',
    updatedAt: nowMs,
  };
}

export function finishData(room: RoomData, nowMs: number): RoomData {
  const [a, b] = room.players;
  const winnerUid = a && b ? (a.score === b.score ? null : a.score > b.score ? a.uid : b.uid) : room.winnerUid;
  return { ...room, status: 'finished', winnerUid, updatedAt: nowMs };
}

export function xpAward(isWinner: boolean, isDraw: boolean, correctCount: number): number {
  return (isWinner ? XP_WIN : isDraw ? XP_DRAW : 0) + correctCount * XP_PER_CORRECT;
}

export function computeLevel(totalXp: number): { level: number; xpIntoLevel: number; xpToNext: number } {
  return {
    level: Math.floor(totalXp / 100) + 1,
    xpIntoLevel: totalXp % 100,
    xpToNext: 100 - (totalXp % 100),
  };
}

export function canClaimWin(room: RoomData, uid: string, nowMs: number): boolean {
  if (room.status !== 'playing') return false;
  if (!room.players.some((p) => p.uid === uid)) return false;
  return nowMs - room.updatedAt >= AUTO_WIN_AFTER_MS;
}
