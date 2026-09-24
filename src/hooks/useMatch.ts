import { useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { pickBattleProblems } from '../lib/battle';

export interface Me {
  uid: string;
  nickname: string;
  avatar: string;
}

export const BATTLE_ROUND_COUNT = 10;
export const ARENA_NOT_READY_MSG = '선생님이 문제를 준비 중이에요';

export function useMatch(arenaId: string, me: Me) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findOrCreate = async () => {
    setBusy(true);
    try {
      // 방 생성자가 쓸 문제 id를 미리 조회한다. 입장자는 방에 저장된
      // problemIds를 그대로 쓰므로 여기서 다시 뽑지 않는다.
      const probSnap = await getDocs(collection(db, 'arenas', arenaId, 'problems'));
      const allIds = probSnap.docs.map((d) => d.id);
      if (allIds.length < BATTLE_ROUND_COUNT) {
        setError(ARENA_NOT_READY_MSG);
        return;
      }
      const id = await runTransaction(db, async (tx) => {
        const snap = await getDocs(
          query(collection(db, 'rooms'), where('arenaId', '==', arenaId), where('status', '==', 'waiting')),
        );
        const open = snap.docs.find(
          (d) => (d.data().players as { uid: string }[]).length === 1 && (d.data().players as { uid: string }[])[0].uid !== me.uid,
        );
        if (open) {
          const data = open.data();
          tx.update(open.ref, {
            status: 'ready',
            players: [
              ...data.players,
              { uid: me.uid, nickname: me.nickname, avatar: me.avatar, score: 0, ready: false, answers: [] },
            ],
            updatedAt: serverTimestamp(),
          });
          return open.id;
        }
        const ref = doc(collection(db, 'rooms'));
        // 한 번 정하면 방이 끝날 때까지 바뀌지 않는 10문제 고정.
        const problemIds = pickBattleProblems(allIds, ref.id, BATTLE_ROUND_COUNT);
        tx.set(ref, {
          arenaId,
          status: 'waiting',
          players: [{ uid: me.uid, nickname: me.nickname, avatar: me.avatar, score: 0, ready: false, answers: [] }],
          problemIds,
          currentRound: 0,
          roundEndsAt: 0,
          winnerUid: null,
          updatedAt: serverTimestamp(),
        });
        return ref.id;
      });
      setRoomId(id);
    } catch {
      setError('매칭에 실패했어요. 다시 시도해주세요');
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
