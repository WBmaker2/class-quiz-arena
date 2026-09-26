import { useEffect, useRef, type ReactNode } from 'react';

/** 작은 오버레이 팝업. 뒤는 흐리게, 오른쪽 위 X·Escape로 닫기. */
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusables = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const items = focusables();
        if (!items.length) { e.preventDefault(); dialog?.focus(); return; }
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previousFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'rgba(38, 33, 26, 0.45)', backdropFilter: 'blur(6px)' }}
      />
      <div ref={dialogRef} tabIndex={-1} className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto card-ink px-6 py-6">
        <button type="button" className="modal-x" aria-label="닫기" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
