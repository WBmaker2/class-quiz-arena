import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const PhyBall = () => (
  <Svg>
    <circle cx="32" cy="32" r="22" fill={PAPER} />
    <polygon points="32,24 40,30 37,39 27,39 24,30" fill={INK} />
    <line x1="32" y1="24" x2="32" y2="12" />
    <line x1="40" y1="30" x2="50" y2="26" />
    <line x1="37" y1="39" x2="43" y2="48" />
    <line x1="27" y1="39" x2="21" y2="48" />
    <line x1="24" y1="30" x2="14" y2="26" />
  </Svg>
);
const PhyRope = () => (
  <Svg>
    <path d="M16 10 C16 34 48 34 48 10" fill="none" />
    <rect x="11" y="8" width="10" height="16" rx="5" fill={PINK} />
    <rect x="43" y="8" width="10" height="16" rx="5" fill={PINK} />
  </Svg>
);
const PhyShoe = () => (
  <Svg>
    <path d="M10 40 C10 32 16 30 22 30 L30 30 L36 20 C37 18 40 18 42 20 L50 32 C52 35 52 40 48 40 L10 40 Z" fill={BLUE} />
    <line x1="32" y1="24" x2="38" y2="30" stroke={PAPER} />
    <line x1="36" y1="22" x2="42" y2="28" stroke={PAPER} />
    <rect x="10" y="40" width="42" height="7" rx="3" fill={PAPER} />
  </Svg>
);
const PhyWhistle = () => (
  <Svg>
    <circle cx="24" cy="32" r="16" fill={GREEN} />
    <circle cx="24" cy="32" r="5" fill={PAPER} />
    <rect x="36" y="26" width="18" height="12" rx="3" fill={GREEN} />
    <path d="M44 14 C48 18 48 20 46 24" fill="none" />
    <path d="M50 12 C54 18 54 22 52 26" fill="none" />
  </Svg>
);
const PhyMedal = () => (
  <Svg>
    <polygon points="22,8 32,26 42,8" fill={PINK} />
    <polygon points="22,8 28,8 34,20 30,26 26,20" fill={BLUE} stroke="none" />
    <circle cx="32" cy="40" r="14" fill={YELLOW} />
    <polygon points="32,33 34,37 39,37 35,40 36,45 32,42 28,45 29,40 25,37 30,37" fill={INK} stroke="none" />
  </Svg>
);
const PhyMat = () => (
  <Svg>
    <rect x="8" y="24" width="36" height="16" rx="8" fill={BLUE} />
    <circle cx="46" cy="32" r="10" fill={YELLOW} />
    <circle cx="46" cy="32" r="4" fill={PAPER} />
  </Svg>
);
const PhyCone = () => (
  <Svg>
    <polygon points="32,8 42,44 22,44" fill={ORANGE} />
    <rect x="26" y="28" width="12" height="6" fill={PAPER} stroke="none" />
    <rect x="16" y="44" width="32" height="8" rx="3" fill={ORANGE} />
  </Svg>
);
const PhyRibbon = () => (
  <Svg>
    <line x1="12" y1="12" x2="12" y2="34" strokeWidth={5} />
    <path d="M12 30 C22 26 22 36 32 32 C42 28 42 40 54 34" fill="none" stroke={PINK} />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'phy-ball': PhyBall,
  'phy-rope': PhyRope,
  'phy-shoe': PhyShoe,
  'phy-whistle': PhyWhistle,
  'phy-medal': PhyMedal,
  'phy-mat': PhyMat,
  'phy-cone': PhyCone,
  'phy-ribbon': PhyRibbon,
};
