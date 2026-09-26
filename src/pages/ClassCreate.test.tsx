import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ClassCreate from './ClassCreate';

describe('ClassCreate', () => {
  it('calls onCreate with trimmed name', () => {
    const onCreate = vi.fn();
    render(<ClassCreate onCreate={onCreate} />);
    fireEvent.change(screen.getByLabelText('학급 이름'), { target: { value: '  4학년 3반  ' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 만들기' }));
    expect(onCreate).toHaveBeenCalledWith('4학년 3반');
  });

  it('shows error for empty name', () => {
    render(<ClassCreate onCreate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '학급 만들기' }));
    expect(screen.getByText('학급 이름을 입력해주세요')).toBeTruthy();
  });

  it('blocks a duplicate classroom name right away', () => {
    const onCreate = vi.fn();
    render(<ClassCreate onCreate={onCreate} existingNames={['4학년 3반']} />);
    fireEvent.change(screen.getByLabelText('학급 이름'), { target: { value: '4학년 3반' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 만들기' }));
    expect(screen.getByText('같은 이름의 학급이 이미 있어요')).toBeTruthy();
    expect(onCreate).not.toHaveBeenCalled();
  });
});
