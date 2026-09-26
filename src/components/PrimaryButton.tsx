import type { ReactNode } from 'react';

export default function PrimaryButton({
  children,
  onClick,
  pulse,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  pulse?: boolean;
  disabled?: boolean;
}) {
  return (
    <button type="button" className={`btn-primary w-full${pulse && !disabled ? ' btn-pulse' : ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
