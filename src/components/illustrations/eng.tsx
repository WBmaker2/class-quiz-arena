import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const EngAbc = () => (
  <Svg>
    <rect x="12" y="14" width="40" height="38" rx="8" fill={ORANGE} />
    <text x="32" y="42" textAnchor="middle" fontSize="20" fontWeight="bold" fill={PAPER} stroke="none">
      ABC
    </text>
  </Svg>
);
const EngCap = () => (
  <Svg>
    <polygon points="32,10 56,20 32,30 8,20" fill={INK} />
    <path d="M22 26 L22 38 C22 42 42 42 42 38 L42 26 L32 31 Z" fill={BLUE} />
    <line x1="50" y1="21" x2="50" y2="36" />
    <circle cx="50" cy="39" r="3" fill={YELLOW} />
  </Svg>
);
const EngMic = () => (
  <Svg>
    <rect x="24" y="8" width="16" height="24" rx="8" fill={GREEN} />
    <line x1="20" y1="18" x2="20" y2="22" />
    <line x1="44" y1="18" x2="44" y2="22" />
    <path d="M20 28 C20 38 26 42 32 42 C38 42 44 38 44 28" fill="none" />
    <line x1="32" y1="42" x2="32" y2="50" />
    <line x1="24" y1="52" x2="40" y2="52" />
  </Svg>
);
const EngPhones = () => (
  <Svg>
    <path d="M14 44 L14 34 C14 20 22 12 32 12 C42 12 50 20 50 34 L50 44" fill="none" />
    <rect x="10" y="36" width="10" height="16" rx="4" fill={PINK} />
    <rect x="44" y="36" width="10" height="16" rx="4" fill={PINK} />
  </Svg>
);
const EngBus = () => (
  <Svg>
    <rect x="10" y="16" width="44" height="26" rx="8" fill={YELLOW} />
    <rect x="16" y="22" width="14" height="9" rx="2" fill={PAPER} />
    <rect x="34" y="22" width="14" height="9" rx="2" fill={PAPER} />
    <circle cx="21" cy="47" r="5" fill={INK} />
    <circle cx="43" cy="47" r="5" fill={INK} />
  </Svg>
);
const EngBalloon = () => (
  <Svg>
    <ellipse cx="32" cy="24" rx="22" ry="16" fill={PAPER} />
    <polygon points="26,38 24,48 34,38" fill={PAPER} />
    <text x="32" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill={INK} stroke="none">
      Hi!
    </text>
  </Svg>
);
const EngBook = () => (
  <Svg>
    <path d="M32 16 C24 10 14 10 8 12 L8 50 C14 48 24 48 32 54 C40 48 50 48 56 50 L56 12 C50 10 40 10 32 16 Z" fill={BLUE} />
    <line x1="32" y1="16" x2="32" y2="54" />
    <polygon points="24,26 26,30 30,30 27,33 28,37 24,35 20,37 21,33 18,30 22,30" fill={YELLOW} stroke="none" />
  </Svg>
);
const EngPen = () => (
  <Svg>
    <line x1="10" y1="16" x2="40" y2="16" />
    <line x1="10" y1="26" x2="54" y2="26" />
    <line x1="10" y1="36" x2="40" y2="36" />
    <g transform="rotate(30 44 44)">
      <rect x="38" y="26" width="12" height="22" rx="2" fill={GREEN} />
      <polygon points="38,48 50,48 44,58" fill={PAPER} />
      <polygon points="42,52 46,52 44,58" fill={INK} />
    </g>
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'eng-abc': EngAbc,
  'eng-cap': EngCap,
  'eng-mic': EngMic,
  'eng-phones': EngPhones,
  'eng-bus': EngBus,
  'eng-balloon': EngBalloon,
  'eng-book': EngBook,
  'eng-pen': EngPen,
};
