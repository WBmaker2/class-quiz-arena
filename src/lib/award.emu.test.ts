import { describe, expect, it } from 'vitest';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { finishAndAward } from './award';

describe('finishAndAward on emulator', () => {
  it('pays both players once, even on duplicate calls', async () => {
    const roomId = `r-${Date.now()}`;

    const credA = await signInAnonymously(auth);
    const uidA = credA.user.uid;
    const earnedA = await finishAndAward({
      roomId,
      winnerUid: uidA,
      myUid: uidA,
      myCorrect: 2,
      myWins: 0,
      myStreak: 0,
    });
    expect(earnedA).toEqual({ xp: 70, stars: 7 });
    const dupA = await finishAndAward({
      roomId,
      winnerUid: uidA,
      myUid: uidA,
      myCorrect: 2,
      myWins: 0,
      myStreak: 0,
    });
    expect(dupA).toEqual({ xp: 70, stars: 7 });
    await auth.signOut();

    const credB = await signInAnonymously(auth);
    const uidB = credB.user.uid;
    const earnedB = await finishAndAward({
      roomId,
      winnerUid: uidA,
      myUid: uidB,
      myCorrect: 1,
      myWins: 0,
      myStreak: 0,
    });
    expect(earnedB).toEqual({ xp: 10, stars: 1 });

    const snapA = await getDoc(doc(db, 'users', uidA));
    const snapB = await getDoc(doc(db, 'users', uidB));
    expect(snapA.data()?.xp).toBe(70);
    expect(snapA.data()?.stars).toBe(7);
    expect(snapB.data()?.xp).toBe(10);
    expect(snapB.data()?.stars).toBe(1);
  }, 30000);
});
