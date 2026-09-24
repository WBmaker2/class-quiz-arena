import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ILLUSTS, Illust, illustsOf } from './illustrations';

describe('illustrations registry', () => {
  it('holds 30 entries, 6 per subject', () => {
    expect(ILLUSTS).toHaveLength(30);
    for (const subject of ['수학', '국어', '사회', '과학', '영어']) {
      expect(illustsOf(subject)).toHaveLength(6);
    }
  });

  it('keeps ids unique', () => {
    expect(new Set(ILLUSTS.map((m) => m.id)).size).toBe(30);
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
