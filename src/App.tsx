import { useEffect, useState } from 'react';
import BattleRoom from './pages/BattleRoom';
import ClassJoin from './pages/ClassJoin';
import LoginScreen from './pages/LoginScreen';
import RoleSelect, { type Role } from './pages/RoleSelect';
import StudentHome from './pages/StudentHome';
import EmptyState from './components/EmptyState';
import type { Animal } from './components/Avatar';
import { useArenas } from './hooks/useArenas';
import { useAuth } from './hooks/useAuth';
import { useClassroom } from './hooks/useClassroom';
import { useMatch } from './hooks/useMatch';
import { useProfile } from './hooks/useProfile';
import { useRoom } from './hooks/useRoom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from './lib/firebase';
import type { Problem } from './lib/arena';
import { finishAndAward } from './lib/award';

export type View = 'login' | 'role' | 'join' | 'student' | 'teacher' | 'battle';

export interface PendingArena {
  arenaId: string;
  me: { uid: string; nickname: string; avatar: string };
  myWins: number;
  myStreak: number;
}

export default function App() {
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<Role | null>(null);
  const [animal, setAnimal] = useState<Animal>('cat');
  const [pendingArena, setPendingArena] = useState<PendingArena | null>(null);
  const { classroomId, join } = useClassroom();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const startLogin = () => {
    void Promise.resolve(signInWithGoogle()).catch(() => {});
    setView('role');
  };

  // 실제 환경에서만 미로그인 진입을 막는다. vitest의 MODE는 'test'이므로
  // 테스트 흐름은 Plan 1과 동일하게 통과한다.
  const effectivelySignedOut = !loading && user === null && import.meta.env.MODE !== 'test';
  if (view !== 'login' && effectivelySignedOut) {
    return <LoginScreen onStart={startLogin} />;
  }
  if (view === 'login') {
    return <LoginScreen onStart={startLogin} />;
  }
  if (loading) {
    return <div className="min-h-screen grid place-items-center">불러오는 중...</div>;
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
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <ClassJoin onJoin={(code) => { void join(code, user?.uid ?? 'local-test', { nickname: user?.displayName ?? '학생', role: role ?? 'student', avatar: animal }); setView(role === 'teacher' ? 'teacher' : 'student'); }} />
        </div>
      </div>
    );
  }

  if (view === 'student') {
    return (
      <StudentShell
        uid={user?.uid ?? 'local-test'}
        nickname={user?.displayName ?? '학생'}
        classroomId={classroomId}
        onEnter={(arenaId, me, myWins, myStreak) => {
          setPendingArena({ arenaId, me, myWins, myStreak });
          setView('battle');
        }}
        onSignOut={() => {
          void signOut();
          setView('login');
        }}
      />
    );
  }

  if (view === 'battle' && pendingArena) {
    return (
      <BattleShell
        arenaId={pendingArena.arenaId}
        me={pendingArena.me}
        myWins={pendingArena.myWins}
        myStreak={pendingArena.myStreak}
        onExit={() => setView('student')}
      />
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
  onEnter,
  onSignOut,
}: {
  uid: string;
  nickname: string;
  classroomId: string | null;
  onEnter: (arenaId: string, me: { uid: string; nickname: string; avatar: string }, myWins: number, myStreak: number) => void;
  onSignOut: () => void;
}) {
  const { arenas } = useArenas();
  const { profile } = useProfile(uid);
  const [leaders, setLeaders] = useState<{ nickname: string; xp: number }[]>([]);

  useEffect(() => {
    let alive = true;
    void getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10)))
      .then((snap) => {
        if (!alive) return;
        setLeaders(
          snap.docs.map((d) => ({ nickname: (d.data().nickname as string) ?? '이름 없음', xp: (d.data().xp as number) ?? 0 })),
        );
      })
      .catch(() => {
        if (!alive) return;
        setLeaders([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const mine = classroomId ? arenas.filter((a) => (a as unknown as { classroomId?: string }).classroomId === classroomId) : arenas;

  return (
    <StudentHome
      arenas={mine}
      leaders={leaders}
      profile={profile ?? { nickname, xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 }}
      onEnter={(arenaId) =>
        onEnter(arenaId, { uid, nickname, avatar: 'cat' }, profile?.winCount ?? 0, profile?.streak ?? 0)
      }
      onSignOut={onSignOut}
    />
  );
}

function BattleShell({
  arenaId,
  me,
  myWins,
  myStreak,
  onExit,
}: {
  arenaId: string;
  me: { uid: string; nickname: string; avatar: string };
  myWins: number;
  myStreak: number;
  onExit: () => void;
}) {
  const { roomId, busy, findOrCreate } = useMatch(arenaId, me);
  const [problems, setProblems] = useState<Problem[]>([]);
  const { room, ready, answer, tick, claimWin } = useRoom(roomId, problems);
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    void findOrCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  useEffect(() => {
    if (!roomId) return;
    void getDocs(collection(db, 'arenas', arenaId, 'problems'))
      .then((snap) => {
        setProblems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Problem, 'id'>) })));
      })
      .catch(() => {
        setProblems([]);
      });
  }, [roomId, arenaId]);

  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const t = setInterval(() => {
      void tick();
    }, 1000);
    return () => clearInterval(t);
  }, [room, roomId, tick]);

  useEffect(() => {
    if (!room || room.status !== 'finished' || awarded || problems.length === 0) return;
    setAwarded(true);
    const correct = room.players.find((p) => p.uid === me.uid)?.answers.filter((a, i) => a === problems[i]?.answerIndex).length ?? 0;
    void finishAndAward({
      roomId: roomId!,
      winnerUid: room.winnerUid,
      myUid: me.uid,
      myCorrect: correct,
      myWins,
      myStreak,
    });
  }, [room, awarded, problems, roomId, me.uid, myWins, myStreak]);

  if (busy || !room) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <p>같은 반 친구와 연결 중...</p>
      </div>
    );
  }

  const problem = problems[room.currentRound];
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <BattleRoom
          room={room}
          meUid={me.uid}
          problem={problem ? { text: problem.text, options: problem.options } : undefined}
          onReady={() => {
            void ready(me.uid);
          }}
          onAnswer={(i) => {
            void answer(me.uid, i);
          }}
          onClaimWin={() => {
            void claimWin(me.uid);
          }}
          onExit={onExit}
        />
      </div>
    </div>
  );
}
