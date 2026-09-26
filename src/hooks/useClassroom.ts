import { useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TEACHER_NOT_ALLOWLISTED } from '../lib/admin';
import { generateInviteCode, isValidInviteCode, normalizeInviteCode } from '../lib/classroom';
import { validateNickname } from '../lib/nickname';
import { seedDefaultArenas } from '../lib/seedDefaults';

export interface JoinInfo {
  nickname: string;
  role: 'teacher' | 'student';
  avatar: string;
}

export interface JoinResult {
  ok: boolean;
  error?: string;
}

export interface TeacherClassroom {
  id: string;
  name: string;
  inviteCode: string;
}

/** 이름 비교용 정리 (앞뒤 공백·연속 공백 무시). */
export function normalizeClassroomName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/** 선생님의 학급 중 같은 이름이 있으면 그 학급 id. 자기 자신(exceptId)은 제외. */
async function findDuplicateName(teacherUid: string, name: string, exceptId?: string): Promise<string | null> {
  const snap = await getDocs(query(collection(db, 'classrooms'), where('teacherId', '==', teacherUid)));
  const want = normalizeClassroomName(name);
  for (const d of snap.docs) {
    if (d.id !== exceptId && normalizeClassroomName((d.data().name as string) ?? '') === want) {
      return d.id;
    }
  }
  return null;
}

/** 선생님이 개설한 학급 목록 (실시간). 실패하면 빈 목록. */
export function useTeacherClassrooms(uid: string | null) {  const [classrooms, setClassrooms] = useState<TeacherClassroom[]>([]);
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

/** 학급 문서 1개 구독 (이름·초대코드 표시용). */
export function useClassroomDoc(classroomId: string | null) {
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      doc(db, 'classrooms', classroomId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { name?: string; inviteCode?: string };
          setName(data.name ?? '');
          setInviteCode(data.inviteCode ?? classroomId);
        }
      },
      () => {},
    );
  }, [classroomId]);

  return { name, inviteCode };
}

export function useClassroom() {
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  const join = async (code: string, uid: string, info: JoinInfo): Promise<JoinResult> => {
    if (!mounted.current) return { ok: false, error: '다시 시도해주세요' };
    const normalized = normalizeInviteCode(code);
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return { ok: false, error: '초대 코드 6자리를 확인해주세요' };
    }
    const nameError = validateNickname(info.nickname);
    if (nameError) {
      setError(nameError);
      return { ok: false, error: nameError };
    }
    try {
      const snap = await getDoc(doc(db, 'classrooms', normalized));
      if (!mounted.current) return { ok: false, error: '다시 시도해주세요' };
      if (!snap.exists() || (snap.data().locked as boolean)) {
        setError('들어갈 수 없는 학급이에요. 코드를 확인해주세요');
        return { ok: false, error: '들어갈 수 없는 학급이에요. 코드를 확인해주세요' };
      }
      setError(null);
      await setDoc(
        doc(db, 'users', uid),
        // 초대로 들어오면 무조건 학생 (선생님 사칭 방지, 규칙도 강제)
        { nickname: info.nickname, role: 'student', classroomId: normalized },
        { merge: true },
      );
      if (!mounted.current) return { ok: false, error: '다시 시도해주세요' };
      setClassroomId(normalized);
      return { ok: true };
    } catch {
      if (!mounted.current) return { ok: false, error: '연결에 실패했어요. 다시 시도해주세요' };
      setError('연결에 실패했어요. 다시 시도해주세요');
      return { ok: false, error: '연결에 실패했어요. 다시 시도해주세요' };
    }
  };

  const create = async (name: string, uid: string, nickname: string, avatar: string): Promise<string | null> => {
    void avatar;
    if (!mounted.current) return null;
    const nameError = validateNickname(nickname);
    if (nameError) {
      setError(nameError);
      return null;
    }
    try {
      if (await findDuplicateName(uid, name)) {
        if (!mounted.current) return null;
        setError('같은 이름의 학급이 이미 있어요');
        return null;
      }
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
        { nickname, role: 'teacher', classroomId: code },
        { merge: true },
      );
      if (!mounted.current) return null;
      setError(null);
      setClassroomId(code);
      // 기본 6개 아레나를 잠긴 상태로 미리 넣어둔다. 실패해도 학급은 열린다.
      try {
        await seedDefaultArenas(code, uid);
      } catch {
        /* 빈 아레나 화면의 가져오기 버튼으로 나중에 넣을 수 있다 */
      }
      if (!mounted.current) return null;
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

  const select = (id: string | null) => {
    setClassroomId(id);
  };

  /** 학급 이름 변경. 성공하면 null, 실패하면 사람이 읽는 이유. */
  const renameClassroom = async (id: string, name: string, teacherUid?: string | null): Promise<string | null> => {
    const trimmed = normalizeClassroomName(name);
    if (!trimmed) {
      setError('학급 이름을 입력해주세요');
      return '학급 이름을 입력해주세요';
    }
    try {
      if (teacherUid && (await findDuplicateName(teacherUid, trimmed, id))) {
        if (!mounted.current) return '같은 이름의 학급이 이미 있어요';
        setError('같은 이름의 학급이 이미 있어요');
        return '같은 이름의 학급이 이미 있어요';
      }
      await setDoc(doc(db, 'classrooms', id), { name: trimmed }, { merge: true });
      if (!mounted.current) return '연결에 실패했어요. 다시 시도해주세요';
      setError(null);
      return null;
    } catch {
      if (!mounted.current) return '연결에 실패했어요. 다시 시도해주세요';
      setError('연결에 실패했어요. 다시 시도해주세요');
      return '연결에 실패했어요. 다시 시도해주세요';
    }
  };

  /**
   * 학급 삭제. 딸린 대결방·아레나·문제를 함께 지우고 남은 첫 학급 id를 돌려준다.
   * 학생 명단은 두되 (XP·보관함 유지), 학급이 사라져 다시 들어와야 한다.
   */
  const deleteClassroom = async (id: string, teacherUid: string): Promise<{ ok: boolean; next: string | null }> => {
    try {
      const arenaSnap = await getDocs(query(collection(db, 'arenas'), where('classroomId', '==', id)));
      for (const a of arenaSnap.docs) {
        const roomSnap = await getDocs(query(collection(db, 'rooms'), where('arenaId', '==', a.id)));
        for (const r of roomSnap.docs) {
          await deleteDoc(doc(db, 'rooms', r.id));
        }
        const probSnap = await getDocs(collection(db, 'arenas', a.id, 'problems'));
        for (const p of probSnap.docs) {
          await deleteDoc(doc(db, 'arenas', a.id, 'problems', p.id));
        }
        await deleteDoc(doc(db, 'arenas', a.id));
      }
      await deleteDoc(doc(db, 'classrooms', id));
      const restSnap = await getDocs(query(collection(db, 'classrooms'), where('teacherId', '==', teacherUid)));
      const next = restSnap.docs.map((d) => d.id).find((cid) => cid !== id) ?? null;
      if (!mounted.current) return { ok: false, next: null };
      setError(null);
      return { ok: true, next };
    } catch {
      if (!mounted.current) return { ok: false, next: null };
      setError('삭제에 실패했어요. 다시 시도해주세요');
      return { ok: false, next: null };
    }
  };

  return { classroomId, join, create, select, renameClassroom, deleteClassroom, error };
}
