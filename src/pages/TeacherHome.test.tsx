import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeacherHome from './TeacherHome';

const noop = () => {};

describe('TeacherHome', () => {
  it('shows live battles tab first', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
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
        onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop}
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
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByRole('button', { name: '새 아레나 만들기' })).toBeTruthy();
  });

  it('shows students placeholder', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText('학생 일괄 관리')).toBeTruthy();
  });

  it('shows empty students roster', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText('아직 등록된 학생이 없어요')).toBeTruthy();
  });

  it('shows empty analysis', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    expect(screen.getByText('아직 분석할 기록이 없어요')).toBeTruthy();
  });

  it('hides admin tab without showAdmin', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
    );
    expect(screen.queryByRole('button', { name: '선생님 관리' })).toBeNull();
  });

  it('adds and removes allowlisted teachers as master', () => {
    const onAddTeacher = vi.fn();
    const onRemoveTeacher = vi.fn();
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} showAdmin teachers={['t@school.kr']} onAddTeacher={onAddTeacher} onRemoveTeacher={onRemoveTeacher} />,
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

describe('TeacherHome arena privacy', () => {
  const base = {
    live: [],
    abandoned: [],
    finished: [],
    classroomCode: '',
    students: [],
    onDeleteStudent: noop,
    onExportCsv: noop,
    rounds: [],
    onForceClose: noop,
    onEditArena: noop,
    onDeleteArena: noop,
    onToggleLock: noop,
    onToggleTts: noop,
    onNewArena: noop,
    onSignOut: noop,
  };

  it('toggles participant visibility per arena', () => {
    const onToggleShowPlayers = vi.fn();
    render(
      <TeacherHome
        {...base}
        arenas={[{ id: 'a1', title: '덧셈', locked: false, showPlayers: false }]}
        onToggleShowPlayers={onToggleShowPlayers}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    fireEvent.click(screen.getByRole('button', { name: '참가자 공개' }));
    expect(onToggleShowPlayers).toHaveBeenCalledWith('a1', true);
  });

  it('shows hide button when already public', () => {
    render(
      <TeacherHome
        {...base}
        arenas={[{ id: 'a1', title: '덧셈', locked: false, showPlayers: true }]}
        onToggleShowPlayers={noop} onToggleTts={noop}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByRole('button', { name: '참가자 비공개' })).toBeTruthy();
  });
});

describe('TeacherHome growth tools', () => {
  const base = {
    live: [],
    abandoned: [],
    finished: [],
    classroomCode: '',
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

  it('shows weak standards Top3 with summaries', () => {
    render(
      <TeacherHome
        {...base}
        arenas={[]}
        rounds={[
          { roomId: 'r1', arenaId: 'a', problemIndex: 0, standardCode: '3수01-02', answers: [{ uid: 'u1', correct: false }] },
          { roomId: 'r1', arenaId: 'a', problemIndex: 1, standardCode: '3수01-01', answers: [{ uid: 'u1', correct: true }] },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    expect(screen.getByText('우리 반이 어려워해요 Top 3 (최근 30일)')).toBeTruthy();
    expect(screen.getAllByText(/3수01-02/).length).toBeGreaterThan(0);
    expect(screen.getByText(/정답률 0%/)).toBeTruthy();
  });

  it('paints the coverage map from classroom arenas', () => {
    render(
      <TeacherHome
        {...base}
        arenas={[{ id: 'a1', title: '덧셈', locked: false, standards: ['3수01-01'] }]}
        rounds={[]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    expect(screen.getByText('2개 중 1개 출제')).toBeTruthy();
    expect(screen.getByText(/출제됨/)).toBeTruthy();
    expect(screen.getByText(/안 됨/)).toBeTruthy();
  });

  it('copies an arena from the bank', () => {
    const onCopyArena = vi.fn();
    render(
      <TeacherHome
        {...base}
        arenas={[]}
        bank={[{ id: 'b1', title: '남의 덧셈', subject: '수학', grade: 3 }]}
        onCopyArena={onCopyArena}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByText('다른 반 공개 아레나 가져오기')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '가져오기' }));
    expect(onCopyArena).toHaveBeenCalledWith('b1');
  });

  it('flags banned nicknames in the roster', () => {
    render(
      <TeacherHome
        {...base}
        arenas={[]}
        students={[{ uid: 'u1', nickname: '시발', xp: 0 }]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText(/이름 확인 필요/)).toBeTruthy();
  });
});

describe('TeacherHome reports tab', () => {
  const base = {
    live: [],
    abandoned: [],
    finished: [],
    classroomCode: '',
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

  it('lists reports and resolves them', () => {
    const onResolveReport = vi.fn();
    render(
      <TeacherHome
        {...base}
        arenas={[]}
        reports={[
          { id: 'rep1', reporterUid: 'u1', reporterNickname: '일호', reportedUid: 'u2', reportedNickname: '나쁜이름', arenaId: 'a', classroomId: 'C', status: 'open' },
        ]}
        onResolveReport={onResolveReport}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '신고' }));
    expect(screen.getByText(/나쁜이름/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '처리완료' }));
    expect(onResolveReport).toHaveBeenCalledWith('rep1');
  });

  it('shows an empty state without reports', () => {
    render(<TeacherHome {...base} arenas={[]} />);
    fireEvent.click(screen.getByRole('button', { name: '신고' }));
    expect(screen.getByText('접수된 신고가 없어요')).toBeTruthy();
  });
});

describe('TeacherHome tts toggle', () => {
  it('toggles read-aloud per arena', () => {
    const onToggleTts = vi.fn();
    render(
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
        onToggleTts={onToggleTts}
        onNewArena={noop}
        onSignOut={noop}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    fireEvent.click(screen.getByRole('button', { name: '읽어주기 켜기' }));
    expect(onToggleTts).toHaveBeenCalledWith('a1', true);
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
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    fireEvent.change(screen.getByLabelText('학급 이름'), { target: { value: '5학년 1반' } });
    fireEvent.click(screen.getByRole('button', { name: '이름 저장' }));
    expect(onRenameClassroom).toHaveBeenCalledWith('5학년 1반');
  });

  it('opens the new-classroom form', () => {
    const onNewClassroom = vi.fn();
    render(<TeacherHome {...base} arenas={[]} onNewClassroom={onNewClassroom} />);
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
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
