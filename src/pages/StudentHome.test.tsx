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
});
