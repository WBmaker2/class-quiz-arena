export interface RoundRecord {
  roomId: string;
  arenaId: string;
  problemIndex: number;
  answers: { uid: string; correct: boolean }[];
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
