# AI 아레나 + 10문제 랜덤 대결 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 교사의 AI 아레나 생성(학년·과목·기준·20문항)과 학생의 10문제 랜덤 대결 + 재해석 리더보드를 구현한다.

**Architecture:** 기존 Firestore 구조 위에 얹는다. 문제선택은 방 생성 시 10개 고정(`room.problemIds`), 대결 규칙은 `battle.ts` 순수함수로 먼저 고정, AI는 Functions+Gemini 1개 엔드포인트로 격리한다.

**Tech Stack:** Vite ^7, React ^19, Tailwind ^4, Firebase JS SDK ^12, firebase-functions, Gemini API, Vitest ^3.

**Spec:** `docs/superpowers/specs/2026-09-24-ai-arena-design.md`

## Global Constraints

- 금지어·원본에셋 사용 금지: BattleStudyGround, 배틀필드, 전투, charlogo.png, logo.png.
- 리더보드 원문구 "명예의 전당 🏆 / LEADERBOARD · TOP 20" 그대로 사용 금지. 자체 문구·색·레이아웃 사용.
- 성취기준 원문 복붙 금지. paraphrase + 코드 표기.
- 아레나 저장은 최대 20문항, 대결은 그 중 10개 랜덤 (`problemIds.length==10`).
- publish는 문제 10개 이상일 때만.
- 매 작업 TDD 순서 준수 (실패 테스트 → 최소 구현 → 통과 확인 → 커밋).

---

## File Structure

- `src/data/curriculum2022.ts` — 신규. 학년×과목 성취기준 JSON (6개 아레나 범위).
- `src/lib/arena.ts` — 수정. grade/topic/standards/cardTheme/status 확장.
- `src/lib/battle.ts` — 수정. `pickRandomProblems`, `totalRounds` 일반화.
- `src/hooks/useArenaAdmin.ts` — 수정. publish 가드(10개 미만 차단).
- `src/pages/ArenaEditor.tsx` — 재작성. 학년·과목·기준·문항수·주제·검토 UI.
- `functions/src/generateArena.ts` — 신규. Gemini 호출 + 검증 + draft 저장.
- `src/hooks/useMatch.ts`, `src/hooks/useRoom.ts`, `src/App.tsx(BattleShell)` — 수정. problemIds 10개 고정.
- `src/pages/StudentHome.tsx` — 수정. 아레나 카드 + 재해석 리더보드(학급 Top20 + 내순위).
- `src/hooks/useLeaderboard.ts` — 신규. 학급 Top20 + 내순위.
- `scripts/seedDefaultArenas.mjs` — 신규. 기본 6개×20문항 주입.
- `firestore.rules`, `firestore.indexes.json` — 수정. classroomId+xp 복합인덱스.

---

### Task 1: 교육과정 JSON + Arena 타입 확장

**Files:**
- Create: `src/data/curriculum2022.ts`
- Modify: `src/lib/arena.ts`
- Test: `src/data/curriculum2022.test.ts`

**Interfaces:**
- Consumes: 없음.
- Produces: `getStandards(grade, subject) → {code, summary}[]`, 확장 `Arena` (Task 2·5가 소비).

- [ ] **Step 1: Write the failing test**

```ts
// src/data/curriculum2022.test.ts
import { describe, expect, it } from 'vitest';
import { getStandards } from './curriculum2022';
describe('curriculum2022', () => {
  it('returns standards for grade 3 math', () => {
    expect(getStandards(3, '수학').length).toBeGreaterThan(0);
  });
  it('returns empty for unknown combo', () => {
    expect(getStandards(1, '영어')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/curriculum2022.test.ts`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

```ts
// src/data/curriculum2022.ts
export interface Standard { code: string; summary: string; }
const DATA: Record<string, Standard[]> = {
  '3-수학': [
    { code: '3수01-01', summary: '세 자리 수 덧셈·뺄셈을 실생활에서 활용하기' },
    { code: '3수01-02', summary: '받아올림·받아내림 문장제 해결하기' },
  ],
  '6-국어': [{ code: '6국02-01', summary: '관용표현 뜻 알기·상황에 맞게 쓰기' }],
  '4-수학': [{ code: '4수02-01', summary: '분수 읽고 쓰기·크기 비교하기' }],
  '5-과학': [{ code: '5과03-01', summary: '물의 순환·상태변화 설명하기' }],
  '4-사회': [{ code: '4사01-01', summary: '지도 방위·기호 읽기' }],
  '5-영어': [{ code: '5영01-01', summary: '인사·소개 기본 표현 주고받기' }],
};
export function getStandards(grade: number, subject: string): Standard[] {
  return DATA[`${grade}-${subject}`] ?? [];
}
```

`src/lib/arena.ts`에 `grade, topic, standards, cardTheme, status` 추가 (기존 필드 유지).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/curriculum2022.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/curriculum2022.ts src/data/curriculum2022.test.ts src/lib/arena.ts
git commit -m "feat: add curriculum JSON and extended arena type"
```

---

### Task 2: 10문제 랜덤 규칙 (순수함수)

**Files:**
- Modify: `src/lib/battle.ts`
- Test: `src/lib/battle.test.ts`에 추가

**Interfaces:**
- Consumes: Task 1 없음.
- Produces: `pickBattleProblems(allIds, roomSeed, n=10)` (Task 4가 소비).

- [ ] **Step 1: Write the failing test**

```ts
it('picks 10 unique ids fixed per room', () => {
  const all = Array.from({ length: 20 }, (_, i) => `p${i + 1}`);
  const a = pickBattleProblems(all, 'roomA', 10);
  const b = pickBattleProblems(all, 'roomA', 10);
  expect(a).toHaveLength(10);
  expect(new Set(a).size).toBe(10);
  expect(a).toEqual(b);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/battle.test.ts`
Expected: FAIL with "pickBattleProblems is not defined"

- [ ] **Step 3: Write minimal implementation**

```ts
export function pickBattleProblems(allIds: string[], seed: string, n = 10): string[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const arr = [...allIds];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/battle.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/battle.ts src/lib/battle.test.ts
git commit -m "feat: add 10-problem random pick per room"
```

---

### Task 3: Functions generateArena (Gemini draft)

**Files:**
- Create: `functions/package.json`, `functions/src/generateArena.ts`
- Modify: `firebase.json` (functions 항목 추가)

**Interfaces:**
- Consumes: Task 1 `Standard`.
- Produces: `generateArena({grade, subject, standards, count, topic}) → problems[]` draft (Task 5 에디터가 소비).

- [ ] **Step 1: Write the failing test (검증함수 단위)**

```ts
// functions 검증: options 4개·answerIndex 범위·빈문항 제거 — 실제 Gemini 호출 없이 검증함수만 테스트
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run functions/src/validate.test.ts`
Expected: FAIL (파일 없음)

- [ ] **Step 3: Write minimal implementation**

- callable function 1개, 입력 검증(count 10-20, standards 1개 이상), Gemini 프롬프트(초등 쉬운말·4지선다·해설1줄·JSON만), 출력 검증 후 `arenas/{id}/problems`에 draft 저장(status=draft).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run functions/src/validate.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add functions/src/generateArena.ts functions/src/validate.test.ts firebase.json
git commit -m "feat: add generateArena function with Gemini draft"
```

---

### Task 4: 매칭·대결 problemIds 10개 고정

**Files:**
- Modify: `src/hooks/useMatch.ts`, `src/hooks/useRoom.ts`, `src/App.tsx` (BattleShell 문제 로드 → problemIds 순으로 필터)

**Interfaces:**
- Consumes: Task 2 `pickBattleProblems`.
- Produces: 10라운드 대결 (Task 6 검증).

- [ ] **Step 1: Write the failing test**

```ts
// useMatch 모킹 테스트: 방 생성 시 problemIds 10개 포함 확인
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useMatch.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

- 방 생성자: 아레나 problems 전체 id 조회 → `pickBattleProblems(ids, roomId)` → `problemIds` 저장. 입장자는 기존 `problemIds` 그대로 사용.
- BattleShell: problems를 `room.problemIds` 순서로 정렬해 사용. `totalRounds = problemIds.length`.
- 문제 10개 미만 아레나는 입장 차단 + "선생님이 문제를 준비 중이에요" 표시.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useMatch.ts src/hooks/useRoom.ts src/App.tsx
git commit -m "feat: fix 10 random problems per battle room"
```

---

### Task 5: ArenaEditor 재작성 + publish 가드

**Files:**
- Modify: `src/pages/ArenaEditor.tsx`, `src/hooks/useArenaAdmin.ts`
- Test: `src/pages/ArenaEditor.test.tsx` 수정

**Interfaces:**
- Consumes: Task 1·3.
- Produces: 교사 생성 플로우 완성.

- [ ] **Step 1: Write the failing test**

```tsx
it('blocks publish with fewer than 10 problems', () => { /* 문제 9개 → 공개 버튼 비활성 */ });
it('shows standards checklist for grade+subject', () => { /* 3학년 수학 → 기준 표시 */ });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

- 학년·과목 드롭다운 → `getStandards` 체크리스트(1개 이상 필수) → 문항수(기본20, 10-20 숫자입력) → 주제 입력 → [AI로 초안 만들기](Functions 호출) → 문항 리스트(텍스트·선택지4·정답라디오·해설·삭제) → [추가] → 10개 이상일 때만 [공개하기] 활성.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/ArenaEditor.tsx src/hooks/useArenaAdmin.ts src/pages/ArenaEditor.test.tsx
git commit -m "feat: rewrite arena editor with curriculum and publish guard"
```

---

### Task 6: 학생홈 카드 + 재해석 리더보드

**Files:**
- Create: `src/hooks/useLeaderboard.ts`
- Modify: `src/pages/StudentHome.tsx`, `firestore.indexes.json`, `firestore.rules`
- Test: `src/pages/StudentHome.test.tsx`, `src/hooks/useLeaderboard.test.ts`

**Interfaces:**
- Consumes: Task 4.
- Produces: 원본과 다른 자체 리더보드 (학급 Top20 + 내순위 하이라이트).

- [ ] **Step 1: Write the failing tests**

```tsx
it('shows top20 classroom leaderboard with own rank highlight', () => {});
it('shows arena card with 10-battle hint', () => {
  // "20문제 중 10문제 대결" 문구 확인
});
```

- [ ] **Step 2: Run test to verify they fail**

Run: `npx vitest run src/pages/StudentHome.test.tsx src/hooks/useLeaderboard.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

- `useLeaderboard(classroomId, myUid)`: `users where classroomId==내학급 orderBy xp desc limit 20` + 내 순위 별도 조회. 제목은 자체 문구(예: "우리 반 대결왕 Top 20"), 순위뱃지 자체 색, 동물아바타·Lv·승·정답률·XP 행.
- 아레나 카드: 과목·학년 뱃지, 주제, "20문제 중 10문제 대결", 색상+이모지 배경. "BATTLE READY" 원문구 사용 금지 → "대결 준비됨" 자체 문구.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLeaderboard.ts src/pages/StudentHome.tsx firestore.indexes.json firestore.rules
git commit -m "feat: add reinterpreted leaderboard and arena cards"
```

---

### Task 7: 기본 6개×20문항 시드 + 전체 검증

**Files:**
- Create: `scripts/seedDefaultArenas.mjs`, `scripts/seedDefaultArenas.test.mjs`(문항수·정답 검증)
- Modify: `docs/UPDATELOG.md`

**Interfaces:**
- Consumes: Task 1·2.
- Produces: 배포 가능한 기본 아레나 6개.

- [ ] **Step 1: Write validation (문항수 20·options 4·answerIndex 범위)**

Run: `node scripts/seedDefaultArenas.mjs --dry`
Expected: FAIL 전 PASS 확인용 dry-run

- [ ] **Step 2: Seed to emulator**

Run: `npm run emulators` 별도 터미널 + `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/seedDefaultArenas.mjs`
Expected: 6 arenas × 20 problems 생성

- [ ] **Step 3: Full check**

Run: `npm test` + `npm run test:emu`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/seedDefaultArenas.mjs docs/UPDATELOG.md
git commit -m "feat: seed 6 default arenas with 20 questions each"
```

**기본 6개:** 덧셈뺄셈(3수학) / 관용표현 배틀(6국어) / 분수 첫걸음(4수학) / 물의 여행(5과학) / 우리 동네 지도(4사회) / Hello English(5영어). 각 20문항 저장, 대결은 10 랜덤.
