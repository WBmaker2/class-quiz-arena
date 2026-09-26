import { useEffect, useState } from 'react';
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface RawLeaderDoc {
  uid: string;
  nickname?: string;
  xp?: number;
  level?: number;
  winCount?: number;
  correctRate?: number;
  answerCount?: number;
  avatar?: string;
  title?: string;
}

export interface LeaderboardEntry {
  uid: string;
  nickname: string;
  xp: number;
  level: number;
  winCount: number;
  correctRate?: number;
  answerCount?: number;
  avatar: string;
  title?: string;
  rank: number;
  isMe: boolean;
}

/** 같은 학급 문서를 xp 내림차순으로 정렬해 Top20 + 내 순위를 뽑는다 (순수 매퍼, 테스트용). */
export function mapLeaderboard(
  docs: RawLeaderDoc[],
  myUid: string | null,
): { top20: LeaderboardEntry[]; myRank: number | null } {
  const sorted = [...docs].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));
  const myIndex = myUid ? sorted.findIndex((d) => d.uid === myUid) : -1;
  const myRank = myIndex >= 0 ? myIndex + 1 : null;
  const top20 = sorted.slice(0, 20).map((d, i) => ({
    uid: d.uid,
    nickname: d.nickname ?? '이름 없음',
    xp: d.xp ?? 0,
    level: d.level ?? 1,
    winCount: d.winCount ?? 0,
    ...(d.correctRate == null ? {} : { correctRate: d.correctRate }),
    ...(d.answerCount == null ? {} : { answerCount: d.answerCount }),
    avatar: d.avatar ?? 'cat',
    ...(d.title ? { title: d.title } : {}),
    rank: i + 1,
    isMe: myUid != null && d.uid === myUid,
  }));
  return { top20, myRank };
}

/**
 * 같은 학급 Top20 리더보드: users where classroomId==내학급 orderBy xp desc limit 20.
 * Top20 밖에 있어도 "내 순위 N위"를 알 수 있게 전체 순서에서 내 순위를 별도로 구한다.
 */
export function useLeaderboard(classroomId: string | null, myUid: string | null) {
  const [top20, setTop20] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) {
      setTop20([]);
      setMyRank(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const topQuery = query(
      collection(db, 'users'),
      where('classroomId', '==', classroomId),
      orderBy('xp', 'desc'),
      limit(20),
    );
    const unsub = onSnapshot(
      topQuery,
      (snap) => {
        const raw: RawLeaderDoc[] = snap.docs.map((d) => ({
          uid: d.id,
          ...((d.data() as Omit<RawLeaderDoc, 'uid'>) ?? {}),
        }));
        const mapped = mapLeaderboard(raw, myUid);
        setTop20(mapped.top20);
        const mineInTop = mapped.top20.find((e) => e.isMe);
        if (mineInTop) {
          setMyRank(mineInTop.rank);
          setLoading(false);
        } else if (myUid) {
          void getDocs(
            query(collection(db, 'users'), where('classroomId', '==', classroomId), orderBy('xp', 'desc')),
          )
            .then((full) => {
              const all: RawLeaderDoc[] = full.docs.map((d) => ({
                uid: d.id,
                ...((d.data() as Omit<RawLeaderDoc, 'uid'>) ?? {}),
              }));
              setMyRank(mapLeaderboard(all, myUid).myRank);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
    );
    return () => unsub();
  }, [classroomId, myUid]);

  return { top20, myRank, loading };
}
