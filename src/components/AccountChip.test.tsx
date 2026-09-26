import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AccountChip from './AccountChip';

describe('AccountChip', () => {
  it('shows the photo and name with email on hover', () => {
    render(<AccountChip name="김선생" email="kim@school.kr" photoURL="https://photo.example/me.png" />);
    expect(screen.getByText('김선생')).toBeTruthy();
    expect(screen.getByTitle('kim@school.kr')).toBeTruthy();
    expect(document.querySelector('img[src="https://photo.example/me.png"]')).toBeTruthy();
  });

  it('works without a photo', () => {
    render(<AccountChip name="일호" />);
    expect(screen.getByText('일호')).toBeTruthy();
    expect(document.querySelector('img')).toBeNull();
  });
});
