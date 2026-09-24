import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  classrooms: [] as { id: string; name: string; inviteCode: string }[],
  loading: false,
}));

vi.mock('./hooks/useClassroom', () => ({
  useTeacherClassrooms: () => ({ classrooms: state.classrooms, loading: state.loading }),
}));

import { TeacherGate } from './App';

const props = {
  uid: 't1',
  displayName: '김선생',
  animal: 'cat' as const,
  create: vi.fn().mockResolvedValue('NEWC1'),
};

describe('TeacherGate', () => {
  it('auto-enters a single classroom', async () => {
    state.classrooms = [{ id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' }];
    state.loading = false;
    const onDone = vi.fn();
    render(<TeacherGate {...props} onDone={onDone} />);
    await waitFor(() => expect(onDone).toHaveBeenCalledWith('C1'));
  });

  it('lists several classrooms for selection', () => {
    state.classrooms = [
      { id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' },
      { id: 'C2', name: '5학년 1반', inviteCode: 'BBBBBB' },
    ];
    state.loading = false;
    const onDone = vi.fn();
    render(<TeacherGate {...props} onDone={onDone} />);
    expect(screen.getByText('어느 학급으로 들어갈까요?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /5학년 1반/ }));
    expect(onDone).toHaveBeenCalledWith('C2');
  });

  it('shows the create form when there are none', () => {
    state.classrooms = [];
    state.loading = false;
    render(<TeacherGate {...props} onDone={() => {}} />);
    expect(screen.getByLabelText('학급 이름')).toBeTruthy();
  });

  it('shows loading while fetching', () => {
    state.classrooms = [];
    state.loading = true;
    render(<TeacherGate {...props} onDone={() => {}} />);
    expect(screen.getByText('학급 목록을 불러오는 중...')).toBeTruthy();
    state.loading = false;
  });
});
