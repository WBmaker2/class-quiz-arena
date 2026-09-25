import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UpdateLog from './UpdateLog';

describe('UpdateLog', () => {
  it('shows entries by date', () => {
    render(<UpdateLog entries={[{ date: '2026-09-25', items: ['그림이 8개씩 나왔어요'] }]} />);
    expect(screen.getByText('2026-09-25')).toBeTruthy();
    expect(screen.getByText('그림이 8개씩 나왔어요')).toBeTruthy();
  });

  it('shows an empty state without entries', () => {
    render(<UpdateLog entries={[]} />);
    expect(screen.getByText('아직 기록된 업데이트가 없어요')).toBeTruthy();
  });
});
