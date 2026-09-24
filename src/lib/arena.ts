export type ProblemKind = 'choice' | 'ox' | 'short';

export interface Arena {
  id: string;
  title: string;
  desc: string;
  subject: string;
  locked: boolean;
  grade?: number;
  topic?: string;
  standards?: string[];
  cardTheme?: { bg: string; emoji: string };
  status?: 'draft' | 'published';
  /** true면 학생에게 상대 이름·아바타 공개. 없으면 비공개로 간주. */
  showPlayers?: boolean;
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

/** 학생에게 보여줄 아레나인지. locked가 공개 여부의 기준이고,
 * draft는 잠금이 풀려 있어도 숨긴다 (옛 자료는 status가 없어 보임). */
export function isVisibleArena(a: Arena): boolean {
  if (a.locked) return false;
  if (a.status === 'draft') return false;
  return true;
}
