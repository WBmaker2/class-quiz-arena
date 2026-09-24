import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena, Problem } from '../lib/arena';

export interface ArenaInput {
  title: string;
  desc: string;
  subject: string;
  aiCount: number;
}

export function useArenaAdmin(classroomId: string | null) {
  const [arenas, setArenas] = useState<Arena[]>([]);

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      query(collection(db, 'arenas'), where('classroomId', '==', classroomId)),
      (snap) => {
        setArenas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Arena, 'id'>) })));
      },
      () => {},
    );
  }, [classroomId]);

  const saveArena = async (id: string | null, input: ArenaInput, problems: Omit<Problem, 'id'>[]) => {
    const ref = id ? doc(db, 'arenas', id) : doc(collection(db, 'arenas'));
    await setDoc(
      ref,
      { classroomId, title: input.title, desc: input.desc, subject: input.subject, aiCount: input.aiCount, locked: false },
      { merge: true },
    );
    const existing = id ? await getDocs(collection(db, 'arenas', ref.id, 'problems')) : { docs: [] as { id: string }[] };
    for (const d of existing.docs) {
      await deleteDoc(doc(db, 'arenas', ref.id, 'problems', d.id));
    }
    for (const [i, p] of problems.entries()) {
      await setDoc(doc(db, 'arenas', ref.id, 'problems', `p${i + 1}`), { ...p, roundTimeSec: 30 });
    }
    return ref.id;
  };

  const removeArena = async (id: string) => {
    await deleteDoc(doc(db, 'arenas', id));
  };

  const setLocked = async (id: string, locked: boolean) => {
    await setDoc(doc(db, 'arenas', id), { locked }, { merge: true });
  };

  return { arenas, saveArena, removeArena, setLocked };
}
