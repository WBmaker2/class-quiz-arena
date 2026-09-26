import type { ReactNode } from 'react';
export const INK = '#26211a';
export const BLUE = '#7FB3E8';
export const YELLOW = '#FFD94D';
export const PINK = '#F5A8C0';
export const GREEN = '#8FD694';
export const ORANGE = '#F5A96B';
export const PAPER = '#FFFDF6';
export function Svg({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 64 64" width="100%" height="100%" role="img" aria-hidden="true" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
