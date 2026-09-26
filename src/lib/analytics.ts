export interface RoundRecord {
  roomId: string;
  arenaId: string;
  problemId: string;
  problemTitle: string;
  problemIndex: number;
  answers: { uid: string; correct: boolean }[];
  standardCode?: string;
  correctAnswer?: number | string;
}

export function resolveRevealProblemMetadata(
  reveal: { questionText?: string; standardCode?: string },
  fallback: { text: string; standardCode?: string } | undefined,
): { problemTitle: string; standardCode?: string } {
  const hasSnapshot = Boolean(reveal.questionText);
  const problemTitle = reveal.questionText || fallback?.text || '문제 내용 없음';
  const standardCode = hasSnapshot ? reveal.standardCode : fallback?.standardCode;
  return { problemTitle, ...(standardCode ? { standardCode } : {}) };
}

export interface ProblemStat {
  problemId: string;
  problemTitle: string;
  problemIndex: number;
  /** 제출한 답만 분모에 포함합니다. */
  asked: number;
  correct: number;
  /** 기록이 없으면 null, 기록이 있으면 0–100의 백분율입니다. */
  correctPercent: number | null;
}

export function problemStats(rounds: RoundRecord[]): ProblemStat[] {
  const map = new Map<string, { problemId: string; problemTitle: string; problemIndex: number; asked: number; correct: number }>();
  for (const r of rounds) {
    const versionKey = JSON.stringify([r.problemId, r.problemTitle, r.standardCode ?? '', r.correctAnswer ?? '']);
    const cur = map.get(versionKey) ?? { problemId: r.problemId, problemTitle: r.problemTitle, problemIndex: r.problemIndex, asked: 0, correct: 0 };
    cur.asked += r.answers.length;
    cur.correct += r.answers.filter((a) => a.correct).length;
    map.set(versionKey, cur);
  }
  return [...map.values()]
    .map((v) => ({ ...v, correctPercent: v.asked === 0 ? null : (v.correct / v.asked) * 100 }))
    .sort((a, b) => a.problemIndex - b.problemIndex);
}

export function hardProblems(stats: ProblemStat[], count: number): ProblemStat[] {
  return [...stats]
    .filter((s) => s.correctPercent !== null)
    .sort((a, b) => (a.correctPercent ?? 0) - (b.correctPercent ?? 0))
    .slice(0, count);
}

export function avgCorrectVsWrong(rounds: RoundRecord[]): { avgCorrect: number; avgWrong: number } {
  const recorded = rounds.filter((r) => r.answers.length > 0);
  if (recorded.length === 0) return { avgCorrect: 0, avgWrong: 0 };
  let correct = 0;
  let total = 0;
  for (const r of recorded) {
    total += r.answers.length;
    correct += r.answers.filter((a) => a.correct).length;
  }
  return { avgCorrect: correct / recorded.length, avgWrong: (total - correct) / recorded.length };
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
    if (!r.standardCode || r.answers.length === 0) continue;
    const cur = map.get(r.standardCode) ?? { asked: 0, correct: 0 };
    cur.asked += r.answers.length;
    cur.correct += r.answers.filter((a) => a.correct).length;
    map.set(r.standardCode, cur);
  }
  return [...map.entries()]
    .map(([code, v]) => ({ code, asked: v.asked, correct: v.correct, rate: v.asked === 0 ? 0 : v.correct / v.asked }))
    .sort((a, b) => a.rate - b.rate || b.asked - a.asked)
    .slice(0, count);
}
