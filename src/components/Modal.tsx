import { useEffect, type ReactNode } from 'react';

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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'rgba(38, 33, 26, 0.45)', backdropFilter: 'blur(6px)' }}
      />
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto card-ink px-6 py-6">
        <button type="button" className="modal-x" aria-label="닫기" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
