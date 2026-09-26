import { useEffect, useState } from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import InviteQR from '../components/InviteQR';
import { avgCorrectVsWrong, hardProblems, problemStats, weakStandards, type RoundRecord } from '../lib/analytics';
import { GRADES, coverageOf, findStandard, getStandards, subjectsOfGrade } from '../data/curriculum2022';
import { containsBanned } from '../lib/nickname';
import Toggle from '../components/Toggle';
import Modal from '../components/Modal';
import UpdateLog from '../components/UpdateLog';
import AccountChip from '../components/AccountChip';
import ArenaCard from '../components/ArenaCard';
import type { CardStyle } from '../lib/arena';
import { gradeLabel } from '../lib/arena';
import type { NameReport } from '../hooks/useReports';
import type { RosterStudent } from '../lib/roster';

export interface LiveRoom {
  id: string;
  arenaTitle: string;
  players: string[];
}

export interface ArenaRow {
  id: string;
  title: string;
  desc?: string;
  subject?: string;
  grade?: number;
  gradeBand?: string;
  locked: boolean;
  /** true면 학생에게 상대 공개. 없으면 비공개로 간주. */
  showPlayers?: boolean;
  /** true면 대결 화면 읽어주기 버튼. 없으면 off. */
  ttsEnabled?: boolean;
  standards?: string[];
  cardTheme?: { bg: string; emoji: string };
  cardStyle?: CardStyle;
  illustId?: string;
}

export interface BankArena {
  id: string;
  title: string;
  subject: string;
  grade?: number;
  gradeBand?: string;
  cardTheme?: { bg: string; emoji: string };
  cardStyle?: CardStyle;
  illustId?: string;
}

export default function TeacherHome({
  live,
  abandoned,
  finished,
  arenas,
  bank,
  classroomCode,
  students,
  onDeleteStudent,
  onExportCsv,
  rounds,
  onForceClose,
  onEditArena,
  onDeleteArena,
  onToggleLock,
  onToggleShowPlayers,
  onToggleTts,
  onCopyArena,
  onSeedDefaults,
  onNewArena,
  onSignOut,
  classroomName,
  onRenameClassroom,
  onNewClassroom,
  reports,
  onResolveReport,
  showAdmin,
  teachers,
  onAddTeacher,
  onRemoveTeacher,
  accountName,
  accountEmail,
  photoURL,
}: {
  live: LiveRoom[];
  abandoned: LiveRoom[];
  finished: LiveRoom[];
  arenas: ArenaRow[];
  bank?: BankArena[];
  classroomCode: string;
  students: RosterStudent[];
  onDeleteStudent: (uid: string) => void;
  onExportCsv: () => void;
  rounds: RoundRecord[];
  onForceClose: (id: string) => void;
  onEditArena: (id: string) => void;
  onDeleteArena: (id: string) => void;
  onToggleLock: (id: string, locked: boolean) => void;
  onToggleShowPlayers: (id: string, showPlayers: boolean) => void;
  onToggleTts: (id: string, ttsEnabled: boolean) => void;
  onCopyArena?: (id: string) => void;
  onSeedDefaults?: () => void;
  onNewArena: () => void;
  onSignOut: () => void;
  classroomName?: string;
  onRenameClassroom?: (name: string) => void;
  onNewClassroom?: () => void;
  reports?: NameReport[];
  onResolveReport?: (id: string) => void;
  showAdmin?: boolean;
  teachers?: string[];
  onAddTeacher?: (email: string) => void;
  onRemoveTeacher?: (email: string) => void;
  accountName?: string;
  accountEmail?: string | null;
  photoURL?: string | null;
}) {
  const [tab, setTab] = useState<'live' | 'arenas' | 'students' | 'analysis' | 'reports' | 'classroom' | 'admin'>('live');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [coverageGrade, setCoverageGrade] = useState(3);
  const [coverageSubject, setCoverageSubject] = useState('수학');
  const coverageSubjects = subjectsOfGrade(coverageGrade);
  const effectiveCoverageSubject = coverageSubjects.includes(coverageSubject) ? coverageSubject : (coverageSubjects[0] ?? '국어');
  const [className, setClassName] = useState(classroomName ?? '');
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

  useEffect(() => {
    setClassName(classroomName ?? '');
  }, [classroomName]);

  const stats = problemStats(rounds);
  const hard = hardProblems(stats, 3);
  const avg = avgCorrectVsWrong(rounds);
  const weak = weakStandards(rounds, 3);
  const coverageStandards = getStandards(coverageGrade, effectiveCoverageSubject);
  const coverage = coverageOf(coverageStandards, arenas);
  const coveredCount = coverage.filter((c) => c.covered).length;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="font-bold mb-0 text-xl">선생님 워크스페이스</p>
          <div className="flex items-center gap-2">
            {accountName && <AccountChip name={accountName} email={accountEmail} photoURL={photoURL} />}
            <button type="button" onClick={() => setShowUpdates(true)}>
              업데이트 내역
            </button>
            <button
              type="button"
              onClick={() => window.open(`${window.location.origin}${window.location.pathname}?preview=${classroomCode}`, '_blank')}
            >
              학생 화면 미리보기
            </button>
          </div>
        </div>
        <nav aria-label="선생님 메뉴" className="flex flex-wrap gap-2 mb-5">
          <button type="button" onClick={() => setTab('live')} aria-current={tab === 'live' ? 'page' : undefined} className={tab === 'live' ? 'tab-active' : undefined}>
            현재 대결
          </button>
          <button type="button" onClick={() => setTab('arenas')} aria-current={tab === 'arenas' ? 'page' : undefined} className={tab === 'arenas' ? 'tab-active' : undefined}>
            아레나
          </button>
          <button type="button" onClick={() => setTab('students')} aria-current={tab === 'students' ? 'page' : undefined} className={tab === 'students' ? 'tab-active' : undefined}>
            학생
          </button>
          <button type="button" onClick={() => setTab('analysis')} aria-current={tab === 'analysis' ? 'page' : undefined} className={tab === 'analysis' ? 'tab-active' : undefined}>
            분석
          </button>
          <button type="button" onClick={() => setTab('reports')} aria-current={tab === 'reports' ? 'page' : undefined} className={tab === 'reports' ? 'tab-active' : undefined}>
            신고
          </button>
          <button type="button" onClick={() => setTab('classroom')} aria-current={tab === 'classroom' ? 'page' : undefined} className={tab === 'classroom' ? 'tab-active' : undefined}>
            학급
          </button>
          {showAdmin && (
            <button type="button" onClick={() => setTab('admin')} aria-current={tab === 'admin' ? 'page' : undefined} className={tab === 'admin' ? 'tab-active' : undefined}>
              선생님 관리
            </button>
          )}
          <button type="button" onClick={() => setConfirmingLogout(true)}>
            로그아웃
          </button>
        </nav>
        {tab === 'live' && (
          <Card>
            <p className="font-bold mb-2">진행 중인 대결</p>
            {live.length === 0 ? (
              <EmptyState title="지금은 진행 중인 대결이 없어요" />
            ) : (
              live.map((r) => (
                <div key={r.id}>
                  <p>
                    {r.arenaTitle} — {r.players.join(' vs ')}
                  </p>
                  {confirmId === r.id ? (
                    <div>
                      <p>이 대결을 강제 종료할까요?</p>
                      <button type="button" onClick={() => { onForceClose(r.id); setConfirmId(null); }}>
                        끝내기
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmId(r.id)}>
                      강제 종료
                    </button>
                  )}
                </div>
              ))
            )}
            <p className="font-bold mt-4">방치된 대결</p>
            {abandoned.length === 0 ? <p>방치된 대결이 없어요</p> : abandoned.map((r) => <p key={r.id}>{r.arenaTitle}</p>)}
            <p className="font-bold mt-4">최근 종료된 대결</p>
            {finished.length === 0 ? <p>종료된 대결이 아직 없어요</p> : finished.map((r) => <p key={r.id}>{r.arenaTitle}</p>)}
          </Card>
        )}
        {tab === 'arenas' && (
          <>
            <Card>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-pulse" onClick={onNewArena}>
                  새 아레나 만들기
                </button>
                {arenas.length === 0 && (
                  <button type="button" onClick={() => onSeedDefaults?.()}>
                    기본 아레나 6개 가져오기
                  </button>
                )}
              </div>
              {arenas.length === 0 && <p className="mt-2">아직 만든 아레나가 없어요</p>}
            </Card>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {arenas.map((a) => (
              <ArenaCard
                key={a.id}
                bg={a.cardTheme?.bg}
                emoji={a.cardTheme?.emoji}
                illustId={a.illustId}
                useIllust={(a.cardStyle ?? 'color') === 'illust'}
                badges={
                  <>
                    {a.subject && <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{a.subject}</span>}
                    {(a.grade != null || a.gradeBand) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{gradeLabel(a)}</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">
                      {a.locked ? '비공개' : '공개 중'}
                    </span>
                  </>
                }
                title={a.title}
                body={
                  <>
                    {a.desc && <p className="text-sm opacity-70">{a.desc}</p>}
                    {(a.standards ?? []).length > 0 && (
                      <p className="text-xs mt-1">성취기준 {(a.standards ?? []).length}개</p>
                    )}
                  </>
                }
                footer={
                  <>
                    <div className="flex items-center gap-2 mt-1">
                      <Toggle small checked={a.locked} onChange={(next) => onToggleLock(a.id, next)} label="잠금" />
                      <Toggle
                        small
                        checked={a.showPlayers ?? false}
                        onChange={(next) => onToggleShowPlayers(a.id, next)}
                        label="공개"
                      />
                      <Toggle
                        small
                        checked={a.ttsEnabled ?? false}
                        onChange={(next) => onToggleTts(a.id, next)}
                        label="읽어주기"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button type="button" onClick={() => onEditArena(a.id)}>
                        아레나 수정
                      </button>
                      <button type="button" onClick={() => onDeleteArena(a.id)}>
                        아레나 삭제
                      </button>
                    </div>
                  </>
                }
              />
            ))}
            </div>
            <p className="font-display text-xl mt-5 mb-2">다른 반 공개 아레나 가져오기</p>
            {(bank ?? []).length === 0 ? (
              <p>가져올 수 있는 아레나가 없어요</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {(bank ?? []).map((b) => (
                <ArenaCard
                  key={b.id}
                  bg={b.cardTheme?.bg}
                  emoji={b.cardTheme?.emoji}
                  illustId={b.illustId}
                  useIllust={(b.cardStyle ?? 'color') === 'illust'}
                  badges={
                    <>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{b.subject}</span>
                      {(b.grade != null || b.gradeBand) && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{gradeLabel(b)}</span>
                      )}
                    </>
                  }
                  title={b.title}
                  footer={
                    <button type="button" onClick={() => onCopyArena?.(b.id)}>
                      가져오기
                    </button>
                  }
                />
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'students' && (
          <Card>
            <p className="font-bold mb-2">학생 일괄 관리</p>
            <InviteQR code={classroomCode} />
            <p>학급 초대 QR — 탭해서 확대</p>
            <p>초대 코드: {classroomCode}</p>
            {students.length === 0 ? (
              <EmptyState title="아직 등록된 학생이 없어요" />
            ) : (
              students.map((s) => (
                <div key={s.uid}>
                  <p>
                    {s.nickname}
                    {containsBanned(s.nickname) && <span className="ml-1 text-xs">⚠ 이름 확인 필요</span>}
                  </p>
                  <button type="button" onClick={() => onDeleteStudent(s.uid)}>
                    학생 삭제
                  </button>
                </div>
              ))
            )}
            <button type="button" onClick={onExportCsv}>
              명단 내려받기
            </button>
          </Card>
        )}
        {tab === 'analysis' && (
          <>
            <Card>
              {rounds.length === 0 ? (
                <EmptyState title="아직 분석할 기록이 없어요" />
              ) : (
                <div>
                  <p>어려운 문제 {hard.length}개</p>
                  {hard.map((h) => (
                    <p key={h.problemIndex}>
                      {h.problemIndex + 1}번 문제 — {h.correct}/{h.asked} 정답
                    </p>
                  ))}
                  <p>
                    맞힌 문제 평균 {avg.avgCorrect} vs 틀린 문제 평균 {avg.avgWrong}
                  </p>
                  <p className="font-bold mt-4">우리 반이 어려워해요 Top 3 (최근 30일)</p>
                  {weak.length === 0 ? (
                    <p>성취기준별 기록이 아직 없어요</p>
                  ) : (
                    weak.map((w) => (
                      <p key={w.code}>
                        {w.code} {findStandard(w.code)?.summary ?? ''} — 정답률{' '}
                        {Math.round(w.rate * 100)}% ({w.correct}/{w.asked})
                      </p>
                    ))
                  )}
                </div>
              )}
            </Card>
            <Card>
              <p className="font-bold mb-2">교육과정 커버리지 지도</p>
              <label htmlFor="coverage-grade">학년</label>
              <select
                id="coverage-grade"
                value={coverageGrade}
                onChange={(e) => setCoverageGrade(Number(e.target.value))}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}학년
                  </option>
                ))}
              </select>
              <label htmlFor="coverage-subject">과목</label>
              <select id="coverage-subject" value={effectiveCoverageSubject} onChange={(e) => setCoverageSubject(e.target.value)}>
                {coverageSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-sm">
                {coverageStandards.length}개 중 {coveredCount}개 출제
              </p>
              {coverageStandards.length === 0 && <p>이 학년·과목에는 등록된 기준이 없어요</p>}
              {coverage.map((c) => (
                <p key={c.code} style={{ background: c.covered ? '#DFF5DF' : '#F0F0F0' }}>
                  {c.code} {c.summary} — {c.covered ? '출제됨' : '안 됨'}
                </p>
              ))}
            </Card>
          </>
        )}
        {tab === 'reports' && (
          <Card>
            <p className="font-bold mb-2">이름 신고 목록</p>
            {(reports ?? []).length === 0 ? (
              <EmptyState title="접수된 신고가 없어요" />
            ) : (
              (reports ?? []).map((r) => (
                <div key={r.id}>
                  <p>
                    {r.reportedNickname} (신고: {r.reporterNickname}) —{' '}
                    {r.status === 'open' ? '확인 중' : '처리됨'}
                  </p>
                  {r.status === 'open' && (
                    <button type="button" onClick={() => onResolveReport?.(r.id)}>
                      처리완료
                    </button>
                  )}
                </div>
              ))
            )}
          </Card>
        )}
        {tab === 'classroom' && (
          <Card>
            <p className="font-bold mb-3 text-lg">학급 관리</p>
            <div className="flex flex-col gap-2 mb-3">
              <label htmlFor="classroom-name">학급 이름</label>
              <input
                id="classroom-name"
                value={className}
                maxLength={30}
                onChange={(e) => setClassName(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-1">
                <button type="button" onClick={() => onRenameClassroom?.(className)}>
                  이름 저장
                </button>
                <button type="button" onClick={() => onNewClassroom?.()}>
                  새 학급 만들기
                </button>
              </div>
            </div>
            <p className="text-sm mt-2">초대 코드: {classroomCode}</p>
          </Card>
        )}
        {tab === 'admin' && showAdmin && (
          <Card>
            <p className="font-bold mb-2">선생님 관리</p>
            <p>등록된 선생님 계정만 학급을 만들 수 있어요</p>
            {(teachers ?? []).map((email) => (
              <div key={email}>
                <p>{email}</p>
                <button type="button" onClick={() => onRemoveTeacher?.(email)}>
                  삭제
                </button>
              </div>
            ))}
            <label htmlFor="teacher-email">선생님 이메일</label>
            <input
              id="teacher-email"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="예: teacher@school.kr"
            />
            <button
              type="button"
              onClick={() => {
                onAddTeacher?.(teacherEmail);
                setTeacherEmail('');
              }}
            >
              추가
            </button>
          </Card>
        )}
        {showUpdates && (
          <Modal title="업데이트 내역" onClose={() => setShowUpdates(false)}>
            <p className="font-bold mb-3 text-lg">업데이트 내역</p>
            <UpdateLog />
          </Modal>
        )}
        {confirmingLogout && (
          <Modal title="로그아웃 확인" onClose={() => setConfirmingLogout(false)}>
            <p className="font-bold mb-3">정말 로그아웃 하시겠습니까?</p>
            <div className="flex gap-2">
              <button type="button" className="btn-primary flex-1" onClick={onSignOut}>
                확인
              </button>
              <button type="button" className="flex-1" onClick={() => setConfirmingLogout(false)}>
                취소
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
