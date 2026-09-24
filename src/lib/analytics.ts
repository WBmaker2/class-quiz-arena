export interface RoundRecord {
  roomId: string;
  arenaId: string;
  problemIndex: number;
  answers: { uid: string; correct: boolean }[];
  standardCode?: string;
}

export interface ProblemStat {
  problemIndex: number;
  asked: number;
  correct: number;
}

export function problemStats(rounds: RoundRecord[]): ProblemStat[] {
  const map = new Map<number, { asked: number; correct: number }>();
  for (const r of rounds) {
    const cur = map.get(r.problemIndex) ?? { asked: 0, correct: 0 };
    cur.asked += 1;
    cur.correct += r.answers.filter((a) => a.correct).length;
    map.set(r.problemIndex, cur);
  }
  return [...map.entries()]
    .map(([problemIndex, v]) => ({ problemIndex, asked: v.asked, correct: v.correct }))
    .sort((a, b) => a.problemIndex - b.problemIndex);
}

export function hardProblems(stats: ProblemStat[], count: number): ProblemStat[] {
  return [...stats]
    .filter((s) => s.asked > 0)
    .sort((a, b) => a.correct / a.asked - b.correct / b.asked)
    .slice(0, count);
}

export function avgCorrectVsWrong(rounds: RoundRecord[]): { avgCorrect: number; avgWrong: number } {
  if (rounds.length === 0) return { avgCorrect: 0, avgWrong: 0 };
  let correct = 0;
  let total = 0;
  for (const r of rounds) {
    total += r.answers.length;
    correct += r.answers.filter((a) => a.correct).length;
  }
  return { avgCorrect: correct / rounds.length, avgWrong: (total - correct) / rounds.length };
}

export function activeStudents(rounds: RoundRecord[], minRounds: number): string[] {
  const count = new Map<string, number>();
  for (const r of rounds) {
    for (const a of r.answers) {
      count.set(a.uid, (count.get(a.uid) ?? 0) + 1);
    }
  }
  return [...count.entries()].filter(([, c]) => c >= minRounds).map(([uid]) => uid);
}

export interface StandardStat {
  code: string;
  asked: number;
  correct: number;
  rate: number;
}

/** 성취기준별 정답률 → 낮은 순. 기준 없는 라운드는 제외. */
export function weakStandards(rounds: RoundRecord[], count: number): StandardStat[] {
  const map = new Map<string, { asked: number; correct: number }>();
  for (const r of rounds) {
    if (!r.standardCode) continue;
    const cur = map.get(r.standardCode) ?? { asked: 0, correct: 0 };
    cur.asked += r.answers.length;
    cur.correct += r.answers.filter((a) => a.correct).length;
    map.set(r.standardCode, cur);
  }
  return [...map.entries()]
    .map(([code, v]) => ({ code, asked: v.asked, correct: v.correct, rate: v.asked === 0 ? 1 : v.correct / v.asked }))
    .sort((a, b) => a.rate - b.rate || b.asked - a.asked)
    .slice(0, count);
}
