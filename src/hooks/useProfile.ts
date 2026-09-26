import { useCallback, useEffect, useState } from 'react';
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
  correctRate?: number;
  answerCount?: number;
  correctAnswerCount?: number;
  avatar?: string;
  title?: string;
  unlockedAvatars?: string[];
  unlockedTitles?: string[];
  classroomId?: string;
  role?: 'student' | 'teacher';
}

export function useProfile(uid: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setProfile(null);
    setError(null);
    if (!uid) return;
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        setProfile(snap.exists() ? snap.data() as Profile : null);
        setError(null);
      },
      () => {
        setProfile(null);
        setError('기록을 불러오지 못했어요. 연결을 확인하고 다시 시도해주세요.');
      },
    );
  }, [uid, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { profile, error, retry };
}
