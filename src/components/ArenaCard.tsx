import type { ReactNode } from 'react';
import { Illust } from './illustrations';

/** 교사·학생·은행이 함께 쓰는 그래픽 아레나 카드 (자체 스타일). */
export default function ArenaCard({
  bg,
  emoji,
  illustId,
  useIllust,
  badges,
  title,
  body,
  footer,
}: {
  bg?: string;
  emoji?: string;
  illustId?: string;
  useIllust?: boolean;
  badges: ReactNode;
  title: string;
  body?: ReactNode;
  footer?: ReactNode;
}) {
  const showIllust = useIllust === true;
  return (
    <div className="h-full overflow-hidden flex flex-col" style={{ background: '#fffdf6', border: '2px solid #26211a', borderRadius: 20 }}>
      <div
        className="px-3 pt-2 pb-1"
        style={{
          backgroundColor: bg ?? '#E8ECF3',
          backgroundImage: 'radial-gradient(rgba(38,33,26,0.14) 1.5px, transparent 1.6px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div className="flex flex-wrap gap-1 mb-1">{badges}</div>
        <div className="flex justify-end" style={{ minHeight: 64 }}>
          {showIllust ? (
            <Illust id={illustId} size={68} />
          ) : (
            <span style={{ fontSize: 50, lineHeight: 1 }} aria-hidden="true">
              {emoji ?? '🎲'}
            </span>
          )}
        </div>
      </div>
      <div className="px-3 py-2 flex flex-col gap-1 flex-1">
        <p className="font-display text-lg" style={{ lineHeight: 1.3 }}>{title}</p>
        {body}
        {footer && <div className="mt-auto pt-2">{footer}</div>}
      </div>
    </div>
  );
}
