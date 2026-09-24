import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ClassSelect from './ClassSelect';

describe('ClassSelect', () => {
  it('selects one of several classrooms', () => {
    const onSelect = vi.fn();
    render(
      <ClassSelect
        classrooms={[
          { id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' },
          { id: 'C2', name: '5학년 1반', inviteCode: 'BBBBBB' },
        ]}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText('어느 학급으로 들어갈까요?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /5학년 1반/ }));
    expect(onSelect).toHaveBeenCalledWith('C2');
  });

  it('shows no create button in the picker', () => {
    render(<ClassSelect classrooms={[{ id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' }]} onSelect={() => {}} />);
    expect(screen.queryByRole('button', { name: '새 학급 만들기' })).toBeNull();
  });
});
