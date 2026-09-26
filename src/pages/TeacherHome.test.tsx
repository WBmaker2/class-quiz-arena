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
    expect(screen.getByRole('button', { name: '현재 대결' }).classList.contains('tab-active')).toBe(true);
  });

  it('shows room and analytics load errors with retry actions', () => {
    const retryRooms = vi.fn();
    const retryAnalysis = vi.fn();
    render(
      <TeacherHome
        live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="" students={[]}
        onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop}
        onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop}
        onToggleTts={noop} onNewArena={noop} onSignOut={noop}
        roomsError onRetryRooms={retryRooms} analysisError onRetryAnalysis={retryAnalysis}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '다시 불러오기' }));
    expect(retryRooms).toHaveBeenCalledOnce();
    expect(screen.queryByText('지금은 진행 중인 대결이 없어요')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    fireEvent.click(screen.getByRole('button', { name: '다시 불러오기' }));
    expect(retryAnalysis).toHaveBeenCalledOnce();
    expect(screen.queryByText('아직 분석할 기록이 없어요')).toBeNull();
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
    const toggle = screen.getByRole('switch', { name: '대전 상대 공개' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(toggle);
    expect(onToggleShowPlayers).toHaveBeenCalledWith('a1', true);
  });

  it('shows switch-on state when already public', () => {
    render(
      <TeacherHome
        {...base}
        arenas={[{ id: 'a1', title: '덧셈', locked: false, showPlayers: true }]}
        onToggleShowPlayers={noop} onToggleTts={noop}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByRole('switch', { name: '대전 상대 공개' }).getAttribute('aria-checked')).toBe('true');
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
          { roomId: 'r1', arenaId: 'a', problemId: 'p1', problemTitle: '1번 문제', problemIndex: 0, standardCode: '[4수01-09]', answers: [{ uid: 'u1', correct: false }] },
          { roomId: 'r1', arenaId: 'a', problemId: 'p2', problemTitle: '2번 문제', problemIndex: 1, standardCode: '[4수01-03]', answers: [{ uid: 'u1', correct: true }] },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    expect(screen.getByText('우리 반이 어려워해요 Top 3 (최근 30일)')).toBeTruthy();
    expect(screen.getAllByText(/4수01-09/).length).toBeGreaterThan(0);
    expect(screen.getByText(/정답률 0%/)).toBeTruthy();
  });

  it('paints the coverage map from classroom arenas', () => {
    render(
      <TeacherHome
        {...base}
        arenas={[{ id: 'a1', title: '덧셈', locked: false, standards: ['[4수01-03]'] }]}
        rounds={[]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '분석' }));
    expect(screen.getByText('47개 중 1개 출제')).toBeTruthy();
    expect(screen.getByText(/출제됨/)).toBeTruthy();
    expect(screen.getAllByText(/안 됨/)).toHaveLength(46);
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
    fireEvent.click(screen.getByRole('switch', { name: '읽어주기' }));
    expect(onToggleTts).toHaveBeenCalledWith('a1', true);
  });
});

describe('TeacherHome update log', () => {
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

  it('opens the update log next to the student preview', () => {
    render(<TeacherHome {...base} arenas={[]} />);
    const updateButton = screen.getByRole('button', { name: '업데이트 내역' });
    const previewButton = screen.getByRole('button', { name: '학생 화면 미리보기' });
    expect(updateButton.compareDocumentPosition(previewButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.click(updateButton);
    expect(screen.getByRole('dialog', { name: '업데이트 내역' })).toBeTruthy();
    expect(screen.getByText('2026-09-25')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(screen.queryByRole('dialog', { name: '업데이트 내역' })).toBeNull();
  });
});

describe('TeacherHome account chip', () => {
  it('shows the signed-in profile next to the preview button', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} accountName="김선생" accountEmail="kim@school.kr" photoURL="https://photo.example/me.png" />,
    );
    expect(screen.getByText('김선생')).toBeTruthy();
    expect(screen.getByTitle('kim@school.kr')).toBeTruthy();
    expect(document.querySelector('img[src="https://photo.example/me.png"]')).toBeTruthy();
  });

  it('hides the chip without account info', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onToggleShowPlayers={noop} onToggleTts={noop} onNewArena={noop} onSignOut={noop} />,
    );
    expect(screen.queryByTitle('kim@school.kr')).toBeNull();
  });
});

describe('TeacherHome logout confirm', () => {
  it('asks once more before signing out', () => {
    const onSignOut = vi.fn();
    render(
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
        onSignOut={onSignOut}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));
    expect(screen.getByText('정말 로그아웃 하시겠습니까?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
