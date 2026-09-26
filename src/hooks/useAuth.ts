import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const REMEMBER_KEY = 'quiz-arena-remember';
const CHOOSE_ACCOUNT_KEY = 'quiz-arena-choose-account';

function readRemember(): boolean | null {
  try {
    const v = window.localStorage.getItem(REMEMBER_KEY);
    if (v === 'keep') return true;
    if (v === 'once') return false;
    return null;
  } catch {
    return null;
  }
}

/** 로그아웃 뒤 다음 로그인에서는 구글 계정 선택창을 띄우기 위한 1회성 표시. */
function consumeChooseAccount(): boolean {
  try {
    if (window.sessionStorage.getItem(CHOOSE_ACCOUNT_KEY) === '1') {
      window.sessionStorage.removeItem(CHOOSE_ACCOUNT_KEY);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // null이면 아직 묻지 않음. true=브라우저에 저장(자동 로그인), false=이번만.
  const [remember, setRemember] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = readRemember();
    setRemember(stored);
    // '이번만'을 골랐으면 기존에 저장된 로그인도 이번 방문용으로만 둔다.
    if (stored === false) {
      void setPersistence(auth, browserSessionPersistence).catch(() => {});
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    if (consumeChooseAccount()) {
      provider.setCustomParameters({ prompt: 'select_account' });
    }
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    try {
      window.sessionStorage.setItem(CHOOSE_ACCOUNT_KEY, '1');
    } catch {
      // 저장소가 막혀도 로그아웃은 진행한다
    }
    await firebaseSignOut(auth);
  };

  /** 로그인 유지 선택을 저장하고 바로 적용한다 (로그인 뒤에 물어도 된다). */
  const applyRemember = async (keep: boolean) => {
    await setPersistence(auth, keep ? browserLocalPersistence : browserSessionPersistence);
    try {
      window.localStorage.setItem(REMEMBER_KEY, keep ? 'keep' : 'once');
    } catch {
      // 저장소가 막혀도 이번 방문 동안은 선택이 유지된다
    }
    setRemember(keep);
  };

  return { user, loading, signInWithGoogle, signOut, remember, applyRemember };
}
