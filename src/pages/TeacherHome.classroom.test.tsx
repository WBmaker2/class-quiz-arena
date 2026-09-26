import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeacherHome from './TeacherHome';

const noop = () => {};

describe('TeacherHome classroom list', () => {
  const base = {
    live: [],
    abandoned: [],
    finished: [],
    classroomCode: 'AAAAAA',
    classroomName: '4학년 3반',
    students: [],
    onDeleteStudent: noop,
    onExportCsv: noop,
    rounds: [],
    onForceClose: noop,
    onEditArena: noop,
    onDeleteArena: noop,
    onToggleLock: noop,
    onToggleShowPlayers: noop,
    onToggleTts: noop,
    onNewArena: noop,
    onSignOut: noop,
  };
  const rooms = [
    { id: 'AAAAAA', name: '4학년 3반', inviteCode: 'AAAAAA' },
    { id: 'BBBBBB', name: '4학년 4반', inviteCode: 'BBBBBB' },
  ];

  const openTab = () => {
    fireEvent.click(screen.getByRole('button', { name: '학급' }));
  };

  it('lists opened classrooms with invite codes', () => {
    render(<TeacherHome {...base} arenas={[]} classrooms={rooms} currentClassroomId="AAAAAA" />);
    openTab();
    expect(screen.getByText('내 학급 목록')).toBeTruthy();
    expect(screen.getByText(/4학년 4반/)).toBeTruthy();
    expect(screen.getByText(/초대 코드: BBBBBB/)).toBeTruthy();
  });

  it('enters another classroom from the list', () => {
    const onSelectClassroom = vi.fn();
    render(<TeacherHome {...base} arenas={[]} classrooms={rooms} currentClassroomId="AAAAAA" onSelectClassroom={onSelectClassroom} />);
    openTab();
    fireEvent.click(screen.getByRole('button', { name: '입장하기' }));
    expect(onSelectClassroom).toHaveBeenCalledWith('BBBBBB');
  });

  it('renames a classroom from the list', () => {
    const onRenameClassroomById = vi.fn().mockResolvedValue(null);
    render(<TeacherHome {...base} arenas={[]} classrooms={rooms} currentClassroomId="AAAAAA" onRenameClassroomById={onRenameClassroomById} />);
    openTab();
    fireEvent.click(screen.getAllByRole('button', { name: '이름 바꾸기' })[1]);
    fireEvent.change(screen.getByLabelText('학급 새 이름'), { target: { value: '4학년 5반' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(onRenameClassroomById).toHaveBeenCalledWith('BBBBBB', '4학년 5반');
  });

  it('confirms before deleting a classroom', () => {
    const onDeleteClassroom = vi.fn().mockResolvedValue(null);
    render(<TeacherHome {...base} arenas={[]} classrooms={rooms} currentClassroomId="AAAAAA" onDeleteClassroom={onDeleteClassroom} />);
    openTab();
    fireEvent.click(screen.getAllByRole('button', { name: '학급 삭제' })[1]);
    expect(screen.getByText(/함께 지워져요/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(onDeleteClassroom).toHaveBeenCalledWith('BBBBBB');
  });
});

describe('TeacherHome classroom management', () => {
  const base = {
    live: [],
    abandoned: [],
    finished: [],
    classroomCode: 'AAAAAA',
    classroomName: '4학년 3반',
    students: [],
    onDeleteStudent: noop,
    onExportCsv: noop,
    rounds: [],
    onForceClose: noop,
    onEditArena: noop,
    onDeleteArena: noop,
    onToggleLock: noop,
    onToggleShowPlayers: noop,
    onToggleTts: noop,
    onNewArena: noop,
    onSignOut: noop,
  };

  it('renames the classroom', () => {
    const onRenameClassroom = vi.fn();
    render(<TeacherHome {...base} arenas={[]} onRenameClassroom={onRenameClassroom} />);
    fireEvent.click(screen.getByRole('button', { name: '학급' }));
    fireEvent.change(screen.getByLabelText('학급 이름'), { target: { value: '5학년 1반' } });
    fireEvent.click(screen.getByRole('button', { name: '이름 저장' }));
    expect(onRenameClassroom).toHaveBeenCalledWith('5학년 1반');
  });

  it('opens the new-classroom form', () => {
    const onNewClassroom = vi.fn();
    render(<TeacherHome {...base} arenas={[]} onNewClassroom={onNewClassroom} />);
    fireEvent.click(screen.getByRole('button', { name: '학급' }));
    fireEvent.click(screen.getByRole('button', { name: '새 학급 만들기' }));
    expect(onNewClassroom).toHaveBeenCalledTimes(1);
  });

  it('opens the student preview in a new tab', () => {
    const openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);
    Object.defineProperty(window, 'location', { value: { origin: 'https://x.web.app', pathname: '/' }, writable: true });
    render(<TeacherHome {...base} arenas={[]} />);
    fireEvent.click(screen.getByRole('button', { name: '학생 화면 미리보기' }));
    expect(openSpy).toHaveBeenCalledWith('https://x.web.app/?preview=AAAAAA', '_blank');
    vi.unstubAllGlobals();
  });
});
