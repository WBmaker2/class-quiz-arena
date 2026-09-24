import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import type { RoomData } from '../lib/battle';

export default function BattleRoom({
  room,
  meUid,
  onReady,
  onExit,
}: {
  room: RoomData;
  meUid: string;
  onReady: () => void;
  onExit: () => void;
}) {
  const me = room.players.find((p) => p.uid === meUid);
  const opponent = room.players.find((p) => p.uid !== meUid);

  return (
    <Card>
      <p className="text-sm">문제 라운드 {room.currentRound + 1}</p>
      <p className="text-lg font-bold">???</p>
      {!me?.ready ? (
        <PrimaryButton onClick={onReady}>네! 준비됐어요!</PrimaryButton>
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
