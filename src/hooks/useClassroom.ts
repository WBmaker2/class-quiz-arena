import { useEffect, useRef, useState } from 'react';
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
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  const join = async (code: string, uid: string, info: JoinInfo) => {
    if (!mounted.current) return;
    const normalized = normalizeInviteCode(code);
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'classrooms', normalized));
      if (!mounted.current) return;
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
      if (!mounted.current) return;
      setClassroomId(normalized);
    } catch {
      if (!mounted.current) return;
      setError('연결에 실패했어요. 다시 시도해주세요');
    }
  };

  const create = async (name: string, uid: string, nickname: string, avatar: string) => {
    if (!mounted.current) return;
    try {
      const code = generateInviteCode();
      await setDoc(doc(db, 'classrooms', code), {
        name,
        inviteCode: code,
        teacherId: uid,
        locked: false,
      });
      if (!mounted.current) return;
      await setDoc(
        doc(db, 'users', uid),
        { nickname, role: 'teacher', avatar, classroomId: code },
        { merge: true },
      );
      if (!mounted.current) return;
      setError(null);
      setClassroomId(code);
    } catch {
      if (!mounted.current) return;
      setError('연결에 실패했어요. 다시 시도해주세요');
    }
  };

  return { classroomId, join, create, error };
}
