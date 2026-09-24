import { useEffect, useState } from 'react';

export default function Timer({ endsAt, nowMs }: { endsAt: number; nowMs?: number }) {
  const [now, setNow] = useState(() => nowMs ?? Date.now());
  useEffect(() => {
    if (nowMs !== undefined) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [nowMs]);
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
  return <p aria-label="남은 시간">{left}초</p>;
}
