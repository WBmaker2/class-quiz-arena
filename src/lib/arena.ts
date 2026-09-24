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
}

export interface Problem {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  roundTimeSec: number;
}

/** 학생에게 보여줄 아레나인지. locked가 공개 여부의 기준이고,
 * draft는 잠금이 풀려 있어도 숨긴다 (옛 자료는 status가 없어 보임). */
export function isVisibleArena(a: Arena): boolean {
  if (a.locked) return false;
  if (a.status === 'draft') return false;
  return true;
}
