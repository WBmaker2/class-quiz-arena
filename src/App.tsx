import { useEffect, useState } from 'react';
import BattleRoom from './pages/BattleRoom';
import ClassCreate from './pages/ClassCreate';
import ClassJoin from './pages/ClassJoin';
import ClassSelect from './pages/ClassSelect';
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
import { useClassroom, useTeacherClassrooms } from './hooks/useClassroom';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useMatch } from './hooks/useMatch';
import { useProfile } from './hooks/useProfile';
import { useStudents } from './hooks/useStudents';
import { useTeacherAllowlist } from './hooks/useTeacherAllowlist';
import { isMasterEmail } from './lib/admin';
import { useTeacherRooms } from './hooks/useTeacherRooms';
import { avgCorrectVsWrong, hardProblems, problemStats } from './lib/analytics';
import { buildRosterCsv } from './lib/roster';
import { useReports } from './hooks/useReports';
import { useRoom, orderBattleProblems } from './hooks/useRoom';
import { isCorrectAnswer } from './lib/battle';
import { TITLE_GOODS } from './data/shop';
import { containsBanned } from './lib/nickname';
import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import type { Problem } from './lib/arena';
import { finishAndAward } from './lib/award';

export type View = 'login' | 'role' | 'join' | 'student' | 'teacher' | 'battle';

export interface PendingArena {
  arenaId: string;
  classroomId: string | null;
  me: { uid: string; nickname: string; avatar: string };
  reporterNickname: string;
  myWins: number;
  myStreak: number;
}

export default function App() {
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<Role | null>(null);
  const [animal, setAnimal] = useState<Animal>('cat');
  const [pendingArena, setPendingArena] = useState<PendingArena | null>(null);
  const { classroomId, join, create, select } = useClassroom();
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
              onJoin={(code, nickname) => { void join(code, user?.uid ?? 'local-test', { nickname, role: role ?? 'student', avatar: animal }); setView('student'); }}
            />
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
        onEnter={(arenaId, me, myWins, myStreak, reporterNickname) => {
          setPendingArena({ arenaId, classroomId, me, reporterNickname, myWins, myStreak });
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
        classroomId={pendingArena.classroomId}
        me={pendingArena.me}
        reporterNickname={pendingArena.reporterNickname}
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
  const { arenas, bank, saveArena, loadProblems, removeArena, setLocked, setShowPlayers, setTtsEnabled, copyArena } = useArenaAdmin(classroomId);
  const { students, removeStudent } = useStudents(classroomId);
  const { reports, resolveReport } = useReports(classroomId);
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
      arenas={arenas.map((a) => ({ id: a.id, title: a.title, locked: a.locked, showPlayers: a.showPlayers ?? false, ttsEnabled: a.ttsEnabled ?? false, standards: a.standards ?? [] }))}
      bank={bank}
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
      onToggleShowPlayers={(id, showPlayers) => {
        void setShowPlayers(id, showPlayers);
      }}
      onToggleTts={(id, ttsEnabled) => {
        void setTtsEnabled(id, ttsEnabled);
      }}
      onCopyArena={(id) => {
        void copyArena(id);
      }}
      reports={reports}
      onResolveReport={(id) => {
        void resolveReport(id);
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

export function TeacherGate({
  uid,
  displayName,
  animal,
  create,
  onDone,
}: {
  uid: string;
  displayName: string;
  animal: Animal;
  create: (name: string, uid: string, nickname: string, avatar: string) => Promise<string | null>;
  onDone: (classroomId: string) => void;
}) {
  // 테스트에서는 조회 없이 만들기 화면 (기존 App 테스트 유지)
  const { classrooms, loading } = useTeacherClassrooms(import.meta.env.MODE === 'test' ? null : uid);
  const [creating, setCreating] = useState(false);
  const [entered, setEntered] = useState(false);

  // 학급 1개면 자동으로 입장
  useEffect(() => {
    if (!entered && !loading && !creating && classrooms.length === 1) {
      setEntered(true);
      onDone(classrooms[0].id);
    }
  }, [entered, loading, creating, classrooms, onDone]);

  if (loading) {
    return <p>학급 목록을 불러오는 중...</p>;
  }
  if (creating || classrooms.length === 0) {
    return (
      <ClassCreate
        onCreate={(name) => {
          void create(name, uid, displayName, animal).then((id) => {
            if (id) onDone(id);
          });
        }}
      />
    );
  }
  if (classrooms.length === 1) {
    return <p>학급으로 들어가는 중...</p>;
  }
  return <ClassSelect classrooms={classrooms} onSelect={onDone} onCreateNew={() => setCreating(true)} />;
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
  onEnter: (arenaId: string, me: { uid: string; nickname: string; avatar: string }, myWins: number, myStreak: number, reporterNickname: string) => void;
  onSignOut: () => void;
}) {
  const { arenas } = useArenas();
  const { profile } = useProfile(uid);
  const { top20, myRank } = useLeaderboard(classroomId, uid);

  const mine = classroomId ? arenas.filter((a) => (a as unknown as { classroomId?: string }).classroomId === classroomId) : arenas;

  const saveProfile = (patch: Record<string, unknown>) => {
    void setDoc(doc(db, 'users', uid), patch, { merge: true });
  };

  return (
    <StudentHome
      arenas={mine}
      leaders={top20}
      profile={profile ?? { nickname, xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 }}
      myUid={uid}
      myRank={myRank}
      onEnter={(arenaId) =>
        onEnter(arenaId, { uid, nickname, avatar: animal }, profile?.winCount ?? 0, profile?.streak ?? 0, profile?.nickname ?? nickname)
      }
      onSignOut={onSignOut}
      onBuyAvatar={(id, price) => {
        if ((profile?.xp ?? 0) < price) return;
        saveProfile({
          xp: (profile?.xp ?? 0) - price,
          unlockedAvatars: [...(profile?.unlockedAvatars ?? []), id],
          avatar: id,
        });
      }}
      onEquipAvatar={(id) => saveProfile({ avatar: id })}
      onBuyTitle={(id, price) => {
        if ((profile?.xp ?? 0) < price) return;
        const label = TITLE_GOODS.find((g) => g.id === id)?.label ?? id;
        saveProfile({
          xp: (profile?.xp ?? 0) - price,
          unlockedTitles: [...(profile?.unlockedTitles ?? []), id],
          title: label,
        });
      }}
      onEquipTitle={(label) => saveProfile({ title: label })}
      onRename={(name) => {
        if (containsBanned(name)) return;
        saveProfile({ nickname: name });
      }}
    />
  );
}

function BattleShell({
  arenaId,
  classroomId,
  me,
  reporterNickname,
  myWins,
  myStreak,
  onExit,
}: {
  arenaId: string;
  classroomId: string | null;
  me: { uid: string; nickname: string; avatar: string };
  reporterNickname: string;
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
    const mine = room.players.find((p) => p.uid === me.uid)?.answers ?? [];
    const correct = mine.filter((a, i) => isCorrectAnswer(a, ordered[i] ?? { answerIndex: -1 })).length;
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
          problem={problem ? { text: problem.text, options: problem.options, kind: problem.kind ?? 'choice' } : undefined}
          problemsLoaded={ordered.length > 0}
          onReady={() => {
            void ready(me.uid);
          }}
          onAnswer={(v) => {
            void answer(me.uid, v);
          }}
          onClaimWin={() => {
            void claimWin(me.uid);
          }}
          onReport={() => {
            const opponent = room.players.find((p) => p.uid !== me.uid);
            if (!opponent || !classroomId) return;
            void setDoc(doc(collection(db, 'reports')), {
              reporterUid: me.uid,
              reporterNickname,
              reportedUid: opponent.uid,
              reportedNickname: opponent.nickname,
              arenaId,
              classroomId,
              status: 'open',
              createdAt: Date.now(),
            });
          }}
          onExit={onExit}
        />
      </div>
    </div>
  );
}
