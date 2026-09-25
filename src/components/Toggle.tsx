import type { ReactNode } from 'react';

export default function Toggle({
  checked,
  onChange,
  label,
  small,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={typeof label === 'string' ? label : undefined}
      className={`toggle${checked ? ' toggle-on' : ''}${small ? ' toggle-sm' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
      <span className="toggle-text">{label}</span>
    </button>
  );
}
