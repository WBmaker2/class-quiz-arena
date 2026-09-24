import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Card from './Card';
import PrimaryButton from './PrimaryButton';
import Avatar from './Avatar';
import EmptyState from './EmptyState';

describe('design system', () => {
  it('renders card content', () => {
    render(<Card>내용</Card>);
    expect(screen.getByText('내용')).toBeTruthy();
  });

  it('calls onClick when primary button pressed', () => {
    const onClick = vi.fn();
    render(<PrimaryButton onClick={onClick}>시작</PrimaryButton>);
    fireEvent.click(screen.getByRole('button', { name: '시작' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('maps each animal to its emoji', () => {
    const { rerender } = render(<Avatar animal="cat" />);
    expect(screen.getByText('🐱')).toBeTruthy();
    rerender(<Avatar animal="turtle" />);
    expect(screen.getByText('🐢')).toBeTruthy();
  });

  it('renders empty state with action', () => {
    const onAction = vi.fn();
    render(<EmptyState title="아직 없어요" actionLabel="만들기" onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: '만들기' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
