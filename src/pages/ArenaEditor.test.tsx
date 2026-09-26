import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArenaEditor, { findProblemError, friendlyAiError } from './ArenaEditor';
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

const baseInitial = { title: '기초', desc: '', subject: '수학', questionCount: 0 };

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

  it('adds standards from the dropdown and removes them with X', () => {
    render(<ArenaEditor initial={baseInitial} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    // 드롭다운에서 고르면 아래에 칩으로 표시
    fireEvent.change(screen.getByLabelText('성취기준 (1개 이상 고르기)'), { target: { value: '[4수01-03]' } });
    expect(screen.getByRole('button', { name: '[4수01-03] 삭제' })).toBeTruthy();
    // 같은 기준 중복 추가 안 됨
    fireEvent.change(screen.getByLabelText('성취기준 (1개 이상 고르기)'), { target: { value: '[4수01-03]' } });
    expect(screen.getAllByRole('button', { name: '[4수01-03] 삭제' })).toHaveLength(1);
    // X로 삭제하면 안내 문구 복귀
    fireEvent.click(screen.getByRole('button', { name: '[4수01-03] 삭제' }));
    expect(screen.getByText('성취기준을 1개 이상 골라주세요')).toBeTruthy();
  });

  it('switches the dropdown options with subject', () => {
    render(<ArenaEditor initial={baseInitial} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    // 기본 3학년 수학 기준이 드롭다운에 있다
    expect(screen.getByRole('option', { name: /4수01-03/ })).toBeTruthy();
    // 과목을 바꾸면 목록이 바뀐다
    fireEvent.change(screen.getByLabelText('과목'), { target: { value: '국어' } });
    expect(screen.queryByRole('option', { name: /4수01-03/ })).toBeNull();
  });

  it('shows error and keeps manual items when AI draft fails', async () => {    const failingCall = vi.fn().mockRejectedValue(new Error('GEMINI_API_KEY is not configured'));
    vi.mocked(httpsCallable).mockReturnValue(failingCall as never);
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(1)} onSave={() => {}} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText('성취기준 (1개 이상 고르기)'), { target: { value: '[4수01-03]' } });
    fireEvent.click(screen.getByRole('button', { name: 'AI로 초안 만들기' }));
    expect(await screen.findByText(/실패/)).toBeTruthy();
    // 직접 쓴 문제는 그대로 남는다
    expect(screen.getByDisplayValue('문제 1')).toBeTruthy();
  });

  it('maps AI error codes to friendly messages', () => {
    expect(friendlyAiError({ code: 'resource-exhausted' })).toContain('20회');
    expect(friendlyAiError({ code: 'unauthenticated' })).toContain('로그인');
    expect(friendlyAiError({ code: 'invalid-argument' })).toContain('성취기준');
    expect(friendlyAiError(new Error('boom'))).toContain('실패');
  });

  it('tells quota exhaustion instead of the generic failure', async () => {
    const err = Object.assign(new Error('오늘 AI 만들기 20회를 다 썼어요'), { code: 'resource-exhausted' });
    vi.mocked(httpsCallable).mockReturnValue(vi.fn().mockRejectedValue(err) as never);
    render(<ArenaEditor initial={baseInitial} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText('성취기준 (1개 이상 고르기)'), { target: { value: '[4수01-03]' } });
    fireEvent.click(screen.getByRole('button', { name: 'AI로 초안 만들기' }));
    expect(await screen.findByText(/20회를 다 썼어요/)).toBeTruthy();
  });

  it('edits problem text in a multiline box', () => {
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(1)} onSave={() => {}} onCancel={() => {}} />);
    const box = screen.getByLabelText('문제 1 내용') as HTMLTextAreaElement;
    expect(box.tagName).toBe('TEXTAREA');
    fireEvent.change(box, { target: { value: '첫째 줄\n둘째 줄' } });
    expect(box.value).toBe('첫째 줄\n둘째 줄');
  });

  it('labels choices above their inputs and keeps picking the answer', () => {
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(1)} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('1번 보기 내용')).toBeTruthy();
    expect(screen.getByText('4번 보기 내용')).toBeTruthy();
    expect(screen.queryByText('정답')).toBeNull();
    // 라벨이 인풋보다 먼저 나온다
    const label = screen.getByText('2번 보기 내용');
    const input = screen.getByLabelText('문제 1 선택지 2');
    expect(label.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // 라디오로 정답을 고르면 반영된다
    const radio = screen.getByLabelText('문제 1 정답: 2번') as HTMLInputElement;
    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });

  it('edits the explanation in a multiline box', () => {
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(1)} onSave={() => {}} onCancel={() => {}} />);
    const box = screen.getByLabelText('문제 1 해설') as HTMLTextAreaElement;
    expect(box.tagName).toBe('TEXTAREA');
    fireEvent.change(box, { target: { value: '첫째 줄\n둘째 줄' } });
    expect(box.value).toBe('첫째 줄\n둘째 줄');
  });

  it('groups each problem in its own card with a heading', () => {
    const { container } = render(<ArenaEditor initial={baseInitial} problems={makeProblems(2)} onSave={() => {}} onCancel={() => {}} />);
    const cards = container.querySelectorAll('.problem-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('p')?.textContent).toBe('문제 1');
    expect(cards[1].querySelector('p')?.textContent).toBe('문제 2');
    // 삭제 버튼은 카드 머리(제목 옆)에 있다
    const firstCard = cards[0];
    expect(firstCard.textContent).toContain('문제 1');
    fireEvent.click(screen.getByRole('button', { name: '문제 1 삭제' }));
    expect(container.querySelectorAll('.problem-card')).toHaveLength(1);
  });

  it('keeps and shows standardCode of loaded problems', () => {    render(
      <ArenaEditor
        initial={baseInitial}
        problems={[{ text: 'Q', options: ['1', '2', '3', '4'], answerIndex: 0, standardCode: '[4수01-03]' }]}
        onSave={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByText('[4수01-03]')).toBeTruthy();
  });

  it('blocks publish with blank or duplicate options', () => {
    expect(findProblemError([{ text: '', options: ['1', '2', '3', '4'], answerIndex: 0 }])).toBeTruthy();
    expect(findProblemError([{ text: 'Q', options: ['1', '', '2', '3'], answerIndex: 0 }])).toBeTruthy();
    expect(findProblemError([{ text: 'Q', options: ['1', '1', '2', '3'], answerIndex: 0 }])).toContain('겹');
    expect(
      findProblemError(
        Array.from({ length: 10 }, () => ({ text: 'Q', options: ['1', '2', '3', '4'], answerIndex: 0 })),
      ),
    ).toBeNull();
  });

  it('shows content error instead of count hint when 10 items exist but invalid', () => {
    render(
      <ArenaEditor
        initial={baseInitial}
        problems={Array.from({ length: 10 }, () => ({
          text: '',
          options: ['1', '2', '3', '4'] as [string, string, string, string],
          answerIndex: 0,
        }))}
        onSave={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(publishButton().disabled).toBe(true);
    expect(screen.getByText(/비었어요/)).toBeTruthy();
  });
});

describe('ArenaEditor question kinds', () => {
  it('switches to short answer and requires answer text', () => {
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(10)} onSave={() => {}} onCancel={() => {}} />);
    const selects = screen.getAllByLabelText(/문제 1 유형/);
    fireEvent.change(selects[0], { target: { value: 'short' } });
    // 정답 입력 전에는 공개 불가 + 안내 문구
    expect(publishButton().disabled).toBe(true);
    expect(screen.getByText(/단답형 정답이 비었어요/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('문제 1 단답형 정답'), { target: { value: '세종대왕' } });
    expect(publishButton().disabled).toBe(false);
  });

  it('fixes ox options to O and X', () => {
    render(<ArenaEditor initial={baseInitial} problems={makeProblems(1)} onSave={() => {}} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText(/문제 1 유형/), { target: { value: 'ox' } });
    expect(screen.getByLabelText('문제 1 정답: O')).toBeTruthy();
    expect(screen.getByLabelText('문제 1 정답: X')).toBeTruthy();
  });

  it('normalizes AI drafts with kinds', async () => {
    const { httpsCallable } = await import('firebase/functions');
    vi.mocked(httpsCallable).mockReturnValue(
      (() =>
        Promise.resolve({
          data: {
            problems: [
              { kind: 'ox', text: 'Q', options: ['o', 'x'], answerIndex: 1 },
              { kind: 'short', text: 'Q2', options: [], answerText: '세종대왕' },
              { text: 'Q3', options: ['1', '2', '3', '4'], answerIndex: 0 },
            ],
          },
        })) as never,
    );
    render(<ArenaEditor initial={baseInitial} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText('성취기준 (1개 이상 고르기)'), { target: { value: '[4수01-03]' } });
    fireEvent.click(screen.getByRole('button', { name: 'AI로 초안 만들기' }));
    expect(await screen.findByDisplayValue('Q')).toBeTruthy();
    expect(screen.getByDisplayValue('Q2')).toBeTruthy();
    // ox는 O/X 고정, 단답형 정답은 그대로 (채점에서 공백·대소문자 무시)
    expect(screen.getByLabelText('문제 1 정답: X')).toBeTruthy();
    expect(screen.getByDisplayValue('세종대왕')).toBeTruthy();
  });
});

describe('ArenaEditor card style', () => {
  it('shows one gallery legend and saves picked illustration', () => {
    const onSave = vi.fn();
    render(
      <ArenaEditor initial={baseInitial} problems={makeProblems(10)} onSave={onSave} onCancel={() => {}} />,
    );
    expect(screen.getByText('수학 일러스트 카드 고르기')).toBeTruthy();
    expect(screen.queryByText(/2가지 중 고르기/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '피자 분수 그림 고르기' }));
    fireEvent.click(screen.getByRole('button', { name: '공개하기' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({ cardStyle: 'illust', illustId: 'math-pizza', gradeBand: '3-4' });
  });

  it('pulses the AI draft button', () => {
    render(
      <ArenaEditor initial={baseInitial} problems={[]} onSave={() => {}} onCancel={() => {}} />,
    );
    fireEvent.change(screen.getByLabelText('성취기준 (1개 이상 고르기)'), { target: { value: '[4수01-03]' } });
    expect(screen.getByRole('button', { name: 'AI로 초안 만들기' }).classList.contains('btn-pulse')).toBe(true);
  });
});
