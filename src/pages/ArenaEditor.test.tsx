import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArenaEditor from './ArenaEditor';
import type { EditableProblem } from '../hooks/useArenaAdmin';

vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: vi.fn(),
}));

import { httpsCallable } from 'firebase/functions';

function makeProblems(n: number): EditableProblem[] {
  return Array.from({ length: n }, (_, i) => ({
    text: `문제 ${i + 1}`,
    options: ['보기1', '보기2', '보기3', '보기4'] as [string, string, string, string],
    answerIndex: 0,
  }));
}

const baseInitial = { title: '기초', desc: '', subject: '수학', aiCount: 0 };

function publishButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: '공개하기' }) as HTMLButtonElement;
}

describe('ArenaEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks publish with fewer than 10 problems', () => {
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(9)} onSave={() => {}} onCancel={() => {}} />);
    expect(publishButton().disabled).toBe(true);
    expect(screen.getByText('문제를 10개 이상 넣어주세요')).toBeTruthy();
  });

  it('enables publish with 10 or more problems', () => {
    const onSave = vi.fn();
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(10)} onSave={onSave} onCancel={() => {}} />);
    expect(publishButton().disabled).toBe(false);
    fireEvent.click(publishButton());
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][1]).toHaveLength(10);
  });

  it('shows standards checklist for grade+subject', () => {
    render(<ArenaEditor initial={baseInitial} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    // 기본 3학년 수학 기준이 보인다
    expect(screen.getByText(/3수01-01/)).toBeTruthy();
    // 과목을 바꾸면 체크리스트가 바뀐다
    fireEvent.change(screen.getByLabelText('과목'), { target: { value: '국어' } });
    expect(screen.queryByText(/3수01-01/)).toBeNull();
  });

  it('shows error and keeps manual items when AI draft fails', async () => {    const failingCall = vi.fn().mockRejectedValue(new Error('GEMINI_API_KEY is not configured'));
    vi.mocked(httpsCallable).mockReturnValue(failingCall as never);
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(1)} onSave={() => {}} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /3수01-01/ }));
    fireEvent.click(screen.getByRole('button', { name: 'AI로 초안 만들기' }));
    expect(await screen.findByText(/실패/)).toBeTruthy();
    // 직접 쓴 문제는 그대로 남는다
    expect(screen.getByDisplayValue('문제 1')).toBeTruthy();
  });

  it('keeps and shows standardCode of loaded problems', () => {
    render(
      <ArenaEditor
        initial={baseInitial}
        problems={[{ text: 'Q', options: ['1', '2', '3', '4'], answerIndex: 0, standardCode: '3수01-01' }]}
        onSave={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByText('3수01-01')).toBeTruthy();
  });
});
