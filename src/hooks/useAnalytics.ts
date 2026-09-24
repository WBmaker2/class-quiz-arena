import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RoundRecord } from '../lib/analytics';

export function useAnalytics(arenaId: string | null) {
  const [rounds, setRounds] = useState<RoundRecord[]>([]);

  useEffect(() => {
    if (!arenaId) return;
    void (async () => {
      try {
        const [roomSnap, probSnap] = await Promise.all([
          getDocs(query(collection(db, 'rooms'), where('arenaId', '==', arenaId), where('status', '==', 'finished'))),
          getDocs(collection(db, 'arenas', arenaId, 'problems')),
        ]);
        const correctByIndex = probSnap.docs
          .sort((a, b) => (a.id < b.id ? -1 : 1))
          .map((d) => d.data().answerIndex as number);
        const out: RoundRecord[] = [];
        for (const d of roomSnap.docs) {
          const data = d.data() as { players?: { uid: string; answers?: (number | null)[] }[] };
          const players = data.players ?? [];
          const maxRounds = Math.max(0, ...players.map((p) => p.answers?.length ?? 0));
          for (let i = 0; i < maxRounds; i += 1) {
            out.push({
              roomId: d.id,
              arenaId,
              problemIndex: i,
              answers: players.map((p) => ({ uid: p.uid, correct: p.answers?.[i] === correctByIndex[i] })),
            });
          }
        }
        setRounds(out);
      } catch {
        setRounds([]);
      }
    })();
  }, [arenaId]);

  return { rounds };
}
