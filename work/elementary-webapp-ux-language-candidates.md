# Learner Text Inventory

- Root: `/Volumes/ External Drive 256G/Dev2/opencode/battle-study-ground-clone`
- Files scanned: `103`
- Candidates: `1807`
- Status: `triage only`; not a grade-level certification or automatic rewrite.

## Candidate strings

| Source | Surface | Text | Role hints | Review signals |
| --- | --- | --- | --- | --- |
| functions/lib/generateArena.js:13:38 | text | 주제: ${input.topic} | input | repeated-text |
| functions/lib/generateArena.js:16:10 | text | 초등학생이 읽는 쉬운 말로 문제를 만들어줘. | learner-text-candidate | repeated-text |
| functions/lib/generateArena.js:17:10 | text | 학년: ${input.grade} (이 학년 수준의 어휘와 문장 길이를 써줘. 저학년은 짧은 문장, 쉬운 말로.) | input | long-or-dense, repeated-text |
| functions/lib/generateArena.js:18:10 | text | 과목: ${input.subject} | input | repeated-text |
| functions/lib/generateArena.js:19:10 | text | 성취기준: ${input.standards.join(', ')} (기준 동사의 수준에 맞춰 출제해. '알기'는 예시·상황으로 이해를 확인하고, '적용하기'는 실생활 문장제·사례 판단으로 내줘.) | input | abstract-or-formal, long-or-dense, repeated-text |
| functions/lib/generateArena.js:21:10 | text | 문제 수: ${input.count}개 — 4지선다 ${mix.choice}개, O/X ${mix.ox}개, 단답형 주관식 ${mix.short}개. | input | long-or-dense, repeated-text |
| functions/lib/generateArena.js:22:10 | text | 너무 쉬운 문제(상식선에서 풀리는 것)와 너무 어려운 문제(상위 학년 개념)는 내지 마. | learner-text-candidate | repeated-text |
| functions/lib/generateArena.js:23:10 | text | 4지선다 오답은 학생들이 흔히 하는 실수(오개념)로 만들어. O/X 문제는 단정적 표현 함정을 1개 이상 넣어. 단답형 정답은 30자 이내 짧은 답으로. | feedback-or-error | long-or-dense, repeated-text |
| functions/lib/generateArena.js:24:10 | text | 각 문제는 해설 1줄을 포함하고, 해설에는 왜 정답인지 이유를 써줘. 반드시 JSON 배열만 출력해줘. | feedback-or-error | abstract-or-formal, missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:25:10 | text | 형식: [{"kind": "choice"\|"ox"\|"short", "text": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "answerText": "단답형일 때만", "explanation": "..."}] | learner-text-candidate | long-or-dense, repeated-text |
| functions/lib/generateArena.js:26:10 | text | (choice면 options 4개, ox면 options ["O","X"]에 answerIndex 0 또는 1, short면 options [] 와 answerText 필수) | learner-text-candidate | long-or-dense, repeated-text |
| functions/lib/generateArena.js:33:26 | text | Gemini response contained no JSON array | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:49:26 | text | Gemini request failed with status ${res.status} | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:56:26 | text | Gemini response had no text | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:65:24 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:65:57 | text | auth | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:66:39 | text | unauthenticated | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:70:24 | text | generateArena failed | feedback-or-error, input | repeated-text |
| functions/lib/generateArena.js:70:57 | text | input | feedback-or-error, input | repeated-text |
| functions/lib/generateArena.js:71:39 | text | invalid-argument | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:80:24 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:80:57 | text | quota | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:81:39 | text | resource-exhausted | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:81:61 | text | 오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요. | feedback-or-error | repeated-text, technical-or-internal |
| functions/lib/generateArena.js:85:24 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:85:57 | text | config | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:85:74 | text | GEMINI_API_KEY is not configured | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:86:39 | text | failed-precondition | feedback-or-error | — |
| functions/lib/generateArena.js:86:62 | text | GEMINI_API_KEY is not configured | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:93:63 | text | Gemini call failed | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:94:24 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:94:57 | text | gemini | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:95:39 | text | internal | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:99:24 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:99:57 | text | validate | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:99:76 | text | No valid problems generated | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:100:39 | text | internal | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:100:51 | text | No valid problems generated | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/generateArena.js:108:43 | text | resource-exhausted | feedback-or-error | repeated-text |
| functions/lib/generateArena.js:108:65 | text | 오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요. | feedback-or-error | repeated-text, technical-or-internal |
| functions/lib/validate.js:20:54 | text | 0; } function validateGenerateArenaInput(data) { if (typeof data !== 'object' \|\| data === null) { return { ok: false, error: 'input must be an object' }; } const d = data; if (typeof d.grade !== 'number' \|\| !Number.isInteger(d.grade)) { return { ok: false, error: 'grade must be an integer' }; } if (!isNonEmptyString(d.subject)) { return { ok: false, error: 'subject must be a non-empty string' }; } if (!Array.isArray(d.standards) \|\| d.standards.length | feedback-or-error, input | long-or-dense, technical-or-internal |
| functions/lib/validate.js:24:37 | text | input must be an object | feedback-or-error, input | repeated-text |
| functions/lib/validate.js:28:37 | text | grade must be an integer | feedback-or-error | repeated-text |
| functions/lib/validate.js:31:37 | text | subject must be a non-empty string | feedback-or-error | repeated-text |
| functions/lib/validate.js:36:37 | text | standards must be a non-empty string array | feedback-or-error | repeated-text |
| functions/lib/validate.js:44:21 | text | count must be an integer between ${MIN_COUNT} and ${MAX_COUNT} | feedback-or-error | long-or-dense, repeated-text |
| functions/lib/validate.js:48:37 | text | topic must be a string when provided | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/validate.js:64:63 | text | sign-in required | feedback-or-error | repeated-text |
| functions/lib/validate.js:68:25 | text | 오늘 20회 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:118:26 | text | 오 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:118:31 | text | 참 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:118:36 | text | 맞다 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:118:42 | text | 예 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:120:31 | text | 엑스 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:120:37 | text | 거짓 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:120:43 | text | 아니다 | learner-text-candidate | repeated-text |
| functions/lib/validate.js:120:50 | text | 아니오 | learner-text-candidate | repeated-text |
| functions/lib/validate.test.js:8:19 | text | 수학 | learner-text-candidate | repeated-text |
| functions/lib/validate.test.js:9:22 | text | 3수01-01 | learner-text-candidate | repeated-text |
| functions/lib/validate.test.js:11:17 | text | 덧셈 | learner-text-candidate | repeated-text |
| functions/lib/validate.test.js:38:23 | text | 3에 4를 더하면 7이야. | learner-text-candidate | repeated-text |
| functions/lib/validate.test.js:54:22 | text | 빈 보기 | learner-text-candidate | repeated-text |
| functions/lib/validate.test.js:63:92 | text | sign-in required | feedback-or-error | repeated-text |
| functions/lib/validate.test.js:94:23 | text | accepts ox option variants and normalizes them | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| functions/lib/validate.test.js:103:115 | text | 세종대왕 | learner-text-candidate | repeated-text |
| functions/src/generateArena.ts:2:37 | text | firebase-functions/v2/https | feedback-or-error | missing-term-explanation, technical-or-internal |
| functions/src/generateArena.ts:41:36 | text | 주제: ${input.topic} | input | repeated-text |
| functions/src/generateArena.ts:44:6 | text | 초등학생이 읽는 쉬운 말로 문제를 만들어줘. | learner-text-candidate | repeated-text |
| functions/src/generateArena.ts:45:6 | text | 학년: ${input.grade} (이 학년 수준의 어휘와 문장 길이를 써줘. 저학년은 짧은 문장, 쉬운 말로.) | input | long-or-dense, repeated-text |
| functions/src/generateArena.ts:46:6 | text | 과목: ${input.subject} | input | repeated-text |
| functions/src/generateArena.ts:47:6 | text | 성취기준: ${input.standards.join(', ')} (기준 동사의 수준에 맞춰 출제해. '알기'는 예시·상황으로 이해를 확인하고, '적용하기'는 실생활 문장제·사례 판단으로 내줘.) | input | abstract-or-formal, long-or-dense, repeated-text |
| functions/src/generateArena.ts:49:6 | text | 문제 수: ${input.count}개 — 4지선다 ${mix.choice}개, O/X ${mix.ox}개, 단답형 주관식 ${mix.short}개. | input | long-or-dense, repeated-text |
| functions/src/generateArena.ts:50:6 | text | 너무 쉬운 문제(상식선에서 풀리는 것)와 너무 어려운 문제(상위 학년 개념)는 내지 마. | learner-text-candidate | repeated-text |
| functions/src/generateArena.ts:51:6 | text | 4지선다 오답은 학생들이 흔히 하는 실수(오개념)로 만들어. O/X 문제는 단정적 표현 함정을 1개 이상 넣어. 단답형 정답은 30자 이내 짧은 답으로. | feedback-or-error | long-or-dense, repeated-text |
| functions/src/generateArena.ts:52:6 | text | 각 문제는 해설 1줄을 포함하고, 해설에는 왜 정답인지 이유를 써줘. 반드시 JSON 배열만 출력해줘. | feedback-or-error | abstract-or-formal, missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:53:6 | text | 형식: [{"kind": "choice"\|"ox"\|"short", "text": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "answerText": "단답형일 때만", "explanation": "..."}] | learner-text-candidate | long-or-dense, repeated-text |
| functions/src/generateArena.ts:54:6 | text | (choice면 options 4개, ox면 options ["O","X"]에 answerIndex 0 또는 1, short면 options [] 와 answerText 필수) | learner-text-candidate | long-or-dense, repeated-text |
| functions/src/generateArena.ts:62:22 | text | Gemini response contained no JSON array | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:67:76 | text | { const res = await fetch(GEMINI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey, }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], }), }); if (!res.ok) { throw new Error(`Gemini request failed with status ${res.status}`); } const body = (await res.json()) as { candidates?: Array | feedback-or-error | long-or-dense, technical-or-internal |
| functions/src/generateArena.ts:79:22 | text | Gemini request failed with status ${res.status} | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:85:17 | text | p.text ?? '') .join(''); if (!text) throw new Error('Gemini response had no text'); return extractJsonArray(text); } export const generateArena = onCall( // secrets 선언: 배포 시 Secret Manager 값이 GEMINI_API_KEY 환경변수로 주입된다. // 에뮬레이터에서는 functions/.secret.local 파일로 같은 값을 넣는다. { secrets: ['GEMINI_API_KEY'] }, async (request): Promise | feedback-or-error | long-or-dense, technical-or-internal |
| functions/src/generateArena.ts:87:31 | text | Gemini response had no text | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:98:22 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:98:55 | text | auth | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:99:29 | text | unauthenticated | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:104:22 | text | generateArena failed | feedback-or-error, input | repeated-text |
| functions/src/generateArena.ts:104:55 | text | input | feedback-or-error, input | repeated-text |
| functions/src/generateArena.ts:105:29 | text | invalid-argument | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:115:22 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:115:55 | text | quota | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:116:29 | text | resource-exhausted | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:116:51 | text | 오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요. | feedback-or-error | repeated-text, technical-or-internal |
| functions/src/generateArena.ts:121:22 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:121:55 | text | config | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:121:72 | text | GEMINI_API_KEY is not configured | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:132:61 | text | Gemini call failed | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:133:22 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:133:55 | text | gemini | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:134:29 | text | internal | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:139:22 | text | generateArena failed | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:139:55 | text | validate | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:139:74 | text | No valid problems generated | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:140:29 | text | internal | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:140:41 | text | No valid problems generated | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/generateArena.ts:149:31 | text | resource-exhausted | feedback-or-error | repeated-text |
| functions/src/generateArena.ts:149:53 | text | 오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요. | feedback-or-error | repeated-text, technical-or-internal |
| functions/src/validate.test.ts:17:15 | text | 수학 | learner-text-candidate | repeated-text |
| functions/src/validate.test.ts:18:18 | text | 3수01-01 | learner-text-candidate | repeated-text |
| functions/src/validate.test.ts:20:13 | text | 덧셈 | learner-text-candidate | repeated-text |
| functions/src/validate.test.ts:53:19 | text | 3에 4를 더하면 7이야. | learner-text-candidate | repeated-text |
| functions/src/validate.test.ts:73:16 | text | 빈 보기 | learner-text-candidate | repeated-text |
| functions/src/validate.test.ts:83:58 | text | sign-in required | feedback-or-error | repeated-text |
| functions/src/validate.test.ts:125:7 | text | accepts ox option variants and normalizes them | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/validate.test.ts:136:76 | text | 세종대왕 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:34:52 | text | 0; } export function validateGenerateArenaInput(data: unknown): InputValidation { if (typeof data !== 'object' \|\| data === null) { return { ok: false, error: 'input must be an object' }; } const d = data as Record | feedback-or-error, input | long-or-dense, technical-or-internal |
| functions/src/validate.ts:39:33 | text | input must be an object | feedback-or-error, input | repeated-text |
| functions/src/validate.ts:41:44 | text | ; if (typeof d.grade !== 'number' \|\| !Number.isInteger(d.grade)) { return { ok: false, error: 'grade must be an integer' }; } if (!isNonEmptyString(d.subject)) { return { ok: false, error: 'subject must be a non-empty string' }; } if ( !Array.isArray(d.standards) \|\| d.standards.length | feedback-or-error | long-or-dense |
| functions/src/validate.ts:44:33 | text | grade must be an integer | feedback-or-error | repeated-text |
| functions/src/validate.ts:47:33 | text | subject must be a non-empty string | feedback-or-error | repeated-text |
| functions/src/validate.ts:54:33 | text | standards must be a non-empty string array | feedback-or-error | repeated-text |
| functions/src/validate.ts:64:15 | text | count must be an integer between ${MIN_COUNT} and ${MAX_COUNT} | feedback-or-error | long-or-dense, repeated-text |
| functions/src/validate.ts:68:33 | text | topic must be a string when provided | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| functions/src/validate.ts:88:61 | text | sign-in required | feedback-or-error | repeated-text |
| functions/src/validate.ts:94:25 | text | 오늘 20회 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:139:32 | text | = (kind === 'ox' ? 2 : OPTION_COUNT) ) { return false; } if (c.explanation !== undefined && typeof c.explanation !== 'string') { return false; } return true; } /** AI가 낸 O/X 변형(o, x, ○, × 등)을 O/X로 통일. 모르면 null. */ export function normalizeOxOption(v: unknown): string \| null { if (typeof v !== 'string') return null; const t = v.trim(); if (['O', 'o', '○', '오', '참', '맞다', '예'].includes(t)) return 'O'; if (['X', 'x', '×', '✕', '엑스', '거짓', '아니다', '아니오'].includes(t)) return 'X'; return null; } /** Keep only valid problems; empties/invalid entries are dropped. */ export function validateProblems(raw: unknown): DraftProblem[] { if (!Array.isArray(raw)) return []; const out: DraftProblem[] = []; for (const item of raw) { if (!isValidProblem(item)) continue; const c = item as unknown as Record | learner-text-candidate | long-or-dense, technical-or-internal |
| functions/src/validate.ts:153:24 | text | 오 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:153:29 | text | 참 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:153:34 | text | 맞다 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:153:40 | text | 예 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:154:29 | text | 엑스 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:154:35 | text | 거짓 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:154:41 | text | 아니다 | learner-text-candidate | repeated-text |
| functions/src/validate.ts:154:48 | text | 아니오 | learner-text-candidate | repeated-text |
| index.html:7:39 | text | 선생님 문제로 친구와 1:1 퀴즈 대결! 초등학생용 학습 아레나 | learner-text-candidate | — |
| index.html:10:12 | text | 퀴즈 아레나 | learner-text-candidate | repeated-text |
| scripts/seed.mjs:9:10 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| scripts/seed.mjs:17:11 | text | 기초 덧셈 아레나 | learner-text-candidate | repeated-text |
| scripts/seed.mjs:18:10 | text | 두 자리 수 덧셈 3문제 | learner-text-candidate | — |
| scripts/seed.mjs:19:13 | text | 수학 | learner-text-candidate | repeated-text |
| scripts/seed.mjs:34:14 | text | 김선생 | learner-text-candidate | repeated-text |
| scripts/seed.mjs:45:14 | text | 일호 | learner-text-candidate | repeated-text |
| scripts/seed.mjs:56:14 | text | 이호 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:11:61 | text | 수학 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:12:59 | text | 국어 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:13:62 | text | 수학 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:14:59 | text | 과학 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:15:57 | text | 사회 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:16:61 | text | 영어 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:25:41 | text | arenas: expected 6, got ${arenas.length} | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:28:40 | text | arenas: missing ${exp.id} | feedback-or-error | technical-or-internal |
| scripts/seedDefaultArenas.mjs:34:20 | text | ${where}: expected ${exp.grade}/${exp.subject}, got ${arena.grade}/${arena.subject} | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:37:20 | text | ${where}: expected band ${exp.band}, got ${arena.gradeBand} | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:39:58 | text | ${where}: classroomId must be ${CLASSROOM_ID} | feedback-or-error | technical-or-internal |
| scripts/seedDefaultArenas.mjs:40:46 | text | ${where}: locked must be false | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:41:51 | text | ${where}: showPlayers must default to false | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:42:27 | text | published | feedback-or-error | repeated-text |
| scripts/seedDefaultArenas.mjs:42:52 | text | ${where}: status must be published | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:43:52 | text | ${where}: createdBy must be ${OWNER_ID} | feedback-or-error | technical-or-internal |
| scripts/seedDefaultArenas.mjs:44:36 | text | ${where}: title is empty | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:45:71 | text | ${where}: cardTheme bg/emoji required | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:46:50 | text | ${where}: questionCount must be 20 | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:48:20 | text | ${where}: standards must have at least 1 code | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:51:20 | text | ${where}: expected 20 problems, got ${arena.problems?.length} | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:55:37 | text | { const at = `${where}/problems/p${i + 1}`; if (!p.text) errors.push(`${at}: text is empty`); if (texts.has(p.text)) errors.push(`${at}: duplicate text`); texts.add(p.text); if (!Array.isArray(p.options) \|\| p.options.length !== 4) { errors.push(`${at}: options must be exactly 4`); } else { for (const o of p.options) { if (typeof o !== 'string' \|\| o.trim() === '') errors.push(`${at}: option must be non-empty`); } if (new Set(p.options).size !== 4) errors.push(`${at}: options must be 4 distinct values`); } if (!Number.isInteger(p.answerIndex) \|\| p.answerIndex | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:57:33 | text | ${at}: text is empty | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:58:43 | text | ${at}: duplicate text | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:61:22 | text | ${at}: options must be exactly 4 | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:64:29 | text | string | feedback-or-error | repeated-text |
| scripts/seedDefaultArenas.mjs:64:70 | text | ${at}: option must be non-empty | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:66:57 | text | ${at}: options must be 4 distinct values | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:69:22 | text | ${at}: answerIndex must be 0-3 | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:72:22 | text | ${at}: explanation must be a 1-line non-empty string | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:74:22 | text | ${at}: explanation must be 1 line | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:76:41 | text | ${at}: standardCode required | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:78:22 | text | ${at}: standardCode ${p.standardCode} not in arena standards | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:80:47 | text | ${at}: roundTimeSec must be 30 | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:91:20 | text | validation FAILED (${errors.length} errors): | feedback-or-error | technical-or-internal |
| scripts/seedDefaultArenas.mjs:92:44 | text | - ${e} | feedback-or-error | — |
| scripts/seedDefaultArenas.mjs:99:20 | text | - ${a.id}: ${a.grade}학년 ${a.subject}, 20 problems, locked=${a.locked}, status=${a.status} | learner-text-candidate | long-or-dense, technical-or-internal |
| scripts/seedDefaultArenas.mjs:104:20 | text | FIRESTORE_EMULATOR_HOST is not set. Refusing production writes. | feedback-or-error | long-or-dense |
| scripts/seedDefaultArenas.mjs:112:14 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| scripts/seedDefaultArenas.mjs:117:18 | text | 김선생 | learner-text-candidate | repeated-text |
| src/App.test.tsx:7:75 | text | a1 | learner-text-candidate | repeated-text |
| src/App.test.tsx:7:88 | text | 기초 덧셈 아레나 | learner-text-candidate | repeated-text |
| src/App.test.tsx:7:107 | text | 설명 | learner-text-candidate | repeated-text |
| src/App.test.tsx:7:122 | text | 수학 | learner-text-candidate | repeated-text |
| src/App.test.tsx:7:156 | text | A1B2C3 | learner-text-candidate | repeated-text |
| src/App.test.tsx:8:83 | text | 일호 | learner-text-candidate | repeated-text |
| src/App.test.tsx:19:36 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/App.test.tsx:28:30 | text | 선생님 문제로 친구와 1:1 퀴즈 대결! | learner-text-candidate | repeated-text |
| src/App.test.tsx:29:30 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:29:48 | text | Google 계정으로 시작하기 | button-or-action | repeated-text |
| src/App.test.tsx:34:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:34:57 | text | Google 계정으로 시작하기 | button-or-action | repeated-text |
| src/App.test.tsx:35:30 | text | 반가워요! 누구신가요? | learner-text-candidate | repeated-text |
| src/App.test.tsx:40:30 | text | 선생님 문제로 친구와 1:1 퀴즈 대결! | learner-text-candidate | repeated-text |
| src/App.test.tsx:45:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:45:57 | text | Google 계정으로 시작하기 | button-or-action | repeated-text |
| src/App.test.tsx:46:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:46:57 | text | 선생님으로 시작 | button-or-action | repeated-text |
| src/App.test.tsx:47:35 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/App.test.tsx:48:37 | text | 초대 코드 | learner-text-candidate | repeated-text |
| src/App.test.tsx:49:45 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/App.test.tsx:49:74 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/App.test.tsx:50:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:50:57 | text | 학급 만들기 | button-or-action | repeated-text |
| src/App.test.tsx:51:37 | text | 선생님 워크스페이스 | learner-text-candidate | repeated-text |
| src/App.test.tsx:56:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:56:57 | text | Google 계정으로 시작하기 | button-or-action | repeated-text |
| src/App.test.tsx:57:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:57:57 | text | 학생으로 시작 | button-or-action | repeated-text |
| src/App.test.tsx:58:45 | text | 초대 코드 | learner-text-candidate | repeated-text |
| src/App.test.tsx:58:74 | text | A1B2C3 | learner-text-candidate | repeated-text |
| src/App.test.tsx:59:39 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:59:57 | text | 학급 들어가기 | button-or-action | repeated-text |
| src/App.test.tsx:60:30 | text | button | button-or-action | repeated-text |
| src/App.test.tsx:60:48 | text | 지금 바로 대결! | button-or-action | repeated-text |
| src/App.tsx:66:57 | text | {}); setView('role'); }; // 실제 환경에서만 미로그인 진입을 막는다. vitest의 MODE는 'test'이므로 // 테스트 흐름은 Plan 1과 동일하게 통과한다. const effectivelySignedOut = !loading && user === null && import.meta.env.MODE !== 'test'; if (view !== 'login' && effectivelySignedOut) { return | learner-text-candidate | long-or-dense, technical-or-internal |
| src/App.tsx:80:66 | text | 불러오는 중... | learner-text-candidate | — |
| src/App.tsx:113:42 | text | 선생님 | learner-text-candidate | repeated-text |
| src/App.tsx:153:50 | text | 선생님 | learner-text-candidate | repeated-text |
| src/App.tsx:164:54 | text | 학생 | learner-text-candidate | repeated-text |
| src/App.tsx:180:43 | text | 학생 | learner-text-candidate | repeated-text |
| src/App.tsx:205:44 | text | 선생님 | learner-text-candidate | repeated-text |
| src/App.tsx:237:28 | title | 선생님 공간은 다음 단계에서 열려요 | title | — |
| src/App.tsx:323:37 | text | a.id === editingId); editorModal = ( | learner-text-candidate | technical-or-internal |
| src/App.tsx:325:34 | text | 아레나 수정 | learner-text-candidate | repeated-text |
| src/App.tsx:325:45 | text | 새 아레나 만들기 | learner-text-candidate | repeated-text |
| src/App.tsx:325:79 | text | {editingId && editingProblems === null ? ( | learner-text-candidate | technical-or-internal |
| src/App.tsx:327:14 | text | 문제를 불러오는 중... | learner-text-candidate | repeated-text |
| src/App.tsx:344:50 | text | 수학 | learner-text-candidate | repeated-text |
| src/App.tsx:344:121 | text | color | learner-text-candidate | repeated-text |
| src/App.tsx:368:307 | text | color | learner-text-candidate | repeated-text |
| src/App.tsx:373:51 | text | 학급을 먼저 골라주세요 | learner-text-candidate | — |
| src/App.tsx:379:28 | text | 삭제에 실패했어요. 다시 시도해주세요. | feedback-or-error | shaming-tone |
| src/App.tsx:464:15 | text | 학급 목록을 불러오는 중... | learner-text-candidate | repeated-text |
| src/App.tsx:479:15 | text | 학급으로 들어가는 중... | learner-text-candidate | — |
| src/App.tsx:538:33 | text | { if ((profile?.stars ?? 0) | learner-text-candidate | — |
| src/App.tsx:571:16 | text | void; }) { const { roomId, busy, error, findOrCreate } = useMatch(arenaId, me); const [problems, setProblems] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/App.tsx:617:42 | text | isCorrectAnswer(a, ordered[i] ?? { answerIndex: -1 })).length; void finishAndAward({ roomId: roomId!, winnerUid: room.winnerUid, myUid: me.uid, myCorrect: correct, myWins, myStreak, }); }, [room, awarded, ordered, roomId, me.uid, myWins, myStreak]); if (error) { return ( | feedback-or-error | long-or-dense, technical-or-internal |
| src/App.tsx:633:79 | text | 아레나로 돌아가기 | button-or-action | repeated-text |
| src/App.tsx:644:12 | text | 같은 반 친구와 연결 중... | learner-text-candidate | — |
| src/TeacherGate.test.tsx:17:17 | text | 김선생 | learner-text-candidate | repeated-text |
| src/TeacherGate.test.tsx:23:51 | text | { state.classrooms = [{ id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' }]; state.loading = false; const onDone = vi.fn(); render( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/TeacherGate.test.tsx:24:44 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/TeacherGate.test.tsx:31:53 | text | { state.classrooms = [ { id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' }, { id: 'C2', name: '5학년 1반', inviteCode: 'BBBBBB' }, ]; state.loading = false; const onDone = vi.fn(); render( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/TeacherGate.test.tsx:33:26 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/TeacherGate.test.tsx:34:26 | text | 5학년 1반 | learner-text-candidate | repeated-text |
| src/TeacherGate.test.tsx:39:30 | text | 어느 학급으로 들어갈까요? | learner-text-candidate | repeated-text |
| src/TeacherGate.test.tsx:40:39 | text | button | button-or-action | repeated-text |
| src/TeacherGate.test.tsx:48:35 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/TeacherGate.test.tsx:55:30 | text | 학급 목록을 불러오는 중... | learner-text-candidate | repeated-text |
| src/components/AccountChip.test.tsx:7:31 | text | 김선생 | learner-text-candidate | repeated-text |
| src/components/AccountChip.test.tsx:8:30 | text | 김선생 | learner-text-candidate | repeated-text |
| src/components/AccountChip.test.tsx:9:31 | text | kim@school.kr | learner-text-candidate | repeated-text |
| src/components/AccountChip.test.tsx:14:31 | text | 일호 | learner-text-candidate | repeated-text |
| src/components/AccountChip.test.tsx:15:30 | text | 일호 | learner-text-candidate | repeated-text |
| src/components/AccountChip.tsx:12:74 | text | {photoURL && ( | learner-text-candidate | — |
| src/components/ArenaCard.tsx:40:78 | text | {emoji ?? '🎲'} | learner-text-candidate | — |
| src/components/ArenaCard.tsx:47:84 | text | {body} {footer && | learner-text-candidate | — |
| src/components/DesignSystem.test.tsx:10:18 | text | 내용 | learner-text-candidate | repeated-text |
| src/components/DesignSystem.test.tsx:11:30 | text | 내용 | learner-text-candidate | repeated-text |
| src/components/DesignSystem.test.tsx:14:7 | text | calls onClick when primary button pressed | button-or-action | — |
| src/components/DesignSystem.test.tsx:14:56 | text | { const onClick = vi.fn(); render( | button-or-action | — |
| src/components/DesignSystem.test.tsx:16:45 | text | 시작 | learner-text-candidate | repeated-text |
| src/components/DesignSystem.test.tsx:17:39 | text | button | button-or-action | repeated-text |
| src/components/DesignSystem.test.tsx:17:57 | text | 시작 | button-or-action | repeated-text |
| src/components/DesignSystem.test.tsx:41:46 | text | { const onAction = vi.fn(); render( | learner-text-candidate | — |
| src/components/DesignSystem.test.tsx:43:31 | title | 아직 없어요 | title | — |
| src/components/DesignSystem.test.tsx:43:52 | text | 만들기 | learner-text-candidate | repeated-text |
| src/components/DesignSystem.test.tsx:44:39 | text | button | button-or-action | repeated-text |
| src/components/DesignSystem.test.tsx:44:57 | text | 만들기 | button-or-action | repeated-text |
| src/components/EmptyState.tsx:12:38 | text | {actionLabel && onAction && ( | button-or-action | — |
| src/components/InviteQR.tsx:19:23 | text | QR을 만드는 중... | learner-text-candidate | — |
| src/components/InviteQR.tsx:20:30 | alt | 학급 초대 QR | alt | technical-or-internal |
| src/components/Modal.test.tsx:6:7 | text | closes with the X button | button-or-action | — |
| src/components/Modal.test.tsx:6:39 | text | { const onClose = vi.fn(); render( | button-or-action | repeated-text |
| src/components/Modal.test.tsx:9:21 | title | 새 아레나 만들기 | title | repeated-text |
| src/components/Modal.test.tsx:10:12 | text | 내용 | learner-text-candidate | repeated-text |
| src/components/Modal.test.tsx:13:48 | text | 새 아레나 만들기 | learner-text-candidate | repeated-text |
| src/components/Modal.test.tsx:14:39 | text | button | button-or-action | repeated-text |
| src/components/Modal.test.tsx:14:57 | text | 닫기 | button-or-action | repeated-text |
| src/components/Modal.test.tsx:18:33 | text | { const onClose = vi.fn(); render( | learner-text-candidate | repeated-text |
| src/components/Modal.test.tsx:21:21 | title | 제목 | title | repeated-text |
| src/components/Modal.test.tsx:22:12 | text | 내용 | learner-text-candidate | repeated-text |
| src/components/Modal.test.tsx:29:42 | text | { const { container } = render( | learner-text-candidate | repeated-text |
| src/components/Modal.test.tsx:31:21 | title | 제목 | title | repeated-text |
| src/components/Modal.test.tsx:32:12 | text | 내용 | learner-text-candidate | repeated-text |
| src/components/Modal.test.tsx:35:47 | text | [aria-hidden="true"] | learner-text-candidate | technical-or-internal |
| src/components/Modal.tsx:18:17 | text | window.removeEventListener('keydown', onKey); }, [onClose]); return ( | learner-text-candidate | long-or-dense |
| src/components/Modal.tsx:22:104 | text | true | learner-text-candidate | — |
| src/components/Modal.tsx:29:63 | aria-label | 닫기 | aria-label, button-or-action | repeated-text |
| src/components/PrimaryButton.tsx:10:17 | text | void; pulse?: boolean; disabled?: boolean; }) { return ( | button-or-action | long-or-dense, technical-or-internal |
| src/components/RememberLogin.test.tsx:8:38 | text | 김선생 | learner-text-candidate | repeated-text |
| src/components/RememberLogin.test.tsx:14:30 | text | 이 브라우저에 로그인 정보를 저장할까요? | learner-text-candidate | repeated-text |
| src/components/RememberLogin.test.tsx:15:39 | text | button | button-or-action | repeated-text |
| src/components/RememberLogin.test.tsx:15:57 | text | 저장하기 | button-or-action | repeated-text |
| src/components/RememberLogin.tsx:9:19 | title | 로그인 유지 | title | — |
| src/components/RememberLogin.tsx:10:45 | text | 이 브라우저에 로그인 정보를 저장할까요? | learner-text-candidate | repeated-text |
| src/components/RememberLogin.tsx:11:35 | text | 저장하면 다음에 같은 구글 프로필로 자동으로 로그인돼요. | learner-text-candidate | — |
| src/components/RememberLogin.tsx:13:103 | text | 저장하기 | button-or-action | repeated-text |
| src/components/RememberLogin.tsx:16:92 | text | 이번만 사용 | button-or-action | — |
| src/components/Timer.test.tsx:8:35 | text | 남은 시간 | learner-text-candidate | repeated-text |
| src/components/Timer.test.tsx:8:63 | text | 20초 | learner-text-candidate | — |
| src/components/Timer.test.tsx:14:35 | text | 남은 시간 | learner-text-candidate | repeated-text |
| src/components/Timer.test.tsx:14:63 | text | 5초 | learner-text-candidate | — |
| src/components/Timer.tsx:8:17 | text | clearInterval(t); }, [nowMs]); const now = nowMs ?? liveNow; const left = Math.max(0, Math.ceil((endsAt - now) / 1000)); return | learner-text-candidate | long-or-dense |
| src/components/Timer.tsx:12:25 | aria-label | 남은 시간 | aria-label | repeated-text |
| src/components/Timer.tsx:12:32 | text | {left}초 | learner-text-candidate | — |
| src/components/Toggle.tsx:10:31 | text | void; label: ReactNode; small?: boolean; }) { return ( | button-or-action | long-or-dense, technical-or-internal |
| src/components/Toggle.tsx:19:37 | text | string | learner-text-candidate | repeated-text |
| src/components/UpdateLog.test.tsx:7:64 | text | 그림이 8개씩 나왔어요 | learner-text-candidate | repeated-text |
| src/components/UpdateLog.test.tsx:9:30 | text | 그림이 8개씩 나왔어요 | learner-text-candidate | repeated-text |
| src/components/UpdateLog.test.tsx:14:30 | text | 아직 기록된 업데이트가 없어요 | learner-text-candidate | repeated-text |
| src/components/UpdateLog.tsx:5:39 | text | 아직 기록된 업데이트가 없어요 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:29 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:35 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:41 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:47 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:53 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:59 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:65 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:71 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:77 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:83 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:89 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:98 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.test.tsx:8:109 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:6:6 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:7:6 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:8:6 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:9:6 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:10:6 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:11:6 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:12:6 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:13:6 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:14:6 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:15:6 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:16:6 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:17:6 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:18:6 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1071:10 | text | math-plus | learner-text-candidate | — |
| src/components/illustrations.tsx:1071:32 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1071:45 | text | 더하기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1072:10 | text | math-ruler | learner-text-candidate | — |
| src/components/illustrations.tsx:1072:33 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1072:46 | text | 자 | learner-text-candidate | — |
| src/components/illustrations.tsx:1073:10 | text | math-pizza | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1073:33 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1073:46 | text | 피자 분수 | learner-text-candidate | — |
| src/components/illustrations.tsx:1074:10 | text | math-calc | learner-text-candidate | — |
| src/components/illustrations.tsx:1074:32 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1074:45 | text | 계산기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1075:10 | text | math-clock | learner-text-candidate | — |
| src/components/illustrations.tsx:1075:33 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1075:46 | text | 시계 | learner-text-candidate | — |
| src/components/illustrations.tsx:1076:10 | text | math-shapes | learner-text-candidate | — |
| src/components/illustrations.tsx:1076:34 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1076:47 | text | 도형 | learner-text-candidate | — |
| src/components/illustrations.tsx:1077:10 | text | math-scale | learner-text-candidate | — |
| src/components/illustrations.tsx:1077:33 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1077:46 | text | 저울 | learner-text-candidate | — |
| src/components/illustrations.tsx:1078:10 | text | math-dice | learner-text-candidate | — |
| src/components/illustrations.tsx:1078:32 | text | 수학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1078:45 | text | 주사위 | learner-text-candidate | — |
| src/components/illustrations.tsx:1079:10 | text | kor-book | learner-text-candidate | — |
| src/components/illustrations.tsx:1079:31 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1079:44 | text | 책 | learner-text-candidate | — |
| src/components/illustrations.tsx:1080:10 | text | kor-pencil | learner-text-candidate | — |
| src/components/illustrations.tsx:1080:33 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1080:46 | text | 연필 | learner-text-candidate | — |
| src/components/illustrations.tsx:1081:10 | text | kor-chat | learner-text-candidate | — |
| src/components/illustrations.tsx:1081:31 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1081:44 | text | 말풍선 | learner-text-candidate | — |
| src/components/illustrations.tsx:1082:10 | text | kor-letter | learner-text-candidate | — |
| src/components/illustrations.tsx:1082:33 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1082:46 | text | 편지 | learner-text-candidate | — |
| src/components/illustrations.tsx:1083:10 | text | kor-scroll | learner-text-candidate | — |
| src/components/illustrations.tsx:1083:33 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1083:46 | text | 두루마리 | learner-text-candidate | — |
| src/components/illustrations.tsx:1084:10 | text | kor-brush | learner-text-candidate | — |
| src/components/illustrations.tsx:1084:32 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1084:45 | text | 붓 | learner-text-candidate | — |
| src/components/illustrations.tsx:1085:10 | text | kor-mic | learner-text-candidate | — |
| src/components/illustrations.tsx:1085:30 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1085:43 | text | 발표 마이크 | learner-text-candidate | — |
| src/components/illustrations.tsx:1086:10 | text | kor-lens | learner-text-candidate | — |
| src/components/illustrations.tsx:1086:31 | text | 국어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1086:44 | text | 돋보기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1087:10 | text | soc-map | learner-text-candidate | — |
| src/components/illustrations.tsx:1087:30 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1087:43 | text | 지도 | learner-text-candidate | — |
| src/components/illustrations.tsx:1088:10 | text | soc-compass | learner-text-candidate | — |
| src/components/illustrations.tsx:1088:34 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1088:47 | text | 나침반 | learner-text-candidate | — |
| src/components/illustrations.tsx:1089:10 | text | soc-globe | learner-text-candidate | — |
| src/components/illustrations.tsx:1089:32 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1089:45 | text | 지구본 | learner-text-candidate | — |
| src/components/illustrations.tsx:1090:10 | text | soc-flag | learner-text-candidate | — |
| src/components/illustrations.tsx:1090:31 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1090:44 | text | 깃발 | learner-text-candidate | — |
| src/components/illustrations.tsx:1091:10 | text | soc-house | learner-text-candidate | — |
| src/components/illustrations.tsx:1091:32 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1091:45 | text | 집 | learner-text-candidate | — |
| src/components/illustrations.tsx:1092:10 | text | soc-train | learner-text-candidate | — |
| src/components/illustrations.tsx:1092:32 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1092:45 | text | 기차 | learner-text-candidate | — |
| src/components/illustrations.tsx:1093:10 | text | soc-jar | learner-text-candidate | — |
| src/components/illustrations.tsx:1093:30 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1093:43 | text | 항아리 유물 | learner-text-candidate | — |
| src/components/illustrations.tsx:1094:10 | text | soc-coin | learner-text-candidate | — |
| src/components/illustrations.tsx:1094:31 | text | 사회 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1094:44 | text | 동전 | learner-text-candidate | — |
| src/components/illustrations.tsx:1095:10 | text | sci-flask | learner-text-candidate | — |
| src/components/illustrations.tsx:1095:32 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1095:45 | text | 플라스크 | learner-text-candidate | — |
| src/components/illustrations.tsx:1096:10 | text | sci-star | learner-text-candidate | — |
| src/components/illustrations.tsx:1096:31 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1096:44 | text | 별 | learner-text-candidate | — |
| src/components/illustrations.tsx:1097:10 | text | sci-drop | learner-text-candidate | — |
| src/components/illustrations.tsx:1097:31 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1097:44 | text | 물방울 | learner-text-candidate | — |
| src/components/illustrations.tsx:1098:10 | text | sci-leaf | learner-text-candidate | — |
| src/components/illustrations.tsx:1098:31 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1098:44 | text | 잎 | learner-text-candidate | — |
| src/components/illustrations.tsx:1099:10 | text | sci-magnet | learner-text-candidate | — |
| src/components/illustrations.tsx:1099:33 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1099:46 | text | 자석 | learner-text-candidate | — |
| src/components/illustrations.tsx:1100:10 | text | sci-rocket | learner-text-candidate | — |
| src/components/illustrations.tsx:1100:33 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1100:46 | text | 로켓 | learner-text-candidate | — |
| src/components/illustrations.tsx:1101:10 | text | sci-scope | learner-text-candidate | — |
| src/components/illustrations.tsx:1101:32 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1101:45 | text | 현미경 | learner-text-candidate | — |
| src/components/illustrations.tsx:1102:10 | text | sci-cloud | learner-text-candidate | — |
| src/components/illustrations.tsx:1102:32 | text | 과학 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1102:45 | text | 구름과 해 | learner-text-candidate | — |
| src/components/illustrations.tsx:1103:10 | text | eng-abc | learner-text-candidate | — |
| src/components/illustrations.tsx:1103:30 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1103:43 | text | ABC 상자 | learner-text-candidate | technical-or-internal |
| src/components/illustrations.tsx:1104:10 | text | eng-cap | learner-text-candidate | — |
| src/components/illustrations.tsx:1104:30 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1104:43 | text | 학사모 | learner-text-candidate | — |
| src/components/illustrations.tsx:1105:10 | text | eng-mic | learner-text-candidate | — |
| src/components/illustrations.tsx:1105:30 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1105:43 | text | 마이크 | learner-text-candidate | — |
| src/components/illustrations.tsx:1106:10 | text | eng-phones | learner-text-candidate | — |
| src/components/illustrations.tsx:1106:33 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1106:46 | text | 헤드폰 | learner-text-candidate | — |
| src/components/illustrations.tsx:1107:10 | text | eng-bus | learner-text-candidate | — |
| src/components/illustrations.tsx:1107:30 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1107:43 | text | 버스 | learner-text-candidate | — |
| src/components/illustrations.tsx:1108:10 | text | eng-balloon | learner-text-candidate | — |
| src/components/illustrations.tsx:1108:34 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1108:47 | text | 인사 말풍선 | learner-text-candidate | — |
| src/components/illustrations.tsx:1109:10 | text | eng-book | learner-text-candidate | — |
| src/components/illustrations.tsx:1109:31 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1109:44 | text | 영어 그림책 | learner-text-candidate | — |
| src/components/illustrations.tsx:1110:10 | text | eng-pen | learner-text-candidate | — |
| src/components/illustrations.tsx:1110:30 | text | 영어 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1110:43 | text | 쓰기 연필 | learner-text-candidate | — |
| src/components/illustrations.tsx:1111:10 | text | mor-heart | learner-text-candidate | — |
| src/components/illustrations.tsx:1111:32 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1111:45 | text | 마음 하트 | learner-text-candidate | — |
| src/components/illustrations.tsx:1112:10 | text | mor-hands | learner-text-candidate | — |
| src/components/illustrations.tsx:1112:32 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1112:45 | text | 손잡기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1113:10 | text | mor-balance | learner-text-candidate | — |
| src/components/illustrations.tsx:1113:34 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1113:47 | text | 공정 저울 | learner-text-candidate | — |
| src/components/illustrations.tsx:1114:10 | text | mor-sprout | learner-text-candidate | — |
| src/components/illustrations.tsx:1114:33 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1114:46 | text | 새싹 지구 | learner-text-candidate | — |
| src/components/illustrations.tsx:1115:10 | text | mor-lamp | learner-text-candidate | — |
| src/components/illustrations.tsx:1115:31 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1115:44 | text | 등불 | learner-text-candidate | — |
| src/components/illustrations.tsx:1116:10 | text | mor-family | learner-text-candidate | — |
| src/components/illustrations.tsx:1116:33 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1116:46 | text | 가족 집 | learner-text-candidate | — |
| src/components/illustrations.tsx:1117:10 | text | mor-badge | learner-text-candidate | — |
| src/components/illustrations.tsx:1117:32 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1117:45 | text | 약속 방패 | learner-text-candidate | — |
| src/components/illustrations.tsx:1118:10 | text | mor-gift | learner-text-candidate | — |
| src/components/illustrations.tsx:1118:31 | text | 도덕 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1118:44 | text | 나눔 상자 | learner-text-candidate | — |
| src/components/illustrations.tsx:1119:10 | text | phy-ball | learner-text-candidate | — |
| src/components/illustrations.tsx:1119:31 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1119:44 | text | 축구공 | learner-text-candidate | — |
| src/components/illustrations.tsx:1120:10 | text | phy-rope | learner-text-candidate | — |
| src/components/illustrations.tsx:1120:31 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1120:44 | text | 줄넘기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1121:10 | text | phy-shoe | learner-text-candidate | — |
| src/components/illustrations.tsx:1121:31 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1121:44 | text | 운동화 | learner-text-candidate | — |
| src/components/illustrations.tsx:1122:10 | text | phy-whistle | learner-text-candidate | — |
| src/components/illustrations.tsx:1122:34 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1122:47 | text | 호각 | learner-text-candidate | — |
| src/components/illustrations.tsx:1123:10 | text | phy-medal | learner-text-candidate | — |
| src/components/illustrations.tsx:1123:32 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1123:45 | text | 메달 | learner-text-candidate | — |
| src/components/illustrations.tsx:1124:10 | text | phy-mat | learner-text-candidate | — |
| src/components/illustrations.tsx:1124:30 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1124:43 | text | 체조 매트 | learner-text-candidate | — |
| src/components/illustrations.tsx:1125:10 | text | phy-cone | learner-text-candidate | — |
| src/components/illustrations.tsx:1125:31 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1125:44 | text | 콘 | learner-text-candidate | — |
| src/components/illustrations.tsx:1126:10 | text | phy-ribbon | learner-text-candidate | — |
| src/components/illustrations.tsx:1126:33 | text | 체육 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1126:46 | text | 리듬 리본 | learner-text-candidate | — |
| src/components/illustrations.tsx:1127:10 | text | mus-note | learner-text-candidate | — |
| src/components/illustrations.tsx:1127:31 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1127:44 | text | 음표 | learner-text-candidate | — |
| src/components/illustrations.tsx:1128:10 | text | mus-drum | learner-text-candidate | — |
| src/components/illustrations.tsx:1128:31 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1128:44 | text | 북 | learner-text-candidate | — |
| src/components/illustrations.tsx:1129:10 | text | mus-flute | learner-text-candidate | — |
| src/components/illustrations.tsx:1129:32 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1129:45 | text | 리코더 | learner-text-candidate | — |
| src/components/illustrations.tsx:1130:10 | text | mus-keys | learner-text-candidate | — |
| src/components/illustrations.tsx:1130:31 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1130:44 | text | 건반 | learner-text-candidate | — |
| src/components/illustrations.tsx:1131:10 | text | mus-bell | learner-text-candidate | — |
| src/components/illustrations.tsx:1131:31 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1131:44 | text | 핸드벨 | learner-text-candidate | — |
| src/components/illustrations.tsx:1132:10 | text | mus-speaker | learner-text-candidate | — |
| src/components/illustrations.tsx:1132:34 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1132:47 | text | 스피커 | learner-text-candidate | — |
| src/components/illustrations.tsx:1133:10 | text | mus-song | learner-text-candidate | — |
| src/components/illustrations.tsx:1133:31 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1133:44 | text | 노래 마이크 | learner-text-candidate | — |
| src/components/illustrations.tsx:1134:10 | text | mus-janggu | learner-text-candidate | — |
| src/components/illustrations.tsx:1134:33 | text | 음악 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1134:46 | text | 장구 | learner-text-candidate | — |
| src/components/illustrations.tsx:1135:10 | text | art-palette | learner-text-candidate | — |
| src/components/illustrations.tsx:1135:34 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1135:47 | text | 팔레트 | learner-text-candidate | — |
| src/components/illustrations.tsx:1136:10 | text | art-crayon | learner-text-candidate | — |
| src/components/illustrations.tsx:1136:33 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1136:46 | text | 크레파스 | learner-text-candidate | — |
| src/components/illustrations.tsx:1137:10 | text | art-frame | learner-text-candidate | — |
| src/components/illustrations.tsx:1137:32 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1137:45 | text | 액자 | learner-text-candidate | — |
| src/components/illustrations.tsx:1138:10 | text | art-scissors | learner-text-candidate | — |
| src/components/illustrations.tsx:1138:35 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1138:48 | text | 가위 | learner-text-candidate | — |
| src/components/illustrations.tsx:1139:10 | text | art-pot | learner-text-candidate | — |
| src/components/illustrations.tsx:1139:30 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1139:43 | text | 도자기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1140:10 | text | art-camera | learner-text-candidate | — |
| src/components/illustrations.tsx:1140:33 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1140:46 | text | 카메라 | learner-text-candidate | — |
| src/components/illustrations.tsx:1141:10 | text | art-rainbow | learner-text-candidate | — |
| src/components/illustrations.tsx:1141:34 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1141:47 | text | 무지개 | learner-text-candidate | — |
| src/components/illustrations.tsx:1142:10 | text | art-stamp | learner-text-candidate | — |
| src/components/illustrations.tsx:1142:32 | text | 미술 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1142:45 | text | 판화 도장 | learner-text-candidate | — |
| src/components/illustrations.tsx:1143:10 | text | pra-pot | learner-text-candidate | — |
| src/components/illustrations.tsx:1143:30 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1143:43 | text | 요리 냄비 | learner-text-candidate | — |
| src/components/illustrations.tsx:1144:10 | text | pra-needle | learner-text-candidate | — |
| src/components/illustrations.tsx:1144:33 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1144:46 | text | 바늘과 실 | learner-text-candidate | — |
| src/components/illustrations.tsx:1145:10 | text | pra-hammer | learner-text-candidate | — |
| src/components/illustrations.tsx:1145:33 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1145:46 | text | 망치 | learner-text-candidate | — |
| src/components/illustrations.tsx:1146:10 | text | pra-robot | learner-text-candidate | — |
| src/components/illustrations.tsx:1146:32 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1146:45 | text | 로봇 | learner-text-candidate | — |
| src/components/illustrations.tsx:1147:10 | text | pra-plug | learner-text-candidate | — |
| src/components/illustrations.tsx:1147:31 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1147:44 | text | 플러그 | learner-text-candidate | — |
| src/components/illustrations.tsx:1148:10 | text | pra-recycle | learner-text-candidate | — |
| src/components/illustrations.tsx:1148:34 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1148:47 | text | 재활용 | learner-text-candidate | abstract-or-formal |
| src/components/illustrations.tsx:1149:10 | text | pra-sprout | learner-text-candidate | — |
| src/components/illustrations.tsx:1149:33 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1149:46 | text | 모종 화분 | learner-text-candidate | — |
| src/components/illustrations.tsx:1150:10 | text | pra-pig | learner-text-candidate | — |
| src/components/illustrations.tsx:1150:30 | text | 실과 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1150:43 | text | 저금통 | learner-text-candidate | — |
| src/components/illustrations.tsx:1151:10 | text | bar-tooth | learner-text-candidate | — |
| src/components/illustrations.tsx:1151:32 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1151:48 | text | 칫솔 | learner-text-candidate | — |
| src/components/illustrations.tsx:1152:10 | text | bar-light | learner-text-candidate | — |
| src/components/illustrations.tsx:1152:32 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1152:48 | text | 신호등 | learner-text-candidate | — |
| src/components/illustrations.tsx:1153:10 | text | bar-taegeuk | learner-text-candidate | — |
| src/components/illustrations.tsx:1153:34 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1153:50 | text | 태극기 | learner-text-candidate | — |
| src/components/illustrations.tsx:1154:10 | text | bar-clock | learner-text-candidate | — |
| src/components/illustrations.tsx:1154:32 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1154:48 | text | 알람시계 | learner-text-candidate | — |
| src/components/illustrations.tsx:1155:10 | text | bar-handheart | learner-text-candidate | — |
| src/components/illustrations.tsx:1155:36 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1155:52 | text | 손 하트 | learner-text-candidate | — |
| src/components/illustrations.tsx:1156:10 | text | bar-bin | learner-text-candidate | — |
| src/components/illustrations.tsx:1156:30 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1156:46 | text | 분리수거함 | learner-text-candidate | — |
| src/components/illustrations.tsx:1157:10 | text | bar-bag | learner-text-candidate | — |
| src/components/illustrations.tsx:1157:30 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1157:46 | text | 책가방 | learner-text-candidate | — |
| src/components/illustrations.tsx:1158:10 | text | bar-umbrella | learner-text-candidate | — |
| src/components/illustrations.tsx:1158:35 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1158:51 | text | 우산 | learner-text-candidate | — |
| src/components/illustrations.tsx:1159:10 | text | slu-school | learner-text-candidate | — |
| src/components/illustrations.tsx:1159:33 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1159:51 | text | 학교 | learner-text-candidate | — |
| src/components/illustrations.tsx:1160:10 | text | slu-map | learner-text-candidate | — |
| src/components/illustrations.tsx:1160:30 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1160:48 | text | 마을 지도 | learner-text-candidate | — |
| src/components/illustrations.tsx:1161:10 | text | slu-hanok | learner-text-candidate | — |
| src/components/illustrations.tsx:1161:32 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1161:50 | text | 한옥 | learner-text-candidate | — |
| src/components/illustrations.tsx:1162:10 | text | slu-globe | learner-text-candidate | — |
| src/components/illustrations.tsx:1162:32 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1162:50 | text | 세계 지구 | learner-text-candidate | — |
| src/components/illustrations.tsx:1163:10 | text | slu-leafcal | learner-text-candidate | — |
| src/components/illustrations.tsx:1163:34 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1163:52 | text | 잎 달력 | learner-text-candidate | — |
| src/components/illustrations.tsx:1164:10 | text | slu-tool | learner-text-candidate | — |
| src/components/illustrations.tsx:1164:31 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1164:49 | text | 공구함 | learner-text-candidate | — |
| src/components/illustrations.tsx:1165:10 | text | slu-bulb | learner-text-candidate | — |
| src/components/illustrations.tsx:1165:31 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1165:49 | text | 궁금 전구 | learner-text-candidate | — |
| src/components/illustrations.tsx:1166:10 | text | slu-seed | learner-text-candidate | — |
| src/components/illustrations.tsx:1166:31 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1166:49 | text | 씨앗 | learner-text-candidate | — |
| src/components/illustrations.tsx:1167:10 | text | joy-kite | learner-text-candidate | — |
| src/components/illustrations.tsx:1167:31 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1167:48 | text | 연 | learner-text-candidate | — |
| src/components/illustrations.tsx:1168:10 | text | joy-ball | learner-text-candidate | — |
| src/components/illustrations.tsx:1168:31 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1168:48 | text | 놀이공 | learner-text-candidate | — |
| src/components/illustrations.tsx:1169:10 | text | joy-drum | learner-text-candidate | — |
| src/components/illustrations.tsx:1169:31 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1169:48 | text | 소고 | learner-text-candidate | — |
| src/components/illustrations.tsx:1170:10 | text | joy-mask | learner-text-candidate | — |
| src/components/illustrations.tsx:1170:31 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1170:48 | text | 탈 | learner-text-candidate | — |
| src/components/illustrations.tsx:1171:10 | text | joy-flower | learner-text-candidate | — |
| src/components/illustrations.tsx:1171:33 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1171:50 | text | 꽃 | learner-text-candidate | — |
| src/components/illustrations.tsx:1172:10 | text | joy-blocks | learner-text-candidate | — |
| src/components/illustrations.tsx:1172:33 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1172:50 | text | 쌓기나무 | learner-text-candidate | — |
| src/components/illustrations.tsx:1173:10 | text | joy-crayon | learner-text-candidate | — |
| src/components/illustrations.tsx:1173:33 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1173:50 | text | 크레파스 상자 | learner-text-candidate | — |
| src/components/illustrations.tsx:1174:10 | text | joy-slide | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/components/illustrations.tsx:1174:32 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/components/illustrations.tsx:1174:49 | text | 미끄럼틀 | learner-text-candidate | — |
| src/components/illustrations.tsx:1178:31 | text | m.subject === subject); } /** 없는 ID면 첫 그림으로. */ export function Illust({ id, size }: { id?: string; size?: number }) { const Art = (id && ART[id]) \|\| ART['math-plus']; return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/data/curriculum2022.test.ts:23:42 | text | 바른 생활 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:23:51 | text | 슬기로운 생활 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:23:62 | text | 즐거운 생활 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:23:72 | text | 국어 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:23:78 | text | 수학 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:27:35 | text | 수학 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:29:41 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:33:29 | text | 영어 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:34:29 | text | 사회 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:40:26 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:40:78 | text | 수학 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:41:26 | text | [6국04-03] | learner-text-candidate | — |
| src/data/curriculum2022.test.ts:41:78 | text | 국어 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:42:26 | text | 없음 | learner-text-candidate | — |
| src/data/curriculum2022.test.ts:46:40 | text | 수학 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:47:56 | text | [4수01-09] | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:49:41 | text | [4수01-09] | learner-text-candidate | repeated-text |
| src/data/curriculum2022.test.ts:50:41 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/data/curriculum2022.ts:11:62 | text | ; export const GRADE_BANDS = ['1-2', '3-4', '5-6']; /** 학년 → 학년군. */ export function bandOfGrade(grade: number): string { if (grade | learner-text-candidate | long-or-dense |
| src/data/curriculum2022.ts:39:27 | text | 국어 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.ts:39:33 | text | 수학 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.ts:39:39 | text | 사회 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.ts:39:45 | text | 과학 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.ts:39:51 | text | 영어 | learner-text-candidate | repeated-text |
| src/data/curriculum2022.ts:45:39 | text | c === code); if (found) return { band, subject, summary: found[1] }; } } return null; } /** 학급 아레나들의 standards[]에 코드가 하나라도 있으면 출제됨. */ export function coverageOf( standards: Standard[], arenas: { standards?: string[] }[], ): { code: string; summary: string; covered: boolean }[] { const covered = new Set | learner-text-candidate | long-or-dense, technical-or-internal |
| src/data/defaultArenas.ts:33:31 | text | seed-학급ID-slug | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/data/shop.test.ts:13:7 | text | has free starter avatar and title | learner-text-candidate | — |
| src/data/shop.test.ts:15:24 | text | sprout | learner-text-candidate | repeated-text |
| src/data/shop.test.ts:20:34 | text | sprout | learner-text-candidate | repeated-text |
| src/data/shop.test.ts:26:24 | text | legend | learner-text-candidate | repeated-text |
| src/data/shop.test.ts:26:35 | text | legend | learner-text-candidate | repeated-text |
| src/data/shop.ts:17:24 | text | 개구리 | learner-text-candidate | — |
| src/data/shop.ts:18:23 | text | 고양이 | learner-text-candidate | — |
| src/data/shop.ts:19:23 | text | 강아지 | learner-text-candidate | — |
| src/data/shop.ts:20:26 | text | 거북이 | learner-text-candidate | — |
| src/data/shop.ts:21:26 | text | 토끼 | learner-text-candidate | — |
| src/data/shop.ts:22:25 | text | 병아리 | learner-text-candidate | — |
| src/data/shop.ts:23:25 | text | 호랑이 | learner-text-candidate | — |
| src/data/shop.ts:24:25 | text | 판다 | learner-text-candidate | — |
| src/data/shop.ts:25:27 | text | 햄스터 | learner-text-candidate | — |
| src/data/shop.ts:26:23 | text | 여우 | learner-text-candidate | — |
| src/data/shop.ts:27:27 | text | 유니콘 | learner-text-candidate | — |
| src/data/shop.ts:28:27 | text | 펭귄 | learner-text-candidate | — |
| src/data/shop.ts:29:23 | text | 부엉이 | learner-text-candidate | — |
| src/data/shop.ts:30:26 | text | 드래곤 | learner-text-candidate | — |
| src/data/shop.ts:31:24 | text | 공룡 | learner-text-candidate | — |
| src/data/shop.ts:35:10 | text | sprout | learner-text-candidate | repeated-text |
| src/data/shop.ts:35:27 | text | 새싹 | learner-text-candidate | repeated-text |
| src/data/shop.ts:36:10 | text | challenger | learner-text-candidate | — |
| src/data/shop.ts:36:31 | text | 도전자 | learner-text-candidate | — |
| src/data/shop.ts:37:10 | text | streak | learner-text-candidate | — |
| src/data/shop.ts:37:27 | text | 연승왕 | learner-text-candidate | — |
| src/data/shop.ts:38:10 | text | doctor | learner-text-candidate | — |
| src/data/shop.ts:38:27 | text | 퀴즈박사 | learner-text-candidate | — |
| src/data/shop.ts:39:10 | text | guardian | learner-text-candidate | — |
| src/data/shop.ts:39:29 | text | 수호자 | learner-text-candidate | — |
| src/data/shop.ts:40:10 | text | legend | learner-text-candidate | repeated-text |
| src/data/shop.ts:40:27 | text | 전설 | learner-text-candidate | — |
| src/data/updatelog.ts:3:9 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/data/updatelog.ts:20:8 | text | 선생님 화면 오른쪽 위에 ‘업데이트 내역’ 버튼이 생겼어요. 누르면 날짜별로 바뀐 점을 팝업으로 볼 수 있어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:21:8 | text | 새 아레나 만들기 그림이 과목마다 8개씩 나왔어요. 도덕·체육·음악·미술·실과·바른 생활·슬기로운 생활·즐거운 생활도 자기 과목 그림 8개가 나와요. 테스트 209개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:22:8 | text | AI 초안 만들기가 다시 돼요. 멈춘 AI 모델을 새 모델로 바꿨어요. 실패한 시도는 하루 20회 횟수를 깎지 않고, 실패하면 이유(횟수 초과·로그인 풀림 등)를 바로 알려줘요. | feedback-or-error | long-or-dense, technical-or-internal |
| src/data/updatelog.ts:23:8 | text | 문제 내용이 여러 줄로 보여요. 보기는 '1번 보기 내용'처럼 인풋 위에 이름이 붙고, 정답 고르기는 그대로 쓸 수 있어요. | feedback-or-error | long-or-dense |
| src/data/updatelog.ts:24:8 | text | 같은 구글 프로필로 들어오면 로그인 화면을 건너뛰고 바로 들어가요. 선생님 화면 오른쪽 위에 내 이름·사진이 보여서 계정을 확인할 수 있어요. 로그인 뒤에 '저장하기'를 누르면 다음에도 자동 로그인되고, 로그아웃 뒤 다시 로그인하면 계정을 고를 수 있어요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/data/updatelog.ts:25:8 | text | 학생 화면 오른쪽 위에도 구글 프로필 사진·이름이 보여요. 학생도 로그인 저장 기능을 똑같이 써요. | learner-text-candidate | — |
| src/data/updatelog.ts:26:8 | text | 만들기·수정 화면에서 문제가 하나씩 카드로 묶여 보여요. 카드 위에 문제 번호와 삭제 버튼이 있어 구분하기 쉬워요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:27:8 | text | '문제 해설'도 여러 줄로 쓸 수 있어요. | learner-text-candidate | — |
| src/data/updatelog.ts:28:8 | text | 만들기·수정의 '공개하기' 버튼이 '공개하기(저장하기)'로 바뀌고 크게 보여요. | learner-text-candidate | — |
| src/data/updatelog.ts:29:8 | text | 아레나 카드의 '공개' 스위치가 '대전 상대 공개'로 바뀌었어요. 켜면 대결 중에 상대 이름이 보이고, 끄면 끝날 때까지 ???로 보여요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:30:8 | text | 대결 대기 화면이 바뀌었어요. '대결 상대를 기다리는 중 ??? vs ???'에서 '1:1 매칭 완료!'가 되면 시작 버튼이 켜지고 반짝여요. 대기·진행·결과 화면 위에 아레나 카드가 보여요. 문제를 풀면 정답·땡과 현재 점수(나 몇 점 : 상대 몇 점)가 바로 보여요. | feedback-or-error | long-or-dense |
| src/data/updatelog.ts:31:8 | text | XP는 레벨·순위 전용으로 쌓이고, 상점은 별(⭐)로 사요. 대결에서 별을 벌어요(정답 1별·승리 5별·레벨업 10별 등). 처음에는 개구리로 시작하고, 토끼·판다·공룡 등 아바타 8종이 새로 나왔어요(총 15종). | feedback-or-error | long-or-dense |
| src/data/updatelog.ts:32:8 | text | '학급' 탭에 내 학급 목록이 나와요. 들어가기·이름 바꾸기·삭제가 돼요. 삭제하면 아레나와 대결 기록이 함께 지워져요. 같은 이름의 학급은 새로 만들 수 없어요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/data/updatelog.ts:38:8 | text | 만들기에서 카드 종류 고르기가 없어졌어요. 그림은 과목 갤러리에서 바로 골라요. | learner-text-candidate | multiple-actions |
| src/data/updatelog.ts:39:8 | text | 꼭 눌러야 하는 버튼에 금빛 펄스가 반짝여요(로그인·대결·AI 만들기·공개하기 등). 테스트 209개가 모두 통과했어요. | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/data/updatelog.ts:40:8 | text | '참가자 공개'가 '공개'로 짧아졌어요. 잠금·공개·읽어주기 스위치가 카드 한 행에 작게 들어가요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:41:8 | text | 로그아웃을 누르면 '정말 로그아웃 하시겠습니까?' 하고 한 번 더 물어봐요. 테스트 209개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:42:8 | text | 성취기준 고르기가 드롭다운으로 바뀌었어요. 고른 기준은 아래에 모이고 X로 지울 수 있어요. | learner-text-candidate | — |
| src/data/updatelog.ts:43:8 | text | 만들기 화면이 작은 팝업으로 떠요. 뒤가 흐릿하게 보이고 오른쪽 위 X나 Esc로 닫아요. 테스트 206개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:44:8 | text | 아레나 목록이 2열 카드로 나와요(선생님·학생 화면). 카드도 작아지고 버튼이 아래에 붙어요. 테스트 202개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:45:8 | text | 아레나 학년이 학년군으로 나와요(예: 3학년 수학 → 3-4학년 수학). 기본 6개의 성취기준도 공식 코드에 맞췄어요. 테스트 200개·에뮬 3개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:46:8 | text | 성취기준을 주신 공식 파일 기준으로 바꿨어요. 학년은 1-2·3-4·5-6학년군, 과목은 파일 그대로(바른 생활·도덕·실과 포함) 나와요. 만들기와 커버리지 지도에서 함께 써요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:47:8 | text | 새 학급을 만들면 기본 아레나 6개가 잠긴 상태로 들어있어요. 빈 교실에는 가져오기 버튼이 나와요. 테스트 196개·에뮬 3개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:48:8 | text | 새로 만드는 아레나는 과목 색상·이모지가 자동으로 들어가요(수학 하늘색➗ 등). 테스트 195개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:49:8 | text | 잠금·참가자 공개·읽어주기가 on/off 토글 스위치가 됐어요. | learner-text-candidate | — |
| src/data/updatelog.ts:50:8 | text | 아레나가 그림 카드가 됐어요. 색상 카드와 일러스트 카드(30종) 중 선생님이 골라요. 학생·선생님·은행 화면에 같이 나와요. 테스트 193개·에뮬 3개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:51:8 | text | 교육과정 성취기준을 1~6학년 5과목으로 채웠어요(2022 개정 바탕 요약). 만들기와 커버리지 지도에서 함께 써요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:52:8 | text | 새 학급을 만들면 기본 아레나 6개가 잠긴 상태로 들어있어요. 선생님이 켜기만 하면 돼요. 빈 교실에는 가져오기 버튼이 나와요. 테스트 185개·에뮬 3개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:53:8 | text | 화면을 다듬었어요. 메뉴에 지금 위치 표시가 되고, 버튼·입력칸이 읽기 쉬워졌어요. 제목 글씨도 바꿨어요. | input | abstract-or-formal, long-or-dense |
| src/data/updatelog.ts:54:8 | text | 선생님은 학급이 없으면 새로 만들고, 1개면 자동 입장, 2개 이상이면 골라서 들어가요. 테스트 175개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:55:8 | text | 학급 화면에서 학급 이름을 고치고 새 학급도 만들 수 있어요. 골라서 들어갈 때는 만들기 버튼이 안 보여요. | learner-text-candidate | multiple-actions, multiple-conditions |
| src/data/updatelog.ts:56:8 | text | 학급 관리는 학생 탭이 아니라 '학급' 탭 따로 있어요. | learner-text-candidate | — |
| src/data/updatelog.ts:57:8 | text | '학생 화면 미리보기' 버튼으로 새 탭에서 학생처럼 보고 대결에도 참여할 수 있어요. 테스트 178개·에뮬 3개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:58:8 | text | AI 아레나 생성(학년·과목·성취기준·20문항)과 10문제 랜덤 대결, 재해석 리더보드 계획을 세웠어요. 설계서와 계획서를 저장했어요. | learner-text-candidate | long-or-dense, technical-or-internal |
| src/data/updatelog.ts:59:8 | text | 기본 아레나 6개(수학2·국어·과학·사회·영어, 각 20문항) 시드 계획을 세웠어요. | learner-text-candidate | — |
| src/data/updatelog.ts:60:8 | text | 기본 아레나 6개(덧셈뺄셈·관용표현·분수·물의 여행·지도·영어, 각 20문항)를 넣는 스크립트를 만들었어요. 검사와 테스트 91개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:61:8 | text | AI 생성을 손봤어요. 로그인해야 쓸 수 있고, AI가 만든 문제는 바로 저장하지 않고 선생님이 고른 뒤 저장해요. | learner-text-candidate | long-or-dense, technical-or-internal |
| src/data/updatelog.ts:62:8 | text | 학생에게 초안 아레나가 실수로 보이는 문제를 막았어요. 문제를 고쳐도 성취기준 코드가 지워지지 않아요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:63:8 | text | 공개하기 전에 빈 문제·빈 선택지·겹치는 선택지를 걸러줘요. 문제 수 이름도 questionCount로 통일했어요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/data/updatelog.ts:64:8 | text | 에뮬레이터 테스트 2개가 모두 통과해요. 아레나 지우기 규칙(선생님만 삭제)도 고쳤어요. 테스트 100개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:65:8 | text | AI 만들기에 하루 20회 제한을 걸었어요(선생님 1명 기준). 열쇠는 Secret Manager에 따로 보관해요. 리더보드용 인덱스를 실서버에 올렸어요. 테스트 104개가 모두 통과했어요. | learner-text-candidate | long-or-dense, technical-or-internal |
| src/data/updatelog.ts:66:8 | text | AI 문제 만들기 함수를 실서버에 올렸어요. 선생님 화면의 'AI로 초안 만들기' 버튼이 이제 진짜로 동작해요. | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/data/updatelog.ts:67:8 | text | AI가 4지선다·O/X·단답형을 섞어서 내줘요(20문제면 14/3/3). 학년 말투와 성취기준 수준에 맞춰 내고, 단답형은 띄어쓰기·대소문자를 따지지 않아요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:68:8 | text | 선생님이 아레나마다 '참가자 공개'를 켜고 끌 수 있어요. 끄면 끝날 때까지 상대가 ???로 보이고 결과에서 공개돼요. 대결 상대는 무작위로 정해져요. 테스트 127개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:69:8 | text | XP 상점이 생겼어요. 모은 XP로 동물 아바타·칭호를 사서 바꿀 수 있어요(뽑기 없음, 전부 정가제). | learner-text-candidate | long-or-dense, technical-or-internal |
| src/data/updatelog.ts:70:8 | text | 선생님 도구가 늘었어요. 반이 어려워하는 성취기준 Top3, 교육과정 커버리지 지도, 남의 아레나 가져오기가 있어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:71:8 | text | 어려워요 Top3를 최근 30일 기준으로 바꿨어요. 은행 제목은 '다른 반 공개 아레나 가져오기'로 바꿨어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:72:8 | text | 아레나마다 읽어주기를 켜고 끌 수 있어요(기본 끄기). 들어갈 때 나쁜 말이 든 이름은 막아요. | learner-text-candidate | — |
| src/data/updatelog.ts:73:8 | text | 저학년용 문제 읽어주기 버튼이 생겼어요. 이름에 나쁜 말이 있으면 저장이 안 되고, 선생님 명단·신고함에서 확인할 수 있어요. 테스트 159개·에뮬 3개가 모두 통과했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:79:8 | text | 배틀 학습 사이트를 분석했어요. 로그인 화면, 학생·선생님 기능, 저장 구조를 정리했어요. | learner-text-candidate | abstract-or-formal |
| src/data/updatelog.ts:80:8 | text | 전체 기능 따라 만들기 + Firebase 사용 + 그림·문구는 새로 만들기로 정했어요. | learner-text-candidate | multiple-actions |
| src/data/updatelog.ts:81:8 | text | 기본 설계서를 `docs/superpowers/specs/2026-09-23-battle-study-ground-design.md`에 저장했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:82:8 | text | 구현을 3단계로 나눴어요. 1단계 계획서(기반 화면·로그인·학급 입장)를 `docs/superpowers/plans/2026-09-23-foundation-plan.md`에 저장했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:83:8 | text | 1단계 기반을 다 만들었어요. 앱 껍데기, 새로 그린 화면 스타일, 구글 로그인, 선생님/학생 선택, 학급 입장까지 돼요. 테스트 12개가 모두 통과했어요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/data/updatelog.ts:84:8 | text | 2단계 계획서(학생 대결: 아레나 고르기, 자동 매칭, 문제 라운드, 결과와 경험치)를 `docs/superpowers/plans/2026-09-24-battle-plan.md`에 저장했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:85:8 | text | 2단계 학생 대결을 다 만들었어요. 아레나 고르기, 자동 매칭, 준비 확인, 문제 라운드, 타이머, 결과와 경험치·레벨까지 돼요. 테스트 42개와 에뮬레이터 확인이 모두 통과했어요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/data/updatelog.ts:86:8 | text | 3단계 계획서(선생님 공간: 아레나 관리, 문제 편집, 초대 QR, 학생 명단, 대결 지켜보기, 분석)를 `docs/superpowers/plans/2026-09-25-teacher-plan.md`에 저장했어요. | learner-text-candidate | abstract-or-formal, long-or-dense, technical-or-internal |
| src/data/updatelog.ts:87:8 | text | 3단계 선생님 공간을 다 만들었어요. 아레나 만들기·고치기·잠그기, 문제 넣기, 초대 QR, 학생 명단, 진행 중인 대결 지켜보기·강제 종료, 어려운 문제 분석까지 돼요. 테스트 59개와 에뮬레이터 확인이 모두 통과했어요. 이제 학생·선생님 전체 기능이 다 됐어요. | learner-text-candidate | abstract-or-formal, long-or-dense, multiple-actions, technical-or-internal |
| src/data/updatelog.ts:88:8 | text | 후속 작업을 했어요. 새 실서버(class-quiz-arena)를 연결하고 규칙을 배포했어요. 본인이 선생님으로 바꾸는 것과 학생의 강제 종료를 막았어요. 아레나를 고쳐도 문제·잠금이 유지되고, 지우면 딸린 문제까지 지워져요. 에뮬레이터 테스트는 `npm run test:emu` 한 번으로 돌아가게 했어요. | learner-text-candidate | long-or-dense |
| src/data/updatelog.ts:89:8 | text | 실서버에 올렸어요. https://class-quiz-arena.web.app 에서 로그인 화면이 잘 나와요. 구글 로그인은 학교 계정으로 직접 눌러서 확인해 보세요. | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/data/updatelog.ts:90:8 | text | 로그인 화면의 학교 계정 문구를 지웠어요. 선생님은 이제 초대코드를 입력하는 대신 새 학급을 만들고 초대코드를 받아요. 학생은 그대로 초대코드로 들어와요. | input | abstract-or-formal, long-or-dense, multiple-actions |
| src/data/updatelog.ts:91:8 | text | 선생님 사칭을 막았어요. 초대로 들어오면 무조건 학생이 되고, 학급 만들기는 등록된 선생님 계정만 할 수 있어요. 마스터 관리자(ketarou85@gmail.com)는 선생님 목록을 앱에서 직접 고칠 수 있어요. | learner-text-candidate | long-or-dense |
| src/hooks/useArenaAdmin.emu.test.ts:27:16 | text | 테스트반 | learner-text-candidate | — |
| src/hooks/useArenaAdmin.emu.test.ts:32:56 | text | 선생 | learner-text-candidate | — |
| src/hooks/useArenaAdmin.emu.test.ts:39:21 | text | t | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:39:32 | text | d | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:39:46 | text | 수학 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:55:54 | text | t2 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:55:66 | text | d | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:55:80 | text | 수학 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:57:44 | text | arenas | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.emu.test.ts:58:33 | text | t2 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:9:17 | text | 덧셈 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:10:16 | text | 설명 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:11:19 | text | 수학 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:13:17 | text | 받아올림 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:14:22 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:17:111 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:18:94 | text | 답 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.test.ts:21:31 | text | 덧셈 (복사) | input | — |
| src/hooks/useArenaAdmin.test.ts:23:39 | text | [4수01-03] | input | repeated-text |
| src/hooks/useArenaAdmin.test.ts:28:42 | text | 답 | learner-text-candidate | repeated-text |
| src/hooks/useArenaAdmin.ts:34:50 | text | ): EditableProblem { const options = (data.options as string[] \| undefined) ?? []; const kind = (data.kind as ProblemKind) ?? 'choice'; return { text: (data.text as string) ?? '', kind: VALID_KINDS.includes(kind) ? kind : 'choice', options: [options[0] ?? '', options[1] ?? '', options[2] ?? '', options[3] ?? ''], answerIndex: (data.answerIndex as number) ?? 0, answerText: (data.answerText as string) ?? '', explanation: (data.explanation as string) ?? '', standardCode: (data.standardCode as string) ?? '', }; } export interface BankArena { id: string; title: string; desc: string; subject: string; grade?: number; gradeBand?: string; cardTheme?: { bg: string; emoji: string }; cardStyle?: CardStyle; illustId?: string; } /** 은행 복제용 순수 조립. 테스트에서 가져오기 결과를 검증한다. */ export function buildArenaCopy( source: BankArena & { topic?: string; standards?: string[]; questionCount?: number; cardStyle?: CardStyle; illustId?: string; gradeBand?: string }, problems: EditableProblem[], ): { input: ArenaInput; problems: EditableProblem[] } { return { input: { title: `${source.title} (복사)`, desc: source.desc, subject: source.subject, questionCount: problems.length, grade: source.grade, gradeBand: source.gradeBand, topic: source.topic, standards: source.standards, status: 'published', cardStyle: source.cardStyle, illustId: source.illustId, }, problems, }; } export function useArenaAdmin(classroomId: string \| null) { const [arenas, setArenas] = useState | input | abstract-or-formal, long-or-dense, technical-or-internal |
| src/hooks/useArenaAdmin.ts:67:15 | text | ${source.title} (복사) | learner-text-candidate | — |
| src/hooks/useArenaAdmin.ts:114:97 | text | { // 공개는 10문제 이상일 때만 (Task 4 대결 | input | — |
| src/hooks/useArenaAdmin.ts:117:24 | text | 문제를 10개 이상 넣어주세요 | feedback-or-error | repeated-text |
| src/hooks/useArenaAdmin.ts:188:48 | text | 은행에 없는 아레나예요 | feedback-or-error | — |
| src/hooks/useAuth.ts:42:48 | text | (null); const [loading, setLoading] = useState(true); // null이면 아직 묻지 않음. true=브라우저에 저장(자동 로그인), false=이번만. const [remember, setRemember] = useState | learner-text-candidate | long-or-dense, technical-or-internal |
| src/hooks/useAuth.ts:50:9 | text | 이번만 | learner-text-candidate | — |
| src/hooks/useClassroom.test.ts:63:62 | text | 시발 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:65:45 | text | 쓸 수 없는 말 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.test.ts:73:62 | text | 일호 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:83:36 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:85:45 | text | 쓸 수 없는 말 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.test.ts:93:47 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:100:43 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:100:66 | text | 김선생 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:103:45 | text | 같은 이름 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.test.ts:110:43 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:110:71 | text | 김선생 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:113:45 | text | 같은 이름 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.test.ts:120:57 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:122:28 | text | 같은 이름 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:124:57 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:134:26 | text | 1반 | learner-text-candidate | — |
| src/hooks/useClassroom.test.ts:135:26 | text | 2반 | learner-text-candidate | — |
| src/hooks/useClassroom.test.ts:159:43 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.test.ts:159:66 | text | 김선생 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.ts:27:110 | text | { const snap = await getDocs(query(collection(db, 'classrooms'), where('teacherId', '==', teacherUid))); const want = normalizeClassroomName(name); for (const d of snap.docs) { if (d.id !== exceptId && normalizeClassroomName((d.data().name as string) ?? '') === want) { return d.id; } } return null; } /** 선생님이 개설한 학급 목록 (실시간). 실패하면 빈 목록. */ export function useTeacherClassrooms(uid: string \| null) { const [classrooms, setClassrooms] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/hooks/useClassroom.ts:55:52 | text | (이름 없음) | learner-text-candidate | — |
| src/hooks/useClassroom.ts:94:64 | text | (null); const [error, setError] = useState | feedback-or-error | technical-or-internal |
| src/hooks/useClassroom.ts:102:68 | text | { if (!mounted.current) return; const normalized = normalizeInviteCode(code); if (!isValidInviteCode(code)) { setError('초대 코드 6자리를 확인해주세요'); return; } const nameError = validateNickname(info.nickname); if (nameError) { setError(nameError); return; } try { const snap = await getDoc(doc(db, 'classrooms', normalized)); if (!mounted.current) return; if (!snap.exists() \|\| (snap.data().locked as boolean)) { setError('들어갈 수 없는 학급이에요. 코드를 확인해주세요'); return; } setError(null); await setDoc( doc(db, 'users', uid), // 초대로 들어오면 무조건 학생 (선생님 사칭 방지, 규칙도 강제) { nickname: info.nickname, role: 'student', avatar: info.avatar, classroomId: normalized }, { merge: true }, ); if (!mounted.current) return; setClassroomId(normalized); } catch { if (!mounted.current) return; setError('연결에 실패했어요. 다시 시도해주세요'); } }; const create = async (name: string, uid: string, nickname: string, avatar: string): Promise | feedback-or-error | long-or-dense, multiple-actions, shaming-tone, technical-or-internal |
| src/hooks/useClassroom.ts:106:17 | text | 초대 코드 6자리를 확인해주세요 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.ts:118:19 | text | 들어갈 수 없는 학급이에요. 코드를 확인해주세요 | feedback-or-error | — |
| src/hooks/useClassroom.ts:132:17 | text | 연결에 실패했어요. 다시 시도해주세요 | feedback-or-error | repeated-text, shaming-tone |
| src/hooks/useClassroom.ts:146:19 | text | 같은 이름의 학급이 이미 있어요 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.ts:178:14 | text | 연결에 실패했어요. 다시 시도해주세요 | feedback-or-error | repeated-text, shaming-tone |
| src/hooks/useClassroom.ts:184:40 | text | { setClassroomId(id); }; /** 학급 이름 변경. 성공하면 null, 실패하면 사람이 읽는 이유. */ const renameClassroom = async (id: string, name: string, teacherUid?: string \| null): Promise | feedback-or-error | long-or-dense, technical-or-internal |
| src/hooks/useClassroom.ts:189:114 | text | { const trimmed = normalizeClassroomName(name); if (!trimmed) { setError('학급 이름을 입력해주세요'); return '학급 이름을 입력해주세요'; } try { if (teacherUid && (await findDuplicateName(teacherUid, trimmed, id))) { if (!mounted.current) return '같은 이름의 학급이 이미 있어요'; setError('같은 이름의 학급이 이미 있어요'); return '같은 이름의 학급이 이미 있어요'; } await setDoc(doc(db, 'classrooms', id), { name: trimmed }, { merge: true }); if (!mounted.current) return '연결에 실패했어요. 다시 시도해주세요'; setError(null); return null; } catch { if (!mounted.current) return '연결에 실패했어요. 다시 시도해주세요'; setError('연결에 실패했어요. 다시 시도해주세요'); return '연결에 실패했어요. 다시 시도해주세요'; } }; /** * 학급 삭제. 딸린 대결방·아레나·문제를 함께 지우고 남은 첫 학급 id를 돌려준다. * 학생 명단은 두되 (XP·보관함 유지), 학급이 사라져 다시 들어와야 한다. */ const deleteClassroom = async (id: string, teacherUid: string): Promise | feedback-or-error, input | abstract-or-formal, long-or-dense, multiple-actions, shaming-tone, technical-or-internal |
| src/hooks/useClassroom.ts:192:17 | text | 학급 이름을 입력해주세요 | feedback-or-error, input | abstract-or-formal, repeated-text |
| src/hooks/useClassroom.ts:193:15 | text | 학급 이름을 입력해주세요 | input | abstract-or-formal, repeated-text |
| src/hooks/useClassroom.ts:197:39 | text | 같은 이름의 학급이 이미 있어요 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.ts:198:19 | text | 같은 이름의 학급이 이미 있어요 | feedback-or-error | repeated-text |
| src/hooks/useClassroom.ts:199:17 | text | 같은 이름의 학급이 이미 있어요 | learner-text-candidate | repeated-text |
| src/hooks/useClassroom.ts:202:37 | text | 연결에 실패했어요. 다시 시도해주세요 | feedback-or-error | repeated-text, shaming-tone |
| src/hooks/useClassroom.ts:206:37 | text | 연결에 실패했어요. 다시 시도해주세요 | feedback-or-error | repeated-text, shaming-tone |
| src/hooks/useClassroom.ts:207:17 | text | 연결에 실패했어요. 다시 시도해주세요 | feedback-or-error | repeated-text, shaming-tone |
| src/hooks/useClassroom.ts:208:15 | text | 연결에 실패했어요. 다시 시도해주세요 | feedback-or-error | repeated-text, shaming-tone |
| src/hooks/useClassroom.ts:238:17 | text | 삭제에 실패했어요. 다시 시도해주세요 | feedback-or-error | shaming-tone |
| src/hooks/useLeaderboard.test.ts:8:18 | text | 친구${i} | learner-text-candidate | repeated-text |
| src/hooks/useLeaderboard.test.ts:21:18 | text | 친구${i} | learner-text-candidate | repeated-text |
| src/hooks/useLeaderboard.ts:37:50 | text | ({ uid: d.uid, nickname: d.nickname ?? '이름 없음', xp: d.xp ?? 0, level: d.level ?? 1, winCount: d.winCount ?? 0, correctRate: d.correctRate ?? 0, avatar: d.avatar ?? 'cat', ...(d.title ? { title: d.title } : {}), rank: i + 1, isMe: myUid != null && d.uid === myUid, })); return { top20, myRank }; } /** * 같은 학급 Top20 리더보드: users where classroomId==내학급 orderBy xp desc limit 20. * Top20 밖에 있어도 "내 순위 N위"를 알 수 있게 전체 순서에서 내 순위를 별도로 구한다. */ export function useLeaderboard(classroomId: string \| null, myUid: string \| null) { const [top20, setTop20] = useState | learner-text-candidate | long-or-dense, technical-or-internal |
| src/hooks/useLeaderboard.ts:39:30 | text | 이름 없음 | learner-text-candidate | repeated-text |
| src/hooks/useLeaderboard.ts:54:18 | text | 내 순위 N위 | learner-text-candidate | — |
| src/hooks/useMatch.test.ts:45:36 | text | 일호 | learner-text-candidate | repeated-text |
| src/hooks/useMatch.test.ts:53:41 | text | 이호 | learner-text-candidate | repeated-text |
| src/hooks/useMatch.test.ts:99:40 | text | 선생님이 문제를 준비 중이에요 | feedback-or-error | repeated-text |
| src/hooks/useMatch.ts:22:37 | text | 선생님이 문제를 준비 중이에요 | learner-text-candidate | repeated-text |
| src/hooks/useMatch.ts:25:54 | text | (null); const [busy, setBusy] = useState(false); const [error, setError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/hooks/useMatch.ts:88:17 | text | 매칭에 실패했어요. 다시 시도해주세요 | feedback-or-error | shaming-tone |
| src/hooks/useReports.emu.test.ts:23:14 | text | 신고반 | learner-text-candidate | — |
| src/hooks/useReports.emu.test.ts:34:26 | text | 일호 | learner-text-candidate | repeated-text |
| src/hooks/useReports.emu.test.ts:36:26 | text | 나쁜이름 | learner-text-candidate | repeated-text |
| src/hooks/useReports.emu.test.ts:48:28 | text | 일호 | learner-text-candidate | repeated-text |
| src/hooks/useReports.emu.test.ts:50:28 | text | 나쁜이름 | learner-text-candidate | repeated-text |
| src/hooks/useStudents.ts:18:59 | text | 이름 없음 | learner-text-candidate | repeated-text |
| src/hooks/useTeacherClassrooms.test.ts:33:53 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/hooks/useTeacherClassrooms.test.ts:36:67 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/lib/admin.test.ts:13:48 | text | 마스터 관리자 | learner-text-candidate | — |
| src/lib/admin.ts:7:41 | text | 등록된 선생님 계정이 아니에요. 마스터 관리자에게 문의해주세요 | learner-text-candidate | — |
| src/lib/analytics.test.ts:40:69 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/lib/analytics.test.ts:41:69 | text | [4수01-09] | learner-text-candidate | repeated-text |
| src/lib/analytics.test.ts:45:47 | text | [4수01-09] | learner-text-candidate | repeated-text |
| src/lib/analytics.test.ts:45:60 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/lib/analytics.ts:53:79 | text | uid); } export interface StandardStat { code: string; asked: number; correct: number; rate: number; } /** 성취기준별 정답률 → 낮은 순. 기준 없는 라운드는 제외. */ export function weakStandards(rounds: RoundRecord[], count: number): StandardStat[] { const map = new Map | feedback-or-error | long-or-dense, technical-or-internal |
| src/lib/arena.test.ts:6:34 | text | a | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:6:46 | text | t | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:6:70 | text | 수학 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:11:29 | text | a | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:11:41 | text | t | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:11:65 | text | 수학 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:11:94 | text | draft | learner-text-candidate | — |
| src/lib/arena.test.ts:17:29 | text | a | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:17:41 | text | t | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:17:65 | text | 수학 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:17:94 | text | published | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:22:34 | text | a | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:22:46 | text | t | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:22:70 | text | 수학 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:28:26 | text | 수학 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:29:26 | text | 국어 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:30:26 | text | 사회 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:31:26 | text | 과학 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:32:26 | text | 영어 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:36:26 | text | 체육 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:40:11 | text | gradeLabel | learner-text-candidate | — |
| src/lib/arena.test.ts:42:62 | text | 3-4학년 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:46:44 | text | 3-4학년 | learner-text-candidate | repeated-text |
| src/lib/arena.test.ts:47:44 | text | 1-2학년 | learner-text-candidate | — |
| src/lib/arena.test.ts:48:44 | text | 5-6학년 | learner-text-candidate | — |
| src/lib/arena.ts:8:11 | text | 수학 | learner-text-candidate | repeated-text |
| src/lib/arena.ts:10:11 | text | 국어 | learner-text-candidate | repeated-text |
| src/lib/arena.ts:12:11 | text | 사회 | learner-text-candidate | repeated-text |
| src/lib/arena.ts:14:11 | text | 과학 | learner-text-candidate | repeated-text |
| src/lib/arena.ts:16:11 | text | 영어 | learner-text-candidate | repeated-text |
| src/lib/arena.ts:66:28 | text | 3-4학년 | learner-text-candidate | repeated-text |
| src/lib/arena.ts:69:21 | text | ${band}학년 | learner-text-candidate | — |
| src/lib/battle.test.ts:28:38 | text | 일호 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:29:39 | text | 이호 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:52:55 | text | 삼호 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:158:29 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:158:82 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:159:29 | text | 세종 대왕 | learner-text-candidate | — |
| src/lib/battle.test.ts:159:83 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:161:78 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:162:77 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/lib/battle.test.ts:171:36 | text | 세종대왕 | button-or-action | repeated-text |
| src/lib/battle.test.ts:172:36 | text | 이순신 | button-or-action | — |
| src/lib/battle.test.ts:173:70 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/lib/battle.ts:197:34 | text | = AUTO_WIN_AFTER_MS; } /** 대기 방 중 무작위 1개. Math.random 기반이라 테스트에서는 값을 고정한다. */ export function pickRandom | learner-text-candidate | long-or-dense |
| src/lib/nickname.test.ts:6:28 | text | 시발놈 | learner-text-candidate | — |
| src/lib/nickname.test.ts:7:28 | text | 병신 | learner-text-candidate | repeated-text |
| src/lib/nickname.test.ts:10:7 | text | detects spaced and symbol-obfuscated variants | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/lib/nickname.test.ts:11:28 | text | 시 발 | learner-text-candidate | — |
| src/lib/nickname.test.ts:12:28 | text | 시!발 | learner-text-candidate | — |
| src/lib/nickname.test.ts:22:28 | text | 일호 | learner-text-candidate | repeated-text |
| src/lib/nickname.test.ts:23:28 | text | 박서연 | learner-text-candidate | — |
| src/lib/nickname.test.ts:30:42 | text | 이름을 입력해주세요 | input | abstract-or-formal, repeated-text |
| src/lib/nickname.test.ts:31:30 | text | 아주아주긴이름이에요 | learner-text-candidate | — |
| src/lib/nickname.test.ts:31:50 | text | 이름은 8자까지 쓸 수 있어요 | learner-text-candidate | repeated-text |
| src/lib/nickname.test.ts:35:30 | text | 시발 | learner-text-candidate | repeated-text |
| src/lib/nickname.test.ts:35:47 | text | 쓸 수 없는 말 | learner-text-candidate | repeated-text |
| src/lib/nickname.test.ts:39:30 | text | 일호 | learner-text-candidate | repeated-text |
| src/lib/nickname.ts:4:4 | text | 시발 | learner-text-candidate | repeated-text |
| src/lib/nickname.ts:5:4 | text | 씨발 | learner-text-candidate | — |
| src/lib/nickname.ts:6:4 | text | 새끼 | learner-text-candidate | — |
| src/lib/nickname.ts:7:4 | text | 병신 | learner-text-candidate | repeated-text |
| src/lib/nickname.ts:8:4 | text | 지랄 | learner-text-candidate | — |
| src/lib/nickname.ts:9:4 | text | 미친놈 | learner-text-candidate | — |
| src/lib/nickname.ts:10:4 | text | 미친년 | learner-text-candidate | — |
| src/lib/nickname.ts:11:4 | text | 좆 | learner-text-candidate | — |
| src/lib/nickname.ts:12:4 | text | 좃 | learner-text-candidate | — |
| src/lib/nickname.ts:13:4 | text | 썅 | learner-text-candidate | — |
| src/lib/nickname.ts:14:4 | text | 닥쳐 | learner-text-candidate | — |
| src/lib/nickname.ts:15:4 | text | 꺼져 | learner-text-candidate | — |
| src/lib/nickname.ts:16:4 | text | 죽어 | learner-text-candidate | — |
| src/lib/nickname.ts:17:4 | text | 엿먹 | learner-text-candidate | — |
| src/lib/nickname.ts:45:25 | text | 이름을 입력해주세요 | input | abstract-or-formal, repeated-text |
| src/lib/nickname.ts:46:53 | text | 이름은 8자까지 쓸 수 있어요 | learner-text-candidate | repeated-text |
| src/lib/nickname.ts:47:40 | text | 쓸 수 없는 말이 들어있어요. 다른 이름으로 해주세요 | learner-text-candidate | — |
| src/lib/roster.test.ts:6:52 | text | 일호 | learner-text-candidate | repeated-text |
| src/lib/roster.test.ts:6:76 | text | 이름,XP 일호,120 | learner-text-candidate | technical-or-internal |
| src/lib/roster.test.ts:11:31 | text | 일호 | learner-text-candidate | repeated-text |
| src/lib/roster.test.ts:12:31 | text | 이호 | learner-text-candidate | repeated-text |
| src/lib/roster.test.ts:14:75 | text | 이호 | learner-text-candidate | repeated-text |
| src/lib/roster.test.ts:14:81 | text | 일호 | learner-text-candidate | repeated-text |
| src/lib/roster.ts:8:17 | text | 이름,XP | learner-text-candidate | technical-or-internal |
| src/lib/tts.test.ts:32:19 | text | 23 더하기 45는? | learner-text-candidate | repeated-text |
| src/lib/tts.test.ts:38:35 | text | 23 더하기 45는? | learner-text-candidate | repeated-text |
| src/lib/tts.test.ts:39:35 | text | 1번, 67 | learner-text-candidate | — |
| src/lib/tts.test.ts:53:19 | text | 왕 이름은? | learner-text-candidate | — |
| src/lib/tts.test.ts:55:39 | text | 1번 | learner-text-candidate | — |
| src/lib/tts.ts:20:19 | text | ${i + 1}번, ${opt} | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:15:12 | text | 문제 ${i + 1} | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:16:16 | text | 보기1 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:16:23 | text | 보기2 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:16:30 | text | 보기3 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:16:37 | text | 보기4 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:21:31 | text | 기초 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:21:56 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:24:28 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:24:46 | text | 공개하기(저장하기) | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:35:30 | text | 문제를 10개 이상 넣어주세요 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:50:45 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:50:85 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:51:30 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:51:48 | text | [4수01-03] 삭제 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:53:45 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:53:85 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:54:33 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:54:51 | text | [4수01-03] 삭제 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:56:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:56:57 | text | [4수01-03] 삭제 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:57:30 | text | 성취기준을 1개 이상 골라주세요 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:65:45 | text | 과목 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:65:71 | text | 국어 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:69:7 | text | shows error and keeps manual items when AI draft fails | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.test.tsx:69:75 | text | { const failingCall = vi.fn().mockRejectedValue(new Error('GEMINI_API_KEY is not configured')); vi.mocked(httpsCallable).mockReturnValue(failingCall as never); render( | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.test.tsx:69:138 | text | GEMINI_API_KEY is not configured | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/pages/ArenaEditor.test.tsx:72:45 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:72:85 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:73:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:73:57 | text | AI로 초안 만들기 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:76:38 | text | 문제 1 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:79:7 | text | maps AI error codes to friendly messages | feedback-or-error | technical-or-internal |
| src/pages/ArenaEditor.test.tsx:80:37 | text | resource-exhausted | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:80:72 | text | 20회 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:81:37 | text | unauthenticated | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:81:69 | text | 로그인 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:82:37 | text | invalid-argument | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/pages/ArenaEditor.test.tsx:82:70 | text | 성취기준 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:83:39 | text | boom | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:83:59 | text | 실패 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:86:74 | text | { const err = Object.assign(new Error('오늘 AI 만들기 20회를 다 썼어요'), { code: 'resource-exhausted' }); vi.mocked(httpsCallable).mockReturnValue(vi.fn().mockRejectedValue(err) as never); render( | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.test.tsx:87:42 | text | 오늘 AI 만들기 20회를 다 썼어요 | feedback-or-error | technical-or-internal |
| src/pages/ArenaEditor.test.tsx:87:75 | text | resource-exhausted | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:90:45 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:90:85 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:91:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:91:57 | text | AI로 초안 만들기 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:97:40 | text | 문제 1 내용 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:99:47 | text | 첫째 줄 둘째 줄 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:100:29 | text | 첫째 줄 둘째 줄 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:103:7 | text | labels choices above their inputs and keeps picking the answer | input | long-or-dense |
| src/pages/ArenaEditor.test.tsx:103:77 | text | { render( | input | repeated-text |
| src/pages/ArenaEditor.test.tsx:105:30 | text | 1번 보기 내용 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:106:30 | text | 4번 보기 내용 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:107:32 | text | 정답 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:109:37 | text | 2번 보기 내용 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:110:42 | text | 문제 1 선택지 2 | input | — |
| src/pages/ArenaEditor.test.tsx:113:42 | text | 문제 1 정답: 2번 | feedback-or-error, input | — |
| src/pages/ArenaEditor.test.tsx:120:40 | text | 문제 1 해설 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:122:47 | text | 첫째 줄 둘째 줄 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:123:29 | text | 첫째 줄 둘째 줄 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:126:7 | text | groups each problem in its own card with a heading | heading | — |
| src/pages/ArenaEditor.test.tsx:126:65 | text | { const { container } = render( | heading | repeated-text |
| src/pages/ArenaEditor.test.tsx:130:60 | text | 문제 1 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:131:60 | text | 문제 2 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:134:46 | text | 문제 1 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:135:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:135:57 | text | 문제 1 삭제 | button-or-action | — |
| src/pages/ArenaEditor.test.tsx:142:95 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:147:30 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:152:39 | text | Q | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:153:39 | text | Q | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:153:105 | text | 겹 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:161:7 | text | shows content error instead of count hint when 10 items exist but invalid | feedback-or-error, hint | long-or-dense, missing-term-explanation, technical-or-internal |
| src/pages/ArenaEditor.test.tsx:161:88 | text | { render( | feedback-or-error, hint | repeated-text |
| src/pages/ArenaEditor.test.tsx:187:45 | text | 문제 1 단답형 정답 | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:187:80 | text | 세종대왕 | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:193:76 | text | ox | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:194:35 | text | 문제 1 정답: O | feedback-or-error | — |
| src/pages/ArenaEditor.test.tsx:195:35 | text | 문제 1 정답: X | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:201:13 | text | Promise.resolve({ data: { problems: [ { kind: 'ox', text: 'Q', options: ['o', 'x'], answerIndex: 1 }, { kind: 'short', text: 'Q2', options: [], answerText: '세종대왕' }, { text: 'Q3', options: ['1', '2', '3', '4'], answerIndex: 0 }, ], }, })) as never, ); render( | learner-text-candidate | long-or-dense |
| src/pages/ArenaEditor.test.tsx:206:70 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:213:45 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:213:85 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:214:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:214:57 | text | AI로 초안 만들기 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:218:35 | text | 문제 1 정답: X | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.test.tsx:219:38 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:229:30 | text | 수학 일러스트 카드 고르기 | learner-text-candidate | — |
| src/pages/ArenaEditor.test.tsx:231:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:231:57 | text | 피자 분수 그림 고르기 | button-or-action | — |
| src/pages/ArenaEditor.test.tsx:232:39 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:232:57 | text | 공개하기(저장하기) | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:237:7 | text | pulses the AI draft button | button-or-action | technical-or-internal |
| src/pages/ArenaEditor.test.tsx:237:41 | text | { render( | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:241:45 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:241:85 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.test.tsx:242:30 | text | button | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:242:48 | text | AI로 초안 만들기 | button-or-action | repeated-text |
| src/pages/ArenaEditor.test.tsx:242:83 | text | btn-pulse | button-or-action | repeated-text |
| src/pages/ArenaEditor.tsx:14:23 | text | 0 ? mine : ILLUSTS; } const MIN_PROBLEMS = 10; const MIN_COUNT = 10; const MAX_COUNT = 20; const DEFAULT_COUNT = 20; /** Task 3 generateArena callable 주고받기 (functions 쪽과 같은 모양, src 독립). */ interface GenerateArenaRequest { grade: number; subject: string; standards: string[]; count: number; topic?: string; } interface GenerateArenaResponse { problems: { text: string; kind?: ProblemKind; options: string[]; answerIndex: number; answerText?: string; explanation?: string; standardCode?: string; }[]; } export const MAX_SHORT_ANSWER_LENGTH = 30; const KIND_LABEL: Record | learner-text-candidate | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.tsx:44:60 | text | 4지선다 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:44:72 | text | O/X | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:44:86 | text | 단답형 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:67:13 | text | 오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요. | learner-text-candidate | repeated-text, technical-or-internal |
| src/pages/ArenaEditor.tsx:70:13 | text | 로그인이 풀렸어요. 다시 로그인한 뒤 눌러주세요. | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:73:13 | text | 학년·과목·성취기준을 다시 확인하고 눌러주세요. | learner-text-candidate | multiple-actions |
| src/pages/ArenaEditor.tsx:75:11 | text | AI 초안 만들기에 실패했어요. 직접 문제를 넣어주세요. | feedback-or-error | shaming-tone, technical-or-internal |
| src/pages/ArenaEditor.tsx:82:33 | text | ${i + 1}번 문제 내용이 비었어요 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:85:26 | text | ${i + 1}번 단답형 정답이 비었어요 | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:86:58 | text | ${i + 1}번 단답형 정답이 너무 길어요 | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:90:46 | text | ${i + 1}번 빈 선택지가 있어요 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:91:74 | text | ${i + 1}번 선택지가 겹쳐요 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:133:47 | text | { const options = subjectsOfGrade(initial.grade ?? 3); return options.includes(initial.subject) ? initial.subject : (options[0] ?? '국어'); }); const [selected, setSelected] = useState | learner-text-candidate | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.tsx:135:82 | text | 국어 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:143:56 | text | (problems); const [aiBusy, setAiBusy] = useState(false); const [aiError, setAiError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.tsx:145:56 | text | (null); const [aiInfo, setAiInfo] = useState | feedback-or-error | technical-or-internal |
| src/pages/ArenaEditor.tsx:192:32 | text | { setAiError(null); setAiInfo(null); const finalCount = clampCount(count); setCount(finalCount); setAiBusy(true); try { const call = httpsCallable | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.tsx:210:20 | text | AI가 ${drafts.length}개 문제를 가져왔어요. 나머지는 직접 넣어주세요. | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:214:22 | text | AI 초안 만들기 실패: | feedback-or-error | technical-or-internal |
| src/pages/ArenaEditor.tsx:221:24 | text | { if (!canPublish) return; onSave( { title, desc, subject, questionCount: clampCount(count), grade, gradeBand: bandOfGrade(grade), topic, standards: selected, status: 'published', cardStyle: 'illust' as CardStyle, illustId }, items, ); }; return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/pages/ArenaEditor.tsx:224:140 | text | published | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:224:164 | text | illust | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:231:36 | text | 아레나 이름 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:233:35 | text | 설명 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:236:36 | text | 학년 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:239:37 | text | {g}학년 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:244:38 | text | 과목 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:253:39 | text | 성취기준 (1개 이상 고르기) | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:262:26 | text | 기준을 골라 추가하세요 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:269:37 | text | 이 학년·과목에는 등록된 기준이 없어요 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:271:12 | text | 성취기준을 1개 이상 골라주세요 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:277:50 | text | ${code} 삭제 | button-or-action | — |
| src/pages/ArenaEditor.tsx:285:36 | text | 문제 수 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:295:36 | text | 주제 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:299:22 | placeholder | 예: 받아올림이 있는 덧셈 | placeholder, input | — |
| src/pages/ArenaEditor.tsx:304:17 | text | {subject} 일러스트 카드 고르기 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:311:28 | text | ${g.label} 그림 고르기 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:321:74 | text | btn-pulse | button-or-action | repeated-text |
| src/pages/ArenaEditor.tsx:321:174 | text | {aiBusy ? 'AI가 문제를 만드는 중...' : 'AI로 초안 만들기'} | button-or-action | — |
| src/pages/ArenaEditor.tsx:322:20 | text | AI가 문제를 만드는 중... | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:322:41 | text | AI로 초안 만들기 | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:323:16 | text | {aiError && | button-or-action, feedback-or-error | — |
| src/pages/ArenaEditor.tsx:324:35 | text | } {aiInfo && | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:327:10 | text | 문제 {items.length}개 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:328:33 | text | 아직 등록된 문제가 없어요 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:330:24 | text | problem-${i} | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:330:52 | text | 문제 ${i + 1} | learner-text-candidate | repeated-text |
| src/pages/ArenaEditor.tsx:332:43 | text | 문제 {i + 1} | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:333:48 | text | 문제 ${i + 1} 삭제 | button-or-action | — |
| src/pages/ArenaEditor.tsx:333:123 | text | 삭제 | button-or-action | repeated-text |
| src/pages/ArenaEditor.tsx:337:52 | text | : null} | learner-text-candidate | repeated-text, technical-or-internal |
| src/pages/ArenaEditor.tsx:338:18 | text | 문제 {i + 1} 유형 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:341:28 | text | 문제 ${i + 1} 유형 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:353:43 | text | {KIND_LABEL[k]} | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:359:18 | text | 문제 {i + 1} 내용 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:366:19 | text | {(p.kind ?? 'choice') === 'short' ? ( | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:368:20 | text | 문제 {i + 1} 단답형 정답 | feedback-or-error, input | — |
| src/pages/ArenaEditor.tsx:375:21 | text | ) : (p.kind ?? 'choice') === 'ox' ? ( | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:378:18 | text | O / X 중 정답을 고르세요 | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:384:34 | text | 문제 ${i + 1} 정답: ${k === 0 ? 'O' : 'X'} | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:387:21 | text | {k === 0 ? 'O' : 'X'} | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:399:34 | text | 문제 ${i + 1} 정답: ${k + 1}번 | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:402:21 | text | {k + 1}번 보기 내용 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:406:32 | text | 문제 ${i + 1} 선택지 ${k + 1} | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:413:18 | text | 문제 {i + 1} 해설 | learner-text-candidate | — |
| src/pages/ArenaEditor.tsx:423:82 | text | 추가 | button-or-action | repeated-text |
| src/pages/ArenaEditor.tsx:427:54 | text | btn-pulse publish-btn | button-or-action | — |
| src/pages/ArenaEditor.tsx:427:80 | text | publish-btn | button-or-action | — |
| src/pages/ArenaEditor.tsx:427:135 | text | 공개하기(저장하기) | button-or-action | repeated-text |
| src/pages/ArenaEditor.tsx:429:16 | text | {!canPublish && | button-or-action, feedback-or-error | — |
| src/pages/ArenaEditor.tsx:430:26 | text | {items.length | feedback-or-error | — |
| src/pages/ArenaEditor.tsx:430:58 | text | 문제를 10개 이상 넣어주세요 | feedback-or-error | repeated-text |
| src/pages/ArenaEditor.tsx:431:48 | text | 취소 | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:6:38 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:7:39 | text | 이호 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:13:30 | text | 일호 vs ??? | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:16:7 | text | shows waiting state with a disabled start button until matched | button-or-action | long-or-dense, missing-term-explanation, technical-or-internal |
| src/pages/BattleRoom.test.tsx:16:77 | text | { const room = createRoomData('a1', host, 1000); render( | button-or-action | long-or-dense |
| src/pages/BattleRoom.test.tsx:19:30 | text | 대결 상대를 기다리는 중... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:21:31 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:21:49 | text | 네! 준비됐어요! | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:24:7 | text | shows match complete with an enabled pulsing start button | button-or-action | long-or-dense |
| src/pages/BattleRoom.test.tsx:24:72 | text | { const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!; render( | button-or-action | long-or-dense |
| src/pages/BattleRoom.test.tsx:27:30 | text | 1:1 매칭 완료! | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:28:38 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:28:56 | text | 네! 준비됐어요! | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:30:39 | text | btn-pulse | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:41:26 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:41:45 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:41:57 | text | 설명 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:44:30 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:45:30 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:48:7 | text | shows waiting hint for opponent readiness | hint | — |
| src/pages/BattleRoom.test.tsx:48:56 | text | { let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!; room = setReadyData(room, 'u1', 3000); render( | hint | long-or-dense |
| src/pages/BattleRoom.test.tsx:52:30 | text | 상대 준비 기다리는 중... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:59:39 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:59:57 | text | 네! 준비됐어요! | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:79:39 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:97:30 | text | 시간이 지난 문제예요. 다음 라운드로 넘어가요. | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:115:39 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:115:57 | text | 자동 승리로 처리할까요? | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:133:27 | text | 한글을 만든 왕은? | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:139:45 | text | 내 답 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:139:72 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:140:39 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:140:57 | text | 제출 | button-or-action | abstract-or-formal, repeated-text |
| src/pages/BattleRoom.test.tsx:141:44 | text | 세종대왕 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:154:30 | text | 대전 상대: ??? | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:167:30 | text | 대전 상대: 이호 | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:174:30 | text | 상대 이호와의 대결이었어요 | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:187:39 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:187:57 | text | 상대 이름 신고하기 | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:189:30 | text | 신고가 접수됐어요. 선생님이 확인할 거예요. | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:192:7 | text | shows a read-aloud button when supported | button-or-action | — |
| src/pages/BattleRoom.test.tsx:192:55 | text | { let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!; room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000 }; render( | button-or-action | long-or-dense |
| src/pages/BattleRoom.test.tsx:192:101 | text | a1 | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:204:32 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:204:50 | text | 문제 읽어주기 | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:224:7 | text | shows the read-aloud button when the arena enables it | button-or-action | long-or-dense |
| src/pages/BattleRoom.test.tsx:224:68 | text | { stubSpeech(); render( | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:235:30 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:235:48 | text | 문제 읽어주기 | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:239:7 | text | hides the read-aloud button when the arena disables it | button-or-action | long-or-dense, missing-term-explanation, technical-or-internal |
| src/pages/BattleRoom.test.tsx:239:69 | text | { stubSpeech(); render( | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:250:32 | text | button | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:250:50 | text | 문제 읽어주기 | button-or-action | repeated-text |
| src/pages/BattleRoom.test.tsx:255:11 | text | BattleRoom scoreboard and feedback | feedback-or-error | — |
| src/pages/BattleRoom.test.tsx:256:27 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:256:46 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:278:30 | text | 나 0점 : 0점 상대 | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:279:30 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:287:30 | text | 정답이에요! | feedback-or-error | repeated-text |
| src/pages/BattleRoom.test.tsx:288:30 | text | 상대방이 생각 중이에요... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:297:30 | text | 아쉬워요. 땡! | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:298:30 | text | 상대방도 답을 골랐어요. | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:307:30 | text | 승리! | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.test.tsx:308:30 | text | 내 점수 7 : 5 상대 점수 | learner-text-candidate | — |
| src/pages/BattleRoom.test.tsx:309:30 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:35:78 | text | {arena.gradeBand ?? `${arena.grade}학년`} | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:35:99 | text | ${arena.grade}학년 | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:37:14 | text | } title={arena.title} body={arena.desc ? | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:97:48 | text | {draw ? '무승부!' : won ? '승리!' : '아쉽지만 패배'} | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:97:57 | text | 무승부! | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:97:72 | text | 승리! | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:97:80 | text | 아쉽지만 패배 | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:98:12 | text | 내 점수 {me?.score ?? 0} : {opponent?.score ?? 0} 상대 점수 | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:101:25 | text | 상대 {opponent.nickname}와의 대결이었어요 | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:101:60 | text | } {opponent && !reported && onReport ? ( | button-or-action | — |
| src/pages/BattleRoom.tsx:109:12 | text | 상대 이름 신고하기 | button-or-action | repeated-text |
| src/pages/BattleRoom.tsx:111:20 | text | ) : null} {reported && | button-or-action | technical-or-internal |
| src/pages/BattleRoom.tsx:113:25 | text | 신고가 접수됐어요. 선생님이 확인할 거예요. | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:114:47 | text | 아레나로 돌아가기 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:131:32 | text | 대전 상대: {opponentName} | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:132:47 | text | 나 {me?.score ?? 0}점 : {opponent?.score ?? 0}점 상대 | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:135:60 | text | {ttsSupported() && (room.ttsEnabled ?? false) && ( | button-or-action | — |
| src/pages/BattleRoom.tsx:139:25 | aria-label | 문제 읽어주기 | aria-label | repeated-text |
| src/pages/BattleRoom.tsx:143:20 | text | )} {timedOut ? ( | button-or-action | — |
| src/pages/BattleRoom.tsx:146:14 | text | 시간이 지난 문제예요. 다음 라운드로 넘어가요. | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:153:22 | text | )) )} {answered && myCorrect !== null && | button-or-action, feedback-or-error | technical-or-internal |
| src/pages/BattleRoom.tsx:156:69 | text | {myCorrect ? '정답이에요!' : '아쉬워요. 땡!'} | feedback-or-error | — |
| src/pages/BattleRoom.tsx:156:83 | text | 정답이에요! | feedback-or-error | repeated-text |
| src/pages/BattleRoom.tsx:156:94 | text | 아쉬워요. 땡! | feedback-or-error | repeated-text |
| src/pages/BattleRoom.tsx:157:45 | text | {oppAnswered ? '상대방도 답을 골랐어요.' : '상대방이 생각 중이에요...'} | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:157:61 | text | 상대방도 답을 골랐어요. | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:157:79 | text | 상대방이 생각 중이에요... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:157:100 | text | } {canClaimWin(room, meUid, now) && ( | button-or-action | technical-or-internal |
| src/pages/BattleRoom.tsx:159:64 | text | 자동 승리로 처리할까요? | button-or-action | repeated-text |
| src/pages/BattleRoom.tsx:163:48 | text | 나가기 | button-or-action | repeated-text |
| src/pages/BattleRoom.tsx:172:40 | text | = 2; const canStart = matched && problemsLoaded !== false; const myName = me?.nickname ?? '나'; return ( | learner-text-candidate | long-or-dense |
| src/pages/BattleRoom.tsx:174:35 | text | 나 | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:178:30 | text | {matched ? '1:1 매칭 완료!' : '대결 상대를 기다리는 중...'} | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:178:42 | text | 1:1 매칭 완료! | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:178:57 | text | 대결 상대를 기다리는 중... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:182:14 | text | 문제를 불러오는 중... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:184:82 | text | 네! 준비됐어요! | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:186:27 | text | ) ) : opponent && !opponent.ready ? ( | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:189:12 | text | 상대 준비 기다리는 중... | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:191:12 | text | 곧 시작해요! | learner-text-candidate | — |
| src/pages/BattleRoom.tsx:193:46 | text | 나가기 | button-or-action | repeated-text |
| src/pages/BattleRoom.tsx:209:10 | text | 단답형 문제예요. 정답을 쓰고 제출을 눌러주세요. | feedback-or-error | abstract-or-formal, multiple-actions |
| src/pages/BattleRoom.tsx:210:37 | text | 내 답 | learner-text-candidate | repeated-text |
| src/pages/BattleRoom.tsx:211:102 | placeholder | 예: 세종대왕 | placeholder, input | — |
| src/pages/BattleRoom.tsx:212:70 | text | 제출 | button-or-action | abstract-or-formal, repeated-text |
| src/pages/ClassCreate.test.tsx:9:45 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.test.tsx:9:74 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.test.tsx:10:39 | text | button | button-or-action | repeated-text |
| src/pages/ClassCreate.test.tsx:10:57 | text | 학급 만들기 | button-or-action | repeated-text |
| src/pages/ClassCreate.test.tsx:11:44 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.test.tsx:14:7 | text | shows error for empty name | feedback-or-error | — |
| src/pages/ClassCreate.test.tsx:14:41 | text | { render( | feedback-or-error | repeated-text |
| src/pages/ClassCreate.test.tsx:16:39 | text | button | button-or-action | repeated-text |
| src/pages/ClassCreate.test.tsx:16:57 | text | 학급 만들기 | button-or-action | repeated-text |
| src/pages/ClassCreate.test.tsx:17:30 | text | 학급 이름을 입력해주세요 | input | abstract-or-formal, repeated-text |
| src/pages/ClassCreate.test.tsx:22:62 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.test.tsx:23:45 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.test.tsx:23:74 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.test.tsx:24:39 | text | button | button-or-action | repeated-text |
| src/pages/ClassCreate.test.tsx:24:57 | text | 학급 만들기 | button-or-action | repeated-text |
| src/pages/ClassCreate.test.tsx:25:30 | text | 같은 이름의 학급이 이미 있어요 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.tsx:5:128 | text | void; existingNames?: string[] }) { const [name, setName] = useState(''); const [error, setError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ClassCreate.tsx:12:17 | text | 학급 이름을 입력해주세요 | feedback-or-error, input | abstract-or-formal, repeated-text |
| src/pages/ClassCreate.tsx:16:42 | text | normalizeClassroomName(n) === want)) { setError('같은 이름의 학급이 이미 있어요'); return; } setError(null); onCreate(name.trim()); }; return ( | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ClassCreate.tsx:17:17 | text | 같은 이름의 학급이 이미 있어요 | feedback-or-error | repeated-text |
| src/pages/ClassCreate.tsx:26:11 | text | 새 학급을 만들어볼까요? | heading | — |
| src/pages/ClassCreate.tsx:28:37 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/pages/ClassCreate.tsx:33:24 | placeholder | 예: 4학년 3반 | placeholder, input | — |
| src/pages/ClassCreate.tsx:35:11 | text | {error && | feedback-or-error | repeated-text |
| src/pages/ClassCreate.tsx:37:72 | text | 학급 만들기 | button-or-action | repeated-text |
| src/pages/ClassCreate.tsx:39:18 | text | {onCancel && ( | button-or-action | — |
| src/pages/ClassCreate.tsx:41:52 | text | 돌아가기 | button-or-action | — |
| src/pages/ClassJoin.tsx:11:46 | text | void; }) { const [code, setCode] = useState(''); const [nickname, setNickname] = useState(defaultNickname); const [error, setError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ClassJoin.tsx:17:41 | text | { e.preventDefault(); if (!isValidInviteCode(code)) { setError('초대 코드 6자리를 확인해주세요'); return; } const nameError = validateNickname(nickname); if (nameError) { setError(nameError); return; } setError(null); onJoin(normalizeInviteCode(code), nickname.trim()); }; return ( | button-or-action, feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/ClassJoin.tsx:20:17 | text | 초대 코드 6자리를 확인해주세요 | feedback-or-error | repeated-text |
| src/pages/ClassJoin.tsx:34:11 | text | 어떤 학급에 들어갈까요? | heading | — |
| src/pages/ClassJoin.tsx:36:38 | text | 초대 코드 | learner-text-candidate | repeated-text |
| src/pages/ClassJoin.tsx:41:24 | placeholder | 예: A1B2C3 | placeholder, input | — |
| src/pages/ClassJoin.tsx:44:35 | text | 내 이름 | learner-text-candidate | — |
| src/pages/ClassJoin.tsx:49:24 | placeholder | 예: 김일호 | placeholder, input | — |
| src/pages/ClassJoin.tsx:51:11 | text | {error && | feedback-or-error | repeated-text |
| src/pages/ClassJoin.tsx:53:72 | text | 학급 들어가기 | button-or-action | repeated-text |
| src/pages/ClassSelect.test.tsx:11:30 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/ClassSelect.test.tsx:12:30 | text | 5학년 1반 | learner-text-candidate | repeated-text |
| src/pages/ClassSelect.test.tsx:17:30 | text | 어느 학급으로 들어갈까요? | learner-text-candidate | repeated-text |
| src/pages/ClassSelect.test.tsx:18:39 | text | button | button-or-action | repeated-text |
| src/pages/ClassSelect.test.tsx:22:7 | text | shows no create button in the picker | button-or-action | — |
| src/pages/ClassSelect.test.tsx:22:51 | text | { render( | button-or-action | repeated-text |
| src/pages/ClassSelect.test.tsx:23:57 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/ClassSelect.test.tsx:24:32 | text | button | button-or-action | repeated-text |
| src/pages/ClassSelect.test.tsx:24:50 | text | 새 학급 만들기 | button-or-action | repeated-text |
| src/pages/ClassSelect.tsx:14:11 | text | 어느 학급으로 들어갈까요? | heading | repeated-text |
| src/pages/ClassSelect.tsx:14:30 | text | {classrooms.length === 0 ? ( | heading | — |
| src/pages/ClassSelect.tsx:16:28 | title | 들어갈 학급이 없어요. 선생님께 초대 코드를 받아주세요! | title | — |
| src/pages/ClassSelect.tsx:24:12 | text | {c.name} · 초대 코드 {c.inviteCode} | button-or-action | — |
| src/pages/JoinFlow.test.tsx:10:39 | text | button | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:10:57 | text | 선생님으로 시작 | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:14:7 | text | shows error for short invite code | feedback-or-error | — |
| src/pages/JoinFlow.test.tsx:14:48 | text | { render( | feedback-or-error | repeated-text |
| src/pages/JoinFlow.test.tsx:15:40 | text | 학생 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:16:45 | text | 초대 코드 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:16:74 | text | ab | learner-text-candidate | — |
| src/pages/JoinFlow.test.tsx:17:39 | text | button | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:17:57 | text | 학급 들어가기 | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:18:30 | text | 초대 코드 6자리를 확인해주세요 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:23:40 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:24:45 | text | 초대 코드 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:24:74 | text | a1b2c3 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:25:39 | text | button | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:25:57 | text | 학급 들어가기 | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:26:52 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:31:40 | text | 시발 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:32:45 | text | 초대 코드 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:32:74 | text | a1b2c3 | learner-text-candidate | repeated-text |
| src/pages/JoinFlow.test.tsx:33:39 | text | button | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:33:57 | text | 학급 들어가기 | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:41:39 | text | button | button-or-action | repeated-text |
| src/pages/JoinFlow.test.tsx:41:57 | text | 학생으로 시작 | button-or-action | repeated-text |
| src/pages/LoginScreen.tsx:12:70 | text | 퀴즈 아레나 | learner-text-candidate | repeated-text |
| src/pages/LoginScreen.tsx:13:73 | text | {'선생님 문제로 친구와 1:1 퀴즈 대결!'} | learner-text-candidate | — |
| src/pages/LoginScreen.tsx:14:15 | text | 선생님 문제로 친구와 1:1 퀴즈 대결! | learner-text-candidate | repeated-text |
| src/pages/LoginScreen.tsx:16:50 | text | Google 계정으로 시작하기 | learner-text-candidate | repeated-text |
| src/pages/RoleSelect.tsx:14:11 | text | 반가워요! 누구신가요? | heading | repeated-text |
| src/pages/RoleSelect.tsx:15:10 | text | 처음에는 개구리로 시작해요 | learner-text-candidate | — |
| src/pages/RoleSelect.tsx:16:10 | text | 별을 모으면 상점에서 바꿀 수 있어요 | learner-text-candidate | — |
| src/pages/RoleSelect.tsx:20:53 | text | teacher | learner-text-candidate | — |
| src/pages/RoleSelect.tsx:20:80 | text | 선생님으로 시작 | learner-text-candidate | repeated-text |
| src/pages/RoleSelect.tsx:22:53 | text | student | learner-text-candidate | — |
| src/pages/RoleSelect.tsx:22:80 | text | 학생으로 시작 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:5:30 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:16:22 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:21:30 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:22:31 | text | one@school.kr | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:36:33 | text | one@school.kr | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:45:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:45:38 | text | 기초 덧셈 아레나 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:45:57 | text | 설명 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:45:72 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:52:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:52:57 | text | 지금 바로 대결! | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:54:30 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:54:48 | text | 둘러보기 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:54:77 | text | tab-active | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:61:32 | text | 이호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:67:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:67:57 | text | 순위표 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:68:30 | text | 이호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:81:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:81:57 | text | 내 기록 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:83:30 | text | 총 XP | learner-text-candidate | repeated-text, technical-or-internal |
| src/pages/StudentHome.test.tsx:91:35 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:92:35 | text | 이호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:101:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:101:57 | text | 순위표 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:102:30 | text | 우리 반 대결왕 Top 20 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:104:30 | text | 이호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:112:7 | text | shows arena card with 10-battle hint | hint | — |
| src/pages/StudentHome.test.tsx:112:51 | text | { render( | hint | repeated-text |
| src/pages/StudentHome.test.tsx:118:21 | text | 덧셈 아레나 | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:119:20 | text | 설명 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:120:23 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:123:21 | text | 받아올림 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:133:9 | text | 20문제 중 10문제 대결 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:134:30 | text | 20문제 중 10문제 대결 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:135:30 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:136:30 | text | 3-4학년 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:137:30 | text | 대결 준비됨 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:143:79 | text | dragon | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:143:107 | text | legend | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:157:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:157:57 | text | 상점 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:158:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:158:57 | text | 80별에 사기 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:173:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:173:57 | text | 상점 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:174:30 | text | 80별 필요 | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:175:32 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:175:50 | text | 80별에 사기 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:190:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:190:57 | text | 상점 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:191:42 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:191:60 | text | 사용하기 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:207:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:207:57 | text | 내 기록 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:208:45 | text | 내 이름 바꾸기 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:208:77 | text | 시발 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:209:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:209:57 | text | 이름 저장 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:226:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:226:57 | text | 내 기록 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:227:45 | text | 내 이름 바꾸기 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:227:77 | text | 삼호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:228:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:228:57 | text | 이름 저장 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:229:44 | text | 삼호 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:18 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:31 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:47 | text | 설명 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:62 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:104 | text | illust | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:124 | text | math-pizza | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:238:155 | text | #FFF8E1 | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:247:30 | text | 분수 첫걸음 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:256:18 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:256:31 | text | 하나 | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:256:56 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:257:18 | text | a2 | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:257:31 | text | 둘 | learner-text-candidate | — |
| src/pages/StudentHome.test.tsx:257:55 | text | 국어 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:267:36 | text | svg, span[aria-hidden="true"] | learner-text-candidate | technical-or-internal |
| src/pages/StudentHome.test.tsx:277:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:277:57 | text | 로그아웃 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:278:30 | text | 정말 로그아웃 하시겠습니까? | learner-text-candidate | repeated-text |
| src/pages/StudentHome.test.tsx:280:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:280:57 | text | 확인 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:289:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:289:57 | text | 로그아웃 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:290:39 | text | button | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:290:57 | text | 취소 | button-or-action | repeated-text |
| src/pages/StudentHome.test.tsx:292:32 | text | 정말 로그아웃 하시겠습니까? | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:93:79 | text | ('browse'); const [newName, setNewName] = useState(''); const [nameError, setNameError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/StudentHome.tsx:98:25 | text | { const err = validateNickname(newName); if (err) { setNameError(err); return; } setNameError(null); onRename?.(newName.trim()); setNewName(''); }; return ( | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/StudentHome.tsx:117:26 | aria-label | 학생 메뉴 | aria-label | — |
| src/pages/StudentHome.tsx:118:56 | text | browse | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:118:89 | text | browse | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:118:100 | text | page | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:118:139 | text | browse | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:118:150 | text | tab-active | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:118:175 | text | 둘러보기 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:121:56 | text | leaderboard | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:121:94 | text | leaderboard | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:121:110 | text | page | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:121:149 | text | leaderboard | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:121:165 | text | tab-active | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:121:190 | text | 순위표 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:124:56 | text | record | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:124:89 | text | record | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:124:100 | text | page | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:124:139 | text | record | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:124:150 | text | tab-active | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:124:175 | text | 내 기록 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:127:56 | text | shop | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:127:87 | text | shop | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:127:96 | text | page | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:127:135 | text | shop | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:127:144 | text | tab-active | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:127:169 | text | 상점 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:130:75 | text | 로그아웃 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:136:55 | text | 오늘 도전할 아레나는? | learner-text-candidate | — |
| src/pages/StudentHome.tsx:139:36 | title | 아직 참여 중인 아레나가 없어요 | title | — |
| src/pages/StudentHome.tsx:152:104 | text | {(a.grade != null \|\| a.gradeBand) && ( | learner-text-candidate | technical-or-internal |
| src/pages/StudentHome.tsx:154:88 | text | {gradeLabel(a)} | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:156:24 | text | } title={a.title} body={ | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:163:51 | text | 20문제 중 10문제 대결 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:165:80 | text | 대결 준비됨 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:167:24 | text | } footer={ | learner-text-candidate | — |
| src/pages/StudentHome.tsx:169:78 | text | 지금 바로 대결! | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:178:43 | text | 우리 반 대결왕 Top 20 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:179:60 | text | 내 순위 {myRank}위 | learner-text-candidate | — |
| src/pages/StudentHome.tsx:179:78 | text | } {leaders.length === 0 ? ( | learner-text-candidate | — |
| src/pages/StudentHome.tsx:181:34 | title | 첫 대결에서 승리하면 이 자리에 올라요! | title | — |
| src/pages/StudentHome.tsx:200:22 | text | {rank}위 | learner-text-candidate | — |
| src/pages/StudentHome.tsx:205:48 | text | {l.nickname} {l.title ? | learner-text-candidate | — |
| src/pages/StudentHome.tsx:207:67 | text | · {l.title} | learner-text-candidate | — |
| src/pages/StudentHome.tsx:207:85 | text | : null} {highlighted && | learner-text-candidate | technical-or-internal |
| src/pages/StudentHome.tsx:210:46 | text | Lv{l.level ?? 1} · {l.winCount ?? 0}승 · 정답률 {l.correctRate ?? 0}% ·{' '} | feedback-or-error | long-or-dense |
| src/pages/StudentHome.tsx:226:50 | text | {profile.nickname} {profile.title ? | learner-text-candidate | — |
| src/pages/StudentHome.tsx:228:67 | text | · {profile.title} | learner-text-candidate | — |
| src/pages/StudentHome.tsx:228:91 | text | : null} | learner-text-candidate | repeated-text, technical-or-internal |
| src/pages/StudentHome.tsx:233:16 | text | 총 XP | learner-text-candidate | repeated-text, technical-or-internal |
| src/pages/StudentHome.tsx:234:16 | text | {profile.xp} XP · {profile.streak}연승 · 정답률 {profile.correctRate}% | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/StudentHome.tsx:237:16 | text | 내 별 | learner-text-candidate | — |
| src/pages/StudentHome.tsx:238:16 | text | {profile.stars ?? 0} 별 | learner-text-candidate | — |
| src/pages/StudentHome.tsx:240:47 | text | 내 이름 바꾸기 | input | repeated-text |
| src/pages/StudentHome.tsx:247:17 | text | {nameError && | feedback-or-error | — |
| src/pages/StudentHome.tsx:249:56 | text | 이름 저장 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:257:43 | text | 아바타 상점 | learner-text-candidate | — |
| src/pages/StudentHome.tsx:258:41 | text | 내 별 {profile.stars ?? 0} | learner-text-candidate | — |
| src/pages/StudentHome.tsx:267:44 | text | 사용 중 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:267:52 | text | ) : owned ? ( | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:269:81 | text | 사용하기 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:271:30 | text | ) : canAfford(profile.stars ?? 0, g.price) ? ( | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:273:88 | text | {g.price}별에 사기 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:277:44 | text | {g.price}별 필요 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:282:48 | text | 칭호 상점 | learner-text-candidate | — |
| src/pages/StudentHome.tsx:283:36 | text | { const owned = ownsTitle(profile.unlockedTitles, g.id); const equipped = (profile.title ?? '새싹') === g.label; return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/pages/StudentHome.tsx:285:51 | text | 새싹 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:288:64 | text | {equipped ? ( | learner-text-candidate | — |
| src/pages/StudentHome.tsx:290:44 | text | 사용 중 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:290:52 | text | ) : owned ? ( | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:292:83 | text | 사용하기 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:294:30 | text | ) : canAfford(profile.stars ?? 0, g.price) ? ( | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:296:87 | text | {g.price}별에 사기 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:300:44 | text | {g.price}별 필요 | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:305:18 | text | )} {confirmingLogout && ( | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:308:25 | title | 로그아웃 확인 | title | repeated-text |
| src/pages/StudentHome.tsx:309:43 | text | 정말 로그아웃 하시겠습니까? | learner-text-candidate | repeated-text |
| src/pages/StudentHome.tsx:311:88 | text | 확인 | button-or-action | repeated-text |
| src/pages/StudentHome.tsx:314:99 | text | 취소 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:12:30 | text | 진행 중인 대결 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:13:30 | text | 지금은 진행 중인 대결이 없어요 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:14:30 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:14:48 | text | 현재 대결 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:14:78 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:21:23 | text | r1 | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:21:41 | text | 기초 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:21:57 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:21:63 | text | 이호 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:38:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:38:57 | text | 강제 종료 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:39:30 | text | 이 대결을 강제 종료할까요? | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:40:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:40:57 | text | 끝내기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:48:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:48:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:49:30 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:49:48 | text | 새 아레나 만들기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:52:7 | text | shows students placeholder | input | — |
| src/pages/TeacherHome.test.tsx:52:41 | text | { render( | input | repeated-text |
| src/pages/TeacherHome.test.tsx:56:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:56:57 | text | 학생 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:57:30 | text | 학생 일괄 관리 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:64:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:64:57 | text | 학생 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:65:30 | text | 아직 등록된 학생이 없어요 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:72:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:72:57 | text | 분석 | button-or-action | abstract-or-formal, repeated-text |
| src/pages/TeacherHome.test.tsx:73:30 | text | 아직 분석할 기록이 없어요 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/pages/TeacherHome.test.tsx:80:32 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:80:50 | text | 선생님 관리 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:89:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:89:57 | text | 선생님 관리 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:91:45 | text | 선생님 이메일 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:91:76 | text | n@school.kr | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:92:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:92:57 | text | 추가 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:94:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:94:57 | text | 삭제 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:123:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:123:38 | text | 덧셈 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:127:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:127:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:128:56 | text | 대전 상대 공개 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:138:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:138:38 | text | 덧셈 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:142:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:142:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:143:48 | text | 대전 상대 공개 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:173:73 | text | [4수01-09] | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:174:73 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:178:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:178:57 | text | 분석 | button-or-action | abstract-or-formal, repeated-text |
| src/pages/TeacherHome.test.tsx:179:30 | text | 우리 반이 어려워해요 Top 3 (최근 30일) | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:188:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:188:38 | text | 덧셈 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:188:71 | text | [4수01-03] | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:192:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:192:57 | text | 분석 | button-or-action | abstract-or-formal, repeated-text |
| src/pages/TeacherHome.test.tsx:193:30 | text | 47개 중 1개 출제 | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:204:23 | text | b1 | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:204:36 | text | 남의 덧셈 | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:204:54 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:208:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:208:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:209:30 | text | 다른 반 공개 아레나 가져오기 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:210:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:210:57 | text | 가져오기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:219:44 | text | 시발 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:222:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:222:57 | text | 학생 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:254:63 | text | 일호 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:254:106 | text | 나쁜이름 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:259:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:259:57 | text | 신고 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:261:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:261:57 | text | 처리완료 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:267:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:267:57 | text | 신고 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:268:30 | text | 접수된 신고가 없어요 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:280:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:280:38 | text | 덧셈 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:296:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:296:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:297:57 | text | 읽어주기 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:308:21 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:325:44 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:325:62 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:326:45 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:326:63 | text | 학생 화면 미리보기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:329:48 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:331:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:331:57 | text | 닫기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:332:50 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:337:7 | text | shows the signed-in profile next to the preview button | button-or-action | long-or-dense |
| src/pages/TeacherHome.test.tsx:337:69 | text | { render( | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:339:336 | text | 김선생 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:341:30 | text | 김선생 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:342:31 | text | kim@school.kr | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:350:33 | text | kim@school.kr | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:360:21 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:375:28 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:376:28 | text | 4학년 4반 | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:380:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:380:57 | text | 학급 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:386:30 | text | 내 학급 목록 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:395:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:395:57 | text | 입장하기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:403:42 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:403:60 | text | 이름 바꾸기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:404:45 | text | 학급 새 이름 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:404:76 | text | 4학년 5반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:405:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:405:57 | text | 저장 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:406:67 | text | 4학년 5반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:413:42 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:413:60 | text | 학급 삭제 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:415:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:415:57 | text | 확인 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:426:21 | text | 4학년 3반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:444:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:444:57 | text | 학급 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:445:45 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:445:74 | text | 5학년 1반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:446:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:446:57 | text | 이름 저장 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:447:53 | text | 5학년 1반 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:453:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:453:57 | text | 학급 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:454:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:454:57 | text | 새 학급 만들기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:463:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:463:57 | text | 학생 화면 미리보기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:492:9 | text | , ); fireEvent.click(screen.getByRole('button', { name: '아레나' })); fireEvent.click(screen.getByRole('button', { name: '기본 아레나 6개 가져오기' })); expect(onSeedDefaults).toHaveBeenCalledTimes(1); rerender( | button-or-action | long-or-dense |
| src/pages/TeacherHome.test.tsx:494:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:494:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:495:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:495:57 | text | 기본 아레나 6개 가져오기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:503:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:503:38 | text | 내 것 | learner-text-candidate | — |
| src/pages/TeacherHome.test.tsx:520:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:520:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:521:32 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:521:50 | text | 기본 아레나 6개 가져오기 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:532:25 | text | a1 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:532:38 | text | 덧셈 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:548:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:548:57 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:577:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:577:57 | text | 로그아웃 | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:578:30 | text | 정말 로그아웃 하시겠습니까? | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.test.tsx:579:39 | text | button | button-or-action | repeated-text |
| src/pages/TeacherHome.test.tsx:579:57 | text | 확인 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:131:60 | text | (null); const [teacherEmail, setTeacherEmail] = useState(''); const [coverageGrade, setCoverageGrade] = useState(3); const [coverageSubject, setCoverageSubject] = useState('수학'); const coverageSubjects = subjectsOfGrade(coverageGrade); const effectiveCoverageSubject = coverageSubjects.includes(coverageSubject) ? coverageSubject : (coverageSubjects[0] ?? '국어'); const [className, setClassName] = useState(classroomName ?? ''); const [confirmingLogout, setConfirmingLogout] = useState(false); const [showUpdates, setShowUpdates] = useState(false); const [classError, setClassError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/TeacherHome.tsx:134:59 | text | 수학 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:136:124 | text | 국어 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:140:62 | text | (null); const [renamingId, setRenamingId] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/TeacherHome.tsx:141:62 | text | (null); const [renameText, setRenameText] = useState(''); const [listError, setListError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/TeacherHome.tsx:143:60 | text | (null); const [deletingId, setDeletingId] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/pages/TeacherHome.tsx:162:49 | text | 선생님 워크스페이스 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:165:72 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:171:14 | text | 학생 화면 미리보기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:176:26 | aria-label | 선생님 메뉴 | aria-label | — |
| src/pages/TeacherHome.tsx:177:56 | text | live | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:177:87 | text | live | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:177:96 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:177:135 | text | live | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:177:144 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:177:169 | text | 현재 대결 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:180:56 | text | arenas | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:180:89 | text | arenas | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:180:100 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:180:139 | text | arenas | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:180:150 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:180:175 | text | 아레나 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:183:56 | text | students | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:183:91 | text | students | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:183:104 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:183:143 | text | students | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:183:156 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:183:181 | text | 학생 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:186:56 | text | analysis | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:186:91 | text | analysis | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:186:104 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:186:143 | text | analysis | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:186:156 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:186:181 | text | 분석 | button-or-action | abstract-or-formal, repeated-text |
| src/pages/TeacherHome.tsx:189:56 | text | reports | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:189:90 | text | reports | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:189:102 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:189:141 | text | reports | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:189:153 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:189:178 | text | 신고 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:192:56 | text | classroom | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:192:92 | text | classroom | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:192:106 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:192:145 | text | classroom | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:192:159 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:192:184 | text | 학급 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:194:20 | text | {showAdmin && ( | button-or-action | — |
| src/pages/TeacherHome.tsx:196:58 | text | admin | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:196:90 | text | admin | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:196:100 | text | page | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:196:139 | text | admin | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:196:149 | text | tab-active | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:196:174 | text | 선생님 관리 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:200:75 | text | 로그아웃 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:206:43 | text | 진행 중인 대결 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:206:55 | text | {live.length === 0 ? ( | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:208:34 | title | 지금은 진행 중인 대결이 없어요 | title | repeated-text |
| src/pages/TeacherHome.tsx:212:22 | text | {r.arenaTitle} — {r.players.join(' vs ')} | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:213:55 | text | vs | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:217:26 | text | 이 대결을 강제 종료할까요? | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:218:105 | text | 끝내기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:223:78 | text | 강제 종료 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:230:43 | text | 방치된 대결 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:230:53 | text | {abandoned.length === 0 ? | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:231:42 | text | 방치된 대결이 없어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:232:43 | text | 최근 종료된 대결 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:232:56 | text | {finished.length === 0 ? | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:233:41 | text | 종료된 대결이 아직 없어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:240:82 | text | 새 아레나 만들기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:242:26 | text | {arenas.length === 0 && ( | button-or-action | — |
| src/pages/TeacherHome.tsx:244:76 | text | 기본 아레나 6개 가져오기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:249:59 | text | 아직 만든 아레나가 없어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:261:116 | text | } {(a.grade != null \|\| a.gradeBand) && ( | learner-text-candidate | technical-or-internal |
| src/pages/TeacherHome.tsx:263:86 | text | {gradeLabel(a)} | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:265:84 | text | {a.locked ? '비공개' : '공개 중'} | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:266:36 | text | 비공개 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:266:44 | text | 공개 중 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:268:22 | text | } title={a.title} body={ | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:275:51 | text | 성취기준 {(a.standards ?? []).length}개 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:282:109 | text | 잠금 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:287:32 | text | 대전 상대 공개 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:293:32 | text | 읽어주기 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:297:79 | text | 아레나 수정 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:300:81 | text | 아레나 삭제 | button-or-action | — |
| src/pages/TeacherHome.tsx:309:59 | text | 다른 반 공개 아레나 가져오기 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:311:18 | text | 가져올 수 있는 아레나가 없어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:323:104 | text | {(b.grade != null \|\| b.gradeBand) && ( | learner-text-candidate | technical-or-internal |
| src/pages/TeacherHome.tsx:325:88 | text | {gradeLabel(b)} | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:327:24 | text | } title={b.title} footer={ | button-or-action | — |
| src/pages/TeacherHome.tsx:331:79 | text | 가져오기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:343:43 | text | 학생 일괄 관리 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:345:16 | text | 학급 초대 QR — 탭해서 확대 | learner-text-candidate | technical-or-internal |
| src/pages/TeacherHome.tsx:346:16 | text | 초대 코드: {classroomCode} | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:346:42 | text | {students.length === 0 ? ( | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:348:34 | title | 아직 등록된 학생이 없어요 | title | repeated-text |
| src/pages/TeacherHome.tsx:354:83 | text | ⚠ 이름 확인 필요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:356:80 | text | 학생 삭제 | button-or-action | — |
| src/pages/TeacherHome.tsx:362:57 | text | 명단 내려받기 | button-or-action | — |
| src/pages/TeacherHome.tsx:369:19 | text | {rounds.length === 0 ? ( | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:371:36 | title | 아직 분석할 기록이 없어요 | title | abstract-or-formal, repeated-text |
| src/pages/TeacherHome.tsx:374:22 | text | 어려운 문제 {hard.length}개 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:376:45 | text | {h.problemIndex + 1}번 문제 — {h.correct}/{h.asked} 정답 | feedback-or-error | long-or-dense |
| src/pages/TeacherHome.tsx:380:22 | text | 맞힌 문제 평균 {avg.avgCorrect} vs 틀린 문제 평균 {avg.avgWrong} | feedback-or-error | — |
| src/pages/TeacherHome.tsx:383:49 | text | 우리 반이 어려워해요 Top 3 (최근 30일) | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:385:24 | text | 성취기준별 기록이 아직 없어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:388:39 | text | {w.code} {findStandard(w.code)?.summary ?? ''} — 정답률{' '} {Math.round(w.rate * 100)}% ({w.correct}/{w.asked}) | feedback-or-error | long-or-dense |
| src/pages/TeacherHome.tsx:398:45 | text | 교육과정 커버리지 지도 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:399:47 | text | 학년 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:406:45 | text | {g}학년 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:411:49 | text | 과목 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:419:38 | text | {coverageStandards.length}개 중 {coveredCount}개 출제 | learner-text-candidate | long-or-dense |
| src/pages/TeacherHome.tsx:422:53 | text | 이 학년·과목에는 등록된 기준이 없어요 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:424:91 | text | {c.code} {c.summary} — {c.covered ? '출제됨' : '안 됨'} | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:425:56 | text | 출제됨 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:425:64 | text | 안 됨 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:433:43 | text | 이름 신고 목록 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:433:55 | text | {(reports ?? []).length === 0 ? ( | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:435:34 | title | 접수된 신고가 없어요 | title | repeated-text |
| src/pages/TeacherHome.tsx:439:22 | text | {r.reportedNickname} (신고: {r.reporterNickname}) —{' '} {r.status === 'open' ? '확인 중' : '처리됨'} | learner-text-candidate | long-or-dense |
| src/pages/TeacherHome.tsx:441:45 | text | 확인 중 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:441:54 | text | 처리됨 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:442:23 | text | {r.status === 'open' && ( | button-or-action | — |
| src/pages/TeacherHome.tsx:444:83 | text | 처리완료 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:456:53 | text | 학급 관리 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:458:49 | text | 학급 이름 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:464:19 | text | {classError && | feedback-or-error | — |
| src/pages/TeacherHome.tsx:475:20 | text | 이름 저장 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:478:76 | text | 새 학급 만들기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:483:43 | text | 초대 코드: {classroomCode} | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:486:53 | text | 내 학급 목록 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:488:20 | text | 개설한 학급이 없어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:494:59 | text | 학급 새 이름 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:515:28 | text | 저장 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:524:28 | text | 취소 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:533:84 | text | (지금 학급) | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:535:48 | text | 초대 코드: {c.inviteCode} | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:536:68 | text | {c.id !== (currentClassroomId ?? classroomCode) && ( | button-or-action | long-or-dense, technical-or-internal |
| src/pages/TeacherHome.tsx:538:93 | text | 입장하기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:549:28 | text | 이름 바꾸기 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:552:85 | text | 학급 삭제 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:558:25 | text | )) )} {listError && | feedback-or-error | — |
| src/pages/TeacherHome.tsx:562:20 | text | {deletingId && ( | learner-text-candidate | technical-or-internal |
| src/pages/TeacherHome.tsx:564:29 | title | 학급 삭제 확인 | title | — |
| src/pages/TeacherHome.tsx:566:51 | text | c.id === deletingId)?.name ?? ''}’ 학급을 정말 삭제할까요? 아레나와 대결 기록이 함께 지워져요. | learner-text-candidate | long-or-dense, technical-or-internal |
| src/pages/TeacherHome.tsx:581:20 | text | 확인 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:584:96 | text | 취소 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:594:43 | text | 선생님 관리 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:595:16 | text | 등록된 선생님 계정만 학급을 만들 수 있어요 | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:599:80 | text | 삭제 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:604:44 | text | 선생님 이메일 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:609:28 | placeholder | 예: teacher@school.kr | placeholder, input | — |
| src/pages/TeacherHome.tsx:617:14 | text | 추가 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:620:18 | text | )} {showUpdates && ( | learner-text-candidate | — |
| src/pages/TeacherHome.tsx:623:25 | title | 업데이트 내역 | title | repeated-text |
| src/pages/TeacherHome.tsx:624:51 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:626:19 | text | )} {confirmingLogout && ( | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:629:25 | title | 로그아웃 확인 | title | repeated-text |
| src/pages/TeacherHome.tsx:630:43 | text | 정말 로그아웃 하시겠습니까? | learner-text-candidate | repeated-text |
| src/pages/TeacherHome.tsx:632:88 | text | 확인 | button-or-action | repeated-text |
| src/pages/TeacherHome.tsx:635:99 | text | 취소 | button-or-action | repeated-text |

## Limitations

- Candidates are triage signals, not an automatic grade-level or readability certification.
- Static scanning can miss runtime-composed text, fetched content, canvas/image text, and some template syntax.
- Every candidate requires rendered-state, target-grade, learning-intent, and curriculum-accuracy review.
- This command reads source files and writes only the optional report path; it never rewrites source files.

## Configuration

- Extensions: `.astro, .cjs, .htm, .html, .js, .jsx, .mjs, .svelte, .ts, .tsx, .vue`
- Excluded directories: `.git, .next, .nuxt, .parcel-cache, .turbo, .vite, build, coverage, dist, node_modules, out, target, vendor`
