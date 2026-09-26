import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { resolveRevealProblemMetadata, type RoundRecord } from '../lib/analytics';
import { isCorrectAnswer } from '../lib/battle';
import type { ProblemKind } from '../lib/arena';

export const ANALYTICS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

interface LoadedProblem {
  id: string;
  text: string;
  kind?: ProblemKind;
  answerIndex: number;
  answerText?: string;
  standardCode?: string;
}

export function useAnalytics(arenaId: string | null, classroomId: string | null, sinceMs: number = Date.now() - ANALYTICS_WINDOW_MS) {
  const [rounds, setRounds] = useState<RoundRecord[]>([]);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!arenaId || !classroomId) {
      setRounds([]);
      setError(false);
      return;
    }
    let active = true;
    setRounds([]);
    setError(false);
    void (async () => {
      try {
        const [roomSnap, probSnap] = await Promise.all([
          getDocs(query(collection(db, 'rooms'), where('classroomId', '==', classroomId), where('arenaId', '==', arenaId), where('status', '==', 'finished'))),
          getDocs(collection(db, 'arenas', arenaId, 'problems')),
        ]);
        const problems: LoadedProblem[] = probSnap.docs.map((d) => {
          const data = d.data() as Partial<LoadedProblem>;
          return { id: d.id, text: typeof data.text === 'string' ? data.text : '문제 내용 없음', answerIndex: data.answerIndex ?? -1, kind: data.kind, answerText: data.answerText, standardCode: data.standardCode };
        });
        const byId = new Map(problems.map((p) => [p.id, p]));
        const out: RoundRecord[] = [];
        for (const d of roomSnap.docs) {
          const data = d.data() as {
            reveals?: Record<string, {
              questionId: string;
              questionText?: string;
              standardCode?: string;
              answers: Record<string, number | string | null>;
              correctAnswer: number | string;
              kind: ProblemKind;
            }>;
            updatedAt?: { toMillis?: () => number };
          };
          const endedAt = data.updatedAt?.toMillis?.() ?? 0;
          if (endedAt < sinceMs) continue;
          for (const [roundIndex, reveal] of Object.entries(data.reveals ?? {})) {
            const prob = byId.get(reveal.questionId);
            const answerKey = Number(roundIndex);
            if (!Number.isInteger(answerKey)) continue;
            const metadata = resolveRevealProblemMetadata(reveal, prob);
            const gradable = reveal.kind === 'short'
              ? { kind: 'short' as const, answerIndex: -1, answerText: String(reveal.correctAnswer) }
              : { kind: reveal.kind, answerIndex: typeof reveal.correctAnswer === 'number' ? reveal.correctAnswer : Number(reveal.correctAnswer) };
            const submitted = Object.entries(reveal.answers ?? {}).flatMap(([uid, answer]) => (
              answer == null ? [] : [{ uid, correct: isCorrectAnswer(answer, gradable) }]
            ));
            out.push({
              roomId: d.id,
              arenaId,
              problemId: reveal.questionId,
              problemTitle: metadata.problemTitle,
              problemIndex: answerKey,
              ...(metadata.standardCode ? { standardCode: metadata.standardCode } : {}),
              correctAnswer: reveal.correctAnswer,
              answers: submitted,
            });
          }
        }
        if (active) setRounds(out);
      } catch {
        if (active) {
          setRounds([]);
          setError(true);
        }
      }
    })();
    return () => { active = false; };
  }, [arenaId, classroomId, sinceMs, retryToken]);

  return { rounds, error, retry: () => setRetryToken((current) => current + 1) };
}
