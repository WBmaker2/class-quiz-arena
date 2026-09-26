import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RoleSelect from './RoleSelect';
import ClassJoin from './ClassJoin';

describe('join flow', () => {
  it('selects teacher role', () => {
    const onSelect = vi.fn();
    render(<RoleSelect onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: '선생님으로 시작' }));
    expect(onSelect).toHaveBeenCalledWith('teacher', 'frog');
  });

  it('shows error for short invite code', () => {
    render(<ClassJoin defaultNickname="학생" onJoin={() => {}} />);
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByText('초대 코드 6자리를 확인해주세요')).toBeTruthy();
  });

  it('calls onJoin with normalized code', () => {
    const onJoin = vi.fn();
    render(<ClassJoin defaultNickname="일호" onJoin={onJoin} />);
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'a1b2c3' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(onJoin).toHaveBeenCalledWith('A1B2C3', '일호');
  });

  it('keeps the student on code entry when the exact code does not join a class', async () => {
    const onJoin = vi.fn().mockResolvedValue({ ok: false, error: '들어갈 수 없는 학급이에요. 코드를 확인해주세요' });
    render(<ClassJoin defaultNickname="일호" onJoin={onJoin} />);
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'BAD123' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('코드를 확인'));
    expect(screen.getByLabelText('초대 코드')).toBeTruthy();
  });

  it('blocks banned nicknames at signup', () => {
    const onJoin = vi.fn();
    render(<ClassJoin defaultNickname="시발" onJoin={onJoin} />);
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'a1b2c3' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByText(/쓸 수 없는 말/)).toBeTruthy();
    expect(onJoin).not.toHaveBeenCalled();
  });

  it('selects student role', () => {
    const onSelect = vi.fn();
    render(<RoleSelect onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: '학생으로 시작' }));
    expect(onSelect).toHaveBeenCalledWith('student', 'frog');
  });
});
