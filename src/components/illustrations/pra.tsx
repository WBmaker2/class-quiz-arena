import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const PraPot = () => (
  <Svg>
    <rect x="14" y="24" width="36" height="22" rx="6" fill={GREEN} />
    <line x1="10" y1="28" x2="14" y2="28" />
    <line x1="50" y1="28" x2="54" y2="28" />
    <path d="M22 16 C24 20 28 20 30 16 C32 20 36 20 38 16" fill="none" />
    <rect x="18" y="46" width="28" height="6" rx="3" fill={INK} />
  </Svg>
);
const PraNeedle = () => (
  <Svg>
    <line x1="12" y1="48" x2="48" y2="14" />
    <ellipse cx="48" cy="14" rx="4" ry="2.5" fill="none" />
    <path d="M14 22 C22 22 26 30 34 30 C40 30 42 24 46 26" fill="none" stroke={PINK} />
    <rect x="10" y="32" width="14" height="18" rx="3" fill={BLUE} />
    <line x1="14" y1="38" x2="20" y2="38" stroke={PAPER} />
    <line x1="14" y1="43" x2="20" y2="43" stroke={PAPER} />
  </Svg>
);
const PraHammer = () => (
  <Svg>
    <g transform="rotate(-25 32 32)">
      <rect x="28" y="22" width="8" height="30" rx="4" fill={ORANGE} />
      <rect x="16" y="10" width="32" height="14" rx="5" fill={BLUE} />
    </g>
  </Svg>
);
const PraRobot = () => (
  <Svg>
    <rect x="18" y="20" width="28" height="24" rx="6" fill={BLUE} />
    <circle cx="26" cy="31" r="3" fill={PAPER} stroke="none" />
    <circle cx="38" cy="31" r="3" fill={PAPER} stroke="none" />
    <line x1="27" y1="38" x2="37" y2="38" stroke={PAPER} />
    <line x1="32" y1="20" x2="32" y2="10" />
    <circle cx="32" cy="9" r="3" fill={PINK} />
    <rect x="22" y="44" width="6" height="10" rx="3" fill={INK} />
    <rect x="36" y="44" width="6" height="10" rx="3" fill={INK} />
  </Svg>
);
const PraPlug = () => (
  <Svg>
    <rect x="22" y="26" width="20" height="22" rx="5" fill={YELLOW} />
    <line x1="27" y1="26" x2="27" y2="12" strokeWidth={4} />
    <line x1="37" y1="26" x2="37" y2="12" strokeWidth={4} />
    <path d="M32 48 L32 56" />
  </Svg>
);
const PraRecycle = () => (
  <Svg>
    <rect x="18" y="26" width="28" height="22" rx="3" fill={GREEN} />
    <path d="M25 38 C25 33 29 31 32 33 C35 31 39 33 39 38" fill="none" stroke={PAPER} />
    <polygon points="39,34 41,39 36,39" fill={PAPER} stroke="none" />
    <polygon points="25,34 23,39 28,39" fill={PAPER} stroke="none" />
  </Svg>
);
const PraSprout = () => (
  <Svg>
    <polygon points="20,34 44,34 40,54 24,54" fill={ORANGE} />
    <line x1="32" y1="34" x2="32" y2="22" stroke={GREEN} />
    <path d="M32 26 C24 26 20 22 18 14 C26 14 31 18 32 26 Z" fill={GREEN} />
    <path d="M32 26 C40 26 44 22 46 14 C38 14 33 18 32 26 Z" fill={GREEN} />
  </Svg>
);
const PraPig = () => (
  <Svg>
    <ellipse cx="32" cy="36" rx="20" ry="14" fill={PINK} />
    <circle cx="46" cy="30" r="7" fill={PINK} />
    <circle cx="46" cy="30" r="2" fill={INK} stroke="none" />
    <line x1="28" y1="22" x2="28" y2="28" />
    <line x1="30" y1="24" x2="34" y2="24" />
    <circle cx="20" cy="33" r="2" fill={INK} stroke="none" />
    <rect x="24" y="48" width="6" height="6" fill={INK} />
    <rect x="36" y="48" width="6" height="6" fill={INK} />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'pra-pot': PraPot,
  'pra-needle': PraNeedle,
  'pra-hammer': PraHammer,
  'pra-robot': PraRobot,
  'pra-plug': PraPlug,
  'pra-recycle': PraRecycle,
  'pra-sprout': PraSprout,
  'pra-pig': PraPig,
};
