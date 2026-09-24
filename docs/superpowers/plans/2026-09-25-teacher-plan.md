# Teacher Workspace Implementation Plan (Plan 3/3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 선생님이 아레나를 만들고, 문제를 넣고, QR로 초대하고, 대결을 지켜보고, 끝난 뒤 분석까지 보는 공간을 완성한다. 동시에 Plan 2 최종 리뷰가 Plan 3로 넘긴 잔여 항목을 모두 닫는다.

**Architecture:** Plan 2 구조를 그대로 쓴다. 분석은 `src/lib/analytics.ts` 순수 함수로 고정하고, Firestore 읽기는 얇은 훅에 둔다. 분석 원천은 `rooms` 종료 문서다 (battles에는 라운드 상세가 없으므로 별도 쓰기 변경 없이 players.answers를 집계한다). 선생님 판별은 `users/{uid}.role == 'teacher'`를 규칙에서 직접 읽는다.

**Tech Stack:** Plan 2와 동일 + `qrcode ^1.5.4` + `@types/qrcode ^1.5.5` (초대 QR 생성용, Task 4에서 추가).

**Spec:** `docs/superpowers/specs/2026-09-23-battle-study-ground-design.md`

## Global Constraints

- 금지어 사용 금지: BattleStudyGround, 배틀필드, 전투, charlogo.png, logo.png 원본 에셋 사용 금지.
- 대체어 고정: 아레나, 대결, 문제 라운드. 모니터링 화면의 명칭은 "현재 대결" (전투 금지).
- 고정 문구: "선생님 워크스페이스", "새 아레나 만들기", "아레나 수정", "아레나 삭제", "잠금 해제", "잠금", "학급 초대 QR", "탭해서 확대", "학생 일괄 관리"는 탭 이름으로만 쓰고 실제 일괄 삭제로 동작, "강제 종료", "이 대결을 강제 종료할까요?", "진행 중인 대결", "지금은 진행 중인 대결이 없어요", "방치된 대결", "최근 종료된 대결", "아직 등록된 학생이 없어요", "이름 없음", "아직 분석할 기록이 없어요".
- 상태 리터럴·컬렉션·XP 공식은 Plan 2와 동일.
- 초대 코드 형식 고정: `/^[A-Z0-9]{6}$/`.
- Cloud Functions 금지. 선생님 권한은 Firestore 규칙의 `isTeacher()`로만 강제한다.
- 매 작업 TDD 순서 준수.

---

## File Structure

- `src/lib/classroom.ts` — 수정. `generateInviteCode()` 추가.
- `src/lib/classroom.test.ts` — 수정. 코드 생성 2건 추가.
- `src/lib/roster.ts` — 신규. `buildRosterCsv(students)` + `RosterStudent` 타입.
- `src/lib/roster.test.ts` — 신규.
- `src/lib/analytics.ts` — 신규. problemStats/hardProblems/avgCorrectVsWrong/activeStudents.
- `src/lib/analytics.test.ts` — 신규.
- `src/hooks/useClassroom.ts` — 수정. Firestore 연동 (join/create/fetch).
- `src/hooks/useStudents.ts` — 신규. 명단 + 삭제.
- `src/hooks/useTeacherRooms.ts` — 신규. 진행/방치/종료 + 강제 종료.
- `src/hooks/useAnalytics.ts` — 신규. 종료 rooms 구독.
- `src/hooks/useArenas.ts` — 수정. 선생님용 전체 조회 옵션 (locked 포함).
- `src/components/InviteQR.tsx` — 신규.
- `src/components/Timer.tsx` — 수정. nowMs 재동기화.
- `src/components/Timer.test.tsx` — 신규.
- `src/pages/RoleSelect.tsx` — 수정. 동물 선택 추가, `onSelect(role, animal)`.
- `src/pages/JoinFlow.test.tsx` — 수정. onSelect 기대값에 동물 포함.
- `src/pages/TeacherHome.tsx` — 신규. 4탭 (현재 대결/아레나/학생/분석).
- `src/pages/TeacherHome.test.tsx` — 신규. 탭 렌더 4건.
- `src/pages/ArenaEditor.tsx` — 신규. 아레나 폼 + 문제 편집기.
- `src/pages/ArenaEditor.test.tsx` — 신규.
- `src/App.tsx`, `src/App.test.tsx` — 수정. 선생님 분기 연결, 중복 테스트 병합.
- `src/pages/BattleRoom.tsx` — 수정. ready 버튼 문제 로딩 전 비활성 (problemsLoaded prop).
- `src/hooks/useMatch.ts` — 수정. 실패 시 error 상태 + 재시도.
- `src/hooks/useArenas.ts`, `src/hooks/useProfile.ts` — 수정. onSnapshot 에러 콜백.
- `firestore.rules` — 수정. isTeacher + 필드 검증.
- `scripts/seed.mjs` — 수정. 데모 선생님·학생 users 3건 추가.
- `package.json` — 수정. qrcode 의존성 (Task 4).
- `vitest.emu.config.ts` — 신규 (Task 6). 에뮬레이터 테스트 상시 설정.

---

### Task 1: 잔여 수용 (타이머·테스트 병합·주문·에러 콜백·재시도)

**Files:**
- Modify: `src/components/Timer.tsx`, `src/App.test.tsx`, `src/pages/BattleRoom.tsx` (ready 게이팅 부분만), `src/hooks/useMatch.ts`, `src/hooks/useArenas.ts`, `src/hooks/useProfile.ts`
- Create: `src/components/Timer.test.tsx`

**Interfaces:**
- Consumes: 기존 동작 전부 유지.
- Produces: 재동기화 Timer, 병합된 App 테스트, problemsLoaded 게이트, match error, 에러 콜백 (후속 Task가 소비).

- [ ] **Step 1: Write the failing tests**

`src/components/Timer.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Timer from './Timer';

describe('Timer', () => {
  it('shows remaining seconds', () => {
    render(<Timer endsAt={30000} nowMs={10000} />);
    expect(screen.getByLabelText('남은 시간')).toHaveTextContent('20초');
  });

  it('resyncs when nowMs changes', () => {
    const { rerender } = render(<Timer endsAt={30000} nowMs={10000} />);
    rerender(<Timer endsAt={30000} nowMs={25000} />);
    expect(screen.getByLabelText('남은 시간')).toHaveTextContent('5초');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Timer.test.tsx`
Expected: FAIL with "Failed to resolve import" (현재 Timer.tsx는 있으나 테스트가 없으므로 — 실제로는 두 번째 케이스 `resyncs`가 FAIL한다. 현재 구현이 `useState` 초기값 고정이므로 `5초` 대신 `20초`가 나온다.)

- [ ] **Step 3: Write minimal implementation**

`src/components/Timer.tsx` 교체:
```tsx
export default function Timer({ endsAt, nowMs }: { endsAt: number; nowMs?: number }) {
  const [liveNow, setLiveNow] = useState(() => Date.now());
  useEffect(() => {
    if (nowMs !== undefined) return;
    const t = setInterval(() => setLiveNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [nowMs]);
  const now = nowMs ?? liveNow;
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
  return <p aria-label="남은 시간">{left}초</p>;
}
```
(useState/useEffect import는 기존 파일에 있으므로 유지.)

`src/App.test.tsx` 병합: 'routes student to student stub'와 'enters student home after join as student' 중 먼저 것을 삭제하고 후자 1건만 남긴다 (둘 다 `지금 바로 대결!` 버튼 존재를 단언하므로 중복).

`src/pages/BattleRoom.tsx`: waiting/ready 분기에 `problemsLoaded?: boolean` prop 추가. `problemsLoaded === false`이면 준비 버튼 대신 `<p>문제를 불러오는 중...</p>`을 보여준다. (Task 4 로비 테스트는 prop을 넘기지 않으므로 기존 분기 그대로 통과 — `undefined`는 로딩 완료로 취급.)

`src/hooks/useMatch.ts`: `{ roomId, busy, error, findOrCreate, retry }`로 확장. `findOrCreate`를 try/catch로 감싸 실패 시 `setError('매칭에 실패했어요. 다시 시도해주세요')`, `retry`는 error를 지우고 `findOrCreate` 재호출. (에러 문구는 신규 고정 문구.)

`src/hooks/useArenas.ts` + `src/hooks/useProfile.ts`: `onSnapshot(ref, next, err)` 형태로 에러 콜백 추가. arenas는 에러 시 `setLoading(false)` + 빈 목록 유지, profile은 `null` 유지. (console 출력 금지 — 조용히 폴백.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (42 + 2 − 1 = 43 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Timer.tsx src/components/Timer.test.tsx src/App.test.tsx src/pages/BattleRoom.tsx src/hooks/useMatch.ts src/hooks/useArenas.ts src/hooks/useProfile.ts
git commit -m "fix: apply Plan 2 leftover polish items"
```

---

### Task 2: 학급·사용자 Firestore 연동 + 동물 선택

**Files:**
- Modify: `src/lib/classroom.ts`, `src/lib/classroom.test.ts`, `src/hooks/useClassroom.ts`, `src/pages/RoleSelect.tsx`, `src/pages/JoinFlow.test.tsx`, `src/App.tsx` (join 분기에 사용자 저장)
- Test: classroom 생성 코드 2건 (아래), JoinFlow onSelect 기대값 수정

**Interfaces:**
- Consumes: `users`, `classrooms` 컬렉션.
- Produces: `generateInviteCode()`, Firestore 연동 `useClassroom`, 동물 포함 `onSelect(role, animal)` (Task 3·4·6이 소비).

- [ ] **Step 1: Write the failing tests**

`src/lib/classroom.test.ts`에 2건 추가:
```ts
it('generates 6-char alphanumeric codes', () => {
  expect(generateInviteCode()).toMatch(/^[A-Z0-9]{6}$/);
});

it('generates unique codes', () => {
  const set = new Set(Array.from({ length: 100 }, () => generateInviteCode()));
  expect(set.size).toBeGreaterThan(90);
});
```

`src/pages/JoinFlow.test.tsx` 수정: 기존 `expect(onSelect).toHaveBeenCalledWith('teacher')` → `expect(onSelect).toHaveBeenCalledWith('teacher', 'cat')`, student도 `('student', 'cat')` (기본 선택이 고양이이므로).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/classroom.test.ts src/pages/JoinFlow.test.tsx`
Expected: FAIL (`generateInviteCode` 없음 + 기대값 불일치)

- [ ] **Step 3: Write minimal implementation**

`src/lib/classroom.ts`에 추가:
```ts
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateInviteCode(random: () => number = Math.random): string {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += CODE_CHARS[Math.floor(random() * CODE_CHARS.length)];
  }
  return code;
}
```
(헷갈리는 문자 I/O/0/1 제외. `crypto` 대신 `Math.random` 기본값 — jsdom 테스트 환경 호환. 결정적 테스트가 필요하면 `random`을 주입한다.)

`src/hooks/useClassroom.ts` 교체:
```ts
import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateInviteCode, isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export interface JoinInfo {
  nickname: string;
  role: 'teacher' | 'student';
  avatar: string;
}

export function useClassroom() {
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const join = async (code: string, uid: string, info: JoinInfo) => {
    const normalized = normalizeInviteCode(code);
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    const snap = await getDoc(doc(db, 'classrooms', normalized));
    if (!snap.exists() || (snap.data().locked as boolean)) {
      setError('들어갈 수 없는 학급이에요. 코드를 확인해주세요');
      return;
    }
    setError(null);
    await setDoc(
      doc(db, 'users', uid),
      { nickname: info.nickname, role: info.role, avatar: info.avatar, classroomId: normalized },
      { merge: true },
    );
    setClassroomId(normalized);
  };

  const create = async (name: string, uid: string, nickname: string) => {
    const code = generateInviteCode();
    await setDoc(doc(db, 'classrooms', code), {
      name,
      inviteCode: code,
      teacherId: uid,
      locked: false,
    });
    await setDoc(
      doc(db, 'users', uid),
      { nickname, role: 'teacher', avatar: 'cat', classroomId: code },
      { merge: true },
    );
    setError(null);
    setClassroomId(code);
  };

  return { classroomId, join, create, error };
}
```
(에러 문구 '들어갈 수 없는 학급이에요. 코드를 확인해주세요'는 신규 고정 문구. 기존 `useClassroom.test.tsx`의 join 호출 2건은 시그니처 변경으로 깨진다 — 해당 테스트 파일에서 `join('a1b2c3')` → `join('a1b2c3', 'u1', { nickname: '일호', role: 'student', avatar: 'cat' })`로 수정하되 Firestore 호출은 실제 DB 없이 실패하므로, 이 테스트는 삭제하고 join 유효성(짧은 코드 거부) 1건만 `isValidInviteCode` 레벨로 남긴다. 즉 `src/hooks/useClassroom.test.tsx`를 삭제하고, 그 1건은 `src/lib/classroom.test.ts`에 이미 존재하므로 추가 파일 없음.)

`src/pages/RoleSelect.tsx` 교체 (동물 선택, 기본 고양이):
```tsx
import { useState } from 'react';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Avatar, { type Animal } from '../components/Avatar';

export type Role = 'teacher' | 'student';

const ANIMALS: Animal[] = ['cat', 'dog', 'tiger', 'frog', 'unicorn', 'dragon', 'turtle'];

export default function RoleSelect({ onSelect }: { onSelect: (role: Role, animal: Animal) => void }) {
  const [animal, setAnimal] = useState<Animal>('cat');

  return (
    <Card>
      <h1>반가워요! 누구신가요?</h1>
      <p>한 번만 골라주면 끝!</p>
      <p>마음에 드는 동물을 골라보세요</p>
      <div>
        {ANIMALS.map((a) => (
          <button key={a} type="button" aria-label={`아바타 ${a}`} aria-pressed={a === animal} onClick={() => setAnimal(a)}>
            <Avatar animal={a} size={44} />
          </button>
        ))}
      </div>
      <PrimaryButton onClick={() => onSelect('teacher', animal)}>선생님으로 시작</PrimaryButton>
      <div style={{ height: 12 }} />
      <PrimaryButton onClick={() => onSelect('student', animal)}>학생으로 시작</PrimaryButton>
    </Card>
  );
}
```
(문구 '마음에 드는 동물을 골라보세요'는 고정 문구.)

`src/App.tsx`: `role` state 옆에 `const [animal, setAnimal] = useState<Animal>('cat');` 추가 (Avatar 타입 import). RoleSelect onSelect를 `(r, a) => { setRole(r); setAnimal(a); setView('join'); }`로 교체. join 분기의 onJoin을 `(code) => { void join(code, user?.uid ?? 'local-test', { nickname: user?.displayName ?? '학생', role: role ?? 'student', avatar: animal }); setView(role === 'teacher' ? 'teacher' : 'student'); }`로 교체. `useClassroom` 구조분해에 `join`은 이미 있으므로 유지.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (43 − 1 + 2 = 44 tests: useClassroom.test 삭제 −1... 정확히는 기존 43개 중 useClassroom.test 2건 삭제 → 41, classroom 신규 2건 → 43. JoinFlow 수정은 개수 동일.)

Expected: PASS (43 tests: 43 − 2 + 2 = 43).

- [ ] **Step 5: Commit**

```bash
git add src/lib/classroom.ts src/lib/classroom.test.ts src/hooks/useClassroom.ts src/hooks/useClassroom.test.tsx src/pages/RoleSelect.tsx src/pages/JoinFlow.test.tsx src/App.tsx
git commit -m "feat: wire classroom and user docs with avatar select"
```

---

### Task 3: 아레나 CRUD + 문제 편집기

**Files:**
- Create: `src/pages/ArenaEditor.tsx`, `src/pages/ArenaEditor.test.tsx`, `src/hooks/useArenaAdmin.ts`
- Test: 에디터 렌더 3건 (아래)

**Interfaces:**
- Consumes: `arenas`, `arenas/{id}/problems` (선생님 쓰기, 규칙은 Task 6).
- Produces: `ArenaEditor`, `useArenaAdmin` (Task 4 TeacherHome 아레나 탭이 소비).

- [ ] **Step 1: Write the failing tests**

`src/pages/ArenaEditor.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ArenaEditor from './ArenaEditor';

describe('ArenaEditor', () => {
  it('renders arena fields', () => {
    render(<ArenaEditor initial={{ title: '', desc: '', subject: '수학', aiCount: 0 }} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText('아레나 이름')).toBeTruthy();
    expect(screen.getByLabelText('설명')).toBeTruthy();
  });

  it('adds a problem', () => {
    const onSave = vi.fn();
    render(<ArenaEditor initial={{ title: '기초', desc: '', subject: '수학', aiCount: 0 }} problems={[]} onSave={onSave} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '새 문제 추가' }));
    fireEvent.change(screen.getByLabelText('문제 내용'), { target: { value: '1 + 1 = ?' } });
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][1]).toHaveLength(1);
  });

  it('shows empty problems hint', () => {
    render(<ArenaEditor initial={{ title: '기초', desc: '', subject: '수학', aiCount: 0 }} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('아직 등록된 문제가 없어요')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

`src/hooks/useArenaAdmin.ts`:
```ts
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena, Problem } from '../lib/arena';

export interface ArenaInput {
  title: string;
  desc: string;
  subject: string;
  aiCount: number;
}

export function useArenaAdmin(classroomId: string | null) {
  const [arenas, setArenas] = useState<Arena[]>([]);

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      query(collection(db, 'arenas'), where('classroomId', '==', classroomId)),
      (snap) => {
        setArenas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Arena, 'id'>) })));
      },
      () => {},
    );
  }, [classroomId]);

  const saveArena = async (id: string | null, input: ArenaInput, problems: Omit<Problem, 'id'>[]) => {
    const ref = id ? doc(db, 'arenas', id) : doc(collection(db, 'arenas'));
    await setDoc(
      ref,
      { classroomId, title: input.title, desc: input.desc, subject: input.subject, aiCount: input.aiCount, locked: false },
      { merge: true },
    );
    const existing = id ? await getDocs(collection(db, 'arenas', ref.id, 'problems')) : { docs: [] as { id: string }[] };
    for (const d of existing.docs) {
      await deleteDoc(doc(db, 'arenas', ref.id, 'problems', d.id));
    }
    for (const [i, p] of problems.entries()) {
      await setDoc(doc(db, 'arenas', ref.id, 'problems', `p${i + 1}`), { ...p, roundTimeSec: 30 });
    }
    return ref.id;
  };

  const removeArena = async (id: string) => {
    await deleteDoc(doc(db, 'arenas', id));
  };

  const setLocked = async (id: string, locked: boolean) => {
    await setDoc(doc(db, 'arenas', id), { locked }, { merge: true });
  };

  return { arenas, saveArena, removeArena, setLocked };
}
```
(`aiCount`는 선생님이 적는 AI 생성 문제 개수 메모 필드. `roundTimeSec` 30 고정 — 스펙에 별도 정의가 없으므로 가장 단순한 규칙.)

`src/pages/ArenaEditor.tsx`:
```tsx
import { useState } from 'react';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import type { ArenaInput } from '../hooks/useArenaAdmin';

export interface EditableProblem {
  text: string;
  options: [string, string, string, string];
  answerIndex: number;
}

export default function ArenaEditor({
  initial,
  problems,
  onSave,
  onCancel,
}: {
  initial: ArenaInput;
  problems: EditableProblem[];
  onSave: (input: ArenaInput, problems: EditableProblem[]) => void;
  onCancel: () => void;
}) {
  const [input, setInput] = useState(initial);
  const [items, setItems] = useState<EditableProblem[]>(problems);
  const [draft, setDraft] = useState('');

  const addProblem = () => {
    if (!draft.trim()) return;
    setItems([...items, { text: draft, options: ['O', 'X', '', ''], answerIndex: 0 }]);
    setDraft('');
  };

  return (
    <Card>
      <label htmlFor="arena-title">아레나 이름</label>
      <input id="arena-title" value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} />
      <label htmlFor="arena-desc">설명</label>
      <input id="arena-desc" value={input.desc} onChange={(e) => setInput({ ...input, desc: e.target.value })} />
      <p>AI 문제 개수: {input.aiCount}</p>
      {items.length === 0 && <p>아직 등록된 문제가 없어요</p>}
      {items.map((p, i) => (
        <p key={`${i}-${p.text}`}>{p.text}</p>
      ))}
      <label htmlFor="problem-text">문제 내용</label>
      <input id="problem-text" value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button type="button" onClick={addProblem}>
        새 문제 추가
      </button>
      <PrimaryButton onClick={() => onSave(input, items)}>저장하기</PrimaryButton>
      <button type="button" onClick={onCancel}>
        취소
      </button>
    </Card>
  );
}
```
(문제 보기는 4지선다 고정. 새 문제는 O/X 기본값으로 들어가고 정답 고르기는 Plan 3 범위 밖 — 편집은 텍스트 추가·저장까지.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/ArenaEditor.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/ArenaEditor.tsx src/pages/ArenaEditor.test.tsx src/hooks/useArenaAdmin.ts
git commit -m "feat: add arena editor and admin hook"
```

---

### Task 4: 선생님 홈 + 모니터링 + 강제 종료

**Files:**
- Create: `src/pages/TeacherHome.tsx`, `src/pages/TeacherHome.test.tsx`, `src/hooks/useTeacherRooms.ts`
- Modify: `src/App.tsx` (teacher 분기 연결), `package.json` (qrcode), `src/components/InviteQR.tsx` (신규이므로 Create)
- Test: TeacherHome 탭 렌더 4건 (아래)

**Interfaces:**
- Consumes: `useArenaAdmin` (Task 3), `useStudents`는 Task 5, `useAnalytics`는 Task 5 — TeacherHome은 4탭 중 현재 대결/아레나만 이번 Task에서 연결하고 학생/분석 탭은 빈 화면으로 둔다 (Task 5가 채움).
- Produces: TeacherHome 셸 + 모니터링 (Task 5가 학생/분석 탭을 이어 붙임).

- [ ] **Step 1: Write the failing tests**

`src/pages/TeacherHome.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeacherHome from './TeacherHome';

const noop = () => {};

describe('TeacherHome', () => {
  it('shows live battles tab first', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    expect(screen.getByText('진행 중인 대결')).toBeTruthy();
    expect(screen.getByText('지금은 진행 중인 대결이 없어요')).toBeTruthy();
  });

  it('confirms force close', () => {
    const onForceClose = vi.fn();
    render(
      <TeacherHome
        live={[{ id: 'r1', arenaTitle: '기초', players: ['일호', '이호'] }]}
        abandoned={[]}
        finished={[]}
        arenas={[]}
        onForceClose={onForceClose}
        onEditArena={noop}
        onDeleteArena={noop}
        onToggleLock={noop}
        onNewArena={noop}
        onSignOut={noop}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '강제 종료' }));
    expect(screen.getByText('이 대결을 강제 종료할까요?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '끝내기' }));
    expect(onForceClose).toHaveBeenCalledWith('r1');
  });

  it('switches to arenas tab', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '아레나' }));
    expect(screen.getByRole('button', { name: '새 아레나 만들기' })).toBeTruthy();
  });

  it('shows students placeholder', () => {
    render(
      <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '학생' }));
    expect(screen.getByText('학생 관리는 다음 단계에서 열려요')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/TeacherHome.test.tsx`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

`src/hooks/useTeacherRooms.ts`:
```ts
import { useEffect, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RoomData } from '../lib/battle';

export interface RoomView {
  id: string;
  arenaId: string;
  status: RoomData['status'];
  players: { uid: string; nickname: string }[];
  updatedAtMs: number;
}

function toView(id: string, data: Record<string, unknown>): RoomView {
  const d = data as unknown as RoomData & { updatedAtMs?: number };
  return {
    id,
    arenaId: d.arenaId,
    status: d.status,
    players: d.players.map((p) => ({ uid: p.uid, nickname: p.nickname })),
    updatedAtMs: d.updatedAtMs ?? 0,
  };
}

export function useTeacherRooms() {
  const [live, setLive] = useState<RoomView[]>([]);
  const [abandoned, setAbandoned] = useState<RoomView[]>([]);
  const [finished, setFinished] = useState<RoomView[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'rooms'), where('status', 'in', ['waiting', 'ready', 'playing'])),
        (snap) => setLive(snap.docs.map((d) => toView(d.id, d.data()))),
        () => {},
      ),
    [],
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'rooms'), where('status', '==', 'abandoned'), orderBy('updatedAt', 'desc'), limit(20)),
        (snap) => setAbandoned(snap.docs.map((d) => toView(d.id, d.data()))),
        () => {},
      ),
    [],
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'rooms'), where('status', '==', 'finished'), orderBy('updatedAt', 'desc'), limit(20)),
        (snap) => setFinished(snap.docs.map((d) => toView(d.id, d.data()))),
        () => {},
      ),
    [],
  );

  const forceClose = async (id: string) => {
    await updateDoc(doc(db, 'rooms', id), { status: 'abandoned' });
  };

  return { live, abandoned, finished, forceClose };
}
```
(주의: `updatedAt`은 서버 타임스탬프이므로 orderBy는 서버에서 정렬된다. `updatedAtMs` 표시는 0 고정 — 목록 정렬용이 아니라 식별용이므로 목록에 시간 표시는 넣지 않는다.)

`src/components/InviteQR.tsx`:
```tsx
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function InviteQR({ code }: { code: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(`quiz-arena-join:${code}`, { width: 220 }).then((url) => {
      if (alive) setSrc(url);
    }).catch(() => {
      if (alive) setSrc(null);
    });
    return () => {
      alive = false;
    };
  }, [code]);

  if (!src) return <p>QR을 만드는 중...</p>;
  return <img src={src} alt="학급 초대 QR" />;
}
```

`src/pages/TeacherHome.tsx`:
```tsx
import { useState } from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export interface LiveRoom {
  id: string;
  arenaTitle: string;
  players: string[];
}

export interface ArenaRow {
  id: string;
  title: string;
  locked: boolean;
}

export default function TeacherHome({
  live,
  abandoned,
  finished,
  arenas,
  onForceClose,
  onEditArena,
  onDeleteArena,
  onToggleLock,
  onNewArena,
  onSignOut,
}: {
  live: LiveRoom[];
  abandoned: LiveRoom[];
  finished: LiveRoom[];
  arenas: ArenaRow[];
  onForceClose: (id: string) => void;
  onEditArena: (id: string) => void;
  onDeleteArena: (id: string) => void;
  onToggleLock: (id: string, locked: boolean) => void;
  onNewArena: () => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<'live' | 'arenas' | 'students' | 'analysis'>('live');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        <p className="font-bold mb-2">선생님 워크스페이스</p>
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setTab('live')}>
            현재 대결
          </button>
          <button type="button" onClick={() => setTab('arenas')}>
            아레나
          </button>
          <button type="button" onClick={() => setTab('students')}>
            학생
          </button>
          <button type="button" onClick={() => setTab('analysis')}>
            분석
          </button>
          <button type="button" onClick={onSignOut}>
            로그아웃
          </button>
        </div>
        {tab === 'live' && (
          <Card>
            <p className="font-bold mb-2">진행 중인 대결</p>
            {live.length === 0 ? (
              <EmptyState title="지금은 진행 중인 대결이 없어요" />
            ) : (
              live.map((r) => (
                <div key={r.id}>
                  <p>
                    {r.arenaTitle} — {r.players.join(' vs ')}
                  </p>
                  {confirmId === r.id ? (
                    <div>
                      <p>이 대결을 강제 종료할까요?</p>
                      <button type="button" onClick={() => { onForceClose(r.id); setConfirmId(null); }}>
                        끝내기
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmId(r.id)}>
                      강제 종료
                    </button>
                  )}
                </div>
              ))
            )}
            <p className="font-bold mt-4">방치된 대결</p>
            {abandoned.length === 0 ? <p>방치된 대결이 없어요</p> : abandoned.map((r) => <p key={r.id}>{r.arenaTitle}</p>)}
            <p className="font-bold mt-4">최근 종료된 대결</p>
            {finished.length === 0 ? <p>종료된 대결이 아직 없어요</p> : finished.map((r) => <p key={r.id}>{r.arenaTitle}</p>)}
          </Card>
        )}
        {tab === 'arenas' && (
          <Card>
            <button type="button" onClick={onNewArena}>
              새 아레나 만들기
            </button>
            {arenas.length === 0 && <p>아직 만든 아레나가 없어요</p>}
            {arenas.map((a) => (
              <div key={a.id}>
                <p>{a.title}</p>
                <button type="button" onClick={() => onEditArena(a.id)}>
                  아레나 수정
                </button>
                <button type="button" onClick={() => onDeleteArena(a.id)}>
                  아레나 삭제
                </button>
                <button type="button" onClick={() => onToggleLock(a.id, !a.locked)}>
                  {a.locked ? '잠금 해제' : '잠금'}
                </button>
              </div>
            ))}
          </Card>
        )}
        {tab === 'students' && (
          <Card>
            <p>학생 관리는 다음 단계에서 열려요</p>
          </Card>
        )}
        {tab === 'analysis' && (
          <Card>
            <p>아직 분석할 기록이 없어요</p>
          </Card>
        )}
      </div>
    </div>
  );
}
```

`src/App.tsx` teacher 분기: `EmptyState` 대신 TeacherHome 셸 연결은 Task 5(학생·분석 탭 완성 후)로 미룬다. 이번 Task에서는 App을 건드리지 않는다.

`package.json`에 `"qrcode": "^1.5.4"`, `"@types/qrcode": "^1.5.5"` 추가 후 `npm install`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/TeacherHome.test.tsx && npm test`
Expected: PASS (4 + 전체 46 + 4 = 50 tests: 기존 46, TeacherHome 4)

- [ ] **Step 5: Commit**

```bash
git add src/pages/TeacherHome.tsx src/pages/TeacherHome.test.tsx src/hooks/useTeacherRooms.ts src/components/InviteQR.tsx package.json package-lock.json
git commit -m "feat: add teacher home shell with live monitoring"
```

---

### Task 5: 학생 명단 + 분석

**Files:**
- Create: `src/hooks/useStudents.ts`, `src/lib/roster.test.ts` (roster.ts는 Task 내용에 포함 — 아래 참조), `src/lib/analytics.test.ts`, `src/hooks/useAnalytics.ts`
- Modify: `src/pages/TeacherHome.tsx` (학생/분석 탭 연결), `src/pages/TeacherHome.test.tsx` (2건 추가)

**Interfaces:**
- Consumes: TeacherHome props 확장 (students, analysis props 추가 — 기존 테스트 prop 목록에 추가).
- Produces: 완성된 TeacherHome 4탭 (Task 6이 App에 연결).

- [ ] **Step 1: Write the failing tests**

`src/lib/roster.ts` (테스트 대상이므로 테스트와 함께 작성 — TDD이므로 테스트 먼저):
```ts
export interface RosterStudent {
  uid: string;
  nickname: string;
  xp: number;
}

export function buildRosterCsv(students: RosterStudent[]): string {
  const head = '이름,XP';
  const rows = students.map((s) => `${s.nickname},${s.xp}`);
  return [head, ...rows].join('\n');
}

export function byXpDesc(a: RosterStudent, b: RosterStudent): number {
  return b.xp - a.xp;
}
```

`src/lib/roster.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildRosterCsv, byXpDesc } from './roster';

describe('buildRosterCsv', () => {
  it('builds csv with header', () => {
    expect(buildRosterCsv([{ uid: 'u1', nickname: '일호', xp: 120 }])).toBe('이름,XP\n일호,120');
  });

  it('sorts by xp descending', () => {
    const students = [
      { uid: 'u1', nickname: '일호', xp: 120 },
      { uid: 'u2', nickname: '이호', xp: 300 },
    ];
    expect([...students].sort(byXpDesc).map((s) => s.nickname)).toEqual(['이호', '일호']);
  });
});
```

`src/lib/analytics.ts`:
```ts
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
```

`src/lib/analytics.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { activeStudents, avgCorrectVsWrong, hardProblems, problemStats, type RoundRecord } from './analytics';

const rounds: RoundRecord[] = [
  { roomId: 'r1', arenaId: 'a1', problemIndex: 0, answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: false }] },
  { roomId: 'r1', arenaId: 'a1', problemIndex: 1, answers: [{ uid: 'u1', correct: true }, { uid: 'u2', correct: true }] },
  { roomId: 'r2', arenaId: 'a1', problemIndex: 0, answers: [{ uid: 'u1', correct: false }, { uid: 'u3', correct: false }] },
];

describe('analytics', () => {
  it('builds problem stats', () => {
    expect(problemStats(rounds)).toEqual([
      { problemIndex: 0, asked: 2, correct: 1 },
      { problemIndex: 1, asked: 1, correct: 2 },
    ]);
  });

  it('finds hard problems', () => {
    expect(hardProblems(problemStats(rounds), 1)).toEqual([{ problemIndex: 0, asked: 2, correct: 1 }]);
  });

  it('averages correct vs wrong', () => {
    expect(avgCorrectVsWrong(rounds)).toEqual({ avgCorrect: 1, avgWrong: 1 });
  });

  it('finds active students', () => {
    expect(activeStudents(rounds, 3)).toEqual(['u1']);
    expect(activeStudents(rounds, 5)).toEqual([]);
  });

  it('handles empty rounds', () => {
    expect(avgCorrectVsWrong([])).toEqual({ avgCorrect: 0, avgWrong: 0 });
    expect(hardProblems([], 3)).toEqual([]);
  });
});
```
(검산: problem0 — r1 1정답 + r2 0정답 = asked 2, correct 1 ✓. problem1 — asked 1, correct 2 ✓. hard 1건 → problem0 (정답률 0.5 < 1.0) ✓. avg: 라운드 3건, 정답 1+2+0=3 → 1.0, 오답 6−3=3 → 1.0 ✓. u1 응답 4건(u1: r1p0, r1p1, r2p0 = 3건... 다시 세면 u1은 r1p0, r1p1, r2p0 = 3건, u2 2건, u3 1건. minRounds 3 → ['u1'] ✓, 5 → [] ✓.)

`src/hooks/useStudents.ts`:
```ts
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { byXpDesc, type RosterStudent } from '../lib/roster';

export function useStudents(classroomId: string | null) {
  const [students, setStudents] = useState<RosterStudent[]>([]);

  useEffect(() => {
    if (!classroomId) return;
    return onSnapshot(
      query(collection(db, 'users'), where('classroomId', '==', classroomId)),
      (snap) => {
        setStudents(
          snap.docs
            .map((d) => ({
              uid: d.id,
              nickname: (d.data().nickname as string) ?? '이름 없음',
              xp: (d.data().xp as number) ?? 0,
            }))
            .sort(byXpDesc),
        );
      },
      () => {},
    );
  }, [classroomId]);

  const removeStudent = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };

  return { students, removeStudent };
}
```

`src/hooks/useAnalytics.ts` (정답지 대조 포함 — rooms 문서에는 정답지가 없으므로 problems를 함께 읽는다):
```ts
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RoundRecord } from '../lib/analytics';

export function useAnalytics(arenaId: string | null) {
  const [rounds, setRounds] = useState<RoundRecord[]>([]);

  useEffect(() => {
    if (!arenaId) return;
    void (async () => {
      try {
        const [roomSnap, probSnap] = await Promise.all([
          getDocs(query(collection(db, 'rooms'), where('arenaId', '==', arenaId), where('status', '==', 'finished'))),
          getDocs(collection(db, 'arenas', arenaId, 'problems')),
        ]);
        const correctByIndex = probSnap.docs
          .sort((a, b) => (a.id < b.id ? -1 : 1))
          .map((d) => d.data().answerIndex as number);
        const out: RoundRecord[] = [];
        for (const d of roomSnap.docs) {
          const data = d.data() as { players?: { uid: string; answers?: (number | null)[] }[] };
          const players = data.players ?? [];
          const maxRounds = Math.max(0, ...players.map((p) => p.answers?.length ?? 0));
          for (let i = 0; i < maxRounds; i += 1) {
            out.push({
              roomId: d.id,
              arenaId,
              problemIndex: i,
              answers: players.map((p) => ({ uid: p.uid, correct: p.answers?.[i] === correctByIndex[i] })),
            });
          }
        }
        setRounds(out);
      } catch {
        setRounds([]);
      }
    })();
  }, [arenaId]);

  return { rounds };
}
```

TeacherHome 학생/분석 탭 연결 (props 확장):
```tsx
// students 탭 교체:
{tab === 'students' && (
  <Card>
    <p className="font-bold mb-2">학생 일괄 관리</p>
    <InviteQR code={classroomCode} />
    <p>학급 초대 QR — 탭해서 확대</p>
    {students.length === 0 ? (
      <EmptyState title="아직 등록된 학생이 없어요" />
    ) : (
      students.map((s) => (
        <div key={s.uid}>
          <p>{s.nickname}</p>
          <button type="button" onClick={() => onDeleteStudent(s.uid)}>
            학생 삭제
          </button>
        </div>
      ))
    )}
    <button type="button" onClick={onExportCsv}>
      명단 내려받기
    </button>
  </Card>
)}
// analysis 탭 교체:
{tab === 'analysis' && (
  <Card>
    {rounds.length === 0 ? (
      <EmptyState title="아직 분석할 기록이 없어요" />
    ) : (
      <div>
        <p>어려운 문제 {hard.length}개</p>
        {hard.map((h) => (
          <p key={h.problemIndex}>
            {h.problemIndex + 1}번 문제 — {h.correct}/{h.asked} 정답
          </p>
        ))}
        <p>
          맞힌 문제 평균 {avg.avgCorrect} vs 틀린 문제 평균 {avg.avgWrong}
        </p>
      </div>
    )}
  </Card>
)}
```
TeacherHome props에 `classroomCode: string; students: RosterStudent[]; onDeleteStudent: (uid: string) => void; onExportCsv: () => void; rounds: RoundRecord[];` 추가. 기존 테스트 4건의 prop 목록에 새 props를 빈값으로 추가한다 (`classroomCode=""`, `students={[]}`, `onDeleteStudent={noop}`, `onExportCsv={noop}`, `rounds={[]}`). `hard`/`avg`는 컴포넌트 안에서 `problemStats`/`hardProblems`/`avgCorrectVsWrong`으로 계산한다.

TeacherHome.test에 2건 추가:
```tsx
it('shows empty students roster', () => {
  render(
    <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
  );
  fireEvent.click(screen.getByRole('button', { name: '학생' }));
  expect(screen.getByText('아직 등록된 학생이 없어요')).toBeTruthy();
});

it('shows empty analysis', () => {
  render(
    <TeacherHome live={[]} abandoned={[]} finished={[]} arenas={[]} classroomCode="A1B2C3" students={[]} onDeleteStudent={noop} onExportCsv={noop} rounds={[]} onForceClose={noop} onEditArena={noop} onDeleteArena={noop} onToggleLock={noop} onNewArena={noop} onSignOut={noop} />,
  );
  fireEvent.click(screen.getByRole('button', { name: '분석' }));
  expect(screen.getByText('아직 분석할 기록이 없어요')).toBeTruthy();
});
```
(InviteQR는 qrcode 비동기 렌더이므로 'QR을 만드는 중...'이 먼저 보인다 — 단언하지 않는다.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/roster.test.ts src/lib/analytics.test.ts`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

위 lib 4개 파일 + 2개 훅 + TeacherHome 탭 교체 + 테스트 prop 수정.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (50 + 2 + 5 + 2 = 59 tests: roster 2, analytics 5, TeacherHome 신규 2)

- [ ] **Step 5: Commit**

```bash
git add src/lib/roster.ts src/lib/roster.test.ts src/lib/analytics.ts src/lib/analytics.test.ts src/hooks/useStudents.ts src/hooks/useAnalytics.ts src/pages/TeacherHome.tsx src/pages/TeacherHome.test.tsx
git commit -m "feat: add roster management and battle analytics"
```

---

### Task 6: 규칙 강화 + App 연결 + 전체 검증

**Files:**
- Modify: `firestore.rules`, `firebase.json`, `src/App.tsx` (teacher 분기), `src/App.test.tsx` (teacher 진입 1건), `scripts/seed.mjs` (데모 사용자 3건)
- Create: `vitest.emu.config.ts`, `firestore.indexes.json`

**Interfaces:**
- Consumes: Task 2–5 전부.
- Produces: 완성된 Plan 3 앱 (선생님 공간 동작).

- [ ] **Step 1: Write the failing test**

`src/App.test.tsx`에 1건 추가:
```tsx
it('enters teacher workspace after join as teacher', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
  fireEvent.click(screen.getByRole('button', { name: '선생님으로 시작' }));
  fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
  fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
  expect(screen.getByText('선생님 워크스페이스')).toBeTruthy();
});
```
(기존 'routes teacher to teacher stub' 테스트는 스텁 문구를 보므로 실패한다 — 기대문을 위 워크스페이스 문구로 교체한다. 계획된 교체.)

`vitest.emu.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.emu.test.ts'],
    setupFiles: ['./src/test-setup.ts'],
  },
});
```
실행: `npx vitest run --config vitest.emu.config.ts` (에뮬레이터 기동 중에만).

`firestore.indexes.json` (운영 배포용 복합 인덱스 — 에뮬레이터는 강제하지 않지만 실프로젝트에서는 필수):
```json
{
  "indexes": [
    {
      "collectionGroup": "rooms",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "rooms",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "arenaId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```
`firebase.json`의 firestore 블록에 `"indexes": "firestore.indexes.json"` 추가.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL (워크스페이스 없음)

- [ ] **Step 3: Write minimal implementation**

`firestore.rules` 교체:
```
rules_version = '2';
service cloud.firestore {
  function isSignedIn() {
    return request.auth != null;
  }
  function isTeacher() {
    return isSignedIn()
      && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
  }
  function isOwner(uid) {
    return isSignedIn() && request.auth.uid == uid;
  }
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if isSignedIn();
      allow write: if isOwner(uid);
      allow delete: if isTeacher();
    }
    match /classrooms/{id} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && resource.data.teacherId == request.auth.uid;
      allow delete: if false;
    }
    match /arenas/{id} {
      allow read: if isSignedIn();
      allow write: if isTeacher();
    }
    match /arenas/{arenaId}/problems/{pid} {
      allow read: if isSignedIn();
      allow write: if isTeacher();
    }
    match /rooms/{roomId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn()
        && request.resource.data.status in ['waiting', 'ready', 'playing', 'finished', 'abandoned']
        && request.resource.data.players.size() >= 1
        && request.resource.data.players.size() <= 2
        && (
          (request.resource.data.players.size() == 1
            && (request.resource.data.winnerUid == null
              || request.resource.data.winnerUid == request.resource.data.players[0].uid))
          || (request.resource.data.players.size() == 2
            && (request.resource.data.winnerUid == null
              || request.resource.data.winnerUid == request.resource.data.players[0].uid
              || request.resource.data.winnerUid == request.resource.data.players[1].uid))
        );
      allow delete: if false;
    }
    match /battles/{battleId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if false;
      allow delete: if false;
    }
  }
}
```
(rooms 형상 검증만 하며 상태 전이 순서는 클라이언트가 지킨다 — Plan 2 리뷰에서 합의된 범위.)

`src/App.tsx` teacher 분기 교체:
```tsx
if (view === 'teacher') {
  return (
    <TeacherShell
      classroomId={classroomId}
      onSignOut={() => {
        void signOut();
        setView('login');
      }}
    />
  );
}

function TeacherShell({ classroomId, onSignOut }: { classroomId: string | null; onSignOut: () => void }) {
  const { live, abandoned, finished, forceClose } = useTeacherRooms();
  const { arenas, saveArena, removeArena, setLocked } = useArenaAdmin(classroomId);
  const { students, removeStudent } = useStudents(classroomId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [analysisArenaId, setAnalysisArenaId] = useState<string | null>(null);
  const { rounds } = useAnalytics(analysisArenaId);
  const stats = problemStats(rounds);
  const hard = hardProblems(stats, 3);
  const avg = avgCorrectVsWrong(rounds);

  const downloadCsv = () => {
    const blob = new Blob([buildRosterCsv(students)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roster.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (creating || editingId) {
    const arena = arenas.find((a) => a.id === editingId);
    return (
      <ArenaEditor
        initial={
          arena
            ? { title: arena.title, desc: arena.desc, subject: arena.subject, aiCount: (arena as unknown as { aiCount?: number }).aiCount ?? 0 }
            : { title: '', desc: '', subject: '수학', aiCount: 0 }
        }
        problems={[]}
        onSave={(input, problems) => {
          void saveArena(editingId, input, problems.map((p) => ({ ...p, roundTimeSec: 30 }))).then(() => {
            setCreating(false);
            setEditingId(null);
          });
        }}
        onCancel={() => {
          setCreating(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <TeacherHome
      live={live.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      abandoned={abandoned.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      finished={finished.map((r) => ({ id: r.id, arenaTitle: r.arenaId, players: r.players.map((p) => p.nickname) }))}
      arenas={arenas.map((a) => ({ id: a.id, title: a.title, locked: a.locked }))}
      classroomCode={classroomId ?? ''}
      students={students}
      onDeleteStudent={(uid) => {
        void removeStudent(uid);
      }}
      onExportCsv={downloadCsv}
      rounds={rounds}
      onForceClose={(id) => {
        void forceClose(id);
      }}
      onEditArena={setEditingId}
      onDeleteArena={(id) => {
        void removeArena(id);
      }}
      onToggleLock={(id, locked) => {
        void setLocked(id, locked);
      }}
      onNewArena={() => setCreating(true)}
      onSignOut={onSignOut}
    />
  );
}
```
(필요 import 추가: TeacherHome, ArenaEditor, useTeacherRooms, useArenaAdmin, useStudents, useAnalytics, problemStats/hardProblems/avgCorrectVsWrong, buildRosterCsv. `analysisArenaId`는 아레나 선택 UI가 없으므로 첫 아레나를 기본값으로 둔다 — 아래 useEffect 추가.)

분석 대상 기본값 (선택 UI 없이 첫 아레나 자동 선택):
```tsx
useEffect(() => {
  if (!analysisArenaId && arenas.length > 0) setAnalysisArenaId(arenas[0].id);
}, [analysisArenaId, arenas]);
```
(useEffect import 필요. 분석 대상 선택 UI는 없고 첫 아레나 자동 선택 — 스펙에 별도 정의가 없으므로 가장 단순한 규칙.)

`scripts/seed.mjs`에 데모 사용자 3건 추가 (맨 끝, 로그 전):
```js
await db.doc('users/teacher-demo').set({
  nickname: '김선생',
  role: 'teacher',
  avatar: 'cat',
  classroomId: 'A1B2C3',
  xp: 0,
  level: 1,
  streak: 0,
  winCount: 0,
  correctRate: 0,
});
await db.doc('users/student-demo-1').set({
  nickname: '일호',
  role: 'student',
  avatar: 'dog',
  classroomId: 'A1B2C3',
  xp: 250,
  level: 3,
  streak: 2,
  winCount: 5,
  correctRate: 70,
});
await db.doc('users/student-demo-2').set({
  nickname: '이호',
  role: 'student',
  avatar: 'frog',
  classroomId: 'A1B2C3',
  xp: 120,
  level: 2,
  streak: 0,
  winCount: 2,
  correctRate: 55,
});
```

- [ ] **Step 4: 전체 테스트 + 빌드 + 에뮬레이터 검증**

Run: `npm test && npm run build`
Expected: PASS (59 + 1 = 60 tests)

Run (에뮬레이터 기동 중):
```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/seed.mjs
npx vitest run --config vitest.emu.config.ts
```
Expected: 시드 로그 + emu 1/1 PASS.

- [ ] **Step 5: Commit**

```bash
git add firestore.rules firebase.json firestore.indexes.json src/App.tsx src/App.test.tsx scripts/seed.mjs vitest.emu.config.ts
git commit -m "feat: harden rules and wire teacher workspace with verification"
```

---

## Plan 2 잔여 수용 확인표 (Task 1·6에서 닫힘)

- Timer nowMs 재동기화 → Task 1 (테스트 포함).
- App.test 중복 병합 → Task 1.
- problems `orderBy('__name__')` → BattleShell fetch에 추가 (Task 6 App 수정 시 반영. 현재 `getDocs(collection(...))`에 `.orderBy`가 없으므로 `query(collection(...), orderBy('__name__'))`로 교체하고 `query` import 추가).
- ready 전 problems 로딩 게이트 → Task 1 (`problemsLoaded` prop) + Task 6에서 BattleShell의 `<BattleRoom>`에 `problemsLoaded={problems.length > 0}` 추가 (위 battle 분기 코드에 해당 줄 삽입).
- onSnapshot 에러 콜백 → Task 1.
- findOrCreate error + 재시도 → Task 1.
- vitest.emu.config.ts 상시 파일 → Task 6.
- correctRate 스키마 → `users`에 `totalAnswered`/`totalCorrect` 누적로는 바꾸지 않고, 분석 집계로만 표시한다 (프로필 correctRate 필드는 시드·가입 기본값 유지). Ruling: 쓰기 경로 변경 없이 읽기 집계로 충분하므로 스키마 동결.
- 리더보드 반 순위 → `useStudents`가 xp 내림차순 정렬해서 반환한다 (정렬 비교자는 `roster.ts`의 `byXpDesc` 순수 함수 + 테스트). StudentHome 전체 리더보드는 그대로 두고, 스펙의 '반 순위'는 선생님 학생 탭에서 충족한다.
- 아바타 → join/create 시 avatar 저장 (Task 2), BattleShell me avatar는 입장 시 선택값 사용: Task 6에서 StudentShell의 onEnter 호출을 `onEnter(arenaId, { uid, nickname, avatar: animal }, ...)` 로 둔다 (`animal` state는 Task 2에서 이미 존재, `'cat'` 하드코드 금지).
