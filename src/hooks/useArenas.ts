import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena } from '../lib/arena';
import { isVisibleArena } from '../lib/arena';

export function useArenas() {
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'arenas'), where('locked', '==', false)),
        (snap) => {
          setArenas(
            snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as Omit<Arena, 'id'>) }))
              .filter(isVisibleArena),
          );
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      ),
    [],
  );

  return { arenas, loading };
}
