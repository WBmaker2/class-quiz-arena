import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeacherHome from './TeacherHome';

const noop = () => {};

describe('TeacherHome default seeding', () => {
  it('offers the default 6 only when empty', () => {
    const onSeedDefaults = vi.fn();
    const { rerender } = render(
      <TeacherHome
        live={[]}
        abandoned={[]}
        finished={[]}
        arenas={[]}
        classroomCode=""
        students={[]}
        onDeleteStudent={noop}
        onExportCsv={noop}
        rounds={[]}
        onForceClose={noop}
        onEditArena={noop}
        onDeleteArena={noop}
        onToggleLock={noop}
        onToggleShowPlayers={noop}
        onToggleTts={noop}
        onNewArena={noop}
        onSignOut={noop}
        onSeedDefaults={onSeedDefaults}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    fireEvent.click(screen.getByRole('button', { name: '기본 아레나 6개 가져오기' }));
    expect(onSeedDefaults).toHaveBeenCalledTimes(1);

    rerender(
      <TeacherHome
        live={[]}
        abandoned={[]}
        finished={[]}
        arenas={[{ id: 'a1', title: '내 것', locked: false }]}
        classroomCode=""
        students={[]}
        onDeleteStudent={noop}
        onExportCsv={noop}
        rounds={[]}
        onForceClose={noop}
        onEditArena={noop}
        onDeleteArena={noop}
        onToggleLock={noop}
        onToggleShowPlayers={noop}
        onToggleTts={noop}
        onNewArena={noop}
        onSignOut={noop}
        onSeedDefaults={onSeedDefaults}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.queryByRole('button', { name: '기본 아레나 6개 가져오기' })).toBeNull();
  });
});

describe('TeacherHome two-column grid', () => {
  it('lays arena cards out in 2 columns', () => {
    const { container } = render(
      <TeacherHome
        live={[]}
        abandoned={[]}
        finished={[]}
        arenas={[{ id: 'a1', title: '덧셈', locked: false }]}
        classroomCode=""
        students={[]}
        onDeleteStudent={noop}
        onExportCsv={noop}
        rounds={[]}
        onForceClose={noop}
        onEditArena={noop}
        onDeleteArena={noop}
        onToggleLock={noop}
        onToggleShowPlayers={noop}
        onToggleTts={noop}
        onNewArena={noop}
        onSignOut={noop}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(container.querySelector('.grid-cols-2')).toBeTruthy();
  });
});
