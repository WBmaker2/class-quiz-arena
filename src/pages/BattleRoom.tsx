import { useEffect, useState } from 'react';
import Card from '../components/Card';
import ArenaCard from '../components/ArenaCard';
import PrimaryButton from '../components/PrimaryButton';
import Timer from '../components/Timer';
import type { CardStyle, ProblemKind } from '../lib/arena';
import { speakProblem, stopSpeaking, ttsSupported } from '../lib/tts';
import { canClaimWin, isCorrectAnswer, roundRemainingMs, type AnswerValue, type GradableProblem, type RoomData } from '../lib/battle';

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
}: {
  room: RoomData;
  meUid: string;
  problem?: { text: string; options: string[]; kind?: ProblemKind };
  nowMs?: number;
  problemsLoaded?: boolean;
  onReady: () => void;
  onAnswer?: (answer: AnswerValue) => void;
  onClaimWin?: () => void;
  onExit: () => void;
  /** 방 생성 시 복사된 아레나 설정. 없으면 방 값 → 그것도 없으면 비공개. */
  showPlayers?: boolean;
  onReport?: () => void;
  /** 대기·진행 화면 위에 참고로 보여주는 아레나. */
  arena?: BattleArenaInfo | null;
  /** 이번 라운드 채점용 정답 정보. 있으면 내 정오를 바로 알려준다. */
  grade?: GradableProblem;
}) {
  const now = nowMs ?? Date.now();
  const me = room.players.find((p) => p.uid === meUid);
  const opponent = room.players.find((p) => p.uid !== meUid);
  const visible = showPlayers ?? room.showPlayers ?? false;
  // 결과에서는 누구와 붙었는지 항상 공개
  const opponentName = visible || room.status === 'finished' ? (opponent?.nickname ?? '???') : '???';
  const [reported, setReported] = useState(false);

  // 라운드가 바뀌거나 끝나면 읽기를 멈춘다
  useEffect(() => {
    stopSpeaking();
  }, [room.currentRound, room.status]);

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
    const myAnswer = me?.answers[room.currentRound];
    const oppAnswer = opponent?.answers[room.currentRound];
    const answered = myAnswer !== null && myAnswer !== undefined;
    const myCorrect = !answered || !grade ? null : isCorrectAnswer(myAnswer, grade);
    const oppAnswered = oppAnswer !== null && oppAnswer !== undefined;
    return (
      <Card>
        <ArenaPanel arena={arena} />
        <Timer endsAt={room.roundEndsAt} nowMs={nowMs} />
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
        ) : isShort ? (
          <ShortAnswerForm onSubmit={(v) => onAnswer?.(v)} />
        ) : (
          problem.options.map((opt, i) => (
            <button key={opt} type="button" className="btn-primary w-full btn-pulse" onClick={() => onAnswer?.(i)}>
              {opt}
            </button>
          ))
        )}
        {answered && myCorrect !== null && <p className="font-bold">{myCorrect ? '정답이에요!' : '아쉬워요. 땡!'}</p>}
        {answered && <p className="text-sm">{oppAnswered ? '상대방도 답을 골랐어요.' : '상대방이 생각 중이에요...'}</p>}
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
          <PrimaryButton pulse={canStart} disabled={!canStart} onClick={onReady}>
            네! 준비됐어요!
          </PrimaryButton>
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <p>단답형 문제예요. 정답을 쓰고 제출을 눌러주세요.</p>
      <label htmlFor="short-answer">내 답</label>
      <input id="short-answer" value={value} onChange={(e) => setValue(e.target.value)} placeholder="예: 세종대왕" />
      <button type="submit" className="btn-primary w-full btn-pulse">
        제출
      </button>
    </form>
  );
}
