import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import {
  computeLevel,
  STAR_LEVEL_UP_BONUS,
  STAR_STREAK_BONUS,
  STAR_STREAK_MIN,
  starAward,
  xpAward,
} from './battle';

export async function finishAndAward(args: {
  roomId: string;
  winnerUid: string | null;
  myUid: string;
  myCorrect: number;
  myWins: number;
  myStreak: number;
}): Promise<{ xp: number; stars: number }> {
  const isWinner = args.winnerUid === args.myUid;
  const isDraw = args.winnerUid === null;
  const earnedXp = xpAward(isWinner, isDraw, args.myCorrect);
  const newStreak = isWinner ? args.myStreak + 1 : 0;
  let out = { xp: earnedXp, stars: 0 };
  await runTransaction(db, async (tx) => {
    // 멱등 가드는 사용자별 문서로 둔다. 양쪽 클라이언트가 각자 호출하므로,
    // roomId 공유 문서로 막으면 먼저 커밋한 쪽이 상대방 지급까지 막는다.
    const battleRef = doc(db, 'battles', `${args.roomId}_${args.myUid}`);
    const existing = await tx.get(battleRef);
    if (existing.exists() && (existing.data().awarded as boolean)) {
      out = {
        xp: (existing.data().earnedXp as number) ?? earnedXp,
        stars: (existing.data().earnedStars as number) ?? 0,
      };
      return;
    }
    const userRef = doc(db, 'users', args.myUid);
    const snap = await tx.get(userRef);
    const prevXp = ((snap.data()?.xp as number) ?? 0) as number;
    const prevStars = ((snap.data()?.stars as number) ?? 0) as number;
    const totalXp = prevXp + earnedXp;
    const levelDiff = computeLevel(totalXp).level - computeLevel(prevXp).level;
    const earnedStars =
      starAward(isWinner, isDraw, args.myCorrect) +
      (newStreak >= STAR_STREAK_MIN ? STAR_STREAK_BONUS : 0) +
      levelDiff * STAR_LEVEL_UP_BONUS;
    tx.set(
      battleRef,
      { roomId: args.roomId, winnerUid: args.winnerUid, awarded: true, earnedXp, earnedStars, endedAt: serverTimestamp() },
      { merge: true },
    );
    tx.set(
      userRef,
      {
        xp: totalXp,
        stars: prevStars + earnedStars,
        level: computeLevel(totalXp).level,
        winCount: args.myWins + (isWinner ? 1 : 0),
        streak: newStreak,
      },
      { merge: true },
    );
    out = { xp: earnedXp, stars: earnedStars };
  });
  return out;
}
