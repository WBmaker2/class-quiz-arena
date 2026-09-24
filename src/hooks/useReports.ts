import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface NameReport {
  id: string;
  reporterUid: string;
  reporterNickname: string;
  reportedUid: string;
  reportedNickname: string;
  arenaId: string;
  classroomId: string;
  status: 'open' | 'resolved';
}

export interface NewNameReport {
  reporterUid: string;
  reporterNickname: string;
  reportedUid: string;
  reportedNickname: string;
  arenaId: string;
  classroomId: string;
}

export function useReports(classroomId: string | null) {
  const [reports, setReports] = useState<NameReport[]>([]);

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      query(collection(db, 'reports'), where('classroomId', '==', classroomId)),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NameReport, 'id'>) }));
        rows.sort((a, b) => (a.status === b.status ? 0 : a.status === 'open' ? -1 : 1));
        setReports(rows);
      },
      () => {},
    );
  }, [classroomId]);

  const resolveReport = async (id: string) => {
    await setDoc(doc(db, 'reports', id), { status: 'resolved' }, { merge: true });
  };

  return { reports, resolveReport };
}
