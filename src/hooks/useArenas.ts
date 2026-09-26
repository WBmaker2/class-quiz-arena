import { useCallback, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena } from '../lib/arena';
import { isVisibleArena } from '../lib/arena';

export function useArenas(classroomId: string | null) {
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!classroomId) {
      setArenas([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    return onSnapshot(
        query(collection(db, 'arenas'), where('classroomId', '==', classroomId), where('locked', '==', false)),
        (snap) => {
          setArenas(
            snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as Omit<Arena, 'id'>) }))
              .filter(isVisibleArena),
          );
          setLoading(false);
          setError(null);
        },
        () => {
          setError('아레나를 불러오지 못했어요. 인터넷 연결을 확인해주세요.');
          setLoading(false);
        },
      );
  }, [classroomId, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { arenas, loading, error, retry };
}
