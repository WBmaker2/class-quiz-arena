import { useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TEACHER_NOT_ALLOWLISTED } from '../lib/admin';
import { generateInviteCode, isValidInviteCode, normalizeInviteCode } from '../lib/classroom';
import { validateNickname } from '../lib/nickname';

export interface JoinInfo {
  nickname: string;
  role: 'teacher' | 'student';
  avatar: string;
}

export interface TeacherClassroom {
  id: string;
  name: string;
  inviteCode: string;
}

/** 선생님이 개설한 학급 목록 (실시간). 실패하면 빈 목록. */
export function useTeacherClassrooms(uid: string | null) {
  const [classrooms, setClassrooms] = useState<TeacherClassroom[]>([]);
  // uid가 없으면(테스트) 조회 없이 끝난 상태로 시작한다
  const [loading, setLoading] = useState(uid !== null);

  useEffect(() => {
    if (!uid) {
      setClassrooms([]);
      setLoading(false);
      return;
    }
    return onSnapshot(
      query(collection(db, 'classrooms'), where('teacherId', '==', uid)),
      (snap) => {
        setClassrooms(
          snap.docs.map((d) => {
            const data = d.data() as { name?: string; inviteCode?: string };
            return { id: d.id, name: data.name ?? '(이름 없음)', inviteCode: data.inviteCode ?? d.id };
          }),
        );
        setLoading(false);
      },
      () => {
        setClassrooms([]);
        setLoading(false);
      },
    );
  }, [uid]);

  return { classrooms, loading };
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
    const nameError = validateNickname(info.nickname);
    if (nameError) {
      setError(nameError);
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
        // 초대로 들어오면 무조건 학생 (선생님 사칭 방지, 규칙도 강제)
        { nickname: info.nickname, role: 'student', avatar: info.avatar, classroomId: normalized },
        { merge: true },
      );
      if (!mounted.current) return;
      setClassroomId(normalized);
    } catch {
      if (!mounted.current) return;
      setError('연결에 실패했어요. 다시 시도해주세요');
    }
  };

  const create = async (name: string, uid: string, nickname: string, avatar: string): Promise<string | null> => {
    if (!mounted.current) return null;
    const nameError = validateNickname(nickname);
    if (nameError) {
      setError(nameError);
      return null;
    }
    try {
      const code = generateInviteCode();
      await setDoc(doc(db, 'classrooms', code), {
        name,
        inviteCode: code,
        teacherId: uid,
        locked: false,
      });
      if (!mounted.current) return null;
      await setDoc(
        doc(db, 'users', uid),
        { nickname, role: 'teacher', avatar, classroomId: code },
        { merge: true },
      );
      if (!mounted.current) return null;
      setError(null);
      setClassroomId(code);
      return code;
    } catch (e) {
      if (!mounted.current) return null;
      setError(
        (e as { code?: string })?.code === 'permission-denied'
          ? TEACHER_NOT_ALLOWLISTED
          : '연결에 실패했어요. 다시 시도해주세요',
      );
      return null;
    }
  };

  const select = (id: string) => {
    setClassroomId(id);
  };

  return { classroomId, join, create, select, error };
}
