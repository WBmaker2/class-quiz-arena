export type ProblemKind = 'choice' | 'ox' | 'short';

export type CardStyle = 'color' | 'illust';

/** 과목 기본 카드 테마. 새로 만들 때 자동 지정 (기본 6개와 같은 색). */
export function subjectTheme(subject: string): { bg: string; emoji: string } {
  switch (subject) {
    case '수학':
      return { bg: '#E3F2FD', emoji: '➗' };
    case '국어':
      return { bg: '#FCE4EC', emoji: '📖' };
    case '사회':
      return { bg: '#E8F5E9', emoji: '🗺️' };
    case '과학':
      return { bg: '#E1F5FE', emoji: '💧' };
    case '영어':
      return { bg: '#FFF3E0', emoji: '🔤' };
    default:
      return { bg: '#E8ECF3', emoji: '🎲' };
  }
}

export interface Arena {
  id: string;
  title: string;
  desc: string;
  subject: string;
  locked: boolean;
  grade?: number;
  /** 학년군 표시용 ('1-2' | '3-4' | '5-6'). 없으면 grade에서 계산. */
  gradeBand?: string;
  topic?: string;
  standards?: string[];
  cardTheme?: { bg: string; emoji: string };
  status?: 'draft' | 'published';
  questionCount?: number;
  /** true면 학생에게 상대 이름·아바타 공개. 없으면 비공개로 간주. */
  showPlayers?: boolean;
  /** true면 대결 화면에 읽어주기 버튼 표시. 없으면 off. */
  ttsEnabled?: boolean;
  /** 카드 그래픽 종류. 없으면 'color'. */
  cardStyle?: CardStyle;
  /** illust 스타일일 때 쓰는 그림 ID. */
  illustId?: string;
}

export interface Problem {
  id: string;
  /** 옛 자료처럼 kind가 없으면 'choice'로 본다. */
  kind?: ProblemKind;
  text: string;
  /** choice 4개, ox는 ["O","X"], short는 비어 있음. */
  options: string[];
  answerIndex: number;
  /** short 정답 (30자 이내). */
  answerText?: string;
  roundTimeSec: number;
}

/** 학년 → 학년군. curriculum2022와 같은 규칙 (번들 분리용 로컬 복사). */
function bandOfGrade(grade: number): string {
  if (grade <= 2) return '1-2';
  if (grade <= 4) return '3-4';
  return '5-6';
}

/** 카드 뱃지용 학년 표시. 밴드가 있으면 '3-4학년', 없으면 기존 숫자로 계산. */
export function gradeLabel(a: { grade?: number; gradeBand?: string }): string {
  const band = a.gradeBand ?? (a.grade != null ? bandOfGrade(a.grade) : null);
  if (band) return `${band}학년`;
  return '';
}

/** 학생에게 보여줄 아레나인지. locked가 공개 여부의 기준이고,
 * draft는 잠금이 풀려 있어도 숨긴다 (옛 자료는 status가 없어 보임). */
export function isVisibleArena(a: Arena): boolean {
  if (a.locked) return false;
  if (a.status === 'draft') return false;
  return true;
}
