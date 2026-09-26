import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const JoyKite = () => (
  <Svg>
    <polygon points="32,8 48,30 32,54 16,30" fill={YELLOW} />
    <line x1="32" y1="8" x2="32" y2="54" />
    <line x1="16" y1="30" x2="48" y2="30" />
    <polygon points="28,46 36,46 32,52" fill={PINK} stroke="none" />
  </Svg>
);
const JoyBall = () => (
  <Svg>
    <circle cx="32" cy="32" r="22" fill={PAPER} />
    <path d="M32 10 C40 18 40 46 32 54" fill="none" stroke={PINK} />
    <path d="M12 24 C22 28 42 28 52 24" fill="none" stroke={BLUE} />
    <path d="M12 40 C22 36 42 36 52 40" fill="none" stroke={GREEN} />
  </Svg>
);
const JoyDrum = () => (
  <Svg>
    <circle cx="32" cy="30" r="18" fill={PAPER} />
    <circle cx="32" cy="30" r="12" fill="none" stroke={PINK} />
    <line x1="32" y1="48" x2="32" y2="56" />
    <path d="M24 52 C28 48 36 48 40 52" fill="none" stroke={PINK} />
  </Svg>
);
const JoyMask = () => (
  <Svg>
    <ellipse cx="32" cy="32" rx="18" ry="22" fill={PAPER} />
    <circle cx="25" cy="28" r="3" fill={INK} stroke="none" />
    <circle cx="39" cy="28" r="3" fill={INK} stroke="none" />
    <path d="M22 42 C26 46 38 46 42 42" fill="none" stroke={PINK} />
    <circle cx="18" cy="36" r="3" fill={PINK} stroke="none" />
    <circle cx="46" cy="36" r="3" fill={PINK} stroke="none" />
  </Svg>
);
const JoyFlower = () => (
  <Svg>
    <circle cx="22" cy="26" r="6" fill={PINK} stroke="none" />
    <circle cx="42" cy="26" r="6" fill={PINK} stroke="none" />
    <circle cx="25" cy="35" r="6" fill={PINK} stroke="none" />
    <circle cx="39" cy="35" r="6" fill={PINK} stroke="none" />
    <circle cx="32" cy="26" r="5" fill={ORANGE} stroke="none" />
    <line x1="32" y1="38" x2="32" y2="54" stroke={GREEN} />
    <path d="M32 48 C26 48 22 45 21 40 C27 40 31 43 32 48 Z" fill={GREEN} />
  </Svg>
);
const JoyBlocks = () => (
  <Svg>
    <rect x="12" y="38" width="18" height="14" rx="2" fill={BLUE} />
    <rect x="34" y="38" width="18" height="14" rx="2" fill={YELLOW} />
    <polygon points="32,12 46,26 46,34 18,34 18,26" fill={PINK} />
  </Svg>
);
const JoyCrayon = () => (
  <Svg>
    <rect x="14" y="30" width="36" height="22" rx="4" fill={BLUE} />
    <line x1="24" y1="30" x2="22" y2="14" stroke={PINK} strokeWidth={5} />
    <line x1="32" y1="30" x2="32" y2="12" stroke={YELLOW} strokeWidth={5} />
    <line x1="40" y1="30" x2="42" y2="14" stroke={GREEN} strokeWidth={5} />
  </Svg>
);
const JoySlide = () => (
  <Svg>
    <line x1="18" y1="10" x2="18" y2="52" strokeWidth={5} />
    <line x1="18" y1="16" x2="30" y2="16" />
    <path d="M30 16 C40 22 44 32 44 44 C44 48 48 48 50 46" fill="none" stroke={YELLOW} strokeWidth={6} />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'joy-kite': JoyKite,
  'joy-ball': JoyBall,
  'joy-drum': JoyDrum,
  'joy-mask': JoyMask,
  'joy-flower': JoyFlower,
  'joy-blocks': JoyBlocks,
  'joy-crayon': JoyCrayon,
  'joy-slide': JoySlide,
};
