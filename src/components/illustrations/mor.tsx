import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const MorHeart = () => (
  <Svg>
    <path d="M32 52 C18 42 10 34 10 24 C10 16 16 12 22 12 C27 12 31 16 32 20 C33 16 37 12 42 12 C48 12 54 16 54 24 C54 34 46 42 32 52 Z" fill={PINK} />
  </Svg>
);
const MorHands = () => (
  <Svg>
    <rect x="6" y="22" width="20" height="14" rx="7" fill={BLUE} />
    <rect x="38" y="22" width="20" height="14" rx="7" fill={GREEN} />
    <circle cx="32" cy="29" r="9" fill={PAPER} />
    <path d="M28 29 C29 32 31 32 32 29 C33 32 35 32 36 29" fill="none" strokeWidth={2} />
  </Svg>
);
const MorBalance = () => (
  <Svg>
    <line x1="32" y1="10" x2="32" y2="54" />
    <line x1="12" y1="16" x2="52" y2="16" />
    <line x1="14" y1="16" x2="10" y2="32" />
    <line x1="14" y1="16" x2="18" y2="32" />
    <path d="M6 32 L18 32 L16 37 L8 37 Z" fill={YELLOW} />
    <line x1="50" y1="16" x2="46" y2="32" />
    <line x1="50" y1="16" x2="54" y2="32" />
    <path d="M42 32 L54 32 L52 37 L44 37 Z" fill={YELLOW} />
    <rect x="24" y="50" width="16" height="6" rx="3" fill={INK} />
  </Svg>
);
const MorSprout = () => (
  <Svg>
    <circle cx="32" cy="38" r="16" fill={BLUE} />
    <path d="M20 38 C26 34 38 34 44 38" fill="none" stroke={PAPER} />
    <line x1="32" y1="22" x2="32" y2="12" stroke={GREEN} />
    <path d="M32 16 C24 16 20 12 18 6 C26 6 31 9 32 16 Z" fill={GREEN} />
    <path d="M32 16 C40 16 44 12 46 6 C38 6 33 9 32 16 Z" fill={GREEN} />
  </Svg>
);
const MorLamp = () => (
  <Svg>
    <rect x="24" y="24" width="16" height="22" rx="6" fill={YELLOW} />
    <line x1="32" y1="24" x2="32" y2="16" />
    <circle cx="32" cy="33" r="4" fill={ORANGE} stroke="none" />
    <path d="M14 14 L18 18 M50 14 L46 18 M32 6 L32 10" fill="none" />
    <rect x="20" y="46" width="24" height="6" rx="3" fill={INK} />
  </Svg>
);
const MorFamily = () => (
  <Svg>
    <polygon points="8,28 32,10 56,28" fill={ORANGE} />
    <rect x="16" y="28" width="32" height="22" rx="2" fill={PAPER} />
    <path d="M32 44 C25 39 22 36 22 32 C22 29 24 27 27 27 C29 27 31 28 32 30 C33 28 35 27 37 27 C40 27 42 29 42 32 C42 36 39 39 32 44 Z" fill={PINK} />
  </Svg>
);
const MorBadge = () => (
  <Svg>
    <path d="M32 8 L48 14 L48 30 C48 42 40 50 32 54 C24 50 16 42 16 30 L16 14 Z" fill={BLUE} />
    <polyline points="24,30 30,36 41,23" fill="none" stroke={PAPER} />
  </Svg>
);
const MorGift = () => (
  <Svg>
    <rect x="12" y="26" width="40" height="24" rx="3" fill={GREEN} />
    <rect x="28" y="26" width="8" height="24" fill={PAPER} />
    <rect x="10" y="18" width="44" height="10" rx="3" fill={GREEN} />
    <circle cx="25" cy="12" r="6" fill="none" />
    <circle cx="39" cy="12" r="6" fill="none" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'mor-heart': MorHeart,
  'mor-hands': MorHands,
  'mor-balance': MorBalance,
  'mor-sprout': MorSprout,
  'mor-lamp': MorLamp,
  'mor-family': MorFamily,
  'mor-badge': MorBadge,
  'mor-gift': MorGift,
};
