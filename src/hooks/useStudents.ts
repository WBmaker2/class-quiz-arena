import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { byXpDesc, type RosterStudent } from '../lib/roster';

export function useStudents(classroomId: string | null) {
  const [students, setStudents] = useState<RosterStudent[]>([]);

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      query(collection(db, 'users'), where('classroomId', '==', classroomId)),
      (snap) => {
        setStudents(
          snap.docs
            .map((d) => ({
              uid: d.id,
              nickname: (d.data().nickname as string) ?? '이름 없음',
              xp: (d.data().xp as number) ?? 0,
            }))
            .sort(byXpDesc),
        );
      },
      () => {},
    );
  }, [classroomId]);

  const removeStudent = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };

  return { students, removeStudent };
}
