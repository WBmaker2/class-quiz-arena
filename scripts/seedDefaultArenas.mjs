import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

export const CLASSROOM_ID = 'A1B2C3';
export const OWNER_ID = 'teacher-demo';
export const PROJECT_ID = 'demo-quiz-arena';

export const EXPECTED_ARENAS = [
  { id: 'arena-add-sub-3', grade: 3, subject: '수학' },
  { id: 'arena-idiom-6', grade: 6, subject: '국어' },
  { id: 'arena-fraction-4', grade: 4, subject: '수학' },
  { id: 'arena-water-5', grade: 4, subject: '과학' },
  { id: 'arena-map-4', grade: 4, subject: '사회' },
  { id: 'arena-english-5', grade: 5, subject: '영어' },
];

// 기본 120문항 단일 원천: scripts/defaultArenas.json (앱 TS 모듈과 공유).
// 아래 내용은 직접 쓴 초등 쉬운 말 짧은 문장이다. 교과서·교육과정 원문 복붙 없음.
export const ARENAS = require('./defaultArenas.json');

export function validateArenas(arenas = ARENAS) {
  const errors = [];
  if (arenas.length !== 6) errors.push(`arenas: expected 6, got ${arenas.length}`);
  const ids = new Set(arenas.map((a) => a.id));
  for (const exp of EXPECTED_ARENAS) {
    if (!ids.has(exp.id)) errors.push(`arenas: missing ${exp.id}`);
  }
  for (const arena of arenas) {
    const where = `arenas/${arena.id}`;
    const exp = EXPECTED_ARENAS.find((e) => e.id === arena.id);
    if (exp && (arena.grade !== exp.grade || arena.subject !== exp.subject)) {
      errors.push(`${where}: expected ${exp.grade}/${exp.subject}, got ${arena.grade}/${arena.subject}`);
    }
    if (arena.classroomId !== CLASSROOM_ID) errors.push(`${where}: classroomId must be ${CLASSROOM_ID}`);
    if (arena.locked !== false) errors.push(`${where}: locked must be false`);
    if (arena.showPlayers !== false) errors.push(`${where}: showPlayers must default to false`);
    if (arena.status !== 'published') errors.push(`${where}: status must be published`);
    if (arena.createdBy !== OWNER_ID) errors.push(`${where}: createdBy must be ${OWNER_ID}`);
    if (!arena.title) errors.push(`${where}: title is empty`);
    if (!arena.cardTheme?.bg || !arena.cardTheme?.emoji) errors.push(`${where}: cardTheme bg/emoji required`);
    if (arena.questionCount !== 20) errors.push(`${where}: questionCount must be 20`);
    if (!Array.isArray(arena.standards) || arena.standards.length === 0) {
      errors.push(`${where}: standards must have at least 1 code`);
    }
    if (!Array.isArray(arena.problems) || arena.problems.length !== 20) {
      errors.push(`${where}: expected 20 problems, got ${arena.problems?.length}`);
      continue;
    }
    const texts = new Set();
    arena.problems.forEach((p, i) => {
      const at = `${where}/problems/p${i + 1}`;
      if (!p.text) errors.push(`${at}: text is empty`);
      if (texts.has(p.text)) errors.push(`${at}: duplicate text`);
      texts.add(p.text);
      if (!Array.isArray(p.options) || p.options.length !== 4) {
        errors.push(`${at}: options must be exactly 4`);
      } else {
        for (const o of p.options) {
          if (typeof o !== 'string' || o.trim() === '') errors.push(`${at}: option must be non-empty`);
        }
        if (new Set(p.options).size !== 4) errors.push(`${at}: options must be 4 distinct values`);
      }
      if (!Number.isInteger(p.answerIndex) || p.answerIndex < 0 || p.answerIndex > 3) {
        errors.push(`${at}: answerIndex must be 0-3`);
      }
      if (typeof p.explanation !== 'string' || p.explanation.trim() === '') {
        errors.push(`${at}: explanation must be a 1-line non-empty string`);
      } else if (p.explanation.includes('\n')) {
        errors.push(`${at}: explanation must be 1 line`);
      }
      if (!p.standardCode) errors.push(`${at}: standardCode required`);
      else if (arena.standards && !arena.standards.includes(p.standardCode)) {
        errors.push(`${at}: standardCode ${p.standardCode} not in arena standards`);
      }
      if (p.roundTimeSec !== 30) errors.push(`${at}: roundTimeSec must be 30`);
    });
  }
  return errors;
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const errors = validateArenas();
  if (errors.length > 0) {
    console.error(`validation FAILED (${errors.length} errors):`);
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }
  const total = ARENAS.reduce((n, a) => n + a.problems.length, 0);
  console.log(`validation PASSED: ${ARENAS.length} arenas x 20 problems = ${total} problems`);
  if (dry) {
    for (const a of ARENAS) {
      console.log(`- ${a.id}: ${a.grade}학년 ${a.subject}, 20 problems, locked=${a.locked}, status=${a.status}`);
    }
    return;
  }
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.error('FIRESTORE_EMULATOR_HOST is not set. Refusing production writes.');
    process.exit(1);
  }
  admin.initializeApp({ projectId: PROJECT_ID });
  const db = admin.firestore();
  const { FieldValue } = admin.firestore;

  await db.doc(`classrooms/${CLASSROOM_ID}`).set(
    { name: '4학년 3반', inviteCode: CLASSROOM_ID, teacherId: OWNER_ID, locked: false },
    { merge: true },
  );
  await db.doc(`users/${OWNER_ID}`).set(
    {
      nickname: '김선생',
      role: 'teacher',
      avatar: 'cat',
      classroomId: CLASSROOM_ID,
      xp: 0,
      level: 1,
      streak: 0,
      winCount: 0,
      correctRate: 0,
    },
    { merge: true },
  );

  for (const arena of ARENAS) {
    const { problems, ...meta } = arena;
    await db.doc(`arenas/${arena.id}`).set({ ...meta, createdAt: FieldValue.serverTimestamp() }, { merge: true });
    for (const [i, p] of problems.entries()) {
      await db.doc(`arenas/${arena.id}/problems/p${i + 1}`).set(p);
    }
    console.log(`seeded: arenas/${arena.id} + 20 problems`);
  }
  console.log(`done: ${ARENAS.length} arenas, ${total} problems in classroom ${CLASSROOM_ID}`);
}

const invokedAsScript = process.argv[1] != null && process.argv[1].endsWith('seedDefaultArenas.mjs');
if (invokedAsScript) {
  await main();
}
