import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, signInWithGoogle: vi.fn(), signOut: vi.fn() }),
}));
vi.mock('./hooks/useArenas', () => ({ useArenas: () => ({ arenas: [{ id: 'a1', title: '기초 덧셈 아레나', desc: '설명', subject: '수학', locked: false }], loading: false }) }));
vi.mock('./hooks/useProfile', () => ({ useProfile: () => ({ profile: { nickname: '일호', xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 } }) }));

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

  it('shows login when signed out', () => {
    render(<App />);
    expect(screen.getByText('선생님 문제로 친구와 1:1 퀴즈 대결!')).toBeTruthy();
  });

  it('routes teacher to teacher stub', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
    fireEvent.click(screen.getByRole('button', { name: '선생님으로 시작' }));
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByText('선생님 공간은 다음 단계에서 열려요')).toBeTruthy();
  });

  it('routes student to student stub', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
    fireEvent.click(screen.getByRole('button', { name: '학생으로 시작' }));
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByRole('button', { name: '지금 바로 대결!' })).toBeTruthy();
  });

  it('enters student home after join as student', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
    fireEvent.click(screen.getByRole('button', { name: '학생으로 시작' }));
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByRole('button', { name: '지금 바로 대결!' })).toBeTruthy();
  });
});
