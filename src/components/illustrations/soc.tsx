import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const SocMap = () => (
  <Svg>
    <polygon points="10,20 24,14 40,20 54,14 54,48 40,54 24,48 10,54" fill={GREEN} />
    <line x1="24" y1="14" x2="24" y2="48" />
    <line x1="40" y1="20" x2="40" y2="54" />
    <circle cx="32" cy="30" r="4" fill={PINK} />
  </Svg>
);
const SocCompass = () => (
  <Svg>
    <circle cx="32" cy="32" r="22" fill={PAPER} />
    <polygon points="32,14 38,32 32,50 26,32" fill={PINK} />
    <circle cx="32" cy="32" r="3" fill={INK} />
  </Svg>
);
const SocGlobe = () => (
  <Svg>
    <circle cx="32" cy="32" r="22" fill={BLUE} />
    <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" />
    <line x1="10" y1="32" x2="54" y2="32" />
  </Svg>
);
const SocFlag = () => (
  <Svg>
    <line x1="18" y1="8" x2="18" y2="56" />
    <path d="M18 10 C28 6 36 14 48 10 L48 30 C36 34 28 26 18 30 Z" fill={YELLOW} />
  </Svg>
);
const SocHouse = () => (
  <Svg>
    <polygon points="8,30 32,12 56,30" fill={ORANGE} />
    <rect x="16" y="30" width="32" height="22" rx="2" fill={PAPER} />
    <rect x="27" y="38" width="10" height="14" fill={BLUE} />
  </Svg>
);
const SocTrain = () => (
  <Svg>
    <rect x="14" y="12" width="36" height="30" rx="8" fill={GREEN} />
    <rect x="20" y="18" width="24" height="12" rx="3" fill={PAPER} />
    <circle cx="23" cy="48" r="5" fill={INK} />
    <circle cx="41" cy="48" r="5" fill={INK} />
    <circle cx="32" cy="36" r="2.5" fill={YELLOW} stroke="none" />
  </Svg>
);
const SocJar = () => (
  <Svg>
    <path d="M22 12 L42 12 L40 18 C46 24 48 34 42 44 C38 50 26 50 22 44 C16 34 18 24 24 18 Z" fill={ORANGE} />
    <rect x="20" y="8" width="24" height="7" rx="3" fill={YELLOW} />
    <path d="M22 30 C28 27 36 27 42 30" fill="none" />
    <path d="M23 37 C28 34 36 34 41 37" fill="none" />
  </Svg>
);
const SocCoin = () => (
  <Svg>
    <circle cx="24" cy="36" r="14" fill={YELLOW} />
    <circle cx="24" cy="36" r="8" fill="none" />
    <circle cx="40" cy="26" r="14" fill={YELLOW} />
    <circle cx="40" cy="26" r="8" fill="none" />
    <line x1="40" y1="20" x2="40" y2="32" />
    <line x1="35" y1="24" x2="45" y2="24" />
    <line x1="35" y1="28" x2="45" y2="28" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'soc-map': SocMap,
  'soc-compass': SocCompass,
  'soc-globe': SocGlobe,
  'soc-flag': SocFlag,
  'soc-house': SocHouse,
  'soc-train': SocTrain,
  'soc-jar': SocJar,
  'soc-coin': SocCoin,
};
