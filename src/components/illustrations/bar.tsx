import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, PAPER, PINK, YELLOW } from './shared';

const BarTooth = () => (
  <Svg>
    <rect x="8" y="40" width="30" height="8" rx="4" fill={BLUE} />
    <rect x="38" y="36" width="12" height="14" rx="3" fill={PAPER} />
    <line x1="41" y1="36" x2="41" y2="30" />
    <line x1="45" y1="36" x2="45" y2="30" />
    <line x1="49" y1="36" x2="49" y2="30" />
    <path d="M16 16 C16 12 22 12 24 16 C26 12 32 12 32 16 C32 22 24 28 24 28 C24 28 16 22 16 16 Z" fill={PAPER} />
  </Svg>
);
const BarLight = () => (
  <Svg>
    <rect x="20" y="8" width="24" height="40" rx="8" fill={INK} />
    <circle cx="32" cy="18" r="5" fill={PINK} stroke="none" />
    <circle cx="32" cy="30" r="5" fill={YELLOW} stroke="none" />
    <circle cx="32" cy="41" r="5" fill={GREEN} stroke="none" />
    <line x1="32" y1="48" x2="32" y2="56" />
  </Svg>
);
const BarTaegeuk = () => (
  <Svg>
    <line x1="18" y1="8" x2="18" y2="56" />
    <path d="M18 10 C28 6 36 14 48 10 L48 34 C36 38 28 30 18 34 Z" fill={PAPER} />
    <circle cx="33" cy="22" r="6" fill={PINK} />
    <path d="M33 16 C37 18 37 24 33 26 C29 28 27 24 29 21 C30 19 32 19 33 21" fill={BLUE} stroke="none" />
  </Svg>
);
const BarClock = () => (
  <Svg>
    <circle cx="32" cy="36" r="18" fill={PAPER} />
    <line x1="32" y1="36" x2="32" y2="24" />
    <line x1="32" y1="36" x2="40" y2="40" />
    <line x1="18" y1="22" x2="12" y2="14" />
    <line x1="46" y1="22" x2="52" y2="14" />
    <line x1="26" y1="52" x2="24" y2="56" />
    <line x1="38" y1="52" x2="40" y2="56" />
  </Svg>
);
const BarHandheart = () => (
  <Svg>
    <path d="M32 46 C22 39 17 34 17 27 C17 22 20 19 24 19 C27 19 30 21 32 24 C34 21 37 19 40 19 C44 19 47 22 47 27 C47 34 42 39 32 46 Z" fill={PINK} />
    <path d="M10 30 C14 28 18 30 20 34" fill="none" />
    <path d="M54 30 C50 28 46 30 44 34" fill="none" />
  </Svg>
);
const BarBin = () => (
  <Svg>
    <polygon points="18,20 46,20 42,54 22,54" fill={GREEN} />
    <rect x="14" y="14" width="36" height="7" rx="3" fill={INK} />
    <path d="M27 28 L27 46 M32 28 L32 46 M37 28 L37 46" stroke={PAPER} />
  </Svg>
);
const BarBag = () => (
  <Svg>
    <rect x="14" y="20" width="36" height="30" rx="8" fill={YELLOW} />
    <rect x="22" y="30" width="20" height="12" rx="4" fill={PAPER} />
    <path d="M24 20 C24 12 40 12 40 20" fill="none" />
  </Svg>
);
const BarUmbrella = () => (
  <Svg>
    <path d="M10 34 C10 22 20 12 32 12 C44 12 54 22 54 34 C48 30 42 30 38 34 C34 30 28 30 24 34 C20 30 14 30 10 34 Z" fill={BLUE} />
    <line x1="32" y1="12" x2="32" y2="50" />
    <path d="M32 50 C32 54 28 55 26 53" fill="none" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'bar-tooth': BarTooth,
  'bar-light': BarLight,
  'bar-taegeuk': BarTaegeuk,
  'bar-clock': BarClock,
  'bar-handheart': BarHandheart,
  'bar-bin': BarBin,
  'bar-bag': BarBag,
  'bar-umbrella': BarUmbrella,
};
