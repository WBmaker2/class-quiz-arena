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

export type DraftKind = 'choice' | 'ox' | 'short';

export interface DraftProblem {
  kind?: DraftKind;
  text: string;
  options: string[];
  answerIndex: number;
  answerText?: string;
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

export type TeacherAuthorization =
  | { ok: true; classroomId: string }
  | { ok: false; error: string };

/** Pure policy shared by callable authorization tests. */
export function authorizeArenaTeacher(args: {
  authenticated: boolean;
  role: unknown;
  allowlisted: boolean;
  master: boolean;
  ownerUid: unknown;
  uid: string;
  classroomId: unknown;
}): TeacherAuthorization {
  if (!args.authenticated) return { ok: false, error: 'sign-in required' };
  if (args.role !== 'teacher' || (!args.allowlisted && !args.master)) {
    return { ok: false, error: 'teacher access required' };
  }
  if (args.ownerUid !== args.uid) return { ok: false, error: 'classroom owner required' };
  if (typeof args.classroomId !== 'string' || !args.classroomId) {
    return { ok: false, error: 'classroom id required' };
  }
  return { ok: true, classroomId: args.classroomId };
}

export function requireAuth(request: { auth?: unknown }): AuthCheck {
  return request.auth ? { ok: true } : { ok: false, error: 'sign-in required' };
}

/** 교사 1명당 하루 AI 생성 횟수 상한. */
export const AI_DAILY_LIMIT = 20;

/** 한국 날짜(YYYY-MM-DD). '오늘 20회' 기준을 선생님 체감 날짜와 맞춘다. */
export function kstToday(now = Date.now()): string {
  return new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export interface UsageState {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
}

/** 순수 함수: 오늘 날짜와 이전 기록으로 허용 여부 + 다음 기록을 낸다. */
export function nextUsage(
  prev: UsageState | null,
  today: string,
): { allowed: boolean; next: UsageState } {
  const used = prev && prev.date === today ? prev.count : 0;
  if (used >= AI_DAILY_LIMIT) {
    return { allowed: false, next: { date: today, count: used } };
  }
  return { allowed: true, next: { date: today, count: used + 1 } };
}

export function isValidProblem(p: unknown): p is DraftProblem {
  if (typeof p !== 'object' || p === null) return false;
  const c = p as Record<string, unknown>;
  const kind: DraftKind = c.kind === 'ox' || c.kind === 'short' ? c.kind : 'choice';
  if (!isNonEmptyString(c.text)) return false;
  if (kind === 'short') {
    return (
      isNonEmptyString(c.answerText) &&
      (c.answerText as string).trim().length <= 30 &&
      (c.explanation === undefined || typeof c.explanation === 'string')
    );
  }
  if (!Array.isArray(c.options)) return false;
  if (kind === 'ox') {
    const norm = (c.options as unknown[]).map(normalizeOxOption);
    if (norm.length !== 2 || norm[0] !== 'O' || norm[1] !== 'X') return false;
  } else if (c.options.length !== OPTION_COUNT || !c.options.every(isNonEmptyString)) {
    return false;
  }
  if (
    typeof c.answerIndex !== 'number' ||
    !Number.isInteger(c.answerIndex) ||
    (c.answerIndex as number) < 0 ||
    (c.answerIndex as number) >= (kind === 'ox' ? 2 : OPTION_COUNT)
  ) {
    return false;
  }
  if (c.explanation !== undefined && typeof c.explanation !== 'string') {
    return false;
  }
  return true;
}

/** AI가 낸 O/X 변형(o, x, ○, × 등)을 O/X로 통일. 모르면 null. */
export function normalizeOxOption(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (['O', 'o', '○', '오', '참', '맞다', '예'].includes(t)) return 'O';
  if (['X', 'x', '×', '✕', '엑스', '거짓', '아니다', '아니오'].includes(t)) return 'X';
  return null;
}

/** Keep only valid problems; empties/invalid entries are dropped. */
export function validateProblems(raw: unknown): DraftProblem[] {
  if (!Array.isArray(raw)) return [];
  const out: DraftProblem[] = [];
  for (const item of raw) {
    if (!isValidProblem(item)) continue;
    const c = item as unknown as Record<string, unknown>;
    const kind: DraftKind = c.kind === 'ox' || c.kind === 'short' ? c.kind : 'choice';
    out.push({
      kind,
      text: (item.text as string).trim(),
      options:
        kind === 'short'
          ? []
          : kind === 'ox'
            ? ['O', 'X']
            : (item.options as string[]).map((o) => o.trim()),
      answerIndex: item.answerIndex as number,
      ...(kind === 'short' && typeof item.answerText === 'string'
        ? { answerText: (item.answerText as string).trim() }
        : {}),
      ...(typeof item.explanation === 'string' && item.explanation.trim()
        ? { explanation: (item.explanation as string).trim() }
        : {}),
    });
  }
  return out;
}

/** 문항수 N에 대한 유형 분배: OX·단답형 각 max(2, 15%), 나머지 4지선다. */
export function kindMix(count: number): { choice: number; ox: number; short: number } {
  const ox = Math.max(2, Math.round(count * 0.15));
  const short = Math.max(2, Math.round(count * 0.15));
  return { choice: Math.max(1, count - ox - short), ox, short };
}
