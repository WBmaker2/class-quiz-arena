import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import ClassCreate from './ClassCreate';
import Modal from '../components/Modal';
import RememberLogin from '../components/RememberLogin';
import type { Animal } from '../components/Avatar';
import TeacherHome from './TeacherHome';
const ArenaEditor = lazy(() => import('./ArenaEditor'));
import { useAnalytics } from '../hooks/useAnalytics';
import { useArenaAdmin, type EditableProblem } from '../hooks/useArenaAdmin';
import { useClassroom, useClassroomDoc, useTeacherClassrooms } from '../hooks/useClassroom';
import { useStudents } from '../hooks/useStudents';
import { useTeacherAllowlist } from '../hooks/useTeacherAllowlist';
import { isMasterEmail } from '../lib/admin';
import { useTeacherRooms } from '../hooks/useTeacherRooms';
import { avgCorrectVsWrong, hardProblems, problemStats } from '../lib/analytics';
import { buildRosterCsv } from '../lib/roster';
import { useReports } from '../hooks/useReports';
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export function TeacherShell({ classroomId, userEmail, uid, displayName, photoURL, animal, onSignOut, onSelectClassroom }: { classroomId: string | null; userEmail: string | null; uid: string; displayName: string; photoURL: string | null; animal: Animal; onSignOut: () => void; onSelectClassroom: (id: string | null) => void }) {
  const showAdmin = isMasterEmail(userEmail);
  const { live, abandoned, finished, forceClose, roomsError, retryRooms } = useTeacherRooms(classroomId);
  const { arenas, bank, saveArena, loadProblems, removeArena, setLocked, setShowPlayers, setTtsEnabled, copyArena, seedDefaults } = useArenaAdmin(classroomId);
  const { students, removeStudent } = useStudents(classroomId);
  const { reports, resolveReport } = useReports(classroomId);
  const { create, renameClassroom, deleteClassroom } = useClassroom();
  const { classrooms } = useTeacherClassrooms(import.meta.env.MODE === 'test' ? null : uid);
  const { name: classroomName } = useClassroomDoc(classroomId);
  const { teachers, addTeacher, removeTeacher } = useTeacherAllowlist(showAdmin);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingProblems, setEditingProblems] = useState<EditableProblem[] | null>(null);
  const [creatingClass, setCreatingClass] = useState(false);
  const [analysisArenaId, setAnalysisArenaId] = useState<string | null>(null);
  const { rounds, error: analysisError, retry: retryAnalysis } = useAnalytics(analysisArenaId, classroomId);
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

  if (creatingClass) {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <ClassCreate
            existingNames={classrooms.map((c) => c.name)}
            onCreate={(name) => {
              void create(name, uid, displayName, animal).then((id) => {
                if (id) {
                  setCreatingClass(false);
                  onSelectClassroom(id);
                }
              });
            }}
            onCancel={() => setCreatingClass(false)}
          />
        </div>
      </div>
    );
  }

  let editorModal: ReactNode = null;
  if (creating || editingId) {
    const closeEditor = () => {
      setCreating(false);
      setEditingId(null);
    };
    const arena = arenas.find((a) => a.id === editingId);
    editorModal = (
      <Modal title={editingId ? '아레나 수정' : '새 아레나 만들기'} onClose={closeEditor}>
        {editingId && editingProblems === null ? (
          <p role="status" aria-live="polite">문제를 불러오는 중...</p>
        ) : (
          <Suspense fallback={<p role="status" aria-live="polite">문제 편집기를 불러오는 중...</p>}>
            <ArenaEditor
              initial={
                arena
                  ? {
                      title: arena.title,
                      desc: arena.desc,
                      subject: arena.subject,
                      questionCount: (arena as unknown as { questionCount?: number }).questionCount ?? 0,
                      grade: arena.grade ?? 3,
                      gradeBand: arena.gradeBand,
                      topic: arena.topic ?? '',
                      standards: arena.standards ?? [],
                      cardStyle: arena.cardStyle ?? 'color',
                      illustId: arena.illustId,
                    }
                  : { title: '', desc: '', subject: '수학', questionCount: 0, grade: 3, topic: '', standards: [], cardStyle: 'color' as const }
              }
              problems={editingProblems ?? []}
              onSave={(input, problems) => {
                void saveArena(editingId, input, problems.map((p) => ({ ...p, roundTimeSec: 30 }))).then(() => {
                  setCreating(false);
                  setEditingId(null);
                });
              }}
              onCancel={closeEditor}
            />
          </Suspense>
        )}
      </Modal>
    );
  }

  return (
    <>
      <RememberLogin />
      {editorModal}
      <TeacherHome
      live={live.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      abandoned={abandoned.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      finished={finished.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      arenas={arenas.map((a) => ({ id: a.id, title: a.title, desc: a.desc, subject: a.subject, grade: a.grade, gradeBand: a.gradeBand, locked: a.locked, showPlayers: a.showPlayers ?? false, ttsEnabled: a.ttsEnabled ?? false, standards: a.standards ?? [], cardTheme: a.cardTheme, cardStyle: a.cardStyle ?? 'color', illustId: a.illustId }))}
      bank={bank}
      classroomCode={classroomId ?? ''}
      classroomName={classroomName}
      onRenameClassroom={(name) => {
        if (!classroomId) return Promise.resolve('학급을 먼저 골라주세요');
        return renameClassroom(classroomId, name, uid);
      }}
      onRenameClassroomById={(id, name) => renameClassroom(id, name, uid)}
      onDeleteClassroom={async (id) => {
        const r = await deleteClassroom(id, uid);
        if (!r.ok) return '삭제에 실패했어요. 다시 시도해주세요.';
        onSelectClassroom(r.next);
        return null;
      }}
      onSelectClassroom={onSelectClassroom}
      classrooms={classrooms}
      currentClassroomId={classroomId}
      onNewClassroom={() => setCreatingClass(true)}
      students={students}
      onDeleteStudent={(uid) => {
        void removeStudent(uid);
      }}
      onExportCsv={downloadCsv}
      rounds={rounds}
      roomsError={roomsError}
      onRetryRooms={retryRooms}
      analysisError={analysisError}
      onRetryAnalysis={retryAnalysis}
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
      onSeedDefaults={() => {
        void seedDefaults(uid);
      }}
      reports={reports}
      onResolveReport={(id) => {
        void resolveReport(id);
      }}
      onNewArena={() => setCreating(true)}
      onSignOut={onSignOut}
      showAdmin={showAdmin}
      accountName={displayName}
      accountEmail={userEmail}
      photoURL={photoURL}
      teachers={teachers}
      onAddTeacher={(email) => {
        void addTeacher(email);
      }}
      onRemoveTeacher={(email) => {
        void removeTeacher(email);
      }}
    />
    </>
  );
}
