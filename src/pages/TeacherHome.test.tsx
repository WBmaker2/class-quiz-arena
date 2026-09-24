import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeacherHome from './TeacherHome';

const noop = () => {};

describe('TeacherHome', () => {
  it('shows live battles tab first', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    expect(screen.getByText('진행 중인 대결')).toBeTruthy();
    expect(screen.getByText('지금은 진행 중인 대결이 없어요')).toBeTruthy();
  });

  it('confirms force close', () => {
    const onForceClose = vi.fn();
    render(
      <TeacherHome
        live={[{ id: 'r1', arenaTitle: '기초', players: ['일호', '이호'] }]}
        abandoned={[]}
        finished={[]}
        arenas={[]}
        onForceClose={onForceClose}
        onEditArena={noop}
        onDeleteArena={noop}
        onToggleLock={noop}
        onNewArena={noop}
        onSignOut={noop}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '강제 종료' }));
    expect(screen.getByText('이 대결을 강제 종료할까요?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '끝내기' }));
    expect(onForceClose).toHaveBeenCalledWith('r1');
  });

  it('switches to arenas tab', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByRole('button', { name: '새 아레나 만들기' })).toBeTruthy();
  });

  it('shows students placeholder', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText('학생 관리는 다음 단계에서 열려요')).toBeTruthy();
  });
});
