import type { JSX } from 'react';
import { Svg, BLUE, GREEN, INK, ORANGE, PAPER, PINK, YELLOW } from './shared';

const ArtPalette = () => (
  <Svg>
    <path d="M32 10 C18 10 10 20 10 32 C10 44 18 54 30 54 C34 54 36 51 34 48 C32 45 34 42 38 42 L44 42 C50 42 54 37 54 30 C54 18 46 10 32 10 Z" fill={PAPER} />
    <circle cx="22" cy="24" r="3" fill={PINK} stroke="none" />
    <circle cx="32" cy="20" r="3" fill={BLUE} stroke="none" />
    <circle cx="42" cy="24" r="3" fill={YELLOW} stroke="none" />
    <circle cx="20" cy="36" r="3" fill={GREEN} stroke="none" />
  </Svg>
);
const ArtCrayon = () => (
  <Svg>
    <g transform="rotate(-30 32 32)">
      <rect x="24" y="14" width="16" height="28" rx="2" fill={GREEN} />
      <polygon points="24,42 40,42 32,56" fill={PAPER} />
      <polygon points="29.5,49 34.5,49 32,56" fill={INK} />
      <line x1="24" y1="22" x2="40" y2="22" />
      <line x1="24" y1="28" x2="40" y2="28" />
    </g>
  </Svg>
);
const ArtFrame = () => (
  <Svg>
    <rect x="10" y="14" width="44" height="36" rx="3" fill={YELLOW} />
    <rect x="17" y="21" width="30" height="22" fill={PAPER} />
    <circle cx="26" cy="30" r="4" fill={PINK} stroke="none" />
    <polygon points="17,43 28,33 35,39 41,34 47,43" fill={GREEN} stroke="none" />
  </Svg>
);
const ArtScissors = () => (
  <Svg>
    <line x1="14" y1="50" x2="44" y2="20" />
    <line x1="14" y1="14" x2="44" y2="44" />
    <circle cx="12" cy="50" r="5" fill="none" />
    <circle cx="12" cy="14" r="5" fill="none" />
  </Svg>
);
const ArtPot = () => (
  <Svg>
    <path d="M20 20 L44 20 L42 48 C42 52 22 52 22 48 Z" fill={BLUE} />
    <ellipse cx="32" cy="20" rx="12" ry="4" fill={PAPER} />
    <path d="M24 30 C28 28 36 28 40 30 M24 37 C28 35 36 35 40 37" fill="none" stroke={PAPER} />
  </Svg>
);
const ArtCamera = () => (
  <Svg>
    <rect x="10" y="22" width="44" height="26" rx="6" fill={INK} />
    <circle cx="32" cy="35" r="9" fill={BLUE} />
    <circle cx="32" cy="35" r="4" fill={PAPER} />
    <rect x="24" y="14" width="12" height="8" rx="2" fill={INK} />
    <circle cx="47" cy="29" r="2" fill={YELLOW} stroke="none" />
  </Svg>
);
const ArtRainbow = () => (
  <Svg>
    <path d="M10 46 C10 26 22 12 32 12 C42 12 54 26 54 46" fill="none" stroke={PINK} strokeWidth={5} />
    <path d="M18 46 C18 31 25 20 32 20 C39 20 46 31 46 46" fill="none" stroke={YELLOW} strokeWidth={5} />
    <path d="M26 46 C26 36 28 28 32 28 C36 28 38 36 38 46" fill="none" stroke={BLUE} strokeWidth={5} />
  </Svg>
);
const ArtStamp = () => (
  <Svg>
    <rect x="22" y="8" width="20" height="14" rx="4" fill={ORANGE} />
    <line x1="32" y1="22" x2="32" y2="34" strokeWidth={5} />
    <rect x="16" y="34" width="32" height="12" rx="3" fill={PINK} />
    <polygon points="24,52 28,48 32,52 36,48 40,52" fill={INK} stroke="none" />
  </Svg>
);


export const ART: Record<string, () => JSX.Element> = {
  'art-palette': ArtPalette,
  'art-crayon': ArtCrayon,
  'art-frame': ArtFrame,
  'art-scissors': ArtScissors,
  'art-pot': ArtPot,
  'art-camera': ArtCamera,
  'art-rainbow': ArtRainbow,
  'art-stamp': ArtStamp,
};
