import type { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }) {
  return <div className="card-ink px-9 py-10">{children}</div>;
}
