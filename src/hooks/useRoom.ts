import { useEffect, useState } from 'react';
import { doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Problem } from '../lib/arena';
import {
  advanceData,
  allReady,
  bothAnswered,
  canClaimWin,
  finishData,
  roundRemainingMs,
  setReadyData,
  startPlayingData,
  submitAnswerData,
  type RoomData,
} from '../lib/battle';

function toRoomData(id: string, data: Record<string, unknown>): RoomData {
  void id;
  return data as unknown as RoomData;
}

export function useRoom(roomId: string | null, problems: Problem[]) {
  const [room, setRoom] = useState<RoomData | null>(null);

  useEffect(() => {
    if (!roomId) return;
    return onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      if (snap.exists()) setRoom(toRoomData(snap.id, snap.data()));
    });
  }, [roomId]);

  const ready = async (uid: string) => {
    if (!roomId) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      const next = setReadyData(r, uid, Date.now());
      tx.update(ref, { players: next.players, updatedAt: serverTimestamp() });
      if (allReady(next) && problems.length > 0) {
        const started = startPlayingData(next, Date.now(), problems[0].roundTimeSec);
        tx.update(ref, {
          status: started.status,
          currentRound: 0,
          roundEndsAt: started.roundEndsAt,
          players: started.players,
          updatedAt: serverTimestamp(),
        });
      }
    });
  };

  const answer = async (uid: string, idx: number) => {
    if (!roomId) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      if (r.status !== 'playing') return;
      const next = submitAnswerData(r, uid, idx, Date.now());
      tx.update(ref, { players: next.players, updatedAt: serverTimestamp() });
      if (bothAnswered(next)) {
        const correct = problems[r.currentRound]?.answerIndex ?? -1;
        const adv = advanceData(next, correct, Date.now(), problems[r.currentRound]?.roundTimeSec ?? 30, problems.length);
        const fin = adv.status === 'finished' ? finishData(adv, Date.now()) : adv;
        tx.update(ref, {
          status: fin.status,
          players: fin.players,
          currentRound: fin.currentRound,
          roundEndsAt: fin.roundEndsAt,
          winnerUid: fin.winnerUid,
          updatedAt: serverTimestamp(),
        });
      }
    });
  };

  const tick = async () => {
    if (!roomId || !room || room.status !== 'playing') return;
    if (roundRemainingMs(room, Date.now()) > 0) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      if (r.status !== 'playing' || roundRemainingMs(r, Date.now()) > 0) return;
      const correct = problems[r.currentRound]?.answerIndex ?? -1;
      const adv = advanceData(r, correct, Date.now(), problems[r.currentRound]?.roundTimeSec ?? 30, problems.length);
      const fin = adv.status === 'finished' ? finishData(adv, Date.now()) : adv;
      tx.update(ref, {
        status: fin.status,
        players: fin.players,
        currentRound: fin.currentRound,
        roundEndsAt: fin.roundEndsAt,
        winnerUid: fin.winnerUid,
        updatedAt: serverTimestamp(),
      });
    });
  };

  const claimWin = async (uid: string) => {
    if (!roomId) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      if (!canClaimWin(r, uid, Date.now())) return;
      const fin = finishData({ ...r, players: r.players }, Date.now());
      tx.update(ref, { status: 'finished', winnerUid: uid, players: fin.players, updatedAt: serverTimestamp() });
    });
  };

  return { room, ready, answer, tick, claimWin };
}
