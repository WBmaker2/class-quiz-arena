import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const KorBook = () => (
  <Svg>
    <path d="M32 14 C24 8 14 8 8 10 L8 50 C14 48 24 48 32 54 C40 48 50 48 56 50 L56 10 C50 8 40 8 32 14 Z" fill={PINK} />
    <line x1="32" y1="14" x2="32" y2="54" />
  </Svg>
);
const KorPencil = () => (
  <Svg>
    <g transform="rotate(-30 32 32)">
      <rect x="24" y="8" width="16" height="32" rx="2" fill={YELLOW} />
      <polygon points="24,40 40,40 32,56" fill={PAPER} />
      <polygon points="29.5,47 34.5,47 32,56" fill={INK} />
      <rect x="24" y="4" width="16" height="6" rx="2" fill={PINK} />
    </g>
  </Svg>
);
const KorChat = () => (
  <Svg>
    <rect x="8" y="12" width="48" height="30" rx="10" fill={PAPER} />
    <polygon points="22,42 22,54 34,42" fill={PAPER} />
    <line x1="18" y1="24" x2="46" y2="24" />
    <line x1="18" y1="32" x2="38" y2="32" />
  </Svg>
);
const KorLetter = () => (
  <Svg>
    <rect x="10" y="18" width="44" height="30" rx="4" fill={BLUE} />
    <polyline points="10,20 32,36 54,20" fill="none" />
  </Svg>
);
const KorScroll = () => (
  <Svg>
    <rect x="14" y="22" width="36" height="20" rx="2" fill={PAPER} />
    <circle cx="14" cy="32" r="7" fill={GREEN} />
    <circle cx="50" cy="32" r="7" fill={GREEN} />
    <line x1="22" y1="30" x2="42" y2="30" />
    <line x1="22" y1="36" x2="42" y2="36" />
  </Svg>
);
const KorBrush = () => (
  <Svg>
    <rect x="27" y="6" width="10" height="26" rx="3" fill={ORANGE} />
    <polygon points="27,32 37,32 42,52 22,52" fill={INK} />
    <polygon points="26,44 38,44 42,52 22,52" fill={PAPER} />
  </Svg>
);
const KorMic = () => (
  <Svg>
    <circle cx="26" cy="22" r="12" fill={PINK} />
    <line x1="18" y1="18" x2="34" y2="18" stroke={PAPER} />
    <line x1="18" y1="23" x2="34" y2="23" stroke={PAPER} />
    <rect x="22" y="34" width="8" height="18" rx="4" fill={ORANGE} />
    <path d="M42 14 C46 22 46 30 42 38" fill="none" />
    <path d="M48 10 C54 22 54 34 48 44" fill="none" />
  </Svg>
);
const KorLens = () => (
  <Svg>
    <circle cx="26" cy="26" r="16" fill={PAPER} />
    <line x1="22" y1="22" x2="36" y2="22" />
    <line x1="22" y1="29" x2="32" y2="29" />
    <line x1="37" y1="37" x2="50" y2="50" strokeWidth={5} />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'kor-book': KorBook,
  'kor-pencil': KorPencil,
  'kor-chat': KorChat,
  'kor-letter': KorLetter,
  'kor-scroll': KorScroll,
  'kor-brush': KorBrush,
  'kor-mic': KorMic,
  'kor-lens': KorLens,
};
