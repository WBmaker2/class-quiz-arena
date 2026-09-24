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
