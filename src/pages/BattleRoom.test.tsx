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

describe('BattleRoom mixed types and privacy', () => {
  function playingRoom(showPlayers?: boolean) {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000, showPlayers };
    return room;
  }

  it('submits a short answer as text', () => {
    const onAnswer = vi.fn();
    render(
      <BattleRoom
        room={playingRoom()}
        meUid="u1"
        problem={{ text: '한글을 만든 왕은?', options: [], kind: 'short' }}
        onReady={() => {}}
        onAnswer={onAnswer}
        onExit={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText('내 답'), { target: { value: '세종대왕' } });
    fireEvent.click(screen.getByRole('button', { name: '제출' }));
    expect(onAnswer).toHaveBeenCalledWith('세종대왕');
  });

  it('hides opponent name when private', () => {
    render(
      <BattleRoom
        room={playingRoom(false)}
        meUid="u1"
        problem={{ text: 'Q', options: ['O', 'X'] }}
        onReady={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('대전 상대: ???')).toBeTruthy();
  });

  it('shows opponent name when public', () => {
    render(
      <BattleRoom
        room={playingRoom(true)}
        meUid="u1"
        problem={{ text: 'Q', options: ['O', 'X'] }}
        onReady={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('대전 상대: 이호')).toBeTruthy();
  });

  it('reveals opponent at result even when private', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'finished', winnerUid: 'u1', showPlayers: false };
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('상대 이호와의 대결이었어요')).toBeTruthy();
  });
});

describe('BattleRoom report and tts', () => {
  function finishedRoom() {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    return { ...room, status: 'finished' as const, winnerUid: 'u1' };
  }

  it('files a name report from the result screen', () => {
    const onReport = vi.fn();
    render(<BattleRoom room={finishedRoom()} meUid="u1" onReady={() => {}} onExit={() => {}} onReport={onReport} />);
    fireEvent.click(screen.getByRole('button', { name: '상대 이름 신고하기' }));
    expect(onReport).toHaveBeenCalledTimes(1);
    expect(screen.getByText('신고가 접수됐어요. 선생님이 확인할 거예요.')).toBeTruthy();
  });

  it('shows a read-aloud button when supported', () => {    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000 };
    render(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: 'Q', options: ['1', '2', '3', '4'] }}
        onReady={() => {}}
        onExit={() => {}}
      />,
    );
    // jsdom에는 speechSynthesis가 없어 버튼이 안 보여야 함
    expect(screen.queryByRole('button', { name: '문제 읽어주기' })).toBeNull();
  });
});

describe('BattleRoom arena tts setting', () => {
  function stubSpeech() {
    function Utterance(this: { text?: string }, text: string) {
      this.text = text;
    }
    vi.stubGlobal('window', {
      speechSynthesis: { speak: vi.fn(), cancel: vi.fn() },
      SpeechSynthesisUtterance: Utterance,
    });
  }

  function playingRoom(ttsEnabled?: boolean) {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    return { ...room, status: 'playing' as const, currentRound: 0, roundEndsAt: Date.now() + 30000, ttsEnabled };
  }

  it('shows the read-aloud button when the arena enables it', () => {
    stubSpeech();
    render(
      <BattleRoom
        room={playingRoom(true)}
        meUid="u1"
        problem={{ text: 'Q', options: ['1', '2', '3', '4'] }}
        onReady={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: '문제 읽어주기' })).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('hides the read-aloud button when the arena disables it', () => {
    stubSpeech();
    render(
      <BattleRoom
        room={playingRoom(false)}
        meUid="u1"
        problem={{ text: 'Q', options: ['1', '2', '3', '4'] }}
        onReady={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: '문제 읽어주기' })).toBeNull();
    vi.unstubAllGlobals();
  });
});
