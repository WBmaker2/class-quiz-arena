import admin from 'firebase-admin';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { auth, db, functions } from './firebase';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
if (!admin.apps.length) admin.initializeApp({ projectId: 'demo-quiz-arena' });
const adb = admin.firestore();
const stamp = Date.now().toString(36);

describe('release preflight emulator contract', () => {
  it('checks classroom rules and awardBattle idempotency/member enforcement', async () => {
    const emails = [`teacher-${stamp}@test.kr`, `student-${stamp}@test.kr`, `other-${stamp}@test.kr`];
    const creds = [] as Awaited<ReturnType<typeof createUserWithEmailAndPassword>>[];
    try {
      for (const email of emails) {
        creds.push(await createUserWithEmailAndPassword(auth, email, 'password123'));
        await signOut(auth);
      }
      const [teacher, student, outsider] = creds.map((c) => c.user.uid);
      const classId = `A-${stamp}`;
      const otherClassId = `B-${stamp}`;
      await adb.doc(`teacherAllowlist/${emails[0]}`).set({ email: emails[0] });
      await adb.doc(`classrooms/${classId}`).set({ name: 'A', inviteCode: classId, teacherId: teacher, locked: false });
      await adb.doc(`classrooms/${otherClassId}`).set({ name: 'B', inviteCode: otherClassId, teacherId: outsider, locked: false });
      await adb.doc(`users/${teacher}`).set({ nickname: '교사', role: 'teacher', classroomId: classId });
      await adb.doc(`users/${student}`).set({ nickname: '학생', role: 'student', classroomId: classId, xp: 0, stars: 0 });
      await adb.doc(`users/${outsider}`).set({ nickname: '외부', role: 'student', classroomId: otherClassId, xp: 0, stars: 0 });
      await adb.doc(`arenas/a-${stamp}`).set({ title: '공개', classroomId: classId, locked: false });
      await adb.doc(`arenas/a-${stamp}/problems/q1`).set({ text: 'Q', options: ['O', 'X'], answerIndex: 0 });
      await adb.doc(`rooms/room-${stamp}`).set({ classroomId: classId, status: 'waiting', players: [{ uid: student }, { uid: 'opponent' }] });

      await signInWithEmailAndPassword(auth, emails[2], 'password123');
      await expect(getDoc(doc(db, 'arenas', `a-${stamp}`))).rejects.toThrow();
      await expect(getDoc(doc(db, 'rooms', `room-${stamp}`))).rejects.toThrow();
      await signOut(auth);

      await signInWithEmailAndPassword(auth, emails[1], 'password123');
      expect((await getDoc(doc(db, 'arenas', `a-${stamp}`))).exists()).toBe(true);
      await expect(setDoc(doc(db, 'rooms', `client-room-${stamp}`), { status: 'waiting' })).rejects.toThrow();
      await expect(setDoc(doc(db, 'battles', `client-battle-${stamp}`), { uid: student })).rejects.toThrow();
      await signOut(auth);

      await signInWithEmailAndPassword(auth, emails[0], 'password123');
      const arenas = await getDocs(query(collection(db, 'arenas'), where('classroomId', '==', classId)));
      expect(arenas.docs.some((d) => d.id === `a-${stamp}`)).toBe(true);
      await updateDoc(doc(db, 'arenas', `a-${stamp}/problems/q1`), { text: 'Q2' });
      await updateDoc(doc(db, 'classrooms', classId), { name: 'A edited' });
      await signOut(auth);

      const roomId = `finished-${stamp}`;
      const reveals = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), { answers: { [student]: 0, opponent: 1 }, correctAnswer: 0 }]));
      await adb.doc(`rooms/${roomId}`).set({ serverManaged: true, classroomId: classId, status: 'finished', winnerUid: student, players: [{ uid: student, score: 10 }, { uid: 'opponent', score: 0 }], reveals });
      const award = httpsCallable<{ roomId: string }, { xp: number; stars: number }>(functions, 'awardBattle');
      await signInWithEmailAndPassword(auth, emails[1], 'password123');
      const first = (await award({ roomId })).data;
      const second = (await award({ roomId })).data;
      expect(second).toEqual(first);
      expect((await adb.doc(`users/${student}`).get()).data()?.xp).toBe(first.xp);
      expect((await adb.doc(`battles/${roomId}_${student}`).get()).exists).toBe(true);
      await signOut(auth);
      await signInWithEmailAndPassword(auth, emails[2], 'password123');
      await expect(award({ roomId })).rejects.toThrow();
    } finally {
      if (auth.currentUser) await signOut(auth);
    }
  }, 60000);
});
