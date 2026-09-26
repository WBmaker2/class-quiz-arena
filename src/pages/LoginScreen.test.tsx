import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginScreen from './LoginScreen';

describe('LoginScreen', () => {
  it('has one page heading and explains sign-in failure without hiding retry', () => {
    const onStart = vi.fn();
    render(<LoginScreen onStart={onStart} error="로그인에 실패했어요. 다시 시도해주세요." />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('alert').textContent).toContain('로그인에 실패했어요');
    fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
    expect(onStart).toHaveBeenCalledOnce();
  });
});
