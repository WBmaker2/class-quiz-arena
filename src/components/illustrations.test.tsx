import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ILLUSTS, Illust, illustsOf } from './illustrations';

describe('illustrations registry', () => {
  it('holds 104 entries, 8 per subject', () => {
    expect(ILLUSTS).toHaveLength(104);
    for (const subject of ['수학', '국어', '사회', '과학', '영어', '도덕', '체육', '음악', '미술', '실과', '바른 생활', '슬기로운 생활', '즐거운 생활']) {
      expect(illustsOf(subject)).toHaveLength(8);
    }
  });

  it('keeps ids unique', () => {
    expect(new Set(ILLUSTS.map((m) => m.id)).size).toBe(104);
  });

  it('renders every illustration without crashing', () => {
    for (const m of ILLUSTS) {
      const { unmount } = render(<Illust id={m.id} size={48} />);
      unmount();
    }
  });

  it('falls back for unknown ids', () => {
    const { container } = render(<Illust id="nope" size={48} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
