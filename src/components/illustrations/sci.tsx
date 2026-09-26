import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, PAPER, PINK, YELLOW } from './shared';

const SciFlask = () => (
  <Svg>
    <path d="M26 8 L26 26 L14 50 C13 53 15 56 19 56 L45 56 C49 56 51 53 50 50 L38 26 L38 8 Z" fill={PAPER} />
    <path d="M19 44 L45 44 L50 50 C51 53 49 56 45 56 L19 56 C15 56 13 53 14 50 Z" fill={BLUE} stroke="none" />
    <circle cx="30" cy="48" r="2" fill={PAPER} stroke="none" />
    <circle cx="38" cy="50" r="1.6" fill={PAPER} stroke="none" />
  </Svg>
);
const SciStar = () => (
  <Svg>
    <polygon
      points="32,8 38,24 55,24 41,34 46,51 32,41 18,51 23,34 9,24 26,24"
      fill={YELLOW}
    />
    <polygon points="52,8 54,13 59,13 55,16 56,21 52,18 48,21 49,16 45,13 50,13" fill={PINK} />
  </Svg>
);
const SciDrop = () => (
  <Svg>
    <path d="M32 8 C32 8 16 30 16 42 C16 51 23 57 32 57 C41 57 48 51 48 42 C48 30 32 8 32 8 Z" fill={BLUE} />
    <path d="M24 42 C24 46 26 49 29 50" stroke={PAPER} fill="none" />
  </Svg>
);
const SciLeaf = () => (
  <Svg>
    <path d="M12 52 C12 30 30 12 54 12 C54 36 36 54 12 52 Z" fill={GREEN} />
    <line x1="16" y1="48" x2="48" y2="16" />
  </Svg>
);
const SciMagnet = () => (
  <Svg>
    <path d="M18 10 L18 34 C18 46 24 54 32 54 C40 54 46 46 46 34 L46 10 L36 10 L36 34 C36 40 34 44 32 44 C30 44 28 40 28 34 L28 10 Z" fill={PINK} />
    <rect x="18" y="10" width="10" height="8" fill={PAPER} />
    <rect x="36" y="10" width="10" height="8" fill={PAPER} />
  </Svg>
);
const SciRocket = () => (
  <Svg>
    <path d="M32 6 C40 16 42 28 40 38 L24 38 C22 28 24 16 32 6 Z" fill={BLUE} />
    <circle cx="32" cy="26" r="5" fill={PAPER} />
    <polygon points="24,38 16,48 24,46" fill={PINK} />
    <polygon points="40,38 48,48 40,46" fill={PINK} />
    <polygon points="29,44 35,44 32,56" fill={YELLOW} />
  </Svg>
);
const SciScope = () => (
  <Svg>
    <rect x="12" y="48" width="32" height="7" rx="3" fill={INK} />
    <line x1="20" y1="48" x2="20" y2="24" />
    <line x1="20" y1="24" x2="40" y2="18" strokeWidth={5} />
    <rect x="36" y="12" width="10" height="10" rx="2" fill={BLUE} />
    <rect x="38" y="22" width="4" height="10" fill={GREEN} />
    <ellipse cx="40" cy="38" rx="10" ry="3" fill={YELLOW} />
    <line x1="40" y1="41" x2="40" y2="48" />
  </Svg>
);
const SciCloud = () => (
  <Svg>
    <circle cx="44" cy="18" r="10" fill={YELLOW} />
    <path d="M14 46 C10 46 8 42 10 39 C8 35 12 31 16 33 C18 28 26 28 28 33 C33 31 37 35 35 39 C37 42 35 46 31 46 Z" fill={PAPER} />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'sci-flask': SciFlask,
  'sci-star': SciStar,
  'sci-drop': SciDrop,
  'sci-leaf': SciLeaf,
  'sci-magnet': SciMagnet,
  'sci-rocket': SciRocket,
  'sci-scope': SciScope,
  'sci-cloud': SciCloud,
};
