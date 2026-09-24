import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena, ProblemKind } from '../lib/arena';

export interface ArenaInput {
  title: string;
  desc: string;
  subject: string;
  questionCount: number;
  grade?: number;
  topic?: string;
  standards?: string[];
  status?: 'draft' | 'published';
}

export interface EditableProblem {
  text: string;
  kind?: ProblemKind;
  options: [string, string, string, string];
  answerIndex: number;
  answerText?: string;
  explanation?: string;
  standardCode?: string;
}

const VALID_KINDS: ProblemKind[] = ['choice', 'ox', 'short'];

function toEditable(data: Record<string, unknown>): EditableProblem {
  const options = (data.options as string[] | undefined) ?? [];
  const kind = (data.kind as ProblemKind) ?? 'choice';
  return {
    text: (data.text as string) ?? '',
    kind: VALID_KINDS.includes(kind) ? kind : 'choice',
    options: [options[0] ?? '', options[1] ?? '', options[2] ?? '', options[3] ?? ''],
    answerIndex: (data.answerIndex as number) ?? 0,
    answerText: (data.answerText as string) ?? '',
    explanation: (data.explanation as string) ?? '',
    standardCode: (data.standardCode as string) ?? '',
  };
}

export interface BankArena {
  id: string;
  title: string;
  desc: string;
  subject: string;
  grade?: number;
}

/** 은행 복제용 순수 조립. 테스트에서 가져오기 결과를 검증한다. */
export function buildArenaCopy(
  source: BankArena & { topic?: string; standards?: string[]; questionCount?: number },
  problems: EditableProblem[],
): { input: ArenaInput; problems: EditableProblem[] } {
  return {
    input: {
      title: `${source.title} (복사)`,
      desc: source.desc,
      subject: source.subject,
      questionCount: problems.length,
      grade: source.grade,
      topic: source.topic,
      standards: source.standards,
      status: 'published',
    },
    problems,
  };
}

export function useArenaAdmin(classroomId: string | null) {
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [bank, setBank] = useState<BankArena[]>([]);

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

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      query(collection(db, 'arenas'), where('locked', '==', false)),
      (snap) => {
        setBank(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<BankArena, 'id'> & { classroomId?: string; status?: string }) }))
            .filter((a) => a.classroomId !== classroomId && a.status !== 'draft')
            .map(({ id, title, desc, subject, grade }) => ({ id, title, desc, subject, grade })),
        );
      },
      () => {},
    );
  }, [classroomId]);

  const saveArena = async (id: string | null, input: ArenaInput, problems: EditableProblem[]) => {
    // 공개는 10문제 이상일 때만 (Task 4 대결 <10 차단과 짝을 이루는 에디터 가드)
    if (input.status === 'published' && problems.length < 10) {
      throw new Error('문제를 10개 이상 넣어주세요');
    }
    const ref = id ? doc(db, 'arenas', id) : doc(collection(db, 'arenas'));
    await setDoc(
      ref,
      {
        classroomId,
        title: input.title,
        desc: input.desc,
        subject: input.subject,
        questionCount: input.questionCount,
        // 수정 시 기존 잠금 유지 (새로 만들 때만 false)
        ...(id ? {} : { locked: false }),
        // 새로 만들 때만 draft 기본값, 수정 시 기존 상태 유지
        ...(input.status ? { status: input.status } : id ? {} : { status: 'draft' }),
        ...(input.grade !== undefined ? { grade: input.grade } : {}),
        ...(input.topic !== undefined ? { topic: input.topic } : {}),
        ...(input.standards !== undefined ? { standards: input.standards } : {}),
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
      .map(({ text, kind, options, answerIndex, answerText, explanation, standardCode }) => ({ text, kind, options, answerIndex, answerText, explanation, standardCode }));
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

  const setShowPlayers = async (id: string, showPlayers: boolean) => {
    await setDoc(doc(db, 'arenas', id), { showPlayers }, { merge: true });
  };

  const setTtsEnabled = async (id: string, ttsEnabled: boolean) => {
    await setDoc(doc(db, 'arenas', id), { ttsEnabled }, { merge: true });
  };

  /** 은행 아레나를 내 학급에 비공개 복제한다. */
  const copyArena = async (sourceId: string) => {
    const sourceSnap = await getDoc(doc(db, 'arenas', sourceId));
    if (!sourceSnap.exists()) throw new Error('은행에 없는 아레나예요');
    const source = sourceSnap.data() as BankArena & {
      topic?: string;
      standards?: string[];
      questionCount?: number;
    };
    const probSnap = await getDocs(collection(db, 'arenas', sourceId, 'problems'));
    const problems = probSnap.docs
      .map((d) => ({ id: d.id, ...toEditable(d.data()) }))
      .sort((a, b) => parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10))
      .map(({ text, kind, options, answerIndex, answerText, explanation, standardCode }) => ({
        text,
        kind,
        options,
        answerIndex,
        answerText,
        explanation,
        standardCode,
      }));
    const { input, problems: items } = buildArenaCopy(source, problems);
    const ref = doc(collection(db, 'arenas'));
    await setDoc(ref, { ...input, classroomId, locked: true });
    for (const [i, p] of items.entries()) {
      await setDoc(doc(db, 'arenas', ref.id, 'problems', `p${i + 1}`), { ...p, roundTimeSec: 30 });
    }
    return ref.id;
  };

  return { arenas, bank, saveArena, loadProblems, removeArena, setLocked, setShowPlayers, setTtsEnabled, copyArena };
}
