import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useTeacherAllowlist(enabled: boolean) {
  const [teachers, setTeachers] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;
    return onSnapshot(
      collection(db, 'teacherAllowlist'),
      (snap) => {
        setTeachers(snap.docs.map((d) => d.id));
      },
      () => {},
    );
  }, [enabled]);

  const addTeacher = async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) return;
    await setDoc(doc(db, 'teacherAllowlist', trimmed), { email: trimmed, addedAt: serverTimestamp() });
  };

  const removeTeacher = async (email: string) => {
    await deleteDoc(doc(db, 'teacherAllowlist', email));
  };

  return { teachers, addTeacher, removeTeacher };
}
