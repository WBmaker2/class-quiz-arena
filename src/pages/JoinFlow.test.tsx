import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RoleSelect from './RoleSelect';
import ClassJoin from './ClassJoin';

describe('join flow', () => {
  it('selects teacher role', () => {
    const onSelect = vi.fn();
    render(<RoleSelect onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: '선생님으로 시작' }));
    expect(onSelect).toHaveBeenCalledWith('teacher');
  });

  it('shows error for short invite code', () => {
    render(<ClassJoin onJoin={() => {}} />);
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByText('초대 코드 6자리를 확인해주세요')).toBeTruthy();
  });
});
