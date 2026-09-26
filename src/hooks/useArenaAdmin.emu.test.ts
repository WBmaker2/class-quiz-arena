import { act, renderHook } from '@testing-library/react';
import admin from 'firebase-admin';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { auth, db } from '../lib/firebase';
import { useArenaAdmin } from './useArenaAdmin';

// Admin SDK는 규칙을 타지 않으므로 명단·학급 시드용으로만 쓴다.
process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'demo-quiz-arena' });
}
const adminDb = admin.firestore();

const stamp = Date.now().toString(36);
const TEACHER = `teacher-${stamp}@test.kr`;
const CLASSROOM = `C-${stamp}`;

describe('useArenaAdmin on emulator', () => {
  it('preserves problems and lock on edit, cascades on delete', async () => {
    const teacherCred = await createUserWithEmailAndPassword(auth, TEACHER, 'password123');
    const uid = teacherCred.user.uid;
    try {
      await adminDb.doc(`teacherAllowlist/${TEACHER}`).set({ email: TEACHER });
      await adminDb.doc(`classrooms/${CLASSROOM}`).set({
        name: '테스트반',
        inviteCode: CLASSROOM,
        teacherId: uid,
        locked: false,
      });
      await setDoc(doc(db, 'users', uid), { nickname: '선생', role: 'teacher', classroomId: CLASSROOM });

      const { result } = renderHook(() => useArenaAdmin(CLASSROOM));
      let id = '';
      await act(async () => {
        id = await result.current.saveArena(
          null,
          { title: 't', desc: 'd', subject: '수학', questionCount: 0 },
          [
            { text: 'Q1', options: ['O', 'X', '', ''], answerIndex: 0 },
            { text: 'Q2', options: ['O', 'X', '', ''], answerIndex: 1 },
          ],
        );
      });

      const loaded = await result.current.loadProblems(id);
      expect(loaded).toHaveLength(2);
      expect(loaded[0].text).toBe('Q1');

      await act(async () => {
        await result.current.setLocked(id, true);
      });
      await act(async () => {
        await result.current.saveArena(id, { title: 't2', desc: 'd', subject: '수학', questionCount: 1 }, loaded);
      });
      const arena = (await getDoc(doc(db, 'arenas', id))).data() as { title: string; locked: boolean };
      expect(arena.title).toBe('t2');
      expect(arena.locked).toBe(true);
      expect(await result.current.loadProblems(id)).toHaveLength(2);

      await act(async () => {
        await result.current.removeArena(id);
      });
      expect((await adminDb.doc(`arenas/${id}`).get()).exists).toBe(false);
      expect((await adminDb.collection(`arenas/${id}/problems`).get()).size).toBe(0);
    } finally {
      await signOut(auth);
    }
  }, 60000);
});
