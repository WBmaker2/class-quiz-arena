import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Timer from '../components/Timer';
import { canClaimWin, roundRemainingMs, type RoomData } from '../lib/battle';

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
}: {
  room: RoomData;
  meUid: string;
  problem?: { text: string; options: string[] };
  nowMs?: number;
  problemsLoaded?: boolean;
  onReady: () => void;
  onAnswer?: (idx: number) => void;
  onClaimWin?: () => void;
  onExit: () => void;
}) {
  const now = nowMs ?? Date.now();
  const me = room.players.find((p) => p.uid === meUid);
  const opponent = room.players.find((p) => p.uid !== meUid);

  if (room.status === 'finished') {
    const won = room.winnerUid === meUid;
    const draw = room.winnerUid === null;
    return (
      <Card>
        <p className="text-2xl font-extrabold">{draw ? '무승부!' : won ? '승리!' : '아쉽지만 패배'}</p>
        <p>
          내 점수 {me?.score ?? 0} : {opponent?.score ?? 0} 상대 점수
        </p>
        <PrimaryButton onClick={onExit}>아레나로 돌아가기</PrimaryButton>
      </Card>
    );
  }

  if (room.status === 'playing' && problem) {
    const timedOut = roundRemainingMs(room, now) <= 0;
    return (
      <Card>
        <Timer endsAt={room.roundEndsAt} nowMs={nowMs} />
        <p className="text-lg font-bold">{problem.text}</p>
        {timedOut ? (
          <p>시간이 지난 문제예요. 다음 라운드로 넘어가요.</p>
        ) : (
          problem.options.map((opt, i) => (
            <button key={opt} type="button" className="btn-primary w-full" onClick={() => onAnswer?.(i)}>
              {opt}
            </button>
          ))
        )}
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

  return (
    <Card>
      <p className="text-sm">문제 라운드 {room.currentRound + 1}</p>
      <p className="text-lg font-bold">???</p>
      {!me?.ready ? (
        problemsLoaded === false ? (
          <p>문제를 불러오는 중...</p>
        ) : (
          <PrimaryButton onClick={onReady}>네! 준비됐어요!</PrimaryButton>
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
