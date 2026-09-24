import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BattleRoom from './BattleRoom';
import { createRoomData, joinRoomData, setReadyData } from '../lib/battle';

const host = { uid: 'u1', nickname: '일호', avatar: 'cat' };
const guest = { uid: 'u2', nickname: '이호', avatar: 'dog' };

describe('BattleRoom lobby', () => {
  it('masks opponent name before start', () => {
    const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('???')).toBeTruthy();
  });

  it('shows waiting hint for opponent readiness', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = setReadyData(room, 'u1', 3000);
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('상대 준비 기다리는 중...')).toBeTruthy();
  });

  it('confirms readiness', () => {
    const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    const onReady = vi.fn();
    render(<BattleRoom room={room} meUid="u1" onReady={onReady} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '네! 준비됐어요!' }));
    expect(onReady).toHaveBeenCalledTimes(1);
  });
});

describe('BattleRoom playing', () => {
  it('answers a question', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000 };
    const onAnswer = vi.fn();
    render(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
        onReady={() => {}}
        onAnswer={onAnswer}
        onExit={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '69' }));
    expect(onAnswer).toHaveBeenCalledWith(2);
  });

  it('advances on timeout text', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: 0, updatedAt: 0 };
    render(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
        nowMs={999999}
        onReady={() => {}}
        onAnswer={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('시간이 지난 문제예요. 다음 라운드로 넘어가요.')).toBeTruthy();
  });

  it('offers auto-win after silence', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000, updatedAt: 0 };
    const onClaimWin = vi.fn();
    render(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
        nowMs={999999}
        onReady={() => {}}
        onAnswer={() => {}}
        onClaimWin={onClaimWin}
        onExit={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '자동 승리로 처리할까요?' }));
    expect(onClaimWin).toHaveBeenCalledTimes(1);
  });
});
