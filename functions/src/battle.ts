import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { answerReveal, countCorrectAnswers, countUserAnswers, isAnswerValid, isAutoWinEligible, isCorrect, isStoredQuestionValid, normalizeTimestamp, pickQuestionIds, questionToStored, recordFirstAnswer, toPublicQuestion, type BattleAnswer } from './battleLogic';

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();
const AUTO_WIN_AFTER_MS = 30_000;
type Player = { uid: string; score: number; ready: boolean; answeredRounds?: number[] } & Record<string, unknown>;
type Room = {
  roomId: string; arenaId: string; classroomId: string; status: string; players: Player[]; problemIds: string[];
  currentRound: number; roundEndsAt: number; updatedAt: unknown; winnerUid: string | null;
  serverManaged?: boolean;
  reveals?: Record<string, unknown>;
};

function uidOf(request: { auth?: { uid: string } | null }): string {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', '로그인이 필요해요.');
  return request.auth.uid;
}

async function userClass(uid: string): Promise<string> {
  const snap = await db.doc(`users/${uid}`).get();
  const classroomId = snap.data()?.classroomId;
  if (typeof classroomId !== 'string' || !classroomId) throw new HttpsError('permission-denied', '학급에 들어간 뒤 이용해 주세요.');
  return classroomId;
}

function requireMember(room: Room, uid: string): void {
  if (!room.players.some((player) => player.uid === uid)) throw new HttpsError('permission-denied', '이 대결의 참가자가 아니에요.');
  if (room.serverManaged !== true) throw new HttpsError('failed-precondition', '이전 대결방은 다시 시작할 수 없어요. 새 대결을 열어 주세요.');
}

async function questionFor(room: Room, round: number) {
  const id = room.problemIds?.[round];
  if (!id) throw new HttpsError('failed-precondition', '대결 문제를 찾을 수 없어요.');
  const snap = await db.doc(`roomQuestions/${room.roomId}_${round}`).get();
  if (!snap.exists) throw new HttpsError('failed-precondition', '대결 문제가 삭제되었어요.');
  return { id, question: questionToStored(id, snap.data() as Record<string, unknown>) };
}

function submissionRef(roomId: string, uid: string) {
  return db.doc(`roomSubmissions/${roomId}_${uid}`);
}

function answerAt(data: FirebaseFirestore.DocumentData | undefined, round: number): BattleAnswer | null {
  const answers = data?.answers as Record<string, BattleAnswer> | undefined;
  return answers && Object.prototype.hasOwnProperty.call(answers, String(round)) ? answers[String(round)] : null;
}

function publicAnswered(room: Room, round: number, uid: string): boolean {
  return room.players.find((p) => p.uid === uid)?.answeredRounds?.includes(round) ?? false;
}

function finishRound(room: Room, round: number, questionId: string, question: ReturnType<typeof questionToStored>, answers: Record<string, BattleAnswer | null>, now: number) {
  const scored = room.players.map((player) => ({
    ...player,
    score: player.score + (isCorrect(answers[player.uid] ?? null, question) ? 1 : 0),
    answeredRounds: [],
  }));
  const reveals = { ...(room.reveals ?? {}), [String(round)]: answerReveal(questionId, question, answers) };
  const last = round >= room.problemIds.length - 1;
  const a = scored[0]; const b = scored[1];
  const winnerUid = last && a && b
    ? (a.score === b.score ? null : a.score > b.score ? a.uid : b.uid)
    : null;
  return {
    players: scored,
    reveals,
    currentRound: last ? round : round + 1,
    status: last ? 'finished' : 'playing',
    roundEndsAt: last ? room.roundEndsAt : now + question.roundTimeSec * 1000,
    winnerUid,
    updatedAt: FieldValue.serverTimestamp(),
  };
}

export const getBattleQuestions = onCall(async (request) => {
  const uid = uidOf(request);
  if (typeof request.data?.roomId === 'string') {
    const roomId = request.data.roomId as string;
    const classroomId = await userClass(uid);
    const snap = await db.doc(`rooms/${request.data.roomId}`).get();
    if (!snap.exists) throw new HttpsError('not-found', '대결방을 찾을 수 없어요.');
    const room = { ...snap.data(), roomId: request.data.roomId } as Room;
    requireMember(room, uid);
    if (room.classroomId !== classroomId) throw new HttpsError('permission-denied', '다른 학급 대결에는 들어갈 수 없어요.');
    const docs = await Promise.all(room.problemIds.map((_, index) => db.doc(`roomQuestions/${roomId}_${index}`).get()));
    if (docs.length !== room.problemIds.length || docs.some((doc) => !doc.exists)) {
      throw new HttpsError('failed-precondition', '대결 문제를 불러오지 못했어요. 새 대결을 시작해 주세요.');
    }
    return { questions: docs.map((doc, index) => toPublicQuestion(questionToStored(room.problemIds[index], doc.data() as Record<string, unknown>))) };
  }
  throw new HttpsError('invalid-argument', 'roomId가 필요해요.');
});

export const getArenaReadiness = onCall(async (request) => {
  const uid = uidOf(request); const arenaId = request.data?.arenaId;
  if (typeof arenaId !== 'string') throw new HttpsError('invalid-argument', 'arenaId가 필요해요.');
  const classroomId = await userClass(uid); const arena = await db.doc(`arenas/${arenaId}`).get();
  if (!arena.exists || arena.data()?.classroomId !== classroomId) throw new HttpsError('permission-denied', '이 학급의 아레나가 아니에요.');
  const questions = await db.collection(`arenas/${arenaId}/problems`).get();
  const data = arena.data(); const questionCount = questions.size;
  return { questionCount, ready: data?.locked === false && data?.status !== 'draft' && questionCount >= 10 };
});

export const matchBattle = onCall(async (request) => {
  const uid = uidOf(request); const arenaId = request.data?.arenaId; const resumeRoomId = request.data?.resumeRoomId;
  if (typeof arenaId !== 'string') throw new HttpsError('invalid-argument', 'arenaId가 필요해요.');
  const classroomId = await userClass(uid);
  if (typeof resumeRoomId === 'string') {
    const saved = await db.doc(`rooms/${resumeRoomId}`).get();
    if (saved.exists) {
      const room = saved.data() as Room;
      if (room.arenaId === arenaId && room.classroomId === classroomId && room.players.some((p) => p.uid === uid)
        && room.serverManaged === true && ['waiting', 'ready', 'playing'].includes(room.status)) return { roomId: resumeRoomId };
    }
  }
  const arenaRef = db.doc(`arenas/${arenaId}`); const profileRef = db.doc(`users/${uid}`);
  const [arenaSnap, profileSnap] = await Promise.all([arenaRef.get(), profileRef.get()]);
  const arena = arenaSnap.data(); const profile = profileSnap.data();
  if (!arenaSnap.exists || arena?.classroomId !== classroomId || arena?.locked !== false || arena?.status === 'draft') throw new HttpsError('permission-denied', '공개된 학급 아레나만 이용할 수 있어요.');
  const problemSnap = await db.collection(`arenas/${arenaId}/problems`).get();
  if (!profileSnap.exists || problemSnap.size < 10) throw new HttpsError('failed-precondition', '대결을 시작할 정보를 찾지 못했어요.');
  const pickedIds = pickQuestionIds(problemSnap.docs.map((doc) => doc.id), 10);
  if (pickedIds.length !== 10) throw new HttpsError('failed-precondition', '대결 문제 10개를 준비해 주세요.');
  const docsById = new Map(problemSnap.docs.map((doc) => [doc.id, doc.data() as Record<string, unknown>]));
  const snapshots = pickedIds.map((id) => ({ id, question: questionToStored(id, docsById.get(id) ?? {}) }));
  if (snapshots.some(({ question }) => !isStoredQuestionValid(question))) throw new HttpsError('failed-precondition', '대결 문제에 정답 또는 선택지가 빠져 있어요.');
  const roomCollection = db.collection('rooms');
  const roomId = await db.runTransaction(async (tx) => {
    const lockRef = db.doc(`matchLocks/${classroomId}_${arenaId}`);
    await tx.get(lockRef);
    const eligible = await tx.get(roomCollection
      .where('classroomId', '==', classroomId)
      .where('arenaId', '==', arenaId)
      .where('status', 'in', ['waiting', 'ready', 'playing']));
    const existingForMe = eligible.docs.find((doc) => {
      const data = doc.data(); const players = data.players as Player[];
      return data.serverManaged === true && players.some((player) => player.uid === uid);
    });
    if (existingForMe) {
      tx.set(lockRef, { updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return existingForMe.id;
    }
    const open = eligible.docs.find((doc) => {
      if (doc.data().status !== 'waiting' || doc.data().serverManaged !== true) return false;
      const players = doc.data().players as Player[];
      return players.length === 1 && players[0].uid !== uid;
    });
    if (open) {
      const old = open.data(); const players = old.players as Player[];
      tx.update(open.ref, {
        status: 'ready',
        players: [...players, { uid, nickname: profile?.nickname ?? '학생', avatar: profile?.avatar ?? 'frog', score: 0, ready: false, answeredRounds: [] }],
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.set(lockRef, { updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return open.id;
    }
    const ref = roomCollection.doc();
    tx.create(ref, {
      roomId: ref.id, arenaId, classroomId, status: 'waiting',
      players: [{ uid, nickname: profile?.nickname ?? '학생', avatar: profile?.avatar ?? 'frog', score: 0, ready: false, answeredRounds: [] }],
      problemIds: pickedIds, showPlayers: arena?.showPlayers === true, ttsEnabled: arena?.ttsEnabled === true,
      currentRound: 0, roundEndsAt: 0, winnerUid: null, serverManaged: true,
      updatedAt: FieldValue.serverTimestamp(),
    });
    snapshots.forEach(({ question }, index) => {
      tx.create(db.doc(`roomQuestions/${ref.id}_${index}`), question);
    });
    tx.set(lockRef, { updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return ref.id;
  });
  return { roomId };
});

export const readyBattlePlayer = onCall(async (request) => {
  const uid = uidOf(request);
  const roomId = request.data?.roomId;
  if (typeof roomId !== 'string') throw new HttpsError('invalid-argument', 'roomId가 필요해요.');
  const ref = db.doc(`rooms/${roomId}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError('not-found', '대결방을 찾을 수 없어요.');
    const room = snap.data() as Room;
    requireMember(room, uid);
    if (room.status !== 'ready' || room.players.length !== 2) throw new HttpsError('failed-precondition', '상대가 들어온 뒤 준비할 수 있어요.');
    const players = room.players.map((player) => player.uid === uid ? { ...player, ready: true } : player);
    if (players.every((player) => player.ready)) {
      const { question } = await questionFor(room, 0);
      tx.update(ref, { status: 'playing', currentRound: 0, roundEndsAt: Date.now() + question.roundTimeSec * 1000, players: players.map((p) => ({ ...p, answeredRounds: [] })), updatedAt: FieldValue.serverTimestamp() });
    } else {
      tx.update(ref, { players, updatedAt: FieldValue.serverTimestamp() });
    }
  });
  return { ok: true };
});

async function progressRound(roomId: string, uid: string, answer?: BattleAnswer) {
  const ref = db.doc(`rooms/${roomId}`);
  await db.runTransaction(async (tx) => {
    const roomSnap = await tx.get(ref);
    if (!roomSnap.exists) throw new HttpsError('not-found', '대결방을 찾을 수 없어요.');
    const room = roomSnap.data() as Room;
    requireMember(room, uid);
    if (room.status !== 'playing') {
      if (answer !== undefined) throw new HttpsError('failed-precondition', '이미 끝났거나 진행 중이 아닌 대결이에요.');
      return;
    }
    const submissionSnaps = await Promise.all(room.players.map((player) => tx.get(submissionRef(roomId, player.uid))));
    const myIndex = room.players.findIndex((player) => player.uid === uid);
    const mine = submissionSnaps[myIndex].data();
    const oldAnswer = answerAt(mine, room.currentRound);
    const lateAnswer = answer !== undefined && Date.now() >= room.roundEndsAt;
    if (lateAnswer) throw new HttpsError('failed-precondition', '답을 낼 시간이 끝났어요. 다음 문제를 기다려 주세요.');
    const acceptedAnswer = answer;
    const storedAnswers = (mine?.answers as Record<string, BattleAnswer>) ?? {};
    if (acceptedAnswer !== undefined && (!recordFirstAnswer(storedAnswers, room.currentRound, acceptedAnswer).accepted || publicAnswered(room, room.currentRound, uid))) return;
    const candidateMine = acceptedAnswer !== undefined ? acceptedAnswer : oldAnswer;
    const answers: Record<string, BattleAnswer | null> = {};
    room.players.forEach((player, index) => {
      const value = index === myIndex ? candidateMine : answerAt(submissionSnaps[index].data(), room.currentRound);
      answers[player.uid] = value;
    });
    const { id, question } = await questionFor(room, room.currentRound);
    if (acceptedAnswer !== undefined && !isAnswerValid(acceptedAnswer, question)) throw new HttpsError('invalid-argument', '답을 확인해 주세요.');
    const both = room.players.every((player) => answers[player.uid] !== null);
    const timedOut = Date.now() >= room.roundEndsAt;
    const nextAnswered = room.players.map((player) => ({
      ...player,
      answeredRounds: acceptedAnswer !== undefined && player.uid === uid
        ? [...(player.answeredRounds ?? []), room.currentRound]
        : [...(player.answeredRounds ?? [])],
    }));
    const updatedRoom = { ...room, players: nextAnswered };
    if (acceptedAnswer !== undefined) {
      const answersMap = recordFirstAnswer(storedAnswers, room.currentRound, acceptedAnswer).answers;
      tx.set(submissionRef(roomId, uid), { roomId, uid, answers: answersMap }, { merge: true });
    }
    if (both || timedOut) {
      tx.update(ref, finishRound(updatedRoom, room.currentRound, id, question, answers, Date.now()));
    } else if (acceptedAnswer !== undefined) {
      tx.update(ref, { players: nextAnswered, updatedAt: FieldValue.serverTimestamp() });
    }
  });
  return { ok: true };
}

export const submitBattleAnswer = onCall(async (request) => {
  const uid = uidOf(request); const roomId = request.data?.roomId; const answer = request.data?.answer;
  if (typeof roomId !== 'string' || (typeof answer !== 'number' && typeof answer !== 'string')) throw new HttpsError('invalid-argument', 'roomId와 답이 필요해요.');
  return progressRound(roomId, uid, answer);
});

export const advanceBattleRound = onCall(async (request) => {
  const uid = uidOf(request); const roomId = request.data?.roomId;
  if (typeof roomId !== 'string') throw new HttpsError('invalid-argument', 'roomId가 필요해요.');
  return progressRound(roomId, uid);
});

export const claimBattleWin = onCall(async (request) => {
  const uid = uidOf(request); const roomId = request.data?.roomId;
  if (typeof roomId !== 'string') throw new HttpsError('invalid-argument', 'roomId가 필요해요.');
  const ref = db.doc(`rooms/${roomId}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError('not-found', '대결방을 찾을 수 없어요.');
    const room = snap.data() as Room; requireMember(room, uid);
    if (room.status !== 'playing' || !isAutoWinEligible(normalizeTimestamp(room.updatedAt), room.roundEndsAt, Date.now(), AUTO_WIN_AFTER_MS)) return;
    const opponentUid = room.players.find((player) => player.uid !== uid)?.uid;
    if (!opponentUid) return;
    const [mineSnap, opponentSnap] = await Promise.all([
      tx.get(submissionRef(roomId, uid)), tx.get(submissionRef(roomId, opponentUid)),
    ]);
    if (answerAt(opponentSnap.data(), room.currentRound) !== null) return;
    const { id, question } = await questionFor(room, room.currentRound);
    const mine = answerAt(mineSnap.data(), room.currentRound);
    const answers = { [uid]: mine, [opponentUid]: null };
    const scoreDelta = isCorrect(mine, question) ? 1 : 0;
    const players = room.players.map((player) => ({
      ...player,
      score: player.score + (player.uid === uid ? scoreDelta : 0),
      answeredRounds: [],
    }));
    const reveals = { ...(room.reveals ?? {}), [String(room.currentRound)]: answerReveal(id, question, answers) };
    tx.update(ref, { status: 'finished', winnerUid: uid, players, reveals, updatedAt: FieldValue.serverTimestamp() });
  });
  return { ok: true };
});

export const awardBattle = onCall(async (request) => {
  const uid = uidOf(request); const roomId = request.data?.roomId;
  if (typeof roomId !== 'string') throw new HttpsError('invalid-argument', 'roomId가 필요해요.');
  const roomRef = db.doc(`rooms/${roomId}`); const battleRef = db.doc(`battles/${roomId}_${uid}`); const userRef = db.doc(`users/${uid}`);
  return db.runTransaction(async (tx) => {
    const roomSnap = await tx.get(roomRef); const battleSnap = await tx.get(battleRef); const userSnap = await tx.get(userRef);
    if (!roomSnap.exists) throw new HttpsError('not-found', '대결방을 찾을 수 없어요.');
    const room = roomSnap.data() as Room; requireMember(room, uid);
    if (room.status !== 'finished') throw new HttpsError('failed-precondition', '대결이 끝난 뒤 받을 수 있어요.');
    if (battleSnap.exists) return { xp: battleSnap.data()?.earnedXp ?? 0, stars: battleSnap.data()?.earnedStars ?? 0 };
    const reveals = Object.values(room.reveals ?? {}) as Array<{ answers: Record<string, unknown>; correctAnswer: unknown }>;
    const correctCount = countCorrectAnswers(reveals, uid);
    const winner = room.winnerUid === uid; const draw = room.winnerUid === null;
    const prev = userSnap.data() ?? {}; const prevXp = Number(prev.xp) || 0; const prevStars = Number(prev.stars) || 0;
    const prevWins = Number(prev.winCount) || 0; const prevStreak = Number(prev.streak) || 0;
    const prevAnswers = Number(prev.answerCount) || 0; const prevCorrect = Number(prev.correctAnswerCount) || 0;
    const answerCount = countUserAnswers(reveals, uid);
    const totalAnswers = prevAnswers + answerCount; const totalCorrect = prevCorrect + correctCount;
    const earnedXp = (winner ? 50 : draw ? 20 : 0) + correctCount * 10;
    const streak = winner ? prevStreak + 1 : 0; const totalXp = prevXp + earnedXp;
    const level = Math.floor(totalXp / 100) + 1; const oldLevel = Math.floor(prevXp / 100) + 1;
    const earnedStars = (winner ? 5 : draw ? 2 : 0) + correctCount + (streak >= 3 ? 2 : 0) + (level - oldLevel) * 10;
    tx.create(battleRef, { roomId, uid, winnerUid: room.winnerUid, correctCount, earnedXp, earnedStars, awarded: true, endedAt: FieldValue.serverTimestamp() });
    tx.set(userRef, {
      xp: totalXp, stars: prevStars + earnedStars, level, winCount: prevWins + (winner ? 1 : 0), streak,
      answerCount: totalAnswers, correctAnswerCount: totalCorrect,
      ...(totalAnswers > 0 ? { correctRate: Math.round((totalCorrect / totalAnswers) * 100) } : {}),
    }, { merge: true });
    return { xp: earnedXp, stars: earnedStars };
  });
});

const AVATAR_PRICES: Record<string, number> = { frog: 0, cat: 10, dog: 10, turtle: 15, rabbit: 20, chick: 20, tiger: 30, panda: 40, hamster: 40, fox: 40, unicorn: 50, penguin: 60, owl: 60, dragon: 80, dino: 100 };
const TITLE_CATALOG: Record<string, { label: string; price: number }> = {
  sprout: { label: '새싹', price: 0 }, challenger: { label: '도전자', price: 10 }, streak: { label: '연승왕', price: 30 },
  doctor: { label: '퀴즈박사', price: 60 }, guardian: { label: '수호자', price: 100 }, legend: { label: '전설', price: 200 },
};

export const manageCosmetic = onCall(async (request) => {
  const uid = uidOf(request); const { kind, id, action } = request.data ?? {};
  if ((kind !== 'avatar' && kind !== 'title') || typeof id !== 'string' || (action !== 'buy' && action !== 'equip')) throw new HttpsError('invalid-argument', '상품 요청을 확인해 주세요.');
  const item = kind === 'avatar' ? AVATAR_PRICES[id] : TITLE_CATALOG[id]?.price;
  if (item === undefined) throw new HttpsError('not-found', '상품을 찾을 수 없어요.');
  const userRef = db.doc(`users/${uid}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef); const data = snap.data() ?? {};
    const field = kind === 'avatar' ? 'unlockedAvatars' : 'unlockedTitles';
    const unlocked = Array.isArray(data[field]) ? [...data[field] as string[]] : [];
    const free = item === 0;
    if (action === 'buy') {
      if (unlocked.includes(id)) throw new HttpsError('already-exists', '이미 가지고 있는 상품이에요.');
      const stars = Number(data.stars) || 0;
      if (!free && stars < item) throw new HttpsError('failed-precondition', '별이 부족해요.');
      unlocked.push(id);
      const patch: Record<string, unknown> = { [field]: unlocked, stars: stars - item };
      tx.set(userRef, patch, { merge: true });
    } else {
      if (!unlocked.includes(id) && !free) throw new HttpsError('permission-denied', '먼저 상품을 사 주세요.');
      const label = kind === 'title' ? TITLE_CATALOG[id].label : id;
      tx.set(userRef, { [kind]: label }, { merge: true });
    }
    return { ok: true };
  });
});
