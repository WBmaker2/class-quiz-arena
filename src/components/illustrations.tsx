// 자체 일러스트 30종. 과목별 6종씩, 전부 직접 그린 납작 스타일.
// 카드 배경 위에 얹는 용도라 배경 없이 motif만. 원본 에셋 아님.
import type { JSX } from 'react';

export type IllustSubject = '수학' | '국어' | '사회' | '과학' | '영어';

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

const ART: Record<string, () => JSX.Element> = {
  'math-plus': MathPlus,
  'math-ruler': MathRuler,
  'math-pizza': MathPizza,
  'math-calc': MathCalc,
  'math-clock': MathClock,
  'math-shapes': MathShapes,
  'kor-book': KorBook,
  'kor-pencil': KorPencil,
  'kor-chat': KorChat,
  'kor-letter': KorLetter,
  'kor-scroll': KorScroll,
  'kor-brush': KorBrush,
  'soc-map': SocMap,
  'soc-compass': SocCompass,
  'soc-globe': SocGlobe,
  'soc-flag': SocFlag,
  'soc-house': SocHouse,
  'soc-train': SocTrain,
  'sci-flask': SciFlask,
  'sci-star': SciStar,
  'sci-drop': SciDrop,
  'sci-leaf': SciLeaf,
  'sci-magnet': SciMagnet,
  'sci-rocket': SciRocket,
  'eng-abc': EngAbc,
  'eng-cap': EngCap,
  'eng-mic': EngMic,
  'eng-phones': EngPhones,
  'eng-bus': EngBus,
  'eng-balloon': EngBalloon,
};

export const ILLUSTS: IllustMeta[] = [
  { id: 'math-plus', subject: '수학', label: '더하기' },
  { id: 'math-ruler', subject: '수학', label: '자' },
  { id: 'math-pizza', subject: '수학', label: '피자 분수' },
  { id: 'math-calc', subject: '수학', label: '계산기' },
  { id: 'math-clock', subject: '수학', label: '시계' },
  { id: 'math-shapes', subject: '수학', label: '도형' },
  { id: 'kor-book', subject: '국어', label: '책' },
  { id: 'kor-pencil', subject: '국어', label: '연필' },
  { id: 'kor-chat', subject: '국어', label: '말풍선' },
  { id: 'kor-letter', subject: '국어', label: '편지' },
  { id: 'kor-scroll', subject: '국어', label: '두루마리' },
  { id: 'kor-brush', subject: '국어', label: '붓' },
  { id: 'soc-map', subject: '사회', label: '지도' },
  { id: 'soc-compass', subject: '사회', label: '나침반' },
  { id: 'soc-globe', subject: '사회', label: '지구본' },
  { id: 'soc-flag', subject: '사회', label: '깃발' },
  { id: 'soc-house', subject: '사회', label: '집' },
  { id: 'soc-train', subject: '사회', label: '기차' },
  { id: 'sci-flask', subject: '과학', label: '플라스크' },
  { id: 'sci-star', subject: '과학', label: '별' },
  { id: 'sci-drop', subject: '과학', label: '물방울' },
  { id: 'sci-leaf', subject: '과학', label: '잎' },
  { id: 'sci-magnet', subject: '과학', label: '자석' },
  { id: 'sci-rocket', subject: '과학', label: '로켓' },
  { id: 'eng-abc', subject: '영어', label: 'ABC 상자' },
  { id: 'eng-cap', subject: '영어', label: '학사모' },
  { id: 'eng-mic', subject: '영어', label: '마이크' },
  { id: 'eng-phones', subject: '영어', label: '헤드폰' },
  { id: 'eng-bus', subject: '영어', label: '버스' },
  { id: 'eng-balloon', subject: '영어', label: '인사 말풍선' },
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
