export type BattleAnswer = number | string;

export function isAutoWinEligible(updatedAtMs: number, roundEndsAt: number, nowMs: number, timeoutMs = 30_000): boolean {
  return nowMs >= Math.max(updatedAtMs + timeoutMs, roundEndsAt);
}

export interface PublicQuestion {
  id: string;
  text: string;
  options: string[];
  kind: 'choice' | 'ox' | 'short';
  roundTimeSec: number;
}

export interface StoredQuestion extends PublicQuestion {
  answerIndex: number;
  answerText?: string;
  explanation?: string;
  standardCode?: string;
}

export function isAnswerValid(value: unknown, question: StoredQuestion): value is BattleAnswer {
  if (question.kind === 'short') return typeof value === 'string' && value.trim().length > 0 && value.length <= 100;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < question.options.length;
}

export function recordFirstAnswer(
  existing: Record<string, BattleAnswer>,
  round: number,
  value: BattleAnswer,
): { accepted: boolean; answers: Record<string, BattleAnswer> } {
  const key = String(round);
  if (Object.prototype.hasOwnProperty.call(existing, key)) return { accepted: false, answers: existing };
  return { accepted: true, answers: { ...existing, [key]: value } };
}

export function isCorrect(value: BattleAnswer | null, question: StoredQuestion): boolean {
  if (value === null) return false;
  if (question.kind === 'short') {
    const norm = (s: string) => s.trim().replace(/\s+/g, '').toLowerCase();
    return typeof value === 'string' && Boolean(question.answerText) && norm(value) === norm(question.answerText!);
  }
  return value === question.answerIndex;
}

export function normalizeTimestamp(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value && typeof value === 'object' && 'toMillis' in value) {
    const millis = (value as { toMillis: () => number }).toMillis();
    return Number.isFinite(millis) ? millis : 0;
  }
  return 0;
}

export function questionToStored(id: string, data: Record<string, unknown>): StoredQuestion {
  const kind = data.kind === 'ox' || data.kind === 'short' ? data.kind : 'choice';
  return {
    id,
    text: typeof data.text === 'string' ? data.text : '',
    options: Array.isArray(data.options) ? data.options.filter((v): v is string => typeof v === 'string') : [],
    kind,
    answerIndex: typeof data.answerIndex === 'number' ? data.answerIndex : -1,
    ...(typeof data.answerText === 'string' ? { answerText: data.answerText } : {}),
    ...(typeof data.explanation === 'string' ? { explanation: data.explanation } : {}),
    ...(typeof data.standardCode === 'string' ? { standardCode: data.standardCode } : {}),
    roundTimeSec: typeof data.roundTimeSec === 'number' ? Math.max(5, Math.min(180, data.roundTimeSec)) : 30,
  };
}

export function isStoredQuestionValid(question: StoredQuestion): boolean {
  if (!question.text.trim() || !Number.isInteger(question.roundTimeSec) || question.roundTimeSec < 5) return false;
  if (question.kind === 'short') return typeof question.answerText === 'string' && question.answerText.trim().length > 0;
  const expected = question.kind === 'ox' ? 2 : 4;
  return question.options.length === expected && Number.isInteger(question.answerIndex)
    && question.answerIndex >= 0 && question.answerIndex < expected;
}

export function toPublicQuestion(question: StoredQuestion): PublicQuestion {
  return {
    id: question.id,
    text: question.text,
    options: [...question.options],
    kind: question.kind,
    roundTimeSec: question.roundTimeSec,
  };
}

export function pickQuestionIds(ids: string[], count: number): string[] {
  const pool = [...new Set(ids)];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function answerReveal(questionId: string, question: StoredQuestion, answers: Record<string, BattleAnswer | null>) {
  return {
    questionId,
    questionText: question.text,
    ...(question.standardCode ? { standardCode: question.standardCode } : {}),
    answers,
    correctAnswer: question.kind === 'short' ? question.answerText ?? '' : question.answerIndex,
    kind: question.kind,
    ...(question.explanation ? { explanation: question.explanation } : {}),
  };
}

export function countCorrectAnswers(
  reveals: Array<{ answers?: Record<string, unknown>; correctAnswer?: unknown }>,
  uid: string,
): number {
  return reveals.filter((reveal) => {
    const answer = reveal.answers?.[uid];
    return answer !== null && answer !== undefined && String(answer).trim().replace(/\s+/g, '').toLowerCase()
      === String(reveal.correctAnswer).trim().replace(/\s+/g, '').toLowerCase();
  }).length;
}

export function countUserAnswers(reveals: Array<{ answers?: Record<string, unknown> }>, uid: string): number {
  return reveals.filter((reveal) => reveal.answers?.[uid] !== null && reveal.answers?.[uid] !== undefined).length;
}
