// functions/src/validate.ts
// Pure validators for the generateArena callable. No imports from src/
// (Task 1 Standard codes are consumed as plain strings) and no side effects,
// so this module is safe to unit-test without emulators or API keys.

export interface GenerateArenaInput {
  grade: number;
  subject: string;
  standards: string[];
  count: number;
  topic?: string;
}

export interface DraftProblem {
  text: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export type InputValidation =
  | { ok: true; value: GenerateArenaInput }
  | { ok: false; error: string };

const MIN_COUNT = 10;
const MAX_COUNT = 20;
const OPTION_COUNT = 4;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function validateGenerateArenaInput(data: unknown): InputValidation {
  if (typeof data !== 'object' || data === null) {
    return { ok: false, error: 'input must be an object' };
  }
  const d = data as Record<string, unknown>;

  if (typeof d.grade !== 'number' || !Number.isInteger(d.grade)) {
    return { ok: false, error: 'grade must be an integer' };
  }
  if (!isNonEmptyString(d.subject)) {
    return { ok: false, error: 'subject must be a non-empty string' };
  }
  if (
    !Array.isArray(d.standards) ||
    d.standards.length < 1 ||
    !d.standards.every(isNonEmptyString)
  ) {
    return { ok: false, error: 'standards must be a non-empty string array' };
  }
  if (
    typeof d.count !== 'number' ||
    !Number.isInteger(d.count) ||
    d.count < MIN_COUNT ||
    d.count > MAX_COUNT
  ) {
    return {
      ok: false,
      error: `count must be an integer between ${MIN_COUNT} and ${MAX_COUNT}`,
    };
  }
  if (d.topic !== undefined && typeof d.topic !== 'string') {
    return { ok: false, error: 'topic must be a string when provided' };
  }

  return {
    ok: true,
    value: {
      grade: d.grade,
      subject: (d.subject as string).trim(),
      standards: (d.standards as string[]).map((s) => s.trim()),
      count: d.count as number,
      ...(typeof d.topic === 'string' && d.topic.trim().length > 0
        ? { topic: (d.topic as string).trim() }
        : {}),
    },
  };
}

export type AuthCheck = { ok: true } | { ok: false; error: string };

export function requireAuth(request: { auth?: unknown }): AuthCheck {
  return request.auth ? { ok: true } : { ok: false, error: 'sign-in required' };
}

export function isValidProblem(p: unknown): p is DraftProblem {
  if (typeof p !== 'object' || p === null) return false;
  const c = p as Record<string, unknown>;
  if (!isNonEmptyString(c.text)) return false;
  if (!Array.isArray(c.options) || c.options.length !== OPTION_COUNT) {
    return false;
  }
  if (!c.options.every(isNonEmptyString)) return false;
  if (
    typeof c.answerIndex !== 'number' ||
    !Number.isInteger(c.answerIndex) ||
    (c.answerIndex as number) < 0 ||
    (c.answerIndex as number) >= OPTION_COUNT
  ) {
    return false;
  }
  if (c.explanation !== undefined && typeof c.explanation !== 'string') {
    return false;
  }
  return true;
}

/** Keep only valid problems; empties/invalid entries are dropped. */
export function validateProblems(raw: unknown): DraftProblem[] {
  if (!Array.isArray(raw)) return [];
  const out: DraftProblem[] = [];
  for (const item of raw) {
    if (!isValidProblem(item)) continue;
    out.push({
      text: (item.text as string).trim(),
      options: (item.options as string[]).map((o) => o.trim()),
      answerIndex: item.answerIndex as number,
      ...(typeof item.explanation === 'string' && item.explanation.trim()
        ? { explanation: (item.explanation as string).trim() }
        : {}),
    });
  }
  return out;
}
