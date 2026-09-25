// 자체 일러스트 104종. 과목별 8종씩, 전부 직접 그린 납작 스타일.
// 카드 배경 위에 얹는 용도라 배경 없이 motif만. 원본 에셋 아님.
import type { JSX } from 'react';

export type IllustSubject =
  | '수학'
  | '국어'
  | '사회'
  | '과학'
  | '영어'
  | '도덕'
  | '체육'
  | '음악'
  | '미술'
  | '실과'
  | '바른 생활'
  | '슬기로운 생활'
  | '즐거운 생활';

export interface IllustMeta {
  id: string;
  subject: IllustSubject;
  label: string;
}

const INK = '#26211a';
const BLUE = '#7FB3E8';
const YELLOW = '#FFD94D';
const PINK = '#F5A8C0';
const GREEN = '#8FD694';
const ORANGE = '#F5A96B';
const PAPER = '#FFFDF6';

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      role="img"
      aria-hidden="true"
      stroke={INK}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/* ---------------- 수학 ---------------- */
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

/* ---------------- 국어 ---------------- */
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

/* ---------------- 사회 ---------------- */
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

/* ---------------- 과학 ---------------- */
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

/* ---------------- 영어 ---------------- */
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

/* ---------------- 기존 5과목 추가분 (각 2종) ---------------- */
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

/* ---------------- 도덕 (자기·배려·공정·생태) ---------------- */
const MorHeart = () => (
  <Svg>
    <path d="M32 52 C18 42 10 34 10 24 C10 16 16 12 22 12 C27 12 31 16 32 20 C33 16 37 12 42 12 C48 12 54 16 54 24 C54 34 46 42 32 52 Z" fill={PINK} />
  </Svg>
);
const MorHands = () => (
  <Svg>
    <rect x="6" y="22" width="20" height="14" rx="7" fill={BLUE} />
    <rect x="38" y="22" width="20" height="14" rx="7" fill={GREEN} />
    <circle cx="32" cy="29" r="9" fill={PAPER} />
    <path d="M28 29 C29 32 31 32 32 29 C33 32 35 32 36 29" fill="none" strokeWidth={2} />
  </Svg>
);
const MorBalance = () => (
  <Svg>
    <line x1="32" y1="10" x2="32" y2="54" />
    <line x1="12" y1="16" x2="52" y2="16" />
    <line x1="14" y1="16" x2="10" y2="32" />
    <line x1="14" y1="16" x2="18" y2="32" />
    <path d="M6 32 L18 32 L16 37 L8 37 Z" fill={YELLOW} />
    <line x1="50" y1="16" x2="46" y2="32" />
    <line x1="50" y1="16" x2="54" y2="32" />
    <path d="M42 32 L54 32 L52 37 L44 37 Z" fill={YELLOW} />
    <rect x="24" y="50" width="16" height="6" rx="3" fill={INK} />
  </Svg>
);
const MorSprout = () => (
  <Svg>
    <circle cx="32" cy="38" r="16" fill={BLUE} />
    <path d="M20 38 C26 34 38 34 44 38" fill="none" stroke={PAPER} />
    <line x1="32" y1="22" x2="32" y2="12" stroke={GREEN} />
    <path d="M32 16 C24 16 20 12 18 6 C26 6 31 9 32 16 Z" fill={GREEN} />
    <path d="M32 16 C40 16 44 12 46 6 C38 6 33 9 32 16 Z" fill={GREEN} />
  </Svg>
);
const MorLamp = () => (
  <Svg>
    <rect x="24" y="24" width="16" height="22" rx="6" fill={YELLOW} />
    <line x1="32" y1="24" x2="32" y2="16" />
    <circle cx="32" cy="33" r="4" fill={ORANGE} stroke="none" />
    <path d="M14 14 L18 18 M50 14 L46 18 M32 6 L32 10" fill="none" />
    <rect x="20" y="46" width="24" height="6" rx="3" fill={INK} />
  </Svg>
);
const MorFamily = () => (
  <Svg>
    <polygon points="8,28 32,10 56,28" fill={ORANGE} />
    <rect x="16" y="28" width="32" height="22" rx="2" fill={PAPER} />
    <path d="M32 44 C25 39 22 36 22 32 C22 29 24 27 27 27 C29 27 31 28 32 30 C33 28 35 27 37 27 C40 27 42 29 42 32 C42 36 39 39 32 44 Z" fill={PINK} />
  </Svg>
);
const MorBadge = () => (
  <Svg>
    <path d="M32 8 L48 14 L48 30 C48 42 40 50 32 54 C24 50 16 42 16 30 L16 14 Z" fill={BLUE} />
    <polyline points="24,30 30,36 41,23" fill="none" stroke={PAPER} />
  </Svg>
);
const MorGift = () => (
  <Svg>
    <rect x="12" y="26" width="40" height="24" rx="3" fill={GREEN} />
    <rect x="28" y="26" width="8" height="24" fill={PAPER} />
    <rect x="10" y="18" width="44" height="10" rx="3" fill={GREEN} />
    <circle cx="25" cy="12" r="6" fill="none" />
    <circle cx="39" cy="12" r="6" fill="none" />
  </Svg>
);

/* ---------------- 체육 (건강·움직임·스포츠·표현) ---------------- */
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

/* ---------------- 음악 (노래·악기·듣기·만들기) ---------------- */
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

/* ---------------- 미술 (탐색·표현·감상) ---------------- */
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

/* ---------------- 실과 (가정·자원·기술·디지털) ---------------- */
const PraPot = () => (
  <Svg>
    <rect x="14" y="24" width="36" height="22" rx="6" fill={GREEN} />
    <line x1="10" y1="28" x2="14" y2="28" />
    <line x1="50" y1="28" x2="54" y2="28" />
    <path d="M22 16 C24 20 28 20 30 16 C32 20 36 20 38 16" fill="none" />
    <rect x="18" y="46" width="28" height="6" rx="3" fill={INK} />
  </Svg>
);
const PraNeedle = () => (
  <Svg>
    <line x1="12" y1="48" x2="48" y2="14" />
    <ellipse cx="48" cy="14" rx="4" ry="2.5" fill="none" />
    <path d="M14 22 C22 22 26 30 34 30 C40 30 42 24 46 26" fill="none" stroke={PINK} />
    <rect x="10" y="32" width="14" height="18" rx="3" fill={BLUE} />
    <line x1="14" y1="38" x2="20" y2="38" stroke={PAPER} />
    <line x1="14" y1="43" x2="20" y2="43" stroke={PAPER} />
  </Svg>
);
const PraHammer = () => (
  <Svg>
    <g transform="rotate(-25 32 32)">
      <rect x="28" y="22" width="8" height="30" rx="4" fill={ORANGE} />
      <rect x="16" y="10" width="32" height="14" rx="5" fill={BLUE} />
    </g>
  </Svg>
);
const PraRobot = () => (
  <Svg>
    <rect x="18" y="20" width="28" height="24" rx="6" fill={BLUE} />
    <circle cx="26" cy="31" r="3" fill={PAPER} stroke="none" />
    <circle cx="38" cy="31" r="3" fill={PAPER} stroke="none" />
    <line x1="27" y1="38" x2="37" y2="38" stroke={PAPER} />
    <line x1="32" y1="20" x2="32" y2="10" />
    <circle cx="32" cy="9" r="3" fill={PINK} />
    <rect x="22" y="44" width="6" height="10" rx="3" fill={INK} />
    <rect x="36" y="44" width="6" height="10" rx="3" fill={INK} />
  </Svg>
);
const PraPlug = () => (
  <Svg>
    <rect x="22" y="26" width="20" height="22" rx="5" fill={YELLOW} />
    <line x1="27" y1="26" x2="27" y2="12" strokeWidth={4} />
    <line x1="37" y1="26" x2="37" y2="12" strokeWidth={4} />
    <path d="M32 48 L32 56" />
  </Svg>
);
const PraRecycle = () => (
  <Svg>
    <rect x="18" y="26" width="28" height="22" rx="3" fill={GREEN} />
    <path d="M25 38 C25 33 29 31 32 33 C35 31 39 33 39 38" fill="none" stroke={PAPER} />
    <polygon points="39,34 41,39 36,39" fill={PAPER} stroke="none" />
    <polygon points="25,34 23,39 28,39" fill={PAPER} stroke="none" />
  </Svg>
);
const PraSprout = () => (
  <Svg>
    <polygon points="20,34 44,34 40,54 24,54" fill={ORANGE} />
    <line x1="32" y1="34" x2="32" y2="22" stroke={GREEN} />
    <path d="M32 26 C24 26 20 22 18 14 C26 14 31 18 32 26 Z" fill={GREEN} />
    <path d="M32 26 C40 26 44 22 46 14 C38 14 33 18 32 26 Z" fill={GREEN} />
  </Svg>
);
const PraPig = () => (
  <Svg>
    <ellipse cx="32" cy="36" rx="20" ry="14" fill={PINK} />
    <circle cx="46" cy="30" r="7" fill={PINK} />
    <circle cx="46" cy="30" r="2" fill={INK} stroke="none" />
    <line x1="28" y1="22" x2="28" y2="28" />
    <line x1="30" y1="24" x2="34" y2="24" />
    <circle cx="20" cy="33" r="2" fill={INK} stroke="none" />
    <rect x="24" y="48" width="6" height="6" fill={INK} />
    <rect x="36" y="48" width="6" height="6" fill={INK} />
  </Svg>
);

/* ---------------- 바른 생활 (습관·안전·공동체) ---------------- */
const BarTooth = () => (
  <Svg>
    <rect x="8" y="40" width="30" height="8" rx="4" fill={BLUE} />
    <rect x="38" y="36" width="12" height="14" rx="3" fill={PAPER} />
    <line x1="41" y1="36" x2="41" y2="30" />
    <line x1="45" y1="36" x2="45" y2="30" />
    <line x1="49" y1="36" x2="49" y2="30" />
    <path d="M16 16 C16 12 22 12 24 16 C26 12 32 12 32 16 C32 22 24 28 24 28 C24 28 16 22 16 16 Z" fill={PAPER} />
  </Svg>
);
const BarLight = () => (
  <Svg>
    <rect x="20" y="8" width="24" height="40" rx="8" fill={INK} />
    <circle cx="32" cy="18" r="5" fill={PINK} stroke="none" />
    <circle cx="32" cy="30" r="5" fill={YELLOW} stroke="none" />
    <circle cx="32" cy="41" r="5" fill={GREEN} stroke="none" />
    <line x1="32" y1="48" x2="32" y2="56" />
  </Svg>
);
const BarTaegeuk = () => (
  <Svg>
    <line x1="18" y1="8" x2="18" y2="56" />
    <path d="M18 10 C28 6 36 14 48 10 L48 34 C36 38 28 30 18 34 Z" fill={PAPER} />
    <circle cx="33" cy="22" r="6" fill={PINK} />
    <path d="M33 16 C37 18 37 24 33 26 C29 28 27 24 29 21 C30 19 32 19 33 21" fill={BLUE} stroke="none" />
  </Svg>
);
const BarClock = () => (
  <Svg>
    <circle cx="32" cy="36" r="18" fill={PAPER} />
    <line x1="32" y1="36" x2="32" y2="24" />
    <line x1="32" y1="36" x2="40" y2="40" />
    <line x1="18" y1="22" x2="12" y2="14" />
    <line x1="46" y1="22" x2="52" y2="14" />
    <line x1="26" y1="52" x2="24" y2="56" />
    <line x1="38" y1="52" x2="40" y2="56" />
  </Svg>
);
const BarHandheart = () => (
  <Svg>
    <path d="M32 46 C22 39 17 34 17 27 C17 22 20 19 24 19 C27 19 30 21 32 24 C34 21 37 19 40 19 C44 19 47 22 47 27 C47 34 42 39 32 46 Z" fill={PINK} />
    <path d="M10 30 C14 28 18 30 20 34" fill="none" />
    <path d="M54 30 C50 28 46 30 44 34" fill="none" />
  </Svg>
);
const BarBin = () => (
  <Svg>
    <polygon points="18,20 46,20 42,54 22,54" fill={GREEN} />
    <rect x="14" y="14" width="36" height="7" rx="3" fill={INK} />
    <path d="M27 28 L27 46 M32 28 L32 46 M37 28 L37 46" stroke={PAPER} />
  </Svg>
);
const BarBag = () => (
  <Svg>
    <rect x="14" y="20" width="36" height="30" rx="8" fill={YELLOW} />
    <rect x="22" y="30" width="20" height="12" rx="4" fill={PAPER} />
    <path d="M24 20 C24 12 40 12 40 20" fill="none" />
  </Svg>
);
const BarUmbrella = () => (
  <Svg>
    <path d="M10 34 C10 22 20 12 32 12 C44 12 54 22 54 34 C48 30 42 30 38 34 C34 30 28 30 24 34 C20 30 14 30 10 34 Z" fill={BLUE} />
    <line x1="32" y1="12" x2="32" y2="50" />
    <path d="M32 50 C32 54 28 55 26 53" fill="none" />
  </Svg>
);

/* ---------------- 슬기로운 생활 (탐색·마을·세계) ---------------- */
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

/* ---------------- 즐거운 생활 (놀이·몸·예술·상상) ---------------- */
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

const ART: Record<string, () => JSX.Element> = {
  'math-plus': MathPlus,
  'math-ruler': MathRuler,
  'math-pizza': MathPizza,
  'math-calc': MathCalc,
  'math-clock': MathClock,
  'math-shapes': MathShapes,
  'math-scale': MathScale,
  'math-dice': MathDice,
  'kor-book': KorBook,
  'kor-pencil': KorPencil,
  'kor-chat': KorChat,
  'kor-letter': KorLetter,
  'kor-scroll': KorScroll,
  'kor-brush': KorBrush,
  'kor-mic': KorMic,
  'kor-lens': KorLens,
  'soc-map': SocMap,
  'soc-compass': SocCompass,
  'soc-globe': SocGlobe,
  'soc-flag': SocFlag,
  'soc-house': SocHouse,
  'soc-train': SocTrain,
  'soc-jar': SocJar,
  'soc-coin': SocCoin,
  'sci-flask': SciFlask,
  'sci-star': SciStar,
  'sci-drop': SciDrop,
  'sci-leaf': SciLeaf,
  'sci-magnet': SciMagnet,
  'sci-rocket': SciRocket,
  'sci-scope': SciScope,
  'sci-cloud': SciCloud,
  'eng-abc': EngAbc,
  'eng-cap': EngCap,
  'eng-mic': EngMic,
  'eng-phones': EngPhones,
  'eng-bus': EngBus,
  'eng-balloon': EngBalloon,
  'eng-book': EngBook,
  'eng-pen': EngPen,
  'mor-heart': MorHeart,
  'mor-hands': MorHands,
  'mor-balance': MorBalance,
  'mor-sprout': MorSprout,
  'mor-lamp': MorLamp,
  'mor-family': MorFamily,
  'mor-badge': MorBadge,
  'mor-gift': MorGift,
  'phy-ball': PhyBall,
  'phy-rope': PhyRope,
  'phy-shoe': PhyShoe,
  'phy-whistle': PhyWhistle,
  'phy-medal': PhyMedal,
  'phy-mat': PhyMat,
  'phy-cone': PhyCone,
  'phy-ribbon': PhyRibbon,
  'mus-note': MusNote,
  'mus-drum': MusDrum,
  'mus-flute': MusFlute,
  'mus-keys': MusKeys,
  'mus-bell': MusBell,
  'mus-speaker': MusSpeaker,
  'mus-song': MusSong,
  'mus-janggu': MusJanggu,
  'art-palette': ArtPalette,
  'art-crayon': ArtCrayon,
  'art-frame': ArtFrame,
  'art-scissors': ArtScissors,
  'art-pot': ArtPot,
  'art-camera': ArtCamera,
  'art-rainbow': ArtRainbow,
  'art-stamp': ArtStamp,
  'pra-pot': PraPot,
  'pra-needle': PraNeedle,
  'pra-hammer': PraHammer,
  'pra-robot': PraRobot,
  'pra-plug': PraPlug,
  'pra-recycle': PraRecycle,
  'pra-sprout': PraSprout,
  'pra-pig': PraPig,
  'bar-tooth': BarTooth,
  'bar-light': BarLight,
  'bar-taegeuk': BarTaegeuk,
  'bar-clock': BarClock,
  'bar-handheart': BarHandheart,
  'bar-bin': BarBin,
  'bar-bag': BarBag,
  'bar-umbrella': BarUmbrella,
  'slu-school': SluSchool,
  'slu-map': SluMap,
  'slu-hanok': SluHanok,
  'slu-globe': SluGlobe,
  'slu-leafcal': SluLeafcal,
  'slu-tool': SluTool,
  'slu-bulb': SluBulb,
  'slu-seed': SluSeed,
  'joy-kite': JoyKite,
  'joy-ball': JoyBall,
  'joy-drum': JoyDrum,
  'joy-mask': JoyMask,
  'joy-flower': JoyFlower,
  'joy-blocks': JoyBlocks,
  'joy-crayon': JoyCrayon,
  'joy-slide': JoySlide,
};

export const ILLUSTS: IllustMeta[] = [
  { id: 'math-plus', subject: '수학', label: '더하기' },
  { id: 'math-ruler', subject: '수학', label: '자' },
  { id: 'math-pizza', subject: '수학', label: '피자 분수' },
  { id: 'math-calc', subject: '수학', label: '계산기' },
  { id: 'math-clock', subject: '수학', label: '시계' },
  { id: 'math-shapes', subject: '수학', label: '도형' },
  { id: 'math-scale', subject: '수학', label: '저울' },
  { id: 'math-dice', subject: '수학', label: '주사위' },
  { id: 'kor-book', subject: '국어', label: '책' },
  { id: 'kor-pencil', subject: '국어', label: '연필' },
  { id: 'kor-chat', subject: '국어', label: '말풍선' },
  { id: 'kor-letter', subject: '국어', label: '편지' },
  { id: 'kor-scroll', subject: '국어', label: '두루마리' },
  { id: 'kor-brush', subject: '국어', label: '붓' },
  { id: 'kor-mic', subject: '국어', label: '발표 마이크' },
  { id: 'kor-lens', subject: '국어', label: '돋보기' },
  { id: 'soc-map', subject: '사회', label: '지도' },
  { id: 'soc-compass', subject: '사회', label: '나침반' },
  { id: 'soc-globe', subject: '사회', label: '지구본' },
  { id: 'soc-flag', subject: '사회', label: '깃발' },
  { id: 'soc-house', subject: '사회', label: '집' },
  { id: 'soc-train', subject: '사회', label: '기차' },
  { id: 'soc-jar', subject: '사회', label: '항아리 유물' },
  { id: 'soc-coin', subject: '사회', label: '동전' },
  { id: 'sci-flask', subject: '과학', label: '플라스크' },
  { id: 'sci-star', subject: '과학', label: '별' },
  { id: 'sci-drop', subject: '과학', label: '물방울' },
  { id: 'sci-leaf', subject: '과학', label: '잎' },
  { id: 'sci-magnet', subject: '과학', label: '자석' },
  { id: 'sci-rocket', subject: '과학', label: '로켓' },
  { id: 'sci-scope', subject: '과학', label: '현미경' },
  { id: 'sci-cloud', subject: '과학', label: '구름과 해' },
  { id: 'eng-abc', subject: '영어', label: 'ABC 상자' },
  { id: 'eng-cap', subject: '영어', label: '학사모' },
  { id: 'eng-mic', subject: '영어', label: '마이크' },
  { id: 'eng-phones', subject: '영어', label: '헤드폰' },
  { id: 'eng-bus', subject: '영어', label: '버스' },
  { id: 'eng-balloon', subject: '영어', label: '인사 말풍선' },
  { id: 'eng-book', subject: '영어', label: '영어 그림책' },
  { id: 'eng-pen', subject: '영어', label: '쓰기 연필' },
  { id: 'mor-heart', subject: '도덕', label: '마음 하트' },
  { id: 'mor-hands', subject: '도덕', label: '손잡기' },
  { id: 'mor-balance', subject: '도덕', label: '공정 저울' },
  { id: 'mor-sprout', subject: '도덕', label: '새싹 지구' },
  { id: 'mor-lamp', subject: '도덕', label: '등불' },
  { id: 'mor-family', subject: '도덕', label: '가족 집' },
  { id: 'mor-badge', subject: '도덕', label: '약속 방패' },
  { id: 'mor-gift', subject: '도덕', label: '나눔 상자' },
  { id: 'phy-ball', subject: '체육', label: '축구공' },
  { id: 'phy-rope', subject: '체육', label: '줄넘기' },
  { id: 'phy-shoe', subject: '체육', label: '운동화' },
  { id: 'phy-whistle', subject: '체육', label: '호각' },
  { id: 'phy-medal', subject: '체육', label: '메달' },
  { id: 'phy-mat', subject: '체육', label: '체조 매트' },
  { id: 'phy-cone', subject: '체육', label: '콘' },
  { id: 'phy-ribbon', subject: '체육', label: '리듬 리본' },
  { id: 'mus-note', subject: '음악', label: '음표' },
  { id: 'mus-drum', subject: '음악', label: '북' },
  { id: 'mus-flute', subject: '음악', label: '리코더' },
  { id: 'mus-keys', subject: '음악', label: '건반' },
  { id: 'mus-bell', subject: '음악', label: '핸드벨' },
  { id: 'mus-speaker', subject: '음악', label: '스피커' },
  { id: 'mus-song', subject: '음악', label: '노래 마이크' },
  { id: 'mus-janggu', subject: '음악', label: '장구' },
  { id: 'art-palette', subject: '미술', label: '팔레트' },
  { id: 'art-crayon', subject: '미술', label: '크레파스' },
  { id: 'art-frame', subject: '미술', label: '액자' },
  { id: 'art-scissors', subject: '미술', label: '가위' },
  { id: 'art-pot', subject: '미술', label: '도자기' },
  { id: 'art-camera', subject: '미술', label: '카메라' },
  { id: 'art-rainbow', subject: '미술', label: '무지개' },
  { id: 'art-stamp', subject: '미술', label: '판화 도장' },
  { id: 'pra-pot', subject: '실과', label: '요리 냄비' },
  { id: 'pra-needle', subject: '실과', label: '바늘과 실' },
  { id: 'pra-hammer', subject: '실과', label: '망치' },
  { id: 'pra-robot', subject: '실과', label: '로봇' },
  { id: 'pra-plug', subject: '실과', label: '플러그' },
  { id: 'pra-recycle', subject: '실과', label: '재활용' },
  { id: 'pra-sprout', subject: '실과', label: '모종 화분' },
  { id: 'pra-pig', subject: '실과', label: '저금통' },
  { id: 'bar-tooth', subject: '바른 생활', label: '칫솔' },
  { id: 'bar-light', subject: '바른 생활', label: '신호등' },
  { id: 'bar-taegeuk', subject: '바른 생활', label: '태극기' },
  { id: 'bar-clock', subject: '바른 생활', label: '알람시계' },
  { id: 'bar-handheart', subject: '바른 생활', label: '손 하트' },
  { id: 'bar-bin', subject: '바른 생활', label: '분리수거함' },
  { id: 'bar-bag', subject: '바른 생활', label: '책가방' },
  { id: 'bar-umbrella', subject: '바른 생활', label: '우산' },
  { id: 'slu-school', subject: '슬기로운 생활', label: '학교' },
  { id: 'slu-map', subject: '슬기로운 생활', label: '마을 지도' },
  { id: 'slu-hanok', subject: '슬기로운 생활', label: '한옥' },
  { id: 'slu-globe', subject: '슬기로운 생활', label: '세계 지구' },
  { id: 'slu-leafcal', subject: '슬기로운 생활', label: '잎 달력' },
  { id: 'slu-tool', subject: '슬기로운 생활', label: '공구함' },
  { id: 'slu-bulb', subject: '슬기로운 생활', label: '궁금 전구' },
  { id: 'slu-seed', subject: '슬기로운 생활', label: '씨앗' },
  { id: 'joy-kite', subject: '즐거운 생활', label: '연' },
  { id: 'joy-ball', subject: '즐거운 생활', label: '놀이공' },
  { id: 'joy-drum', subject: '즐거운 생활', label: '소고' },
  { id: 'joy-mask', subject: '즐거운 생활', label: '탈' },
  { id: 'joy-flower', subject: '즐거운 생활', label: '꽃' },
  { id: 'joy-blocks', subject: '즐거운 생활', label: '쌓기나무' },
  { id: 'joy-crayon', subject: '즐거운 생활', label: '크레파스 상자' },
  { id: 'joy-slide', subject: '즐거운 생활', label: '미끄럼틀' },
];

export function illustsOf(subject: string): IllustMeta[] {
  return ILLUSTS.filter((m) => m.subject === subject);
}

/** 없는 ID면 첫 그림으로. */
export function Illust({ id, size }: { id?: string; size?: number }) {
  const Art = (id && ART[id]) || ART['math-plus'];
  return (
    <span style={{ display: 'inline-block', width: size ?? 72, height: size ?? 72 }} aria-hidden="true">
      <Art />
    </span>
  );
}
