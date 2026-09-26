import { useEffect, useState } from 'react';
import Card from '../components/Card';
import ArenaCard from '../components/ArenaCard';
import PrimaryButton from '../components/PrimaryButton';
import Timer from '../components/Timer';
import type { CardStyle, ProblemKind } from '../lib/arena';
import { speakProblem, stopSpeaking, ttsSupported } from '../lib/tts';
import { canClaimWin, normalizeAnswerText, roundRemainingMs, type AnswerValue, type GradableProblem, type RoomData } from '../lib/battle';

/** 대기·진행·결과 화면 위에 참고로 보여주는 아레나 정보. */
export interface BattleArenaInfo {
  title: string;
  subject?: string;
  grade?: number;
  gradeBand?: string;
  desc?: string;
  cardTheme?: { bg: string; emoji: string };
  cardStyle?: CardStyle;
  illustId?: string;
}

function ArenaPanel({ arena }: { arena?: BattleArenaInfo | null }) {
  if (!arena) return null;
  return (
    <div className="mb-3">
      <ArenaCard
        bg={arena.cardTheme?.bg}
        emoji={arena.cardTheme?.emoji}
        illustId={arena.illustId}
        useIllust={(arena.cardStyle ?? 'color') === 'illust'}
        badges={
          <>
            {arena.subject && <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{arena.subject}</span>}
            {(arena.grade != null || arena.gradeBand) && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{arena.gradeBand ?? `${arena.grade}학년`}</span>
            )}
          </>
        }
        title={arena.title}
        body={arena.desc ? <p className="text-sm opacity-70">{arena.desc}</p> : undefined}
      />
    </div>
  );
}

export default function BattleRoom({
  room,
  meUid,
  problem,
  nowMs,
  onReady,
  onAnswer,
  onClaimWin,
  onExit,
  problemsLoaded,
  showPlayers,
  onReport,
  arena,
  grade,
  review,
  awardFailed,
  onRetryAward,
}: {
  room: RoomData;
  meUid: string;
  problem?: { text: string; options: string[]; kind?: ProblemKind };
  nowMs?: number;
  problemsLoaded?: boolean;
  onReady: () => void | Promise<void>;
  onAnswer?: (answer: AnswerValue) => void | Promise<void>;
  onClaimWin?: () => void;
  onExit: () => void;
  /** 방 생성 시 복사된 아레나 설정. 없으면 방 값 → 그것도 없으면 비공개. */
  showPlayers?: boolean;
  onReport?: () => void;
  /** 대기·진행 화면 위에 참고로 보여주는 아레나. */
  arena?: BattleArenaInfo | null;
  /** 이번 라운드 채점용 정답 정보. 있으면 내 정오를 바로 알려준다. */
  grade?: GradableProblem;
  review?: { text: string; options: string[]; myAnswer: number | string | null; correctAnswer: number | string; explanation?: string }[];
  awardFailed?: boolean;
  onRetryAward?: () => void;
}) {
  const now = nowMs ?? Date.now();
  const me = room.players.find((p) => p.uid === meUid);
  const opponent = room.players.find((p) => p.uid !== meUid);
  const visible = showPlayers ?? room.showPlayers ?? false;
  // 결과에서는 누구와 붙었는지 항상 공개
  const opponentName = visible || room.status === 'finished' ? (opponent?.nickname ?? '???') : '???';
  const [reported, setReported] = useState(false);
  const [lockedRound, setLockedRound] = useState<number | null>(null);
  const [readyBusy, setReadyBusy] = useState(false);
  const [readyError, setReadyError] = useState(false);
  const [answerError, setAnswerError] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<AnswerValue | null>(null);
  useEffect(() => setLockedRound(null), [room.currentRound]);

  // 라운드가 바뀌거나 끝나면 읽기를 멈춘다
  useEffect(() => {
    stopSpeaking();
  }, [room.currentRound, room.status]);

  if (room.status === 'abandoned') {
    return <Card><ArenaPanel arena={arena} /><h1 className="text-xl font-extrabold">대결이 종료됐어요</h1><p className="mt-2">선생님이 이 대결을 마무리했어요. 아레나로 돌아가 다시 시작할 수 있어요.</p><PrimaryButton pulse onClick={onExit}>아레나로 돌아가기</PrimaryButton></Card>;
  }

  if (room.status === 'finished') {
    const won = room.winnerUid === meUid;
    const draw = room.winnerUid === null;
    return (
      <Card>
        <ArenaPanel arena={arena} />
        <p className="text-2xl font-extrabold">{draw ? '무승부!' : won ? '승리!' : '아쉽지만 패배'}</p>
        <p>
          내 점수 {me?.score ?? 0} : {opponent?.score ?? 0} 상대 점수
        </p>
        {review && review.length > 0 && (
          <section className="mt-4 text-left" aria-label="문제 복습">
            <h2 className="font-bold text-lg mb-2">문제 다시 보기</h2>
            <ol className="space-y-3">
              {review.map((item, index) => {
                const answerText = typeof item.correctAnswer === 'number' ? item.options[item.correctAnswer] ?? '정답 정보' : item.correctAnswer;
                const myText = typeof item.myAnswer === 'number' ? item.options[item.myAnswer] ?? '답하지 않음' : item.myAnswer ?? '답하지 않음';
                const isRight = typeof item.correctAnswer === 'number'
                  ? item.myAnswer === item.correctAnswer
                  : typeof item.myAnswer === 'string' && normalizeAnswerText(item.myAnswer) === normalizeAnswerText(String(item.correctAnswer));
                return <li key={index} className="rounded-xl bg-white/70 p-3">
                  <p className="font-bold">{index + 1}. {item.text}</p>
                  <p className="text-sm">내 답: {myText}</p>
                  <p className="text-sm font-bold">{isRight ? '맞았어요!' : '다음에는 이 답을 살펴봐요.'}</p>
                  <p className="text-sm">정답: {answerText}</p>
                  {item.explanation && <p className="text-sm mt-1">해설: {item.explanation}</p>}
                </li>;
              })}
            </ol>
          </section>
        )}
        {awardFailed && <div role="alert" className="mt-3"><p>별과 경험치를 저장하지 못했어요.</p><button type="button" className="btn-primary mt-2" onClick={onRetryAward}>다시 저장하기</button></div>}
        {opponent && <p>상대 {opponent.nickname}와의 대결이었어요</p>}
        {opponent && !reported && onReport ? (
          <button
            type="button"
            onClick={() => {
              onReport();
              setReported(true);
            }}
          >
            상대 이름 신고하기
          </button>
        ) : null}
        {reported && <p>신고가 접수됐어요. 선생님이 확인할 거예요.</p>}
        <PrimaryButton pulse onClick={onExit}>아레나로 돌아가기</PrimaryButton>
      </Card>
    );
  }

  if (room.status === 'playing' && problem) {
    const timedOut = roundRemainingMs(room, now) <= 0;
    const isShort = (problem.kind ?? 'choice') === 'short';
    const answered = (me?.answeredRounds?.includes(room.currentRound) ?? false) || lockedRound === room.currentRound;
    const reveal = room.reveals?.[String(room.currentRound)] ?? room.reveals?.[String(room.currentRound - 1)];
    const submitAnswer = (value: AnswerValue) => {
      if (answered) return;
      setLockedRound(room.currentRound);
      setPendingAnswer(value);
      setAnswerError(false);
      void Promise.resolve(onAnswer?.(value)).catch(() => {
        setLockedRound(null);
        setAnswerError(true);
      });
    };
    const retryAnswer = () => {
      if (pendingAnswer === null) return;
      setLockedRound(room.currentRound);
      setAnswerError(false);
      void Promise.resolve(onAnswer?.(pendingAnswer)).catch(() => {
        setLockedRound(null);
        setAnswerError(true);
      });
    };
    const oppAnswered = opponent?.answeredRounds?.includes(room.currentRound) ?? false;
    return (
      <Card>
        <ArenaPanel arena={arena} />
        <Timer endsAt={room.roundEndsAt} nowMs={nowMs} />
        <p className="text-sm">문제 {room.currentRound + 1} / {room.problemIds.length || '?'}</p>
        <p className="text-sm">대전 상대: {opponentName}</p>
        <p className="text-sm font-bold tnum">
          나 {me?.score ?? 0}점 : {opponent?.score ?? 0}점 상대
        </p>
        <p className="text-lg font-bold">{problem.text}</p>
        {ttsSupported() && (room.ttsEnabled ?? false) && (
          <button
            type="button"
            aria-label="문제 읽어주기"
            onClick={() => speakProblem(problem.text, problem.options, problem.kind ?? 'choice')}
          >
            🔊
          </button>
        )}
        {timedOut ? (
          <p>시간이 지난 문제예요. 다음 라운드로 넘어가요.</p>
        ) : answerError ? (
          <div role="alert"><p>답을 보내지 못했어요. 연결을 확인하고 다시 시도해주세요.</p><button type="button" className="btn-primary w-full mt-2" onClick={retryAnswer}>답 다시 보내기</button></div>
        ) : answered ? (
          <p className="rounded-xl bg-white/70 p-3 font-bold">답을 제출했어요. 상대가 답할 때까지 기다려요.</p>
        ) : isShort ? (
          <ShortAnswerForm key={room.currentRound} onSubmit={submitAnswer} />
        ) : (
          problem.options.map((opt, i) => (
            <button key={`${i}-${opt}`} type="button" className="btn-primary w-full btn-pulse" disabled={answered} onClick={() => submitAnswer(i)}>
              {opt}
            </button>
          ))
        )}
        {reveal && <div className="rounded-xl bg-white/80 p-3"><p className="font-bold">{reveal.explanation ?? '두 사람이 답을 제출했어요. 다음 문제를 준비하고 있어요.'}</p></div>}
        {answered && !reveal && <p className="text-sm">{oppAnswered ? '상대방도 답을 골랐어요.' : '상대방이 생각 중이에요...'}</p>}
        {canClaimWin(room, meUid, now) && (
          <button type="button" onClick={() => onClaimWin?.()}>
            자동 승리로 처리할까요?
          </button>
        )}
        <button type="button" onClick={onExit}>
          나가기
        </button>
      </Card>
    );
  }

  // 대기 화면: 1명이면 매칭 대기, 2명이면 매칭 완료.
  // 시작 버튼은 매칭이 끝나기 전까지 눌리지 않다가, 끝나면 펄스와 함께 켜진다.
  const matched = room.players.length >= 2;
  const canStart = matched && problemsLoaded !== false;
  const myName = me?.nickname ?? '나';
  return (
    <Card>
      <ArenaPanel arena={arena} />
      <p className="text-sm">{matched ? '1:1 매칭 완료!' : '대결 상대를 기다리는 중...'}</p>
      <p className="text-lg font-bold">{matched ? `${myName} vs ${opponentName}` : '??? vs ???'}</p>
      {!me?.ready ? (
        problemsLoaded === false ? (
          <p>문제를 불러오는 중...</p>
        ) : (
          <>
            {readyError && <p role="alert">준비 신호를 보내지 못했어요. 다시 눌러주세요.</p>}
            <PrimaryButton pulse={canStart} disabled={!canStart || readyBusy} onClick={() => {
              setReadyBusy(true);
              setReadyError(false);
              void Promise.resolve(onReady()).catch(() => setReadyError(true)).finally(() => setReadyBusy(false));
            }}>
              {readyBusy ? '확인 중...' : readyError ? '다시 준비하기' : '네! 준비됐어요!'}
            </PrimaryButton>
          </>
        )
      ) : opponent && !opponent.ready ? (
        <p>상대 준비 기다리는 중...</p>
      ) : (
        <p>곧 시작해요!</p>
      )}
      <button type="button" onClick={onExit}>
        나가기
      </button>
    </Card>
  );
}

function ShortAnswerForm({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim() || submitted) return;
        setSubmitted(true);
        onSubmit(value.trim());
      }}
    >
      <p>단답형 문제예요. 정답을 쓰고 제출을 눌러주세요.</p>
      <label htmlFor="short-answer">내 답</label>
      <input id="short-answer" value={value} disabled={submitted} onChange={(e) => setValue(e.target.value)} placeholder="예: 세종대왕" />
      <button type="submit" disabled={submitted || !value.trim()} className="btn-primary w-full btn-pulse">
        제출
      </button>
    </form>
  );
}
