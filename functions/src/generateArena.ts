import * as admin from 'firebase-admin';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import {
  validateGenerateArenaInput,
  validateProblems,
  type DraftProblem,
  type GenerateArenaInput,
} from './validate';

admin.initializeApp();
const db = admin.firestore();

// TODO: wire the real key at deploy time via Secret Manager / env config;
// the Gemini call below reads process.env.GEMINI_API_KEY.
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Request shape Task 5's editor sends (all fields plain JSON). */
export interface GenerateArenaRequest {
  grade: number;
  subject: string;
  standards: string[];
  count: number;
  topic?: string;
}

/** Response shape Task 5's editor receives. */
export interface GenerateArenaResponse {
  arenaId: string;
  problems: DraftProblem[];
}

function buildPrompt(input: GenerateArenaInput): string {
  const topicLine = input.topic ? `주제: ${input.topic}\n` : '';
  return [
    '초등학생이 읽는 쉬운 말로 4지선다 문제를 만들어줘.',
    `학년: ${input.grade}, 과목: ${input.subject}`,
    `성취기준: ${input.standards.join(', ')}`,
    topicLine,
    `문제 수: ${input.count}개`,
    '각 문제는 해설 1줄을 포함하고, 반드시 JSON 배열만 출력해줘.',
    '형식: [{"text": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "explanation": "..."}]',
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
  async (request): Promise<GenerateArenaResponse> => {
    const parsed = validateGenerateArenaInput(request.data);
    if (!parsed.ok) {
      throw new HttpsError('invalid-argument', parsed.error);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new HttpsError(
        'failed-precondition',
        'GEMINI_API_KEY is not configured',
      );
    }

    let raw: unknown;
    try {
      raw = await callGemini(buildPrompt(parsed.value), apiKey);
    } catch (err) {
      throw new HttpsError(
        'internal',
        err instanceof Error ? err.message : 'Gemini call failed',
      );
    }

    const problems = validateProblems(raw).slice(0, parsed.value.count);
    if (problems.length === 0) {
      throw new HttpsError('internal', 'No valid problems generated');
    }

    const arenaRef = await db.collection('arenas').add({
      grade: parsed.value.grade,
      subject: parsed.value.subject,
      standards: parsed.value.standards,
      ...(parsed.value.topic ? { topic: parsed.value.topic } : {}),
      status: 'draft',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const batch = db.batch();
    problems.forEach((p, i) => {
      batch.set(arenaRef.collection('problems').doc(), {
        ...p,
        order: i,
        status: 'draft',
      });
    });
    await batch.commit();

    return { arenaId: arenaRef.id, problems };
  },
);
