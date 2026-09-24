import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeacherHome from './TeacherHome';

const noop = () => {};

describe('TeacherHome', () => {
  it('shows live battles tab first', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
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
        classroomCode=""
        students={[]}
        onDeleteStudent={noop}
        onExportCsv={noop}
        rounds={[]}
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
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByRole('button', { name: '새 아레나 만들기' })).toBeTruthy();
  });

  it('shows students placeholder', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText('학생 일괄 관리')).toBeTruthy();
  });

  it('shows empty students roster', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText('아직 등록된 학생이 없어요')).toBeTruthy();
  });

  it('shows empty analysis', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    expect(screen.getByText('아직 분석할 기록이 없어요')).toBeTruthy();
  });

  it('hides admin tab without showAdmin', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    expect(screen.queryByRole('button', { name: '선생님 관리' })).toBeNull();
  });

  it('adds and removes allowlisted teachers as master', () => {
    const onAddTeacher = vi.fn();
    const onRemoveTeacher = vi.fn();
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} showAdmin teachers={['t@school.kr']} onAddTeacher={onAddTeacher} onRemoveTeacher={onRemoveTeacher} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '선생님 관리' }));
    expect(screen.getByText('t@school.kr')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('선생님 이메일'), { target: { value: 'n@school.kr' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(onAddTeacher).toHaveBeenCalledWith('n@school.kr');
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onRemoveTeacher).toHaveBeenCalledWith('t@school.kr');
  });
});
