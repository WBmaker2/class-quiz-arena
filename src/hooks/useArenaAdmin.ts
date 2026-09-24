import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena, Problem } from '../lib/arena';

export interface ArenaInput {
  title: string;
  desc: string;
  subject: string;
  aiCount: number;
}

export interface EditableProblem {
  text: string;
  options: [string, string, string, string];
  answerIndex: number;
}

function toEditable(data: Record<string, unknown>): EditableProblem {
  const options = (data.options as string[] | undefined) ?? [];
  return {
    text: (data.text as string) ?? '',
    options: [options[0] ?? '', options[1] ?? '', options[2] ?? '', options[3] ?? ''],
    answerIndex: (data.answerIndex as number) ?? 0,
  };
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

  const saveArena = async (id: string | null, input: ArenaInput, problems: EditableProblem[]) => {
    const ref = id ? doc(db, 'arenas', id) : doc(collection(db, 'arenas'));
    await setDoc(
      ref,
      {
        classroomId,
        title: input.title,
        desc: input.desc,
        subject: input.subject,
        aiCount: input.aiCount,
        // 수정 시 기존 잠금 유지 (새로 만들 때만 false)
        ...(id ? {} : { locked: false }),
      },
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

  const loadProblems = async (arenaId: string): Promise<EditableProblem[]> => {
    const snap = await getDocs(query(collection(db, 'arenas', arenaId, 'problems'), orderBy('__name__')));
    return snap.docs
      .map((d) => ({ id: d.id, ...toEditable(d.data()) }))
      .sort((a, b) => parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10))
      .map(({ text, options, answerIndex }) => ({ text, options, answerIndex }));
  };

  const removeArena = async (id: string) => {
    const snap = await getDocs(collection(db, 'arenas', id, 'problems'));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'arenas', id, 'problems', d.id));
    }
    await deleteDoc(doc(db, 'arenas', id));
  };

  const setLocked = async (id: string, locked: boolean) => {
    await setDoc(doc(db, 'arenas', id), { locked }, { merge: true });
  };

  return { arenas, saveArena, loadProblems, removeArena, setLocked };
}
