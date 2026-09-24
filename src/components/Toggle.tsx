import type { ReactNode } from 'react';

export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={typeof label === 'string' ? label : undefined}
      className={`toggle${checked ? ' toggle-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
      <span className="toggle-text">{label}</span>
    </button>
  );
}
