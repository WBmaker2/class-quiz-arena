import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export interface AwardResult {
  xp: number;
  stars: number;
}

/** Server derives score, winner, streak, and reward from the finished room. */
export async function finishAndAward(roomId: string): Promise<AwardResult> {
  const award = httpsCallable<{ roomId: string }, AwardResult>(functions, 'awardBattle');
  const result = await award({ roomId });
  return result.data;
}
