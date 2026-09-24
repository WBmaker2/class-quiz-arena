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

export interface Me {
  uid: string;
  nickname: string;
  avatar: string;
}

export function useMatch(arenaId: string, me: Me) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const findOrCreate = async () => {
    setBusy(true);
    try {
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
        tx.set(ref, {
          arenaId,
          status: 'waiting',
          players: [{ uid: me.uid, nickname: me.nickname, avatar: me.avatar, score: 0, ready: false, answers: [] }],
          currentRound: 0,
          roundEndsAt: 0,
          winnerUid: null,
          updatedAt: serverTimestamp(),
        });
        return ref.id;
      });
      setRoomId(id);
    } finally {
      setBusy(false);
    }
  };

  return { roomId, busy, findOrCreate };
}
