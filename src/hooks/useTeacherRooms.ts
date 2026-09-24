import { useEffect, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RoomData } from '../lib/battle';

export interface RoomView {
  id: string;
  arenaId: string;
  status: RoomData['status'];
  players: { uid: string; nickname: string }[];
  updatedAtMs: number;
}

function toView(id: string, data: Record<string, unknown>): RoomView {
  const d = data as unknown as RoomData & { updatedAtMs?: number };
  return {
    id,
    arenaId: d.arenaId,
    status: d.status,
    players: d.players.map((p) => ({ uid: p.uid, nickname: p.nickname })),
    updatedAtMs: d.updatedAtMs ?? 0,
  };
}

export function useTeacherRooms() {
  const [live, setLive] = useState<RoomView[]>([]);
  const [abandoned, setAbandoned] = useState<RoomView[]>([]);
  const [finished, setFinished] = useState<RoomView[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'rooms'), where('status', 'in', ['waiting', 'ready', 'playing'])),
        (snap) => setLive(snap.docs.map((d) => toView(d.id, d.data()))),
        () => {},
      ),
    [],
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'rooms'), where('status', '==', 'abandoned'), orderBy('updatedAt', 'desc'), limit(20)),
        (snap) => setAbandoned(snap.docs.map((d) => toView(d.id, d.data()))),
        () => {},
      ),
    [],
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'rooms'), where('status', '==', 'finished'), orderBy('updatedAt', 'desc'), limit(20)),
        (snap) => setFinished(snap.docs.map((d) => toView(d.id, d.data()))),
        () => {},
      ),
    [],
  );

  const forceClose = async (id: string) => {
    await updateDoc(doc(db, 'rooms', id), { status: 'abandoned' });
  };

  return { live, abandoned, finished, forceClose };
}
