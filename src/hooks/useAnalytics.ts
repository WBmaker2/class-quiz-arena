import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RoundRecord } from '../lib/analytics';
import { isCorrectAnswer } from '../lib/battle';
import type { ProblemKind } from '../lib/arena';

export const ANALYTICS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

interface LoadedProblem {
  id: string;
  kind?: ProblemKind;
  answerIndex: number;
  answerText?: string;
  standardCode?: string;
}

export function useAnalytics(arenaId: string | null, sinceMs: number = Date.now() - ANALYTICS_WINDOW_MS) {
  const [rounds, setRounds] = useState<RoundRecord[]>([]);

  useEffect(() => {
    if (!arenaId) return;
    void (async () => {
      try {
        const [roomSnap, probSnap] = await Promise.all([
          getDocs(query(collection(db, 'rooms'), where('arenaId', '==', arenaId), where('status', '==', 'finished'))),
          getDocs(collection(db, 'arenas', arenaId, 'problems')),
        ]);
        const problems: LoadedProblem[] = probSnap.docs.map((d) => {
          const data = d.data() as Partial<LoadedProblem>;
          return { id: d.id, answerIndex: data.answerIndex ?? -1, kind: data.kind, answerText: data.answerText, standardCode: data.standardCode };
        });
        const byId = new Map(problems.map((p) => [p.id, p]));
        const sortedIds = [...problems].sort((a, b) => (a.id < b.id ? -1 : 1)).map((p) => p.id);
        const out: RoundRecord[] = [];
        for (const d of roomSnap.docs) {
          const data = d.data() as {
            players?: { uid: string; answers?: (number | string | null)[] }[];
            problemIds?: string[];
            updatedAt?: { toMillis?: () => number };
          };
          const endedAt = data.updatedAt?.toMillis?.() ?? 0;
          if (endedAt < sinceMs) continue;
          const players = data.players ?? [];
          const order = data.problemIds?.length ? data.problemIds : sortedIds;
          const maxRounds = Math.max(0, ...players.map((p) => p.answers?.length ?? 0));
          for (let i = 0; i < maxRounds; i += 1) {
            const prob = byId.get(order[i] ?? '');
            out.push({
              roomId: d.id,
              arenaId,
              problemIndex: i,
              ...(prob?.standardCode ? { standardCode: prob.standardCode } : {}),
              answers: players.map((p) => ({
                uid: p.uid,
                correct: isCorrectAnswer(p.answers?.[i] ?? null, prob ?? { answerIndex: -1 }),
              })),
            });
          }
        }
        setRounds(out);
      } catch {
        setRounds([]);
      }
    })();
  }, [arenaId, sinceMs]);

  return { rounds };
}
