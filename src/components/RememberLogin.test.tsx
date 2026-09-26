import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RememberLogin from './RememberLogin';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({ useAuth: vi.fn() }));

const base = { user: { displayName: '김선생' }, loading: false, applyRemember: vi.fn() };

describe('RememberLogin', () => {
  it('asks once after sign-in and saves the choice', () => {
    vi.mocked(useAuth).mockReturnValue({ ...base, remember: null } as never);
    render(<RememberLogin />);
    expect(screen.getByText('이 브라우저에 로그인 정보를 저장할까요?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
    expect(base.applyRemember).toHaveBeenCalledWith(true);
  });

  it('stays hidden once answered', () => {
    vi.mocked(useAuth).mockReturnValue({ ...base, remember: true } as never);
    const { container } = render(<RememberLogin />);
    expect(container.firstChild).toBeNull();
  });
});
