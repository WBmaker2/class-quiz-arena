import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import StudentHome from './StudentHome';

const profile = { nickname: '일호', xp: 250, level: 3, streak: 2, winCount: 5, correctRate: 70 };

describe('StudentHome', () => {
  it('shows arenas and starts battle', () => {
    const onEnter = vi.fn();
    render(
      <StudentHome
        arenas={[{ id: 'a1', title: '기초 덧셈 아레나', desc: '설명', subject: '수학', locked: false }]}
        leaders={[]}
        profile={profile}
        onEnter={onEnter}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '지금 바로 대결!' }));
    expect(onEnter).toHaveBeenCalledWith('a1');
  });

  it('switches to leaderboard tab', () => {
    render(
      <StudentHome
        arenas={[]}
        leaders={[{ nickname: '이호', xp: 300 }]}
        profile={profile}
        onEnter={() => {}}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '순위표' }));
    expect(screen.getByText('이호')).toBeTruthy();
  });

  it('shows record tab with level', () => {
    render(
      <StudentHome
        arenas={[]}
        leaders={[]}
        profile={profile}
        onEnter={() => {}}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '내 기록' }));
    expect(screen.getByText('Lv.3')).toBeTruthy();
    expect(screen.getByText('총 XP')).toBeTruthy();
  });

  it('shows top20 classroom leaderboard with own rank highlight', () => {
    render(
      <StudentHome
        arenas={[]}
        leaders={[
          { uid: 'u1', nickname: '일호', xp: 300, avatar: 'cat', level: 3, winCount: 5, correctRate: 70 },
          { uid: 'u2', nickname: '이호', xp: 250, avatar: 'dog', level: 2, winCount: 3, correctRate: 60, isMe: true },
        ]}
        profile={profile}
        myUid="u2"
        myRank={2}
        onEnter={() => {}}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '순위표' }));
    expect(screen.getByText('우리 반 대결왕 Top 20')).toBeTruthy();
    expect(screen.getByText(/내 순위 2위/)).toBeTruthy();
    expect(screen.getByText('이호')).toBeTruthy();
    expect(screen.getByText(/Lv2/)).toBeTruthy();
    expect(screen.getByText(/3승/)).toBeTruthy();
    expect(screen.getByText(/정답률 60%/)).toBeTruthy();
    expect(screen.queryByText(/명예의 전당/)).toBeNull();
    expect(screen.queryByText(/LEADERBOARD/)).toBeNull();
  });

  it('shows arena card with 10-battle hint', () => {
    render(
      <StudentHome
        arenas={[
          {
            id: 'a1',
            title: '덧셈 아레나',
            desc: '설명',
            subject: '수학',
            locked: false,
            grade: 3,
            topic: '받아올림',
            cardTheme: { bg: '#E3F2FD', emoji: '➗' },
          },
        ]}
        leaders={[]}
        profile={profile}
        onEnter={() => {}}
        onSignOut={() => {}}
      />,
    );
    // "20문제 중 10문제 대결" 문구 확인
    expect(screen.getByText('20문제 중 10문제 대결')).toBeTruthy();
    expect(screen.getByText('수학')).toBeTruthy();
    expect(screen.getByText('3학년')).toBeTruthy();
    expect(screen.getByText('대결 준비됨')).toBeTruthy();
    expect(screen.queryByText(/BATTLE READY/)).toBeNull();
  });
});
