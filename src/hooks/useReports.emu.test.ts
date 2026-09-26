import admin from 'firebase-admin';
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { auth, db } from '../lib/firebase';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'demo-quiz-arena' });
}
const adminDb = admin.firestore();

const stamp = Date.now().toString(36);
const TEACHER = `rep-teacher-${stamp}@test.kr`;
const CLASSROOM = `RC-${stamp}`;

describe('reports rules on emulator', () => {
  it('lets students file, teachers review, and blocks the rest', async () => {
    const teacherCred = await createUserWithEmailAndPassword(auth, TEACHER, 'password123');
    const teacherUid = teacherCred.user.uid;
    await adminDb.doc(`teacherAllowlist/${TEACHER}`).set({ email: TEACHER });
    await adminDb.doc(`classrooms/${CLASSROOM}`).set({
      name: '신고반',
      inviteCode: CLASSROOM,
      teacherId: teacherUid,
      locked: false,
    });
    await signOut(auth);

    const studentCred = await signInAnonymously(auth);
    const studentUid = studentCred.user.uid;
    await adminDb.doc(`users/${studentUid}`).set({ nickname: '일호', role: 'student', classroomId: CLASSROOM });
    const ref = await addDoc(collection(db, 'reports'), {
      reporterUid: studentUid,
      reporterNickname: '일호',
      reportedUid: 'u2',
      reportedNickname: '나쁜이름',
      arenaId: 'a1',
      classroomId: CLASSROOM,
      status: 'open',
      createdAt: Date.now(),
    });
    expect(ref.id).toBeTruthy();

    // 남의 이름으로 신고는 거부
    await expect(
      addDoc(collection(db, 'reports'), {
        reporterUid: 'someone-else',
        reporterNickname: '일호',
        reportedUid: 'u2',
        reportedNickname: '나쁜이름',
        arenaId: 'a1',
        classroomId: CLASSROOM,
        status: 'open',
        createdAt: Date.now(),
      }),
    ).rejects.toThrow();

    // 학생은 목록을 읽을 수 없음
    await expect(getDocs(query(collection(db, 'reports'), where('classroomId', '==', CLASSROOM)))).rejects.toThrow();
    await signOut(auth);

    // 선생님은 읽고 처리할 수 있음
    await signInWithEmailAndPassword(auth, TEACHER, 'password123');
    const list = await getDocs(query(collection(db, 'reports'), where('classroomId', '==', CLASSROOM)));
    expect(list.docs.some((d) => d.id === ref.id)).toBe(true);
    await setDoc(doc(db, 'reports', ref.id), { status: 'resolved' }, { merge: true });
    await signOut(auth);
  }, 60000);
});
