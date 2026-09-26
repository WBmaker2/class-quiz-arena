import { useEffect, useState } from 'react';
import BattleRoom from './BattleRoom';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../lib/firebase';
import type { Arena, Problem } from '../lib/arena';
import { useMatch } from '../hooks/useMatch';
import { useRoom } from '../hooks/useRoom';

export default function BattleShell({
  arenaId,
  classroomId,
  me,
  reporterNickname,
  myWins,
  myStreak,
  resumeRoomId,
  onExit,
}: {
  arenaId: string;
  classroomId: string | null;
  me: { uid: string; nickname: string; avatar: string };
  reporterNickname: string;
  myWins: number;
  myStreak: number;
  resumeRoomId?: string | null;
  onExit: () => void;
}) {
  const { roomId, busy, error, findOrCreate, retry } = useMatch(arenaId, me, classroomId, resumeRoomId);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [questionError, setQuestionError] = useState(false);
  const [questionAttempt, setQuestionAttempt] = useState(0);
  const [arena, setArena] = useState<Arena | null>(null);
  const { room, error: roomError, retry: retryRoom, ready, answer, tick, claimWin } = useRoom(roomId, problems);
  const [awardFailed, setAwardFailed] = useState(false);
  const [awardAttempt, setAwardAttempt] = useState(1);
  const [lastAwardAttempt, setLastAwardAttempt] = useState(0);

  useEffect(() => {
    if (roomId) {
      window.sessionStorage.setItem('quiz-arena-active-battle', JSON.stringify({ arenaId, classroomId, me, reporterNickname, myWins, myStreak, roomId, uid: me.uid }));
    }
  }, [roomId, arenaId, classroomId, me, reporterNickname, myWins, myStreak]);

  useEffect(() => {
    void findOrCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  useEffect(() => {
    if (!roomId) return;
    setQuestionError(false);
    const getQuestions = httpsCallable<{ roomId: string }, { questions: Array<{ id: string; text: string; options: string[]; kind?: Problem['kind']; roundTimeSec: number }> }>(getFunctions(), 'getBattleQuestions');
    void getQuestions({ roomId }).then(({ data }) => {
        setProblems(data.questions.map((q) => ({ ...q, answerIndex: -1 })));
      })
      .catch(() => {
        setProblems([]);
        setQuestionError(true);
      });
    void getDoc(doc(db, 'arenas', arenaId))
      .then((snap) => {
        setArena(snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Arena, 'id'>) }) : null);
      })
      .catch(() => {
        setArena(null);
      });
  }, [roomId, arenaId, questionAttempt]);

  const ordered = problems;

  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const t = setInterval(() => {
      void tick();
    }, 1000);
    return () => clearInterval(t);
  }, [room, roomId, tick]);

  useEffect(() => {
    if (!room || room.status !== 'finished' || ordered.length === 0 || lastAwardAttempt >= awardAttempt) return;
    setLastAwardAttempt(awardAttempt);
    setAwardFailed(false);
    const award = httpsCallable(getFunctions(), 'awardBattle');
    void award({ roomId: roomId! }).catch(() => setAwardFailed(true));
  }, [room, awardAttempt, lastAwardAttempt, ordered, roomId]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="w-full max-w-md text-center">
          <p>{error}</p>
          <button type="button" className="btn-primary mt-4" onClick={() => void retry()}>
            다시 연결하기
          </button>
          <button type="button" className="btn-primary mt-4" onClick={onExit}>
            아레나로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (busy || !room) {
    if (roomError) return <div className="min-h-screen grid place-items-center px-6"><div className="w-full max-w-md text-center">
      <p role="alert">{roomError}</p>
      <button type="button" className="btn-primary mt-4" onClick={retryRoom}>대결 다시 연결하기</button>
      <button type="button" className="mt-3" onClick={onExit}>아레나로 돌아가기</button>
    </div></div>;
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <p>같은 반 친구와 연결 중...</p>
      </div>
    );
  }

  if (questionError) {
    return <div className="min-h-screen grid place-items-center px-6"><div className="w-full max-w-md text-center">
      <p role="alert">문제를 불러오지 못했어요. 인터넷 연결을 확인해주세요.</p>
      <button type="button" className="btn-primary mt-4" onClick={() => setQuestionAttempt((n) => n + 1)}>문제 다시 불러오기</button>
      <button type="button" className="mt-3" onClick={onExit}>아레나로 돌아가기</button>
    </div></div>;
  }

  const problem = ordered[room.currentRound];
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <BattleRoom
          room={room}
          meUid={me.uid}
          problem={problem ? { text: problem.text, options: problem.options, kind: problem.kind ?? 'choice' } : undefined}
          grade={undefined}
          review={Object.entries(room.reveals ?? {}).sort(([a], [b]) => Number(a) - Number(b)).map(([round, reveal]) => ({
            text: ordered[Number(round)]?.text ?? `문제 ${Number(round) + 1}`,
            options: ordered[Number(round)]?.options ?? [],
            myAnswer: reveal.answers?.[me.uid] ?? null,
            correctAnswer: reveal.correctAnswer,
            explanation: reveal.explanation,
          }))}
          awardFailed={awardFailed}
          onRetryAward={() => setAwardAttempt((value) => value + 1)}
          arena={
            arena
              ? {
                  title: arena.title,
                  subject: arena.subject,
                  grade: arena.grade,
                  gradeBand: arena.gradeBand,
                  desc: arena.desc,
                  cardTheme: arena.cardTheme,
                  cardStyle: arena.cardStyle,
                  illustId: arena.illustId,
                }
              : null
          }
          problemsLoaded={ordered.length > 0}
          onReady={() => ready(me.uid)}
          onAnswer={(v) => answer(me.uid, v)}
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
