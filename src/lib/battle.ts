export type RoomStatus = 'waiting' | 'ready' | 'playing' | 'finished' | 'abandoned';

/** 대결 답안: choice/ox는 선택지 번호, short는 직접 쓴 답. */
export type AnswerValue = number | string;

export interface PlayerState {
  uid: string;
  nickname: string;
  avatar: string;
  score: number;
  ready: boolean;
  /** Round indexes submitted; answer values stay server-side until reveal. */
  answeredRounds: number[];
}

export interface RoundReveal {
  questionId: string;
  answers: Record<string, AnswerValue | null>;
  correctAnswer: number | string;
  kind: 'choice' | 'ox' | 'short';
  explanation?: string;
}

export interface RoomData {
  arenaId: string;
  status: RoomStatus;
  players: PlayerState[];
  currentRound: number;
  roundEndsAt: number;
  winnerUid: string | null;
  updatedAt: number;
  problemIds: string[];
  reveals?: Record<string, RoundReveal>;
  /** 방 생성 시 아레나 showPlayers 복사값. 없으면 비공개로 간주. */
  showPlayers?: boolean;
  /** 방 생성 시 아레나 ttsEnabled 복사값. 없으면 off. */
  ttsEnabled?: boolean;
}

export const XP_PER_CORRECT = 10;
export const XP_WIN = 50;
export const XP_DRAW = 20;
export const AUTO_WIN_AFTER_MS = 30000;

export function createRoomData(
  arenaId: string,
  host: { uid: string; nickname: string; avatar: string },
  nowMs: number,
  problemIds: string[] = [],
): RoomData {
  return {
    arenaId,
    status: 'waiting',
    players: [{ ...host, score: 0, ready: false, answeredRounds: [] }],
    currentRound: 0,
    roundEndsAt: 0,
    winnerUid: null,
    updatedAt: nowMs,
    problemIds,
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
    players: [...room.players, { ...guest, score: 0, ready: false, answeredRounds: [] }],
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
    players: room.players.map((p) => ({ ...p, answeredRounds: [] })),
    updatedAt: nowMs,
  };
}

export function roundRemainingMs(room: RoomData, nowMs: number): number {
  return Math.max(0, room.roundEndsAt - nowMs);
}

export function submitAnswerData(room: RoomData, uid: string, answer: AnswerValue, nowMs: number): RoomData {
  void answer;
  if (room.status !== 'playing' || !room.players.some((player) => player.uid === uid)) return room;
  return {
    ...room,
    players: room.players.map((p) => {
      if (p.uid !== uid) return p;
      if (p.answeredRounds.includes(room.currentRound)) return p;
      return { ...p, answeredRounds: [...p.answeredRounds, room.currentRound] };
    }),
    updatedAt: nowMs,
  };
}

export function bothAnswered(room: RoomData): boolean {
  return (
    room.players.length === 2 &&
    room.players.every((p) => p.answeredRounds.includes(room.currentRound))
  );
}

export interface GradableProblem {
  kind?: 'choice' | 'ox' | 'short';
  answerIndex: number;
  answerText?: string;
}

/** 단답형 비교용 정규화: 공백 제거 + 영문 소문자. */
export function normalizeAnswerText(v: string): string {
  return v.trim().replace(/\s+/g, '').toLowerCase();
}

export function isCorrectAnswer(given: AnswerValue | null | undefined, problem: GradableProblem): boolean {
  if (given === null || given === undefined) return false;
  if ((problem.kind ?? 'choice') === 'short') {
    if (typeof given !== 'string') return false;
    const want = (problem.answerText ?? '').trim();
    if (!want) return false;
    return normalizeAnswerText(given) === normalizeAnswerText(want);
  }
  return given === problem.answerIndex;
}

export function advanceData(
  room: RoomData,
  problem: GradableProblem,
  nowMs: number,
  roundSec: number,
  totalRounds: number,
  answersByUid: Record<string, AnswerValue | null> = {},
): RoomData {
  const players = room.players.map((p) => ({
    ...p,
    score: p.score + (isCorrectAnswer(answersByUid[p.uid], problem) ? 1 : 0),
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

/** 별(상점 재화) 기본 지급: 정답 1개당 1별 + 승리 5별/무승부 2별. XP와 별개. */
export const STAR_PER_CORRECT = 1;
export const STAR_WIN = 5;
export const STAR_DRAW = 2;
/** 새 연승이 3 이상이면 판마다 추가. */
export const STAR_STREAK_BONUS = 2;
export const STAR_STREAK_MIN = 3;
/** 레벨이 오를 때마다 레벨당 추가. */
export const STAR_LEVEL_UP_BONUS = 10;

export function starAward(isWinner: boolean, isDraw: boolean, correctCount: number): number {
  return (isWinner ? STAR_WIN : isDraw ? STAR_DRAW : 0) + correctCount * STAR_PER_CORRECT;
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
  return nowMs >= Math.max(room.updatedAt + AUTO_WIN_AFTER_MS, room.roundEndsAt);
}

/** Convert Firestore Timestamp values at the database boundary without numeric coercion. */
export function toMillis(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value && typeof value === 'object' && 'toMillis' in value) {
    const millis = (value as { toMillis: () => number }).toMillis();
    if (Number.isFinite(millis)) return millis;
  }
  if (value instanceof Date) return value.getTime();
  return 0;
}

/** 대기 방 중 무작위 1개. Math.random 기반이라 테스트에서는 값을 고정한다. */
export function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export function pickBattleProblems(allIds: string[], seed: string, n = 10): string[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const arr = [...allIds];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}
