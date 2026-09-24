import admin from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';

admin.initializeApp({ projectId: 'demo-quiz-arena' });
const db = admin.firestore();

await db.doc('classrooms/A1B2C3').set({
  name: '4학년 3반',
  inviteCode: 'A1B2C3',
  teacherId: 'teacher-demo',
  locked: false,
});

await db.doc('arenas/arena-basics').set({
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
  await db.doc(`arenas/arena-basics/problems/p${i + 1}`).set(p);
}

await db.doc('users/teacher-demo').set({
  nickname: '김선생',
  role: 'teacher',
  avatar: 'cat',
  classroomId: 'A1B2C3',
  xp: 0,
  level: 1,
  streak: 0,
  winCount: 0,
  correctRate: 0,
});
await db.doc('users/student-demo-1').set({
  nickname: '일호',
  role: 'student',
  avatar: 'dog',
  classroomId: 'A1B2C3',
  xp: 250,
  level: 3,
  streak: 2,
  winCount: 5,
  correctRate: 70,
});
await db.doc('users/student-demo-2').set({
  nickname: '이호',
  role: 'student',
  avatar: 'frog',
  classroomId: 'A1B2C3',
  xp: 120,
  level: 2,
  streak: 0,
  winCount: 2,
  correctRate: 55,
});

await db.doc('teacherAllowlist/ketarou85@dc.es.kr').set({
  email: 'ketarou85@dc.es.kr',
  addedBy: 'ketarou85@gmail.com',
  addedAt: admin.firestore.FieldValue.serverTimestamp(),
});

console.log('seeded: classroom A1B2C3, arena-basics, 3 problems');
