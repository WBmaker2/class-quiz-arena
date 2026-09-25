import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  it('closes with the X button', () => {
    const onClose = vi.fn();
    render(
      <Modal title="새 아레나 만들기" onClose={onClose}>
        <p>내용</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: '새 아레나 만들기' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes with Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal title="제목" onClose={onClose}>
        <p>내용</p>
      </Modal>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('dims and blurs the backdrop', () => {
    const { container } = render(
      <Modal title="제목" onClose={() => {}}>
        <p>내용</p>
      </Modal>,
    );
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(backdrop.style.backdropFilter).toContain('blur');
  });
});
