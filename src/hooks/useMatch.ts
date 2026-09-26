import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export interface Me {
  uid: string;
  nickname: string;
  avatar: string;
}

export const BATTLE_ROUND_COUNT = 10;
export const ARENA_NOT_READY_MSG = '선생님이 문제를 준비 중이에요';

export function useMatch(arenaId: string, _me: Me, classroomId: string | null, resumeRoomId?: string | null) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findOrCreate = async () => {
    if (!classroomId) {
      setError('먼저 학급에 들어가 주세요.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const match = httpsCallable<{ arenaId: string; resumeRoomId?: string }, { roomId: string }>(functions, 'matchBattle');
      const { data } = await match({ arenaId, ...(resumeRoomId ? { resumeRoomId } : {}) });
      setRoomId(data.roomId);
    } catch (cause) {
      const code = (cause as { code?: string })?.code;
      setError(code === 'functions/failed-precondition' ? ARENA_NOT_READY_MSG : '매칭에 실패했어요. 다시 시도해주세요');
    } finally {
      setBusy(false);
    }
  };

  const retry = async () => {
    setError(null);
    await findOrCreate();
  };

  return { roomId, busy, error, findOrCreate, retry };
}
