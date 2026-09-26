import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';

export type IllustSubject = '수학' | '국어' | '사회' | '과학' | '영어' | '도덕' | '체육' | '음악' | '미술' | '실과' | '바른 생활' | '슬기로운 생활' | '즐거운 생활';
export interface IllustMeta { id: string; subject: IllustSubject; label: string }
type ArtViewProps = { id: string };
type ArtRegistry = Record<string, ComponentType>;
function lazyArt(load: () => Promise<{ ART: ArtRegistry }>): LazyExoticComponent<ComponentType<ArtViewProps>> {
  return lazy(async () => {
    const { ART } = await load();
    return { default: function ArtView({ id }: ArtViewProps) { const Art = ART[id]; return Art ? <Art /> : null; } };
  });
}
const ART_BY_GROUP: Record<string, LazyExoticComponent<ComponentType<ArtViewProps>>> = {
  math: lazyArt(() => import('./illustrations/math')), kor: lazyArt(() => import('./illustrations/kor')),
  soc: lazyArt(() => import('./illustrations/soc')), sci: lazyArt(() => import('./illustrations/sci')),
  eng: lazyArt(() => import('./illustrations/eng')), mor: lazyArt(() => import('./illustrations/mor')),
  phy: lazyArt(() => import('./illustrations/phy')), mus: lazyArt(() => import('./illustrations/mus')),
  art: lazyArt(() => import('./illustrations/art')), pra: lazyArt(() => import('./illustrations/pra')),
  bar: lazyArt(() => import('./illustrations/bar')), slu: lazyArt(() => import('./illustrations/slu')),
  joy: lazyArt(() => import('./illustrations/joy')),
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


export function illustsOf(subject: string): IllustMeta[] { return ILLUSTS.filter((m) => m.subject === subject); }
function FallbackMark() { return <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true"><path d="M32 14v36M14 32h36" stroke="#2545a0" strokeWidth="7" strokeLinecap="round" /></svg>; }
/** 선택한 과목의 그림 묶음만 필요한 순간에 내려받습니다. */
export function Illust({ id, size }: { id?: string; size?: number }) {
  const selectedId = id && ILLUSTS.some((item) => item.id === id) ? id : 'math-plus';
  const GroupArt = ART_BY_GROUP[selectedId.split('-')[0]] ?? ART_BY_GROUP.math;
  return <span style={{ display: 'inline-block', width: size ?? 72, height: size ?? 72 }} aria-hidden="true"><Suspense fallback={<FallbackMark />}><GroupArt id={selectedId} /></Suspense></span>;
}
