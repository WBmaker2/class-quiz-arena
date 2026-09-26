import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
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

  it('starts focus inside the modal and keeps Tab navigation inside it', () => {
    render(<><button type="button">열기</button><Modal title="제목" onClose={() => {}}><button type="button">첫 항목</button><button type="button">마지막 항목</button></Modal></>);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '닫기' }));
    screen.getByRole('button', { name: '마지막 항목' }).focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '닫기' }));
  });

  it('returns focus to the opening control after closing', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return <><button type="button" onClick={() => setOpen(true)}>열기</button>{open && <Modal title="제목" onClose={() => setOpen(false)}><button type="button">내용</button></Modal>}</>;
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: '열기' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).toBe(trigger);
  });
});
