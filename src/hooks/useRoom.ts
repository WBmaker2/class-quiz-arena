import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';
import type { Problem } from '../lib/arena';
import { toMillis, type AnswerValue, type RoomData } from '../lib/battle';

function toRoomData(id: string, data: Record<string, unknown>): RoomData {
  void id;
  const r = data as unknown as RoomData & { problemIds?: unknown; updatedAt?: unknown };
  return {
    ...(r as RoomData),
    players: Array.isArray(r.players) ? r.players.map((player) => {
      const legacy = player as typeof player & { answers?: (AnswerValue | null)[] };
      const answeredRounds = Array.isArray(player.answeredRounds)
        ? player.answeredRounds
        : (legacy.answers ?? []).flatMap((answer, index) => answer === null ? [] : [index]);
      const safePlayer = { ...legacy };
      delete safePlayer.answers;
      return { ...safePlayer, answeredRounds };
    }) : [],
    updatedAt: toMillis(r.updatedAt),
    problemIds: Array.isArray(r.problemIds) ? (r.problemIds as string[]) : [],
    showPlayers: (r as RoomData).showPlayers ?? false,
    ttsEnabled: (r as RoomData).ttsEnabled ?? false,
  };
}

export function orderBattleProblems(problems: Problem[], problemIds: string[]): Problem[] {
  if (problemIds.length === 0) return problems;
  return problemIds
    .map((id) => problems.find((p) => p.id === id))
    .filter((p): p is Problem => Boolean(p));
}

export function useRoom(roomId: string | null, _problems: Problem[]) {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const tickInFlight = useRef(false);

  useEffect(() => {
    setRoom(null);
    setError(null);
    if (!roomId) return;
    return onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      if (snap.exists()) {
        setRoom(toRoomData(snap.id, snap.data()));
        setError(null);
      } else {
        setRoom(null);
        setError('대결방이 끝났거나 없어졌어요. 다시 연결해 주세요.');
      }
    }, () => {
      setRoom(null);
      setError('대결방에 연결할 수 없어요. 다시 시도해 주세요.');
    });
  }, [roomId, retryCount]);

  const retry = useCallback(() => setRetryCount((value) => value + 1), []);

  const ready = async (uid: string) => {
    void uid;
    if (!roomId) return;
    await httpsCallable(functions, 'readyBattlePlayer')({ roomId });
  };

  const answer = async (uid: string, value: AnswerValue) => {
    void uid;
    if (!roomId) return;
    await httpsCallable(functions, 'submitBattleAnswer')({ roomId, answer: value });
  };

  const tick = async () => {
    if (!roomId || !room || room.status !== 'playing' || Date.now() < room.roundEndsAt || tickInFlight.current) return;
    tickInFlight.current = true;
    try {
      await httpsCallable(functions, 'advanceBattleRound')({ roomId });
    } finally {
      tickInFlight.current = false;
    }
  };

  const claimWin = async (uid: string) => {
    void uid;
    if (!roomId) return;
    await httpsCallable(functions, 'claimBattleWin')({ roomId });
  };

  return { room, error, retry, ready, answer, tick, claimWin };
}
