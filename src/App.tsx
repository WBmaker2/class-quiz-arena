import { useEffect, useState } from 'react';
import BattleRoom from './pages/BattleRoom';
import ClassCreate from './pages/ClassCreate';
import ClassJoin from './pages/ClassJoin';
import LoginScreen from './pages/LoginScreen';
import RoleSelect, { type Role } from './pages/RoleSelect';
import StudentHome from './pages/StudentHome';
import TeacherHome from './pages/TeacherHome';
import ArenaEditor from './pages/ArenaEditor';
import EmptyState from './components/EmptyState';
import type { Animal } from './components/Avatar';
import { useAnalytics } from './hooks/useAnalytics';
import { useArenaAdmin, type EditableProblem } from './hooks/useArenaAdmin';
import { useArenas } from './hooks/useArenas';
import { useAuth } from './hooks/useAuth';
import { useClassroom } from './hooks/useClassroom';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useMatch } from './hooks/useMatch';
import { useProfile } from './hooks/useProfile';
import { useStudents } from './hooks/useStudents';
import { useTeacherAllowlist } from './hooks/useTeacherAllowlist';
import { isMasterEmail } from './lib/admin';
import { useTeacherRooms } from './hooks/useTeacherRooms';
import { avgCorrectVsWrong, hardProblems, problemStats } from './lib/analytics';
import { buildRosterCsv } from './lib/roster';
import { useRoom, orderBattleProblems } from './hooks/useRoom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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
  const { classroomId, join, create } = useClassroom();
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
          {role === 'teacher' ? (
            <ClassCreate
              onCreate={(name) => {
                void create(name, user?.uid ?? 'local-test', user?.displayName ?? '선생님', animal);
                setView('teacher');
              }}
            />
          ) : (
            <ClassJoin onJoin={(code) => { void join(code, user?.uid ?? 'local-test', { nickname: user?.displayName ?? '학생', role: role ?? 'student', avatar: animal }); setView('student'); }} />
          )}
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
        animal={animal}
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

  if (view === 'teacher') {
    return (
      <TeacherShell
        classroomId={classroomId}
        userEmail={user?.email ?? null}
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

function TeacherShell({ classroomId, userEmail, onSignOut }: { classroomId: string | null; userEmail: string | null; onSignOut: () => void }) {
  const showAdmin = isMasterEmail(userEmail);
  const { live, abandoned, finished, forceClose } = useTeacherRooms();
  const { arenas, saveArena, loadProblems, removeArena, setLocked } = useArenaAdmin(classroomId);
  const { students, removeStudent } = useStudents(classroomId);
  const { teachers, addTeacher, removeTeacher } = useTeacherAllowlist(showAdmin);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingProblems, setEditingProblems] = useState<EditableProblem[] | null>(null);
  const [analysisArenaId, setAnalysisArenaId] = useState<string | null>(null);
  const { rounds } = useAnalytics(analysisArenaId);
  const stats = problemStats(rounds);
  const hard = hardProblems(stats, 3);
  const avg = avgCorrectVsWrong(rounds);

  useEffect(() => {
    if (!analysisArenaId && arenas.length > 0) setAnalysisArenaId(arenas[0].id);
  }, [analysisArenaId, arenas]);

  const downloadCsv = () => {
    const blob = new Blob([buildRosterCsv(students)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roster.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!editingId) {
      setEditingProblems(null);
      return;
    }
    let alive = true;
    void loadProblems(editingId)
      .then((ps) => {
        if (alive) setEditingProblems(ps);
      })
      .catch(() => {
        if (alive) setEditingProblems([]);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  if (creating || editingId) {
    if (editingId && editingProblems === null) {
      return (
        <div className="min-h-screen grid place-items-center px-6">
          <p>문제를 불러오는 중...</p>
        </div>
      );
    }
    const arena = arenas.find((a) => a.id === editingId);
    return (
      <ArenaEditor
        initial={
          arena
            ? {
                title: arena.title,
                desc: arena.desc,
                subject: arena.subject,
                questionCount: (arena as unknown as { questionCount?: number }).questionCount ?? 0,
                grade: arena.grade ?? 3,
                topic: arena.topic ?? '',
                standards: arena.standards ?? [],
              }
            : { title: '', desc: '', subject: '수학', questionCount: 0, grade: 3, topic: '', standards: [] }
        }
        problems={editingProblems ?? []}
        onSave={(input, problems) => {
          void saveArena(editingId, input, problems.map((p) => ({ ...p, roundTimeSec: 30 }))).then(() => {
            setCreating(false);
            setEditingId(null);
          });
        }}
        onCancel={() => {
          setCreating(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <TeacherHome
      live={live.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      abandoned={abandoned.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      finished={finished.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      arenas={arenas.map((a) => ({ id: a.id, title: a.title, locked: a.locked }))}
      classroomCode={classroomId ?? ''}
      students={students}
      onDeleteStudent={(uid) => {
        void removeStudent(uid);
      }}
      onExportCsv={downloadCsv}
      rounds={rounds}
      onForceClose={(id) => {
        void forceClose(id);
      }}
      onEditArena={setEditingId}
      onDeleteArena={(id) => {
        void removeArena(id);
      }}
      onToggleLock={(id, locked) => {
        void setLocked(id, locked);
      }}
      onNewArena={() => setCreating(true)}
      onSignOut={onSignOut}
      showAdmin={showAdmin}
      teachers={teachers}
      onAddTeacher={(email) => {
        void addTeacher(email);
      }}
      onRemoveTeacher={(email) => {
        void removeTeacher(email);
      }}
    />
  );
}

function StudentShell({
  uid,
  nickname,
  classroomId,
  animal,
  onEnter,
  onSignOut,
}: {
  uid: string;
  nickname: string;
  classroomId: string | null;
  animal: Animal;
  onEnter: (arenaId: string, me: { uid: string; nickname: string; avatar: string }, myWins: number, myStreak: number) => void;
  onSignOut: () => void;
}) {
  const { arenas } = useArenas();
  const { profile } = useProfile(uid);
  const { top20, myRank } = useLeaderboard(classroomId, uid);

  const mine = classroomId ? arenas.filter((a) => (a as unknown as { classroomId?: string }).classroomId === classroomId) : arenas;

  return (
    <StudentHome
      arenas={mine}
      leaders={top20}
      profile={profile ?? { nickname, xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 }}
      myUid={uid}
      myRank={myRank}
      onEnter={(arenaId) =>
        onEnter(arenaId, { uid, nickname, avatar: animal }, profile?.winCount ?? 0, profile?.streak ?? 0)
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
  const { roomId, busy, error, findOrCreate } = useMatch(arenaId, me);
  const [problems, setProblems] = useState<Problem[]>([]);
  const { room, ready, answer, tick, claimWin } = useRoom(roomId, problems);
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    void findOrCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  useEffect(() => {
    if (!roomId) return;
    void getDocs(query(collection(db, 'arenas', arenaId, 'problems'), orderBy('__name__')))
      .then((snap) => {
        setProblems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Problem, 'id'>) })));
      })
      .catch(() => {
        setProblems([]);
      });
  }, [roomId, arenaId]);

  // 방에 고정된 10문제 순서대로 대결한다. problemIds가 없는 옛 방은 전체를 그대로 쓴다.
  const ordered = orderBattleProblems(problems, room?.problemIds ?? []);

  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const t = setInterval(() => {
      void tick();
    }, 1000);
    return () => clearInterval(t);
  }, [room, roomId, tick]);

  useEffect(() => {
    if (!room || room.status !== 'finished' || awarded || ordered.length === 0) return;
    setAwarded(true);
    const correct = room.players.find((p) => p.uid === me.uid)?.answers.filter((a, i) => a === ordered[i]?.answerIndex).length ?? 0;
    void finishAndAward({
      roomId: roomId!,
      winnerUid: room.winnerUid,
      myUid: me.uid,
      myCorrect: correct,
      myWins,
      myStreak,
    });
  }, [room, awarded, ordered, roomId, me.uid, myWins, myStreak]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="w-full max-w-md text-center">
          <p>{error}</p>
          <button type="button" className="btn-primary mt-4" onClick={onExit}>
            아레나로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (busy || !room) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <p>같은 반 친구와 연결 중...</p>
      </div>
    );
  }

  const problem = ordered[room.currentRound];
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <BattleRoom
          room={room}
          meUid={me.uid}
          problem={problem ? { text: problem.text, options: problem.options } : undefined}
          problemsLoaded={ordered.length > 0}
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
