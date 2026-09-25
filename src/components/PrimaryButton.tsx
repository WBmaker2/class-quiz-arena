import type { ReactNode } from 'react';

export default function PrimaryButton({
  children,
  onClick,
  pulse,
}: {
  children: ReactNode;
  onClick: () => void;
  pulse?: boolean;
}) {
  return (
    <button type="button" className={`btn-primary w-full${pulse ? ' btn-pulse' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
