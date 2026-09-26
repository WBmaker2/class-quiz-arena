import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Profile {
  nickname: string;
  xp: number;
  /** 상점에서 쓰는 별. 0부터 시작하고 XP와 별개로 모은다. */
  stars?: number;
  level: number;
  streak: number;
  winCount: number;
  correctRate: number;
  avatar?: string;
  title?: string;
  unlockedAvatars?: string[];
  unlockedTitles?: string[];
}

export function useProfile(uid: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        if (snap.exists()) setProfile(snap.data() as Profile);
      },
      () => {},
    );
  }, [uid]);

  return { profile };
}
