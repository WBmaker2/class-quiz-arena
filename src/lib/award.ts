import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { computeLevel, xpAward } from './battle';

export async function finishAndAward(args: {
  roomId: string;
  winnerUid: string | null;
  myUid: string;
  myCorrect: number;
  myWins: number;
  myStreak: number;
}): Promise<number> {
  const earned = xpAward(args.winnerUid === args.myUid, args.winnerUid === null, args.myCorrect);
  await runTransaction(db, async (tx) => {
    // 멱등 가드는 사용자별 문서로 둔다. 양쪽 클라이언트가 각자 호출하므로,
    // roomId 공유 문서로 막으면 먼저 커밋한 쪽이 상대방 지급까지 막는다.
    const battleRef = doc(db, 'battles', `${args.roomId}_${args.myUid}`);
    const existing = await tx.get(battleRef);
    if (existing.exists() && (existing.data().awarded as boolean)) return;
    const userRef = doc(db, 'users', args.myUid);
    const snap = await tx.get(userRef);
    const prevXp = ((snap.data()?.xp as number) ?? 0) as number;
    const total = prevXp + earned;
    tx.set(
      battleRef,
      { roomId: args.roomId, winnerUid: args.winnerUid, awarded: true, endedAt: serverTimestamp() },
      { merge: true },
    );
    tx.set(
      userRef,
      {
        xp: total,
        level: computeLevel(total).level,
        winCount: args.myWins + (args.winnerUid === args.myUid ? 1 : 0),
        streak: args.winnerUid === args.myUid ? args.myStreak + 1 : 0,
      },
      { merge: true },
    );
  });
  return earned;
}
