import type { ReactNode } from 'react';

export default function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className="btn-primary w-full" onClick={onClick}>
      {children}
    </button>
  );
}
