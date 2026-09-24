# Arena Hardening Follow-ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 최종 리뷰 후속 6건과 기존 emu 실패 1건을 고쳐 AI 아레나를 배포 가능 상태로 만든다.

**Architecture:** 기존 파일 제자리 수정. 새 개념 없음. `locked`를 공개 여부 single source로 두고 `status`는 생애주기 라벨로만 쓴다. Functions는 쓰기 전 auth만 확인하고, 초안 저장은 없앤다(에디터가 최종 저장).

**Tech Stack:** 기존과 동일 (Vite ^7, React ^19, Firebase JS SDK ^12, firebase-functions v2, Vitest ^3).

**Spec:** `docs/superpowers/specs/2026-09-24-ai-arena-design.md` (§3 데이터 모델: `locked==true` 숨김, 문제 10개 이상 공개)

## Global Constraints

- 금지어·원본에셋 사용 금지: BattleStudyGround, 배틀필드, 전투, charlogo.png, logo.png.
- 리더보드 원문구 "명예의 전당 🏆 / LEADERBOARD · TOP 20", "BATTLE READY" 사용 금지.
- 성취기준 원문 복붙 금지.
- 아레나 저장 최대 20문항, 대결은 10 랜덤, 공개는 10개 이상.
- 매 작업 TDD (실패 테스트 → 최소 구현 → 통과 → 커밋).

---

## File Structure

- `functions/src/generateArena.ts` — 수정 (H1 auth, H2 저장 제거). `functions/src/validate.ts` — 수정 (H1 `requireAuth` 헬퍼).
- `functions/src/validate.test.ts` — 수정 (H1 테스트).
- `src/hooks/useArenaAdmin.ts` — 수정 (H4 standardCode 보존).
- `src/lib/arena.ts` — 수정 (H3 `isVisibleArena`).
- `src/hooks/useArenas.ts` — 수정 (H3 draft 제외).
- `src/pages/ArenaEditor.tsx` — 수정 (H4 코드 표시, H5 내용 검증, H6 이름 변경).
- `src/pages/ArenaEditor.test.tsx` — 수정 (H5·H6 테스트).
- `src/App.tsx` — 수정 (H6 이름 변경).
- `src/hooks/useArenaAdmin.emu.test.ts` — 재작성 (H7 이메일 계정 흐름).
- `firestore.rules` — 수정 (H7 anon email 가드).
- `docs/UPDATELOG.md` — 수정 (완료 기록).

---

### Task H1: generateArena 인증 게이트

**Files:**
- Modify: `functions/src/validate.ts` (추가: `requireAuth`), `functions/src/generateArena.ts` (호출부), `functions/src/validate.test.ts`

**Interfaces:**
- Consumes: 없음.
- Produces: `requireAuth(data: { auth?: unknown }): { ok: true } | { ok: false; error: string }` (generateArena가 소비).

- [ ] **Step 1: Write the failing test**

```ts
// functions/src/validate.test.ts 에 추가
import { describe, expect, it } from 'vitest';
import { requireAuth } from './validate';

describe('requireAuth', () => {
  it('rejects calls without auth', () => {
    expect(requireAuth({})).toEqual({ ok: false, error: 'sign-in required' });
  });
  it('accepts calls with auth', () => {
    expect(requireAuth({ auth: { uid: 'u1' } })).toEqual({ ok: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run functions/src/validate.test.ts`
Expected: FAIL with "requireAuth is not defined" (또는 import 오류)

- [ ] **Step 3: Write minimal implementation**

```ts
// functions/src/validate.ts 에 추가
export function requireAuth(request: { auth?: unknown }): { ok: true } | { ok: false; error: string } {
  return request.auth ? { ok: true } : { ok: false, error: 'sign-in required' };
}
```

```ts
// functions/src/generateArena.ts onCall 맨 앞 (input 검증 전)
import { requireAuth } from './validate';
const authed = requireAuth(request);
if (!authed.ok) {
  throw new HttpsError('unauthenticated', authed.error);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run functions/src/validate.test.ts` + `npx tsc --noEmit -p functions/tsconfig.json`
Expected: PASS (기존 9 + 신규 2 = 11)

- [ ] **Step 5: Commit**

```bash
git add functions/src/validate.ts functions/src/validate.test.ts functions/src/generateArena.ts
git commit -m "feat: require sign-in for generateArena"
```

---

### Task H2: 고아 arena 저장 제거 (문제만 반환)

**Files:**
- Modify: `functions/src/generateArena.ts`, `src/pages/ArenaEditor.tsx` (응답 타입의 `arenaId` 제거)

**Interfaces:**
- Consumes: H1.
- Produces: `GenerateArenaResponse = { problems: DraftProblem[] }` (에디터가 소비).

- [ ] **Step 1: Write the failing test** — 해당 없음 (저장 제거는 삭제 코드; `validate.test.ts` 기존 테스트가 그대로 통과해야 함). 대신 `generateArena.ts`에 `db.collection('arenas').add` 문자열이 없는지 육안 확인을 Step 4에 포함.

- [ ] **Step 2: Run test to verify current state**

Run: `npx vitest run functions/src/validate.test.ts`
Expected: PASS (삭제 작업이므로 RED 없음)

- [ ] **Step 3: Write minimal implementation**

```ts
// generateArena.ts: admin import·db·arenaRef·batch 블록 삭제, 반환 변경
return { problems };
// 응답 인터페이스 변경
export interface GenerateArenaResponse {
  problems: DraftProblem[];
}
```

```tsx
// ArenaEditor.tsx 응답 인터페이스 변경
interface GenerateArenaResponse {
  problems: { text: string; options: string[]; answerIndex: number; explanation?: string }[];
}
```

(`res.data.problems` 사용부는 그대로. `db` 미사용이 되면 `admin` import도 삭제.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run functions/src/validate.test.ts` + `npx tsc --noEmit -p functions/tsconfig.json` + `npm test`
Expected: PASS + `grep -n "arenas').add\|collection('arenas')" functions/src/generateArena.ts` 결과 없음

- [ ] **Step 5: Commit**

```bash
git add functions/src/generateArena.ts src/pages/ArenaEditor.tsx
git commit -m "feat: return AI problems without persisting orphan arena"
```

---

### Task H3: draft 노출 방지 (`isVisibleArena`)

**Files:**
- Modify: `src/lib/arena.ts` (추가), `src/hooks/useArenas.ts` (클라이언트 필터), `src/lib/arena.test.ts` (신규 — `src/lib/*.test.ts` 규칙 따름)

**Interfaces:**
- Consumes: `Arena.status`.
- Produces: `isVisibleArena(a: Arena): boolean` (useArenas가 소비).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/arena.test.ts (신규)
import { describe, expect, it } from 'vitest';
import { isVisibleArena } from './arena';

describe('isVisibleArena', () => {
  it('hides locked arenas', () => {
    expect(isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: true })).toBe(false);
  });
  it('hides drafts even when unlocked', () => {
    expect(isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: false, status: 'draft' })).toBe(false);
  });
  it('shows published unlocked arenas', () => {
    expect(isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: false, status: 'published' })).toBe(true);
  });
  it('shows legacy arenas without status', () => {
    expect(isVisibleArena({ id: 'a', title: 't', desc: '', subject: '수학', locked: false })).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/arena.test.ts`
Expected: FAIL with "Failed to resolve import" (파일은 있으나 함수 없음 — 구현은 Step 3)

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/arena.ts 에 추가
export function isVisibleArena(a: Arena): boolean {
  if (a.locked) return false;
  if (a.status === 'draft') return false;
  return true;
}
```

```ts
// src/hooks/useArenas.ts snapshot 매핑에 필터 추가
import type { Arena } from '../lib/arena';
import { isVisibleArena } from '../lib/arena';
setArenas(
  snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Arena, 'id'>) }))
    .filter(isVisibleArena),
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/arena.ts src/lib/arena.test.ts src/hooks/useArenas.ts
git commit -m "feat: hide draft arenas from students"
```

---

### Task H4: `standardCode` 보존

**Files:**
- Modify: `src/hooks/useArenaAdmin.ts`, `src/pages/ArenaEditor.tsx`

**Interfaces:**
- Consumes: DB 문제 문서의 `standardCode`.
- Produces: 편집→저장 후에도 유지되는 `standardCode` (H5 검증과 무관).

- [ ] **Step 1: Write the failing test** — `useArenaAdmin`은 Firestore 경로라 단위 테스트 없음. 대신 에디터往返 테스트를 `ArenaEditor.test.tsx`에 추가:

```tsx
it('keeps standardCode through edit and save', () => {
  const onSave = vi.fn();
  render(
    <ArenaEditor
      initial={baseInitial}
      problems={[{ text: 'Q', options: ['1', '2', '3', '4'], answerIndex: 0, explanation: '', standardCode: '3수01-01' }]}
      onSave={onSave}
      onCancel={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: '추가' }));
  // 10개 미만이라 공개 버튼은 비활성이지만 onSave 직접 호출 대신 아래 H5와 함께 검증
  expect(screen.getByText('3수01-01')).toBeTruthy();
});
```

(정확히는: 코드 라벨이 화면에 보여야 통과. 현재는 라벨이 없어 RED.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: FAIL (getByText '3수01-01' 없음)

- [ ] **Step 3: Write minimal implementation**

```ts
// useArenaAdmin.ts
export interface EditableProblem {
  text: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation?: string;
  standardCode?: string;
}
function toEditable(...) {
  return { ..., standardCode: (data.standardCode as string) ?? '' };
}
// loadProblems map에 standardCode 추가
.map(({ text, options, answerIndex, explanation, standardCode }) => ({ text, options, answerIndex, explanation, standardCode }));
```

```tsx
// ArenaEditor.tsx normalizeDraft에 standardCode 전달
return { text, options, answerIndex, explanation, ...(typeof p.standardCode === 'string' && p.standardCode ? { standardCode: p.standardCode } : {}) };
// 문제 카드에 코드 라벨 표시
{p.standardCode ? <p>{p.standardCode}</p> : null}
```

(응답 타입에도 `standardCode?: string` 추가. 저장은 `{...p}` 확산이라 자동 포함.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useArenaAdmin.ts src/pages/ArenaEditor.tsx src/pages/ArenaEditor.test.tsx
git commit -m "feat: preserve standardCode through arena editing"
```

---

### Task H5: 공개 전 내용 검증

**Files:**
- Modify: `src/pages/ArenaEditor.tsx`, `src/pages/ArenaEditor.test.tsx`

**Interfaces:**
- Consumes: H4의 items.
- Produces: `findProblemError(items): string | null` (에디터 내부, export해서 테스트).

- [ ] **Step 1: Write the failing test**

```tsx
import ArenaEditor, { findProblemError } from './ArenaEditor';

it('blocks publish with blank or duplicate options', () => {
  expect(findProblemError([{ text: '', options: ['1', '2', '3', '4'], answerIndex: 0 }])).toBeTruthy();
  expect(findProblemError([{ text: 'Q', options: ['1', '1', '2', '3'], answerIndex: 0 }])).toContain('겹');
  expect(
    findProblemError(Array.from({ length: 10 }, () => ({ text: 'Q', options: ['1', '2', '3', '4'], answerIndex: 0 }))),
  ).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: FAIL (findProblemError 없음)

- [ ] **Step 3: Write minimal implementation**

```tsx
export function findProblemError(items: EditableProblem[]): string | null {
  for (const [i, p] of items.entries()) {
    if (!p.text.trim()) return `${i + 1}번 문제 내용이 비었어요`;
    if (p.options.some((o) => !o.trim())) return `${i + 1}번 빈 선택지가 있어요`;
    if (new Set(p.options.map((o) => o.trim())).size !== p.options.length) return `${i + 1}번 선택지가 겹쳐요`;
  }
  return null;
}
// canPublish 교체
const contentError = findProblemError(items);
const canPublish = items.length >= MIN_PROBLEMS && contentError === null;
// 버튼 아래 안내 교체
{!canPublish && <p>{items.length < MIN_PROBLEMS ? '문제를 10개 이상 넣어주세요' : contentError}</p>}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (기존 "10개 미만 차단" 테스트의 문구 기대값 유지 확인 — 9개 빈 문제면 개수 안내가 먼저 뜸)

- [ ] **Step 5: Commit**

```bash
git add src/pages/ArenaEditor.tsx src/pages/ArenaEditor.test.tsx
git commit -m "feat: validate problem content before publish"
```

---

### Task H6: `aiCount` → `questionCount` 통일

**Files:**
- Modify: `src/hooks/useArenaAdmin.ts`, `src/pages/ArenaEditor.tsx`, `src/pages/ArenaEditor.test.tsx`, `src/App.tsx`, `src/hooks/useArenaAdmin.emu.test.ts` (H7에서 재작성 시 반영 — H7이 나중이므로 여기서는 건드리지 않음)

**Interfaces:**
- Consumes: 없음 (이름 변경).
- Produces: `ArenaInput.questionCount` (전면 교체, `aiCount` 잔재 없음).

- [ ] **Step 1: Write the failing test** — 이름 변경이라 RED 없음. `ArenaEditor.test.tsx`의 `baseInitial`을 먼저 `questionCount`로 바꾸면 타입 오류로 RED가 됨:

```tsx
const baseInitial = { title: '기초', desc: '', subject: '수학', questionCount: 0 };
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: FAIL (ArenaInput에 questionCount 없음 — TS 오류 또는 초기값 무시)

- [ ] **Step 3: Write minimal implementation**

`aiCount` → `questionCount` 전면 치환 (4개 파일):
- `useArenaAdmin.ts`: `ArenaInput.aiCount` → `questionCount`, 저장 필드 동일 변경
- `ArenaEditor.tsx`: `initial.aiCount` → `initial.questionCount`, publish `questionCount: clampCount(count)`
- `ArenaEditor.test.tsx`: `baseInitial` 변경
- `App.tsx:220,225`: `aiCount` → `questionCount`

확인: `grep -rn "aiCount" src/ functions/src/` 결과 없음.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test` + `npx tsc --noEmit`
Expected: PASS (DB에 남은 옛 `aiCount` 값은 읽지 않으므로 무시 — 룰링 기록)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useArenaAdmin.ts src/pages/ArenaEditor.tsx src/pages/ArenaEditor.test.tsx src/App.tsx
git commit -m "refactor: rename aiCount to questionCount"
```

---

### Task H7: emu 테스트 복구 (규칙 가드 + 이메일 흐름)

**Files:**
- Modify: `firestore.rules`, `src/hooks/useArenaAdmin.emu.test.ts`

**Interfaces:**
- Consumes: 에뮬레이터 Auth (이메일 가입 지원).
- Produces: 그린 `npm run test:emu` (award 1 + arenaAdmin 1).

- [ ] **Step 1: Write the failing test (먼저 규칙만 고치고 기존 테스트 실행)**

```bash
# 규칙 가드 후에도 기존 anon 테스트는 여전히 실패해야 함 (teacher 권한 없음) — RED 확인용
npx vitest run --config vitest.emu.config.ts src/hooks/useArenaAdmin.emu.test.ts
```
Expected: FAIL (PERMISSION_DENIED — 에러 평가 오류가 아니라 깔끔한 거부여야 함)

- [ ] **Step 2: Fix rules null-guard**

```
// isAllowlisted 교체
function tokenEmail() {
  return 'email' in request.auth.token ? request.auth.token.email : null;
}
function isAllowlisted() {
  return isSignedIn() && tokenEmail() != null && exists(/databases/(default)/documents/teacherAllowlist/$(tokenEmail()));
}
```

(`isMaster`의 `request.auth.token.email == masterEmail()`도 동일 가드로 교체 — anon 평가는 false로 떨어져야 함.)

- [ ] **Step 3: Rewrite emu test with email flow**

```ts
import { act, renderHook } from '@testing-library/react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { auth, db } from '../lib/firebase';
import { useArenaAdmin } from './useArenaAdmin';

const stamp = Date.now().toString(36);
const MASTER = `master-${stamp}@test.kr`;
const TEACHER = `teacher-${stamp}@test.kr`;
const CLASSROOM = `C-${stamp}`;

describe('useArenaAdmin on emulator', () => {
  it('preserves problems and lock on edit, cascades on delete', async () => {
    // 마스터로 선생 명단에 등록
    const masterCred = await createUserWithEmailAndPassword(auth, MASTER, 'password123');
    void masterCred;
    // NOTE: masterEmail()은 실계정이라 isMaster false — 대신 명단 경로로 허용:
    // classrooms create는 명단 선생님만 가능하므로, 먼저 명단에 TEACHER를 넣어야 함.
    // 명단 쓰기는 마스터만 가능 → 에뮬에서는 admin SDK 없이 불가.
  }, 60000);
});
```

위 방식은 막힌다. 실제로는: 명단 쓰기가 마스터 전용이라 이메일 흐름만으로 명단에 못 넣는다. 그래서 **테스트는 규칙을 우회하지 않고**, `classrooms` 문서를 허용된 경로로 만든다 — 허용된 경로가 없다. 대안: **테스트 전용 시드는 `scripts/seed.mjs`처럼 admin SDK로** 만든다. 즉 테스트 파일 안에서 `firebase-admin`을 직접 import해 에뮬레이터(FIRESTORE_EMULATOR_HOST)에 `teacherAllowlist/{TEACHER}`와 `classrooms/{CLASSROOM}`(teacherId=교사uid) 문서를 미리 넣는다. admin SDK는 규칙을 타지 않으므로 허용된다.

```ts
import admin from 'firebase-admin';
if (!admin.apps.length) admin.initializeApp({ projectId: 'demo-quiz-arena' });
const adminDb = admin.firestore(); // FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 (emu config에서 설정됨)

it('...', async () => {
  const teacherCred = await createUserWithEmailAndPassword(auth, TEACHER, 'password123');
  const uid = teacherCred.user.uid;
  await adminDb.doc(`teacherAllowlist/${TEACHER}`).set({ email: TEACHER });
  await adminDb.doc(`classrooms/${CLASSROOM}`).set({ name: '테스트반', inviteCode: CLASSROOM, teacherId: uid, locked: false });
  await setDoc(doc(db, 'users', uid), { nickname: '선생', role: 'teacher', classroomId: CLASSROOM });
  const { result } = renderHook(() => useArenaAdmin(CLASSROOM));
  // 이하 기존 assertions 동일 (saveArena/loadProblems/setLocked/removeArena)
});
```

(`vitest.emu.config.ts`가 FIRESTORE_EMULATOR_HOST를 잡는지 먼저 확인할 것. `test:emu` 스크립트와 award.emu.test.ts가 같은 패턴이면 따름.)

- [ ] **Step 4: Run test to verify it passes**

Run (에뮬레이터 기동 후): `npm run test:emu`
Expected: PASS (2 files, 2 tests)

- [ ] **Step 5: Commit**

```bash
git add firestore.rules src/hooks/useArenaAdmin.emu.test.ts
git commit -m "fix: repair arena admin emulator test with email flow"
```

---

## Self-Review

- Spec coverage: §3 locked 의미(H3) · 10개 공개(H5) · questionCount 명칭(H6) · AI 생성(H1·H2) — 전부 매핑됨. 리더보드·대결 변경 없음.
- Placeholder scan: 구체 코드 포함, TBD 없음.
- Type consistency: `questionCount`(H6)가 plan 전체에서 통일. `GenerateArenaResponse.problems`(H2)가 에디터와 일치.
