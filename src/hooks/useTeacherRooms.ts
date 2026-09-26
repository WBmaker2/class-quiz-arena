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

export function useTeacherRooms(classroomId: string | null) {
  const [live, setLive] = useState<RoomView[]>([]);
  const [abandoned, setAbandoned] = useState<RoomView[]>([]);
  const [finished, setFinished] = useState<RoomView[]>([]);
  const [errors, setErrors] = useState({ live: false, abandoned: false, finished: false });
  const [retryToken, setRetryToken] = useState(0);

  useEffect(
    () => {
      setLive([]);
      setErrors((current) => ({ ...current, live: false }));
      if (!classroomId) {
        return;
      }
      return onSnapshot(
        query(collection(db, 'rooms'), where('classroomId', '==', classroomId), where('status', 'in', ['waiting', 'ready', 'playing'])),
        (snap) => {
          setLive(snap.docs.map((d) => toView(d.id, d.data())));
          setErrors((current) => ({ ...current, live: false }));
        },
        () => {
          setLive([]);
          setErrors((current) => ({ ...current, live: true }));
        },
      );
    },
    [classroomId, retryToken],
  );

  useEffect(
    () => {
      setAbandoned([]);
      setErrors((current) => ({ ...current, abandoned: false }));
      if (!classroomId) {
        return;
      }
      return onSnapshot(
        query(collection(db, 'rooms'), where('classroomId', '==', classroomId), where('status', '==', 'abandoned'), orderBy('updatedAt', 'desc'), limit(20)),
        (snap) => {
          setAbandoned(snap.docs.map((d) => toView(d.id, d.data())));
          setErrors((current) => ({ ...current, abandoned: false }));
        },
        () => {
          setAbandoned([]);
          setErrors((current) => ({ ...current, abandoned: true }));
        },
      );
    },
    [classroomId, retryToken],
  );

  useEffect(
    () => {
      setFinished([]);
      setErrors((current) => ({ ...current, finished: false }));
      if (!classroomId) {
        return;
      }
      return onSnapshot(
        query(collection(db, 'rooms'), where('classroomId', '==', classroomId), where('status', '==', 'finished'), orderBy('updatedAt', 'desc'), limit(20)),
        (snap) => {
          setFinished(snap.docs.map((d) => toView(d.id, d.data())));
          setErrors((current) => ({ ...current, finished: false }));
        },
        () => {
          setFinished([]);
          setErrors((current) => ({ ...current, finished: true }));
        },
      );
    },
    [classroomId, retryToken],
  );

  const forceClose = async (id: string) => {
    await updateDoc(doc(db, 'rooms', id), { status: 'abandoned' });
  };

  return {
    live,
    abandoned,
    finished,
    roomsError: Object.values(errors).some(Boolean),
    retryRooms: () => setRetryToken((current) => current + 1),
    forceClose,
  };
}
