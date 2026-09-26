import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BattleRoom from './BattleRoom';
import { createRoomData, joinRoomData, setReadyData, submitAnswerData } from '../lib/battle';

const host = { uid: 'u1', nickname: '일호', avatar: 'cat' };
const guest = { uid: 'u2', nickname: '이호', avatar: 'dog' };

describe('BattleRoom lobby', () => {
  it('masks opponent name before start', () => {
    const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('일호 vs ???')).toBeTruthy();
  });

  it('shows waiting state with a disabled start button until matched', () => {
    const room = createRoomData('a1', host, 1000);
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('대결 상대를 기다리는 중...')).toBeTruthy();
    expect(screen.getByText('??? vs ???')).toBeTruthy();
    expect((screen.getByRole('button', { name: '네! 준비됐어요!' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows match complete with an enabled pulsing start button', () => {
    const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('1:1 매칭 완료!')).toBeTruthy();
    const button = screen.getByRole('button', { name: '네! 준비됐어요!' }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.classList.contains('btn-pulse')).toBe(true);
  });

  it('shows the arena card on the waiting screen', () => {
    const room = createRoomData('a1', host, 1000);
    render(
      <BattleRoom
        room={room}
        meUid="u1"
        onReady={() => {}}
        onExit={() => {}}
        arena={{ title: '분수 첫걸음', subject: '수학', desc: '설명' }}
      />,
    );
    expect(screen.getByText('분수 첫걸음')).toBeTruthy();
    expect(screen.getByText('수학')).toBeTruthy();
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

  it('allows an explicit answer retry when the server call fails', async () => {
    const onAnswer = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000 };
    render(<BattleRoom room={room} meUid="u1" problem={{ text: 'Q', options: ['1', '2', '3', '4'] }} onReady={() => {}} onAnswer={onAnswer} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('답을 보내지 못했어요'));
    fireEvent.click(screen.getByRole('button', { name: '답 다시 보내기' }));
    await waitFor(() => expect(onAnswer).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole('alert')).toBeNull();
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

  it('offers auto-win only after silence threshold and round deadline', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: 60000, updatedAt: 0 };
    const onClaimWin = vi.fn();
    const view = render(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
        nowMs={30000}
        onReady={() => {}}
        onAnswer={() => {}}
        onClaimWin={onClaimWin}
        onExit={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: '자동 승리로 처리할까요?' })).toBeNull();

    view.rerender(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
        nowMs={59999}
        onReady={() => {}}
        onAnswer={() => {}}
        onClaimWin={onClaimWin}
        onExit={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: '자동 승리로 처리할까요?' })).toBeNull();

    view.rerender(
      <BattleRoom
        room={room}
        meUid="u1"
        problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
        nowMs={60000}
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

describe('BattleRoom scoreboard and feedback', () => {
  const arena = { title: '분수 첫걸음', subject: '수학' };
  const grade = { answerIndex: 2 };
  const question = { text: 'Q', options: ['1', '2', '3', '4'] };

  function playingRoom() {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'playing' as const, currentRound: 0, roundEndsAt: Date.now() + 30000 };
    return room;
  }

  it('shows the live score and arena while playing', () => {
    render(
      <BattleRoom
        room={playingRoom()}
        meUid="u1"
        problem={question}
        grade={grade}
        arena={arena}
        onReady={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('나 0점 : 0점 상대')).toBeTruthy();
    expect(screen.getByText('분수 첫걸음')).toBeTruthy();
  });

  it('locks the submitted answer without revealing correctness early', () => {
    const room = submitAnswerData(playingRoom(), 'u1', 2, 3000);
    render(
      <BattleRoom room={room} meUid="u1" problem={question} grade={grade} onReady={() => {}} onExit={() => {}} />,
    );
    expect(screen.queryByText('정답이에요!')).toBeNull();
    expect(screen.queryByText('아쉬워요. 땡!')).toBeNull();
    expect(screen.getByText('상대방이 생각 중이에요...')).toBeTruthy();
    expect(screen.getByText('답을 제출했어요. 상대가 답할 때까지 기다려요.')).toBeTruthy();
  });

  it('keeps submitted answers hidden while waiting for the opponent', () => {
    let room = submitAnswerData(playingRoom(), 'u1', 0, 3000);
    room = submitAnswerData(room, 'u2', 2, 3100);
    render(
      <BattleRoom room={room} meUid="u1" problem={question} grade={grade} onReady={() => {}} onExit={() => {}} />,
    );
    expect(screen.queryByText('아쉬워요. 땡!')).toBeNull();
    expect(screen.getByText('상대방도 답을 골랐어요.')).toBeTruthy();
  });

  it('shows the server reveal and explanation in the completed review', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'finished' as const, winnerUid: 'u1', reveals: { '0': { questionId: 'q1', answers: { u1: 0, u2: 2 }, correctAnswer: 2, kind: 'choice', explanation: '분모가 같을 때 분자를 비교해요.' } } };
    render(<BattleRoom room={room} meUid="u1" review={[{ text: 'Q', options: question.options, myAnswer: 0, correctAnswer: 2, explanation: '분모가 같을 때 분자를 비교해요.' }]} onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('문제 다시 보기')).toBeTruthy();
    expect(screen.getByText('정답: 3')).toBeTruthy();
    expect(screen.getByText(/해설: 분모가 같을 때 분자를 비교해요\./)).toBeTruthy();
  });

  it('shows totals with the arena on the result screen', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = { ...room, status: 'finished' as const, winnerUid: 'u1', showPlayers: false };
    room.players[0].score = 7;
    room.players[1].score = 5;
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} arena={arena} />);
    expect(screen.getByText('승리!')).toBeTruthy();
    expect(screen.getByText('내 점수 7 : 5 상대 점수')).toBeTruthy();
    expect(screen.getByText('분수 첫걸음')).toBeTruthy();
  });
});
