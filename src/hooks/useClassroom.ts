import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateInviteCode, isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export interface JoinInfo {
  nickname: string;
  role: 'teacher' | 'student';
  avatar: string;
}

export function useClassroom() {
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const join = async (code: string, uid: string, info: JoinInfo) => {
    const normalized = normalizeInviteCode(code);
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    const snap = await getDoc(doc(db, 'classrooms', normalized));
    if (!snap.exists() || (snap.data().locked as boolean)) {
      setError('들어갈 수 없는 학급이에요. 코드를 확인해주세요');
      return;
    }
    setError(null);
    await setDoc(
      doc(db, 'users', uid),
      { nickname: info.nickname, role: info.role, avatar: info.avatar, classroomId: normalized },
      { merge: true },
    );
    setClassroomId(normalized);
  };

  const create = async (name: string, uid: string, nickname: string) => {
    const code = generateInviteCode();
    await setDoc(doc(db, 'classrooms', code), {
      name,
      inviteCode: code,
      teacherId: uid,
      locked: false,
    });
    await setDoc(
      doc(db, 'users', uid),
      { nickname, role: 'teacher', avatar: 'cat', classroomId: code },
      { merge: true },
    );
    setError(null);
    setClassroomId(code);
  };

  return { classroomId, join, create, error };
}
