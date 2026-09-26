import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, PAPER, PINK, YELLOW } from './shared';

const MathPlus = () => (
  <Svg>
    <rect x="26" y="10" width="12" height="44" rx="3" fill={BLUE} />
    <rect x="10" y="26" width="44" height="12" rx="3" fill={YELLOW} />
  </Svg>
);
const MathRuler = () => (
  <Svg>
    <g transform="rotate(-20 32 32)">
      <rect x="10" y="24" width="44" height="16" rx="3" fill={YELLOW} />
      <line x1="18" y1="24" x2="18" y2="30" />
      <line x1="26" y1="24" x2="26" y2="30" />
      <line x1="34" y1="24" x2="34" y2="30" />
      <line x1="42" y1="24" x2="42" y2="30" />
    </g>
  </Svg>
);
const MathPizza = () => (
  <Svg>
    <circle cx="30" cy="34" r="22" fill={YELLOW} />
    <line x1="30" y1="34" x2="30" y2="12" />
    <line x1="30" y1="34" x2="49" y2="45" />
    <line x1="30" y1="34" x2="11" y2="45" />
    <circle cx="23" cy="27" r="2.5" fill={PINK} stroke="none" />
    <circle cx="37" cy="27" r="2.5" fill={PINK} stroke="none" />
    <circle cx="30" cy="42" r="2.5" fill={PINK} stroke="none" />
  </Svg>
);
const MathCalc = () => (
  <Svg>
    <rect x="16" y="8" width="32" height="48" rx="6" fill={BLUE} />
    <rect x="22" y="14" width="20" height="10" rx="2" fill={PAPER} />
    <circle cx="24" cy="33" r="2.4" fill={PAPER} stroke="none" />
    <circle cx="32" cy="33" r="2.4" fill={PAPER} stroke="none" />
    <circle cx="40" cy="33" r="2.4" fill={PAPER} stroke="none" />
    <circle cx="24" cy="42" r="2.4" fill={PAPER} stroke="none" />
    <circle cx="32" cy="42" r="2.4" fill={PAPER} stroke="none" />
    <circle cx="40" cy="42" r="2.4" fill={PAPER} stroke="none" />
  </Svg>
);
const MathClock = () => (
  <Svg>
    <circle cx="32" cy="32" r="22" fill={PAPER} />
    <line x1="32" y1="32" x2="32" y2="16" />
    <line x1="32" y1="32" x2="43" y2="37" />
    <circle cx="32" cy="32" r="2.5" fill={INK} />
  </Svg>
);
const MathShapes = () => (
  <Svg>
    <polygon points="20,50 38,14 52,50" fill={GREEN} />
    <rect x="10" y="34" width="20" height="20" rx="2" fill={PINK} />
  </Svg>
);
const MathScale = () => (
  <Svg>
    <rect x="14" y="48" width="36" height="8" rx="3" fill={BLUE} />
    <line x1="32" y1="48" x2="32" y2="30" />
    <ellipse cx="32" cy="26" rx="16" ry="5" fill={YELLOW} />
    <circle cx="32" cy="40" r="7" fill={PAPER} />
    <line x1="32" y1="40" x2="36" y2="36" />
  </Svg>
);
const MathDice = () => (
  <Svg>
    <rect x="12" y="12" width="40" height="40" rx="9" fill={PAPER} />
    <circle cx="22" cy="22" r="3" fill={PINK} stroke="none" />
    <circle cx="42" cy="22" r="3" fill={PINK} stroke="none" />
    <circle cx="32" cy="32" r="3" fill={INK} stroke="none" />
    <circle cx="22" cy="42" r="3" fill={PINK} stroke="none" />
    <circle cx="42" cy="42" r="3" fill={PINK} stroke="none" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'math-plus': MathPlus,
  'math-ruler': MathRuler,
  'math-pizza': MathPizza,
  'math-calc': MathCalc,
  'math-clock': MathClock,
  'math-shapes': MathShapes,
  'math-scale': MathScale,
  'math-dice': MathDice,
};
