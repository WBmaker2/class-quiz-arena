import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const SluSchool = () => (
  <Svg>
    <rect x="12" y="28" width="40" height="22" rx="2" fill={YELLOW} />
    <polygon points="8,28 32,14 56,28" fill={PINK} />
    <rect x="27" y="38" width="10" height="12" fill={BLUE} />
    <rect x="16" y="34" width="8" height="8" fill={PAPER} />
    <rect x="40" y="34" width="8" height="8" fill={PAPER} />
    <line x1="32" y1="14" x2="32" y2="8" />
    <circle cx="32" cy="7" r="2" fill={INK} />
  </Svg>
);
const SluMap = () => (
  <Svg>
    <polygon points="10,18 24,14 40,18 54,14 54,46 40,50 24,46 10,50" fill={PAPER} />
    <line x1="24" y1="14" x2="24" y2="46" />
    <line x1="40" y1="18" x2="40" y2="50" />
    <polygon points="32,24 34,28 38,28 35,31 36,35 32,33 28,35 29,31 26,28 30,28" fill={PINK} stroke="none" />
  </Svg>
);
const SluHanok = () => (
  <Svg>
    <path d="M8 26 C20 26 44 26 56 26 L52 16 C42 20 22 20 12 16 Z" fill={INK} />
    <rect x="18" y="26" width="28" height="20" rx="2" fill={PAPER} />
    <line x1="26" y1="26" x2="26" y2="46" />
    <line x1="32" y1="26" x2="32" y2="46" />
    <line x1="38" y1="26" x2="38" y2="46" />
    <rect x="14" y="46" width="36" height="6" rx="2" fill={INK} />
  </Svg>
);
const SluGlobe = () => (
  <Svg>
    <circle cx="32" cy="34" r="18" fill={BLUE} />
    <path d="M20 28 C26 26 30 32 36 30 C40 28 42 32 46 30" fill="none" stroke={PAPER} />
    <path d="M22 40 C28 38 36 42 44 38" fill="none" stroke={PAPER} />
    <path d="M32 6 C30 10 30 12 32 16 C34 12 34 10 32 6 Z" fill={PINK} />
    <path d="M18 52 L46 52" />
  </Svg>
);
const SluLeafcal = () => (
  <Svg>
    <rect x="14" y="16" width="36" height="34" rx="5" fill={PAPER} />
    <line x1="14" y1="26" x2="50" y2="26" />
    <line x1="24" y1="10" x2="24" y2="20" strokeWidth={4} />
    <line x1="40" y1="10" x2="40" y2="20" strokeWidth={4} />
    <path d="M32 44 C26 44 22 40 21 34 C27 34 31 37 32 44 Z" fill={GREEN} />
  </Svg>
);
const SluTool = () => (
  <Svg>
    <rect x="12" y="28" width="40" height="22" rx="4" fill={ORANGE} />
    <path d="M24 28 C24 20 40 20 40 28" fill="none" />
    <line x1="28" y1="14" x2="36" y2="26" />
    <line x1="36" y1="14" x2="28" y2="26" />
  </Svg>
);
const SluBulb = () => (
  <Svg>
    <circle cx="32" cy="24" r="14" fill={YELLOW} />
    <rect x="26" y="38" width="12" height="8" rx="2" fill={INK} />
    <line x1="28" y1="46" x2="36" y2="46" />
    <path d="M28 24 C28 20 36 20 36 24 C36 27 32 27 32 31" fill="none" />
    <circle cx="32" cy="34" r="1.5" fill={INK} stroke="none" />
  </Svg>
);
const SluSeed = () => (
  <Svg>
    <ellipse cx="32" cy="36" rx="12" ry="15" fill={ORANGE} />
    <path d="M32 24 C32 18 36 14 42 12" fill="none" stroke={GREEN} />
    <path d="M42 12 C38 12 34 14 32 18 C36 18 40 16 42 12 Z" fill={GREEN} />
    <path d="M28 40 C28 44 30 46 33 47" stroke={PAPER} fill="none" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'slu-school': SluSchool,
  'slu-map': SluMap,
  'slu-hanok': SluHanok,
  'slu-globe': SluGlobe,
  'slu-leafcal': SluLeafcal,
  'slu-tool': SluTool,
  'slu-bulb': SluBulb,
  'slu-seed': SluSeed,
};
