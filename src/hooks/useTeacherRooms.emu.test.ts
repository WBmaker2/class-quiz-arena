import admin from 'firebase-admin';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { renderHook, waitFor } from '@testing-library/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { auth, db } from '../lib/firebase';
import { useTeacherRooms } from './useTeacherRooms';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
if (!admin.apps.length) admin.initializeApp({ projectId: 'demo-quiz-arena' });
const adminDb = admin.firestore();
const stamp = Date.now().toString(36);

describe('useTeacherRooms on emulator', () => {
  it('lists live, abandoned, and finished rooms for the teacher classroom', async () => {
    const email = `teacher-rooms-${stamp}@test.kr`;
    const cred = await createUserWithEmailAndPassword(auth, email, 'password123');
    const uid = cred.user.uid;
    const classroomId = `rooms-${stamp}`;
    const roomIds = {
      waiting: `waiting-${stamp}`,
      ready: `ready-${stamp}`,
      playing: `playing-${stamp}`,
      abandoned: `abandoned-${stamp}`,
      finished: `finished-${stamp}`,
    };
    let unmount = () => {};
    try {
      await adminDb.doc(`teacherAllowlist/${email}`).set({ email });
      await adminDb.doc(`classrooms/${classroomId}`).set({
        name: '테스트반', inviteCode: classroomId, teacherId: uid, locked: false,
      });
      await setDoc(doc(db, 'users', uid), { nickname: '선생님', role: 'teacher', classroomId });
      expect((await getDoc(doc(db, 'users', uid))).exists()).toBe(true);

      for (const [status, id] of Object.entries(roomIds)) {
        await adminDb.doc(`rooms/${id}`).set({
          classroomId,
          arenaId: 'arena-test',
          status,
          players: [{ uid: 'student', nickname: '학생' }],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      const hook = renderHook(() => useTeacherRooms(classroomId));
      unmount = hook.unmount;
      await waitFor(() => {
        expect(hook.result.current.live.map((room) => room.id).sort()).toEqual([
          roomIds.playing, roomIds.ready, roomIds.waiting,
        ].sort());
        expect(hook.result.current.abandoned.map((room) => room.id)).toEqual([roomIds.abandoned]);
        expect(hook.result.current.finished.map((room) => room.id)).toEqual([roomIds.finished]);
        expect(hook.result.current.roomsError).toBe(false);
      });
    } finally {
      unmount();
      await signOut(auth);
    }
  }, 60000);
});
