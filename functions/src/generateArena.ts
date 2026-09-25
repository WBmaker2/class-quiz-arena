import * as admin from 'firebase-admin';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import {
  AI_DAILY_LIMIT,
  kindMix,
  kstToday,
  nextUsage,
  requireAuth,
  validateGenerateArenaInput,
  validateProblems,
  type DraftProblem,
  type GenerateArenaInput,
  type UsageState,
} from './validate';

admin.initializeApp();
const db = admin.firestore();

// gemini-2.0-flash는 2026-06-01에 종료됨. 공식 대체 모델을 쓴다.
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
// NOTE: deploy-time wiring — set GEMINI_API_KEY via Secret Manager / env config.

/** Request shape Task 5's editor sends (all fields plain JSON). */
export interface GenerateArenaRequest {
  grade: number;
  subject: string;
  standards: string[];
  count: number;
  topic?: string;
}

/** Response: problems only. Nothing is persisted — the editor saves
 * the final arena after teacher review, so no orphan docs accumulate. */
export interface GenerateArenaResponse {
  problems: DraftProblem[];
}

function buildPrompt(input: GenerateArenaInput): string {
  const topicLine = input.topic ? `주제: ${input.topic}\n` : '';
  const mix = kindMix(input.count);
  return [
    '초등학생이 읽는 쉬운 말로 문제를 만들어줘.',
    `학년: ${input.grade} (이 학년 수준의 어휘와 문장 길이를 써줘. 저학년은 짧은 문장, 쉬운 말로.)`,
    `과목: ${input.subject}`,
    `성취기준: ${input.standards.join(', ')} (기준 동사의 수준에 맞춰 출제해. '알기'는 예시·상황으로 이해를 확인하고, '적용하기'는 실생활 문장제·사례 판단으로 내줘.)`,
    topicLine,
    `문제 수: ${input.count}개 — 4지선다 ${mix.choice}개, O/X ${mix.ox}개, 단답형 주관식 ${mix.short}개.`,
    '너무 쉬운 문제(상식선에서 풀리는 것)와 너무 어려운 문제(상위 학년 개념)는 내지 마.',
    '4지선다 오답은 학생들이 흔히 하는 실수(오개념)로 만들어. O/X 문제는 단정적 표현 함정을 1개 이상 넣어. 단답형 정답은 30자 이내 짧은 답으로.',
    '각 문제는 해설 1줄을 포함하고, 해설에는 왜 정답인지 이유를 써줘. 반드시 JSON 배열만 출력해줘.',
    '형식: [{"kind": "choice"|"ox"|"short", "text": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "answerText": "단답형일 때만", "explanation": "..."}]',
    '(choice면 options 4개, ox면 options ["O","X"]에 answerIndex 0 또는 1, short면 options [] 와 answerText 필수)',
  ].join('\n');
}

function extractJsonArray(text: string): unknown {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Gemini response contained no JSON array');
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function callGemini(prompt: string, apiKey: string): Promise<unknown> {
  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini request failed with status ${res.status}`);
  }
  const body = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = body.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('');
  if (!text) throw new Error('Gemini response had no text');
  return extractJsonArray(text);
}

export const generateArena = onCall(
  // secrets 선언: 배포 시 Secret Manager 값이 GEMINI_API_KEY 환경변수로 주입된다.
  // 에뮬레이터에서는 functions/.secret.local 파일로 같은 값을 넣는다.
  { secrets: ['GEMINI_API_KEY'] },
  async (request): Promise<GenerateArenaResponse> => {
    const authed = requireAuth(request);
    if (!authed.ok) {
      console.error('generateArena failed', { stage: 'auth', error: authed.error });
      throw new HttpsError('unauthenticated', authed.error);
    }

    const parsed = validateGenerateArenaInput(request.data);
    if (!parsed.ok) {
      console.error('generateArena failed', { stage: 'input', error: parsed.error });
      throw new HttpsError('invalid-argument', parsed.error);
    }

    // 요금폭탄 방지: 교사 1명 하루 20회(KST 기준).
    // 실패한 호출은 횟수를 깎지 않는다: Gemini 성공 뒤에만 차감한다.
    const today = kstToday();
    const usageRef = db.collection('aiUsage').doc(request.auth!.uid);
    const preSnap = await usageRef.get();
    const pre = preSnap.exists ? (preSnap.data() as UsageState) : null;
    if (!nextUsage(pre, today).allowed) {
      console.error('generateArena failed', { stage: 'quota', used: pre?.count ?? 0, limit: AI_DAILY_LIMIT });
      throw new HttpsError('resource-exhausted', '오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요.');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('generateArena failed', { stage: 'config', error: 'GEMINI_API_KEY is not configured' });
      throw new HttpsError(
        'failed-precondition',
        'GEMINI_API_KEY is not configured',
      );
    }

    let raw: unknown;
    try {
      raw = await callGemini(buildPrompt(parsed.value), apiKey);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gemini call failed';
      console.error('generateArena failed', { stage: 'gemini', model: GEMINI_MODEL, error: message });
      throw new HttpsError('internal', message);
    }

    const problems = validateProblems(raw).slice(0, parsed.value.count);
    if (problems.length === 0) {
      console.error('generateArena failed', { stage: 'validate', error: 'No valid problems generated' });
      throw new HttpsError('internal', 'No valid problems generated');
    }

    // 성공한 뒤에만 하루 횟수를 1 올린다 (동시 호출 경합은 트랜잭션으로 막는다).
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(usageRef);
      const cur = snap.exists ? (snap.data() as UsageState) : null;
      const { allowed, next } = nextUsage(cur, today);
      if (!allowed) {
        throw new HttpsError('resource-exhausted', '오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요.');
      }
      tx.set(usageRef, next);
    });

    return { problems };
  },
);
