import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, doc, getFirestore, setDoc } from 'firebase/firestore';

const app = initializeApp({ apiKey: 'demo-key', authDomain: 'demo.local', projectId: 'demo-quiz-arena' });
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

await setDoc(doc(db, 'classrooms', 'A1B2C3'), {
  name: '4학년 3반',
  inviteCode: 'A1B2C3',
  teacherId: 'teacher-demo',
  locked: false,
});

await setDoc(doc(db, 'arenas', 'arena-basics'), {
  classroomId: 'A1B2C3',
  title: '기초 덧셈 아레나',
  desc: '두 자리 수 덧셈 3문제',
  subject: '수학',
  locked: false,
  createdBy: 'teacher-demo',
});

const problems = [
  { text: '23 + 45 = ?', options: ['67', '68', '69', '70'], answerIndex: 2, roundTimeSec: 30 },
  { text: '51 + 29 = ?', options: ['70', '80', '90', '100'], answerIndex: 1, roundTimeSec: 30 },
  { text: '34 + 58 = ?', options: ['82', '92', '102', '112'], answerIndex: 1, roundTimeSec: 30 },
];
for (const [i, p] of problems.entries()) {
  await setDoc(doc(db, 'arenas', 'arena-basics', 'problems', `p${i + 1}`), p);
}

console.log('seeded: classroom A1B2C3, arena-basics, 3 problems');
