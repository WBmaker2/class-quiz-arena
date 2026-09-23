import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, signInWithGoogle: vi.fn(), signOut: vi.fn() }),
}));

import App from './App';

describe('App', () => {
  it('shows login first', () => {
    render(<App />);
    expect(screen.getByText('선생님 문제로 친구와 1:1 퀴즈 대결!')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Google 계정으로 시작하기' })).toBeTruthy();
  });

  it('moves to role select after login tap', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
    expect(screen.getByText('반가워요! 누구신가요?')).toBeTruthy();
  });
});
