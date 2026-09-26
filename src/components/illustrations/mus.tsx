import type { JSX } from 'react';
import { Svg, BLUE, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const MusNote = () => (
  <Svg>
    <ellipse cx="22" cy="44" rx="9" ry="7" fill={INK} />
    <line x1="30" y1="43" x2="30" y2="12" />
    <path d="M30 12 C38 14 44 18 46 26 C40 24 34 22 30 20" fill={PINK} />
  </Svg>
);
const MusDrum = () => (
  <Svg>
    <ellipse cx="32" cy="20" rx="20" ry="7" fill={PAPER} />
    <rect x="12" y="20" width="40" height="22" fill={PINK} />
    <ellipse cx="32" cy="42" rx="20" ry="7" fill={PINK} />
    <line x1="12" y1="12" x2="22" y2="22" />
    <line x1="52" y1="12" x2="42" y2="22" />
    <circle cx="11" cy="11" r="3" fill={BLUE} />
    <circle cx="53" cy="11" r="3" fill={BLUE} />
  </Svg>
);
const MusFlute = () => (
  <Svg>
    <rect x="26" y="8" width="12" height="42" rx="6" fill={YELLOW} />
    <circle cx="32" cy="20" r="2" fill={INK} stroke="none" />
    <circle cx="32" cy="28" r="2" fill={INK} stroke="none" />
    <circle cx="32" cy="36" r="2" fill={INK} stroke="none" />
    <polygon points="26,50 38,50 32,58" fill={INK} />
  </Svg>
);
const MusKeys = () => (
  <Svg>
    <rect x="8" y="18" width="48" height="28" rx="4" fill={PAPER} />
    <line x1="20" y1="18" x2="20" y2="46" />
    <line x1="32" y1="18" x2="32" y2="46" />
    <line x1="44" y1="18" x2="44" y2="46" />
    <rect x="15" y="18" width="8" height="16" fill={INK} stroke="none" />
    <rect x="27" y="18" width="8" height="16" fill={INK} stroke="none" />
    <rect x="39" y="18" width="8" height="16" fill={INK} stroke="none" />
  </Svg>
);
const MusBell = () => (
  <Svg>
    <path d="M32 16 C40 24 42 34 42 42 L22 42 C22 34 24 24 32 16 Z" fill={YELLOW} />
    <line x1="32" y1="16" x2="32" y2="8" />
    <circle cx="32" cy="8" r="3" fill={INK} />
    <circle cx="32" cy="46" r="3" fill={INK} />
    <rect x="18" y="42" width="28" height="6" rx="3" fill={INK} />
  </Svg>
);
const MusSpeaker = () => (
  <Svg>
    <rect x="12" y="14" width="26" height="36" rx="4" fill={BLUE} />
    <circle cx="25" cy="26" r="6" fill={PAPER} />
    <circle cx="25" cy="40" r="4" fill={PAPER} />
    <path d="M44 24 C48 28 48 36 44 40" fill="none" />
    <path d="M48 20 C54 28 54 36 48 44" fill="none" />
  </Svg>
);
const MusSong = () => (
  <Svg>
    <circle cx="22" cy="20" r="11" fill={BLUE} />
    <line x1="18" y1="17" x2="26" y2="17" stroke={PAPER} />
    <line x1="18" y1="22" x2="26" y2="22" stroke={PAPER} />
    <rect x="18" y="31" width="8" height="21" rx="4" fill={INK} />
    <ellipse cx="46" cy="46" rx="6" ry="5" fill={PINK} stroke={INK} />
    <line x1="51" y1="45" x2="51" y2="26" />
  </Svg>
);
const MusJanggu = () => (
  <Svg>
    <path d="M14 14 L26 24 L26 40 L14 50 Z" fill={ORANGE} />
    <path d="M50 14 L38 24 L38 40 L50 50 Z" fill={ORANGE} />
    <rect x="26" y="22" width="12" height="20" rx="4" fill={YELLOW} />
    <line x1="26" y1="27" x2="38" y2="31" />
    <line x1="26" y1="35" x2="38" y2="39" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'mus-note': MusNote,
  'mus-drum': MusDrum,
  'mus-flute': MusFlute,
  'mus-keys': MusKeys,
  'mus-bell': MusBell,
  'mus-speaker': MusSpeaker,
  'mus-song': MusSong,
  'mus-janggu': MusJanggu,
};
