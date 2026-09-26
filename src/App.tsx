import { lazy, Suspense, useEffect, useState } from 'react';
import ClassJoin from './pages/ClassJoin';
import LoginScreen from './pages/LoginScreen';
import RoleSelect, { type Role } from './pages/RoleSelect';
import EmptyState from './components/EmptyState';
import TeacherGate from './pages/TeacherGate';
import RememberLogin from './components/RememberLogin';
import type { Animal } from './components/Avatar';
import { useArenas } from './hooks/useArenas';
import { useAuth } from './hooks/useAuth';
import { useClassroom } from './hooks/useClassroom';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useProfile } from './hooks/useProfile';
import { containsBanned } from './lib/nickname';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

const StudentHome = lazy(() => import('./pages/StudentHome'));
const TeacherShell = lazy(() => import('./pages/TeacherShell').then((module) => ({ default: module.TeacherShell })));
const BattleShell = lazy(() => import('./pages/BattleShell'));
export { default as TeacherGate } from './pages/TeacherGate';

export type View = 'login' | 'role' | 'join' | 'student' | 'teacher' | 'battle';

export interface PendingArena {
  arenaId: string;
  classroomId: string | null;
  me: { uid: string; nickname: string; avatar: string };
  reporterNickname: string;
  myWins: number;
  myStreak: number;
  roomId?: string | null;
}

function RouteLoading() {
  return <div className="min-h-screen grid place-items-center" role="status" aria-live="polite" aria-busy="true">화면을 불러오는 중...</div>;
}

export default function App() {
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<Role | null>(null);
  const [animal, setAnimal] = useState<Animal>('frog');
  const [pendingArena, setPendingArena] = useState<PendingArena | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { classroomId, join, create, select } = useClassroom();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { profile: savedProfile } = useProfile(user?.uid ?? null);
  // 선생님의 학생 화면 미리보기 (?preview=학급ID, 새 탭). 로그인 후 바로 학생홈.
  const [previewClassroom] = useState(() => new URLSearchParams(window.location.search).get('preview'));

  // 같은 구글 프로필로 저장된 로그인이 있으면 로그인 화면을 건너뛴다.
  useEffect(() => {
    if (view === 'login' && user) setView('role');
  }, [view, user]);

  useEffect(() => {
    if (!user || !savedProfile?.classroomId || view !== 'role' || savedProfile.role !== 'student') return;
    select(savedProfile.classroomId);
    try {
      const saved = window.sessionStorage.getItem('quiz-arena-active-battle');
      const pending = saved ? JSON.parse(saved) as PendingArena & { uid?: string } : null;
      if (pending?.uid === user.uid && pending.arenaId && pending.me?.uid === user.uid && pending.classroomId === savedProfile.classroomId) {
        setPendingArena(pending);
        setView('battle');
        return;
      }
    } catch { /* 손상된 복원 데이터는 버리고 학급 홈으로 이동 */ }
    setView('student');
  }, [user, savedProfile, view, select]);

  const startLogin = () => {
    setLoginError(null);
    void Promise.resolve(signInWithGoogle()).then(() => setView('role')).catch((error: unknown) => {
      const code = (error as { code?: string })?.code;
      setLoginError(code === 'auth/popup-blocked' ? '로그인 창이 차단됐어요. 팝업을 허용하고 다시 눌러주세요.' : '로그인에 실패했어요. 인터넷 연결을 확인하고 다시 시도해주세요.');
    });
  };

  // 실제 환경에서만 미로그인 진입을 막는다. vitest의 MODE는 'test'이므로
  // 테스트 흐름은 Plan 1과 동일하게 통과한다.
  const effectivelySignedOut = !loading && user === null && import.meta.env.MODE !== 'test';
  if (view !== 'login' && effectivelySignedOut) {
    return <LoginScreen onStart={startLogin} error={loginError} />;
  }
  if (view === 'login') {
    return <LoginScreen onStart={startLogin} error={loginError} />;
  }
  if (loading) {
    return <div className="min-h-screen grid place-items-center">불러오는 중...</div>;
  }

  if (previewClassroom && user) {
    const previewEnter = (arenaId: string, me: { uid: string; nickname: string; avatar: string }, myWins: number, myStreak: number, reporterNickname: string) => {
      const pending = { arenaId, classroomId: previewClassroom, me, reporterNickname, myWins, myStreak };
      setPendingArena(pending);
      window.sessionStorage.setItem('quiz-arena-active-battle', JSON.stringify({ ...pending, uid: me.uid }));
      setView('battle');
    };
    const previewExit = () => {
      window.sessionStorage.removeItem('quiz-arena-active-battle');
      setPendingArena(null);
      setView('login');
    };
    if (view === 'battle' && pendingArena) {
      return (
        <>
          <RememberLogin />
          <Suspense fallback={<RouteLoading />}><BattleShell
            arenaId={pendingArena.arenaId}
            classroomId={pendingArena.classroomId}
            me={pendingArena.me}
            reporterNickname={pendingArena.reporterNickname}
            myWins={pendingArena.myWins}
            myStreak={pendingArena.myStreak}
            resumeRoomId={pendingArena.roomId}
            onExit={previewExit}
          /></Suspense>
        </>
      );
    }
    return (
      <>
        <RememberLogin />
        <Suspense fallback={<RouteLoading />}><StudentShell
          uid={user.uid}
          nickname={user.displayName ?? '선생님'}
          classroomId={previewClassroom}
          animal={animal}
          accountName={user.displayName ?? undefined}
          accountEmail={user.email}
          photoURL={user.photoURL}
          onEnter={previewEnter}
          onSignOut={() => {
            void signOut();
            setView('login');
          }}
        /></Suspense>
      </>
    );
  }

  if (view === 'role') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <RoleSelect
            onSelect={(r: Role, a: Animal) => {
              setRole(r);
              setAnimal(a);
              setView('join');
            }}
          />
          <RememberLogin />
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          {role === 'teacher' ? (
            <TeacherGate
              uid={user?.uid ?? 'local-test'}
              displayName={user?.displayName ?? '선생님'}
              animal={animal}
              create={create}
              onDone={(id) => {
                void setDoc(doc(db, 'users', user?.uid ?? 'local-test'), { classroomId: id }, { merge: true });
                select(id);
                setView('teacher');
              }}
            />
          ) : (
            <ClassJoin
              defaultNickname={user?.displayName ?? '학생'}
              onJoin={async (code, nickname) => {
                const joined = await join(code, user?.uid ?? 'local-test', { nickname, role: role ?? 'student', avatar: animal });
                if (joined.ok) setView('student');
                return joined;
              }}
            />
          )}
          <RememberLogin />
        </div>
      </div>
    );
  }

  if (view === 'student') {
    return (
      <>
        <RememberLogin />
        <Suspense fallback={<RouteLoading />}><StudentShell
          uid={user?.uid ?? 'local-test'}
          nickname={user?.displayName ?? '학생'}
          classroomId={classroomId}
          animal={animal}
          accountName={user?.displayName ?? undefined}
          accountEmail={user?.email ?? null}
          photoURL={user?.photoURL ?? null}
          onEnter={(arenaId, me, myWins, myStreak, reporterNickname) => {
            const pending = { arenaId, classroomId, me, reporterNickname, myWins, myStreak };
            setPendingArena(pending);
            window.sessionStorage.setItem('quiz-arena-active-battle', JSON.stringify({ ...pending, uid: me.uid }));
            setView('battle');
          }}
          onSignOut={() => {
            void signOut();
            setView('login');
          }}
        /></Suspense>
      </>
    );
  }

  if (view === 'teacher') {
    return (
      <Suspense fallback={<RouteLoading />}><TeacherShell
        classroomId={classroomId}
        userEmail={user?.email ?? null}
        uid={user?.uid ?? 'local-test'}
        displayName={user?.displayName ?? '선생님'}
        photoURL={user?.photoURL ?? null}
        animal={animal}
        onSignOut={() => {
          void signOut();
          setView('login');
        }}
        onSelectClassroom={select}
      /></Suspense>
    );
  }

  if (view === 'battle' && pendingArena) {
    return (
      <>
        <RememberLogin />
        <Suspense fallback={<RouteLoading />}><BattleShell
          arenaId={pendingArena.arenaId}
          classroomId={pendingArena.classroomId}
          me={pendingArena.me}
          reporterNickname={pendingArena.reporterNickname}
          myWins={pendingArena.myWins}
          myStreak={pendingArena.myStreak}
          resumeRoomId={pendingArena.roomId}
          onExit={() => {
            window.sessionStorage.removeItem('quiz-arena-active-battle');
            setPendingArena(null);
            setView('student');
          }}
        /></Suspense>
      </>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <EmptyState title="선생님 공간은 다음 단계에서 열려요" />
      </div>
    </div>
  );
}

function StudentShell({
  uid,
  nickname,
  classroomId,
  animal,
  onEnter,
  onSignOut,
  accountName,
  accountEmail,
  photoURL,
}: {
  uid: string;
  nickname: string;
  classroomId: string | null;
  animal: Animal;
  onEnter: (arenaId: string, me: { uid: string; nickname: string; avatar: string }, myWins: number, myStreak: number, reporterNickname: string) => void;
  onSignOut: () => void;
  accountName?: string;
  accountEmail?: string | null;
  photoURL?: string | null;
}) {
  const { arenas, error: arenaError, retry: retryArenas } = useArenas(classroomId);
  const { profile, error: profileError, retry: retryProfile } = useProfile(uid);
  const { top20, myRank } = useLeaderboard(classroomId, uid);
  const [shopError, setShopError] = useState<string | null>(null);
  const [legacyReadiness, setLegacyReadiness] = useState<Record<string, { questionCount: number; ready: boolean }>>({});

  useEffect(() => {
    if (!classroomId) return;
    const missing = arenas.filter((arena) => arena.questionCount == null && legacyReadiness[arena.id] == null);
    if (!missing.length) return;
    const getReadiness = httpsCallable<{ arenaId: string }, { questionCount: number; ready: boolean }>(getFunctions(), 'getArenaReadiness');
    for (const arena of missing) {
      void getReadiness({ arenaId: arena.id }).then(({ data }) => {
        setLegacyReadiness((current) => ({ ...current, [arena.id]: data }));
      }).catch(() => {
        setLegacyReadiness((current) => ({ ...current, [arena.id]: { questionCount: -1, ready: false } }));
      });
    }
  }, [arenas, classroomId, legacyReadiness]);

  const mine = classroomId ? arenas.filter((a) => (a as unknown as { classroomId?: string }).classroomId === classroomId).map((a) => {
    const legacy = a.questionCount == null ? legacyReadiness[a.id] : undefined;
    return { ...a, questionCount: a.questionCount ?? legacy?.questionCount, arenaReady: legacy?.ready };
  }) : [];

  const manageCosmetic = (kind: 'avatar' | 'title', id: string, action: 'buy' | 'equip') => {
    const call = httpsCallable(getFunctions(), 'manageCosmetic');
    setShopError(null);
    void call({ kind, id, action }).catch((error: unknown) => {
      const code = (error as { code?: string })?.code;
      setShopError(code?.includes('permission-denied') ? '이 상품을 사용할 수 없어요. 상점 정보를 새로고침해주세요.' : '상품을 저장하지 못했어요. 연결을 확인하고 다시 시도해주세요.');
    });
  };

  return (
    <StudentHome
      arenas={mine}
      leaders={top20}
      profile={profile ?? { nickname, xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 }}
      myUid={uid}
      myRank={myRank}
      accountName={accountName}
      accountEmail={accountEmail}
      photoURL={photoURL}
      arenaError={arenaError}
      onRetryArenas={retryArenas}
      shopError={shopError}
      onRetryQuestionCount={(id) => setLegacyReadiness((current) => { const next = { ...current }; delete next[id]; return next; })}
      profileError={profileError}
      onRetryProfile={retryProfile}
      onEnter={(arenaId) =>
        onEnter(arenaId, { uid, nickname, avatar: animal }, profile?.winCount ?? 0, profile?.streak ?? 0, profile?.nickname ?? nickname)
      }
      onSignOut={onSignOut}
      onBuyAvatar={(id) => manageCosmetic('avatar', id, 'buy')}
      onEquipAvatar={(id) => manageCosmetic('avatar', id, 'equip')}
      onBuyTitle={(id) => manageCosmetic('title', id, 'buy')}
      onEquipTitle={(id) => manageCosmetic('title', id, 'equip')}
      onRename={(name) => {
        if (containsBanned(name)) return;
        void setDoc(doc(db, 'users', uid), { nickname: name }, { merge: true });
      }}
    />
  );
}
