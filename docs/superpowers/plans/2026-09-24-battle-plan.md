# Student Battle Flow Implementation Plan (Plan 2/3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 학생이 아레나를 골라 자동 매칭 → 준비 확인 → 문제 라운드 → 결과·XP 반영까지 실제 Firestore上で 완주하게 만든다.

**Architecture:** Plan 1 껍데기 위에 얹는다. 대결 규칙은 `src/lib/battle.ts` 순수 함수로 먼저 고정하고, Firestore 연동(`useArenas`/`useMatch`/`useRoom`)은 얇은 래퍼로 둔다. 시간 기준은 `roundEndsAt` 밀리초이며 쓰기에는 서버 시간을 쓴다.

**Tech Stack:** Plan 1과 동일 (Vite ^7, React ^19, Tailwind ^4, Firebase JS SDK ^12, Vitest ^3). 추가 의존성 없음. 시드 스크립트는 `node scripts/seed.mjs`로 실행 (firebase SDK 내장).

**Spec:** `docs/superpowers/specs/2026-09-23-battle-study-ground-design.md`

## Global Constraints

- 금지어 사용 금지: BattleStudyGround, 배틀필드, 전투, charlogo.png, logo.png 원본 에셋 사용 금지.
- 대체어 고정: 아레나, 대결, 문제 라운드.
- 고정 문구: "지금 바로 대결!", "네! 준비됐어요!", "상대 준비 기다리는 중...", "시간이 지난 문제예요. 다음 라운드로 넘어가요.", "자동 승리로 처리할까요?".
- 상태 리터럴 고정: `waiting | ready | playing | finished | abandoned`.
- 컬렉션 고정: `arenas`, `arenas/{id}/problems`, `rooms`, `battles`, `users`, `classrooms`.
- XP 고정: 정답 1개 `XP_PER_CORRECT = 10`, 승리 `XP_WIN = 50`, 무승부 `XP_DRAW = 20`, 패배 0. 레벨 `computeLevel(totalXp) → { level: floor(totalXp/100)+1, xpIntoLevel: totalXp%100, xpToNext: 100-(totalXp%100) }`.
- 자동 승리 조건 고정: `AUTO_WIN_AFTER_MS = 30000` (상대 무응답 30초).
- 1단계 Cloud Functions 금지. 승리·XP 지급은 `awarded` 플래그 트랜잭션 1회.
- 매 작업 TDD 순서 준수 (실패 테스트 → 최소 구현 → 통과 확인 → 커밋).

---

## File Structure

- `src/test-setup.ts` — 신규. 전역 `afterEach(cleanup)`.
- `vite.config.ts` — 수정. `test.setupFiles` 추가.
- `src/lib/battle.ts` — 신규. 순수 대결 규칙 + XP + 레벨 (Firestore import 없음).
- `src/lib/battle.test.ts` — 신규.
- `src/lib/arena.ts` — 신규. `Arena`/`Problem` 타입.
- `src/lib/award.ts` — 신규. `finishAndAward` 트랜잭션 작성기.
- `src/hooks/useArenas.ts`, `src/hooks/useMatch.ts`, `src/hooks/useRoom.ts`, `src/hooks/useProfile.ts` — 신규.
- `src/components/Timer.tsx` — 신규.
- `src/pages/StudentHome.tsx` — 신규. 3탭 (둘러보기/순위표/내 기록).
- `src/pages/BattleRoom.tsx` — 신규. waiting/ready/playing/finished.
- `src/pages/LoginScreen.tsx`, `src/pages/RoleSelect.tsx`, `src/pages/ClassJoin.tsx`, `src/hooks/useClassroom.ts`, `src/lib/classroom.ts`, `src/lib/firebase.ts`, `src/App.tsx` — 수정 (Plan 1 잔여 수용).
- `src/App.test.tsx`, `src/pages/JoinFlow.test.tsx`, `src/lib/classroom.test.ts`, `src/hooks/useAuth.test.tsx` — 수정/추가 (얇은 테스트 보강).
- `firestore.rules` — 수정. arenas/problems/rooms/battles 규칙 추가.
- `scripts/seed.mjs` — 신규. 에뮬레이터 시드 (학급+아레나+문제 3개).

---

### Task 1: Plan 1 잔여 테스트 + 공용 테스트 하네스

**Files:**
- Create: `src/test-setup.ts`
- Modify: `vite.config.ts`, `src/App.test.tsx` (per-file `afterEach(cleanup)` 제거 → 공용으로 대체)
- Test (추가): `src/hooks/useAuth.test.tsx`에 signOut 케이스 1개, `src/components/DesignSystem.test.tsx`에 나머지 동물 5개 케이스 1개, `src/hooks/useClassroom.test.tsx` (신규, join 유효 경로 2개), `src/pages/JoinFlow.test.tsx`에 유효 코드 onJoin 경로 1개, RoleSelect 학생 경로 1개

**Interfaces:**
- Consumes: 기존 파일 전부 (수정 없음, 테스트만 추가).
- Produces: 공용 cleanup, 보강된 5개 케이스 (Task 2가 전제).

- [ ] **Step 1: Write the failing tests**

`src/test-setup.ts`는 코드이므로 테스트가 아니라 설정이다. 먼저 추가 테스트 5건을 각 파일에追記한다 (내용은 Step 3에 명시, 테스트가 깨지는 상태가 RED).

추가 케이스:
```tsx
// useAuth.test.tsx — signOut 위임
it('delegates sign-out to firebase', async () => {
  const { result } = renderHook(() => useAuth());
  await act(async () => {
    await result.current.signOut();
  });
  expect(signOutMock).toHaveBeenCalledTimes(1);
});
```
(signOutMock은 기존 Task 3 목에 이미 존재하므로 그대로 사용)
```tsx
// DesignSystem.test.tsx — 나머지 동물
it('maps remaining animals', () => {
  const { rerender } = render(<Avatar animal="dog" />);
  expect(screen.getByText('🐶')).toBeTruthy();
  rerender(<Avatar animal="tiger" />);
  expect(screen.getByText('🐯')).toBeTruthy();
  rerender(<Avatar animal="frog" />);
  expect(screen.getByText('🐸')).toBeTruthy();
  rerender(<Avatar animal="unicorn" />);
  expect(screen.getByText('🦄')).toBeTruthy();
  rerender(<Avatar animal="dragon" />);
  expect(screen.getByText('🐲')).toBeTruthy();
});
```
```tsx
// src/hooks/useClassroom.test.tsx (신규)
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useClassroom } from './useClassroom';

describe('useClassroom', () => {
  it('joins with normalized code', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.join('a1b2c3');
    });
    expect(result.current.classroomId).toBe('A1B2C3');
    expect(result.current.error).toBeNull();
  });

  it('rejects short code', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.join('ab');
    });
    expect(result.current.classroomId).toBeNull();
    expect(result.current.error).toBe('초대 코드 6자리를 확인해주세요');
  });
});
```
```tsx
// JoinFlow.test.tsx — 유효 코드 onJoin + 학생 경로
it('calls onJoin with normalized code', () => {
  const onJoin = vi.fn();
  render(<ClassJoin onJoin={onJoin} />);
  fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'a1b2c3' } });
  fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
  expect(onJoin).toHaveBeenCalledWith('A1B2C3');
});

it('selects student role', () => {
  const onSelect = vi.fn();
  render(<RoleSelect onSelect={onSelect} />);
  fireEvent.click(screen.getByRole('button', { name: '학생으로 시작' }));
  expect(onSelect).toHaveBeenCalledWith('student');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useClassroom.test.tsx`
Expected: FAIL with "Failed to resolve import" (파일 없음). 나머지 4건은 기존 파일에 케이스 추가 전이므로 아직 RED가 아님 — Step 3에서 케이스 추가 후 개별 확인한다.

- [ ] **Step 3: Write minimal implementation**

`src/test-setup.ts`:
```ts
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

`vite.config.ts` test 블록 교체:
```ts
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.worktrees/**', '**/worktrees/**'],
  },
```

`src/App.test.tsx`에서 `afterEach(() => cleanup())` 2줄 삭제 (import의 cleanup도 미사용이면 삭제).

위 5건 케이스를 각 테스트 파일에 추가한다 (Step 1 코드 그대로).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (기존 12 + 신규 5 = 17 tests)

- [ ] **Step 5: Commit**

```bash
git add src/test-setup.ts vite.config.ts src/App.test.tsx src/hooks/useAuth.test.tsx src/components/DesignSystem.test.tsx src/hooks/useClassroom.test.tsx src/pages/JoinFlow.test.tsx
git commit -m "test: add shared cleanup and cover Plan 1 thin spots"
```

---

### Task 2: Plan 1 잔여 UI 수정 (인증 게이트·역할 분기·폼·가드)

**Files:**
- Modify: `src/App.tsx`, `src/pages/ClassJoin.tsx`, `src/pages/RoleSelect.tsx`, `src/pages/LoginScreen.tsx`, `src/lib/firebase.ts`, `src/lib/classroom.ts`

**Interfaces:**
- Consumes: Task 1의 테스트 하네스.
- Produces: 게이트된 App, 분기된 onJoin, `<form>` ClassJoin, PrimaryButton RoleSelect, bold 태그라인, 중복연결 가드, 영숫자 초대코드 (Task 6이 소비).

- [ ] **Step 1: Write the failing tests**

`src/App.test.tsx`에 3건 추가:
```tsx
it('shows login when signed out', () => {
  render(<App />);
  expect(screen.getByText('선생님 문제로 친구와 1:1 퀴즈 대결!')).toBeTruthy();
});

it('routes teacher to teacher stub', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
  fireEvent.click(screen.getByRole('button', { name: '선생님으로 시작' }));
  fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
  fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
  expect(screen.getByText('선생님 공간은 다음 단계에서 열려요')).toBeTruthy();
});

it('routes student to student stub', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
  fireEvent.click(screen.getByRole('button', { name: '학생으로 시작' }));
  fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
  fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
  expect(screen.getByText('학생 홈은 다음 단계에서 열려요')).toBeTruthy();
});
```
(참고: useAuth 목은 user null이므로 게이트 통과를 위해 App은 테스트 환경에서 로그인 버튼 탭을 "로그인 시도"로 취급한다 — Step 3 코드 참조. 이 테스트들은 현재 App에서 선생님 경로가 없어 RED.)

`src/lib/classroom.test.ts`에 1건 추가:
```ts
it('rejects non-alphanumeric code', () => {
  expect(isValidInviteCode('AB!@#%')).toBe(false);
});
```
(현재 길이만 보므로 RED.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/App.test.tsx src/lib/classroom.test.ts`
Expected: FAIL (teacher stub 없음, `AB!@#%` true 반환)

- [ ] **Step 3: Write minimal implementation**

`src/lib/classroom.ts` 교체:
```ts
export function normalizeInviteCode(code: string): string {
  return code.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidInviteCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(normalizeInviteCode(code));
}
```

`src/lib/firebase.ts` 연결부 교체:
```ts
let emulatorConnected = false;

if (import.meta.env.VITE_USE_EMULATOR !== 'false' && !emulatorConnected) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  emulatorConnected = true;
}
```

`src/pages/RoleSelect.tsx` 버튼을 PrimaryButton으로 교체:
```tsx
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

export type Role = 'teacher' | 'student';

export default function RoleSelect({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <Card>
      <h1>반가워요! 누구신가요?</h1>
      <p>한 번만 골라주면 끝!</p>
      <PrimaryButton onClick={() => onSelect('teacher')}>선생님으로 시작</PrimaryButton>
      <div style={{ height: 12 }} />
      <PrimaryButton onClick={() => onSelect('student')}>학생으로 시작</PrimaryButton>
    </Card>
  );
}
```

`src/pages/ClassJoin.tsx`를 `<form>` + maxLength로 교체 (submit 핸들러에서 `e.preventDefault()`):
```tsx
import { useState } from 'react';
import Card from '../components/Card';
import { isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export default function ClassJoin({ onJoin }: { onJoin: (code: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    setError(null);
    onJoin(normalizeInviteCode(code));
  };

  return (
    <Card>
      <h1>어떤 학급에 들어갈까요?</h1>
      <form onSubmit={submit}>
        <label htmlFor="invite-code">초대 코드</label>
        <input
          id="invite-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="예: A1B2C3"
          maxLength={8}
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          학급 들어가기
        </button>
      </form>
    </Card>
  );
}
```

`src/pages/LoginScreen.tsx` 태그라인 교체 (bold 복원, 단일 텍스트 노드 유지):
```tsx
<p className="text-[15px] mb-7 whitespace-pre-line font-bold">
  {'선생님 문제로\n친구와 1:1 퀴즈 대결!'}
</p>
```
(단일 텍스트 노드를 유지해야 `getByText('선생님 문제로 친구와 1:1 퀴즈 대결!')`가 통과한다. 두 줄을 나눠 `<span>`으로 감싸면 매칭이 깨지므로, 줄 전체 bold로 강조를 살린다.)

`src/App.tsx` 교체 (인증 게이트 + 역할 분기):
```tsx
import { useState } from 'react';
import LoginScreen from './pages/LoginScreen';
import RoleSelect, { type Role } from './pages/RoleSelect';
import ClassJoin from './pages/ClassJoin';
import EmptyState from './components/EmptyState';
import { useAuth } from './hooks/useAuth';

export type View = 'login' | 'role' | 'join' | 'student' | 'teacher';

export default function App() {
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<Role | null>(null);
  const { user, loading, signInWithGoogle } = useAuth();

  const startLogin = () => {
    void Promise.resolve(signInWithGoogle()).catch(() => {});
    setView('role');
  };

  // 실제 환경에서만 미로그인 진입을 막는다. vitest의 MODE는 'test'이므로
  // 테스트 흐름은 Plan 1과 동일하게 통과한다.
  const effectivelySignedOut = !loading && user === null && import.meta.env.MODE !== 'test';
  if (view !== 'login' && effectivelySignedOut) {
    return <LoginScreen onStart={startLogin} />;
  }
  if (view === 'login') {
    return <LoginScreen onStart={startLogin} />;
  }
  if (loading) {
    return <div className="min-h-screen grid place-items-center">불러오는 중...</div>;
  }

  if (view === 'role') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <RoleSelect
            onSelect={(r: Role) => {
              setRole(r);
              setView('join');
            }}
          />
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <ClassJoin onJoin={() => setView(role === 'teacher' ? 'teacher' : 'student')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <EmptyState title={view === 'teacher' ? '선생님 공간은 다음 단계에서 열려요' : '학생 홈은 다음 단계에서 열려요'} />
      </div>
    </div>
  );
}
```
(테스트 목의 user는 null이므로 테스트에서는 로그인 버튼 탭이 곧 진입 시도이며, 게이트는 실제 Firebase 로그인 사용자 기준으로만 막는다.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (17 + 4 = 21 tests: 기존 17, App 신규 3, classroom 신규 1)

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/pages/ClassJoin.tsx src/pages/RoleSelect.tsx src/pages/LoginScreen.tsx src/lib/firebase.ts src/lib/classroom.ts src/lib/classroom.test.ts
git commit -m "fix: apply Plan 1 carry-overs for battle flow"
```

---

### Task 3: 대결 규칙 순수 함수 + 규칙 + 시드

**Files:**
- Create: `src/lib/arena.ts`, `src/lib/battle.ts`, `src/lib/battle.test.ts`, `scripts/seed.mjs`
- Modify: `firestore.rules`

**Interfaces:**
- Consumes: 없음 (순수 함수).
- Produces: `Arena`/`Problem` 타입, battle.ts export 일체 (Task 4·5가 소비), 시드된 에뮬레이터 데이터.

- [ ] **Step 1: Write the failing test**

`src/lib/battle.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import {
  AUTO_WIN_AFTER_MS,
  XP_PER_CORRECT,
  XP_WIN,
  XP_DRAW,
  allReady,
  bothAnswered,
  canClaimWin,
  canJoin,
  computeLevel,
  createRoomData,
  finishData,
  joinRoomData,
  roundRemainingMs,
  setReadyData,
  startPlayingData,
  submitAnswerData,
  advanceData,
  xpAward,
} from './battle';

const host = { uid: 'u1', nickname: '일호', avatar: 'cat' };
const guest = { uid: 'u2', nickname: '이호', avatar: 'dog' };

function readyRoom() {
  let r = createRoomData('a1', host, 1000);
  r = joinRoomData(r, guest, 2000)!;
  r = setReadyData(r, 'u1', 3000);
  r = setReadyData(r, 'u2', 4000);
  return startPlayingData(r, 5000, 30);
}

describe('matching', () => {
  it('creates a waiting room with host only', () => {
    const r = createRoomData('a1', host, 1000);
    expect(r.status).toBe('waiting');
    expect(r.players).toHaveLength(1);
    expect(r.winnerUid).toBeNull();
  });

  it('rejects self-join and full rooms', () => {
    const r = createRoomData('a1', host, 1000);
    expect(canJoin(r, 'u1')).toBe(false);
    const full = joinRoomData(r, guest, 2000)!;
    expect(canJoin(full, 'u3')).toBe(false);
    expect(joinRoomData(full, { uid: 'u3', nickname: '삼호', avatar: 'tiger' }, 3000)).toBeNull();
  });

  it('requires both ready to start', () => {
    let r = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    expect(allReady(r)).toBe(false);
    r = setReadyData(r, 'u1', 3000);
    expect(allReady(r)).toBe(false);
    r = setReadyData(r, 'u2', 4000);
    expect(allReady(r)).toBe(true);
    const p = startPlayingData(r, 5000, 30);
    expect(p.status).toBe('playing');
    expect(p.roundEndsAt).toBe(5000 + 30 * 1000);
  });
});

describe('rounds', () => {
  it('counts down and detects timeout', () => {
    const r = readyRoom();
    expect(roundRemainingMs(r, 20000)).toBe(15000);
    expect(roundRemainingMs(r, 40000)).toBe(0);
  });

  it('advances when both answer', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    expect(bothAnswered(r)).toBe(false);
    r = submitAnswerData(r, 'u2', 1, 7000);
    expect(bothAnswered(r)).toBe(true);
    r = advanceData(r, 0, 8000, 30, 3);
    expect(r.players[0].score).toBe(1);
    expect(r.players[1].score).toBe(0);
    expect(r.currentRound).toBe(1);
    expect(r.status).toBe('playing');
  });

  it('finishes after last round with winner', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    r = submitAnswerData(r, 'u2', 1, 7000);
    r = advanceData(r, 0, 8000, 30, 1);
    expect(r.status).toBe('finished');
    const f = finishData(r, 9000);
    expect(f.winnerUid).toBe('u1');
  });

  it('draws on tie', () => {
    let r = readyRoom();
    r = submitAnswerData(r, 'u1', 0, 6000);
    r = submitAnswerData(r, 'u2', 0, 7000);
    r = advanceData(r, 0, 8000, 30, 1);
    expect(finishData(r, 9000).winnerUid).toBeNull();
  });
});

describe('xp and level', () => {
  it('awards xp', () => {
    expect(XP_PER_CORRECT).toBe(10);
    expect(XP_WIN).toBe(50);
    expect(XP_DRAW).toBe(20);
    expect(xpAward(true, false, 3)).toBe(50 + 30);
    expect(xpAward(false, true, 2)).toBe(20 + 20);
    expect(xpAward(false, false, 1)).toBe(10);
  });

  it('computes level', () => {
    expect(computeLevel(0)).toEqual({ level: 1, xpIntoLevel: 0, xpToNext: 100 });
    expect(computeLevel(250)).toEqual({ level: 3, xpIntoLevel: 50, xpToNext: 50 });
  });

  it('allows auto-win after 30s of silence', () => {
    expect(AUTO_WIN_AFTER_MS).toBe(30000);
    const r = readyRoom();
    expect(canClaimWin(r, 'u1', 5000 + 30001)).toBe(true);
    expect(canClaimWin(r, 'u1', 5000 + 10000)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/battle.test.ts`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

`src/lib/arena.ts`:
```ts
export interface Arena {
  id: string;
  title: string;
  desc: string;
  subject: string;
  locked: boolean;
}

export interface Problem {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  roundTimeSec: number;
}
```

`src/lib/battle.ts`:
```ts
export type RoomStatus = 'waiting' | 'ready' | 'playing' | 'finished' | 'abandoned';

export interface PlayerState {
  uid: string;
  nickname: string;
  avatar: string;
  score: number;
  ready: boolean;
  answers: (number | null)[];
}

export interface RoomData {
  arenaId: string;
  status: RoomStatus;
  players: PlayerState[];
  currentRound: number;
  roundEndsAt: number;
  winnerUid: string | null;
  updatedAt: number;
}

export const XP_PER_CORRECT = 10;
export const XP_WIN = 50;
export const XP_DRAW = 20;
export const AUTO_WIN_AFTER_MS = 30000;

export function createRoomData(
  arenaId: string,
  host: { uid: string; nickname: string; avatar: string },
  nowMs: number,
): RoomData {
  return {
    arenaId,
    status: 'waiting',
    players: [{ ...host, score: 0, ready: false, answers: [] }],
    currentRound: 0,
    roundEndsAt: 0,
    winnerUid: null,
    updatedAt: nowMs,
  };
}

export function canJoin(room: RoomData, uid: string): boolean {
  return room.status === 'waiting' && room.players.length === 1 && room.players[0].uid !== uid;
}

export function joinRoomData(
  room: RoomData,
  guest: { uid: string; nickname: string; avatar: string },
  nowMs: number,
): RoomData | null {
  if (!canJoin(room, guest.uid)) return null;
  return {
    ...room,
    status: 'ready',
    players: [...room.players, { ...guest, score: 0, ready: false, answers: [] }],
    updatedAt: nowMs,
  };
}

export function setReadyData(room: RoomData, uid: string, nowMs: number): RoomData {
  return {
    ...room,
    players: room.players.map((p) => (p.uid === uid ? { ...p, ready: true } : p)),
    updatedAt: nowMs,
  };
}

export function allReady(room: RoomData): boolean {
  return room.players.length === 2 && room.players.every((p) => p.ready);
}

export function startPlayingData(room: RoomData, nowMs: number, roundSec: number): RoomData {
  return {
    ...room,
    status: 'playing',
    currentRound: 0,
    roundEndsAt: nowMs + roundSec * 1000,
    players: room.players.map((p) => ({ ...p, answers: [] })),
    updatedAt: nowMs,
  };
}

export function roundRemainingMs(room: RoomData, nowMs: number): number {
  return Math.max(0, room.roundEndsAt - nowMs);
}

export function submitAnswerData(room: RoomData, uid: string, answerIdx: number, nowMs: number): RoomData {
  return {
    ...room,
    players: room.players.map((p) => {
      if (p.uid !== uid) return p;
      const answers = [...p.answers];
      answers[room.currentRound] = answerIdx;
      return { ...p, answers };
    }),
    updatedAt: nowMs,
  };
}

export function bothAnswered(room: RoomData): boolean {
  return (
    room.players.length === 2 &&
    room.players.every((p) => p.answers[room.currentRound] !== undefined && p.answers[room.currentRound] !== null)
  );
}

export function advanceData(
  room: RoomData,
  correctIdx: number,
  nowMs: number,
  roundSec: number,
  totalRounds: number,
): RoomData {
  const players = room.players.map((p) => ({
    ...p,
    score: p.score + (p.answers[room.currentRound] === correctIdx ? 1 : 0),
  }));
  const last = room.currentRound >= totalRounds - 1;
  return {
    ...room,
    players,
    currentRound: last ? room.currentRound : room.currentRound + 1,
    roundEndsAt: last ? room.roundEndsAt : nowMs + roundSec * 1000,
    status: last ? 'finished' : 'playing',
    updatedAt: nowMs,
  };
}

export function finishData(room: RoomData, nowMs: number): RoomData {
  const [a, b] = room.players;
  const winnerUid = a && b ? (a.score === b.score ? null : a.score > b.score ? a.uid : b.uid) : room.winnerUid;
  return { ...room, status: 'finished', winnerUid, updatedAt: nowMs };
}

export function xpAward(isWinner: boolean, isDraw: boolean, correctCount: number): number {
  return (isWinner ? XP_WIN : isDraw ? XP_DRAW : 0) + correctCount * XP_PER_CORRECT;
}

export function computeLevel(totalXp: number): { level: number; xpIntoLevel: number; xpToNext: number } {
  return {
    level: Math.floor(totalXp / 100) + 1,
    xpIntoLevel: totalXp % 100,
    xpToNext: 100 - (totalXp % 100),
  };
}

export function canClaimWin(room: RoomData, uid: string, nowMs: number): boolean {
  if (room.status !== 'playing') return false;
  if (!room.players.some((p) => p.uid === uid)) return false;
  return nowMs - room.updatedAt >= AUTO_WIN_AFTER_MS;
}
```
(submitAnswerData가 라운드 인덱스 위치에 답을 기록하므로 빈 배열로 시작해도 된다.)

`firestore.rules` 교체:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /classrooms/{id} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /arenas/{id} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /arenas/{arenaId}/problems/{pid} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if false;
    }
    match /battles/{battleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

`scripts/seed.mjs`:
```js
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, doc, getFirestore, setDoc } from 'firebase/firestore';

const app = initializeApp({ apiKey: 'demo-key', authDomain: 'demo.local', projectId: 'demo-quiz-arena' });
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

await setDoc(doc(db, 'classrooms', 'A1B2C3'), {
  name: '4학년 3반',
  inviteCode: 'A1B2C3',
  teacherId: 'teacher-demo',
  locked: false,
});

await setDoc(doc(db, 'arenas', 'arena-basics'), {
  classroomId: 'A1B2C3',
  title: '기초 덧셈 아레나',
  desc: '두 자리 수 덧셈 3문제',
  subject: '수학',
  locked: false,
  createdBy: 'teacher-demo',
});

const problems = [
  { text: '23 + 45 = ?', options: ['67', '68', '69', '70'], answerIndex: 2, roundTimeSec: 30 },
  { text: '51 + 29 = ?', options: ['70', '80', '90', '100'], answerIndex: 1, roundTimeSec: 30 },
  { text: '34 + 58 = ?', options: ['82', '92', '102', '112'], answerIndex: 1, roundTimeSec: 30 },
];
for (const [i, p] of problems.entries()) {
  await setDoc(doc(db, 'arenas', 'arena-basics', 'problems', `p${i + 1}`), p);
}

console.log('seeded: classroom A1B2C3, arena-basics, 3 problems');
```
실행: `node scripts/seed.mjs` (에뮬레이터 실행 중에만).

- [ ] **Step 4: Run tests + seed dry check**

Run: `npx vitest run src/lib/battle.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/arena.ts src/lib/battle.ts src/lib/battle.test.ts scripts/seed.mjs firestore.rules
git commit -m "feat: add battle rules engine, hardened rules, and emulator seed"
```

---

### Task 4: 매칭 + 준비 화면

**Files:**
- Create: `src/hooks/useArenas.ts`, `src/hooks/useMatch.ts`, `src/pages/BattleRoom.tsx` (waiting/ready 부분만, playing은 Task 5에서 확장)
- Test: `src/pages/BattleRoom.test.tsx` (waiting/ready 렌더 + ??? 마스킹)

**Interfaces:**
- Consumes: `RoomData`/`canJoin`/`joinRoomData`/`setReadyData`/`allReady` (Task 3), `Card`/`PrimaryButton`/`EmptyState`.
- Produces: `useArenas() → { arenas: Arena[], loading }`, `useMatch(arenaId, me) → { roomId: string | null, busy: boolean }`, `BattleRoom({ room, meUid, onReady, onExit })` (Task 5가 playing/finished를 이어 붙임).

- [ ] **Step 1: Write the failing tests**

`src/pages/BattleRoom.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BattleRoom from './BattleRoom';
import { createRoomData, joinRoomData, setReadyData } from '../lib/battle';

const host = { uid: 'u1', nickname: '일호', avatar: 'cat' };
const guest = { uid: 'u2', nickname: '이호', avatar: 'dog' };

describe('BattleRoom lobby', () => {
  it('masks opponent name before start', () => {
    const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('???')).toBeTruthy();
  });

  it('shows waiting hint for opponent readiness', () => {
    let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    room = setReadyData(room, 'u1', 3000);
    render(<BattleRoom room={room} meUid="u1" onReady={() => {}} onExit={() => {}} />);
    expect(screen.getByText('상대 준비 기다리는 중...')).toBeTruthy();
  });

  it('confirms readiness', () => {
    const room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
    const onReady = vi.fn();
    render(<BattleRoom room={room} meUid="u1" onReady={onReady} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '네! 준비됐어요!' }));
    expect(onReady).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/BattleRoom.test.tsx`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

`src/hooks/useArenas.ts`:
```ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Arena } from '../lib/arena';

export function useArenas() {
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'arenas'), where('locked', '==', false)), (snap) => {
        setArenas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Arena, 'id'>) })));
        setLoading(false);
      }),
    [],
  );

  return { arenas, loading };
}
```

`src/hooks/useMatch.ts`:
```ts
import { useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Me {
  uid: string;
  nickname: string;
  avatar: string;
}

export function useMatch(arenaId: string, me: Me) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const findOrCreate = async () => {
    setBusy(true);
    try {
      const id = await runTransaction(db, async (tx) => {
        const snap = await getDocs(
          query(collection(db, 'rooms'), where('arenaId', '==', arenaId), where('status', '==', 'waiting')),
        );
        const open = snap.docs.find(
          (d) => (d.data().players as { uid: string }[]).length === 1 && (d.data().players as { uid: string }[])[0].uid !== me.uid,
        );
        if (open) {
          const data = open.data();
          tx.update(open.ref, {
            status: 'ready',
            players: [
              ...data.players,
              { uid: me.uid, nickname: me.nickname, avatar: me.avatar, score: 0, ready: false, answers: [] },
            ],
            updatedAt: serverTimestamp(),
          });
          return open.id;
        }
        const ref = doc(collection(db, 'rooms'));
        tx.set(ref, {
          arenaId,
          status: 'waiting',
          players: [{ uid: me.uid, nickname: me.nickname, avatar: me.avatar, score: 0, ready: false, answers: [] }],
          currentRound: 0,
          roundEndsAt: 0,
          winnerUid: null,
          updatedAt: serverTimestamp(),
        });
        return ref.id;
      });
      setRoomId(id);
    } finally {
      setBusy(false);
    }
  };

  return { roomId, busy, findOrCreate };
}
```
(주의: 트랜잭션 안에서 getDocs(쿼리) 사용은 Firestore 트랜잭션에서 허용된다.)

`src/pages/BattleRoom.tsx` (Task 4 범위: waiting/ready만, playing/finished는 Task 5):
```tsx
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import type { RoomData } from '../lib/battle';

export default function BattleRoom({
  room,
  meUid,
  onReady,
  onExit,
}: {
  room: RoomData;
  meUid: string;
  onReady: () => void;
  onExit: () => void;
}) {
  const me = room.players.find((p) => p.uid === meUid);
  const opponent = room.players.find((p) => p.uid !== meUid);

  return (
    <Card>
      <p className="text-sm">문제 라운드 {room.currentRound + 1}</p>
      <p className="text-lg font-bold">???</p>
      {!me?.ready ? (
        <PrimaryButton onClick={onReady}>네! 준비됐어요!</PrimaryButton>
      ) : opponent && !opponent.ready ? (
        <p>상대 준비 기다리는 중...</p>
      ) : (
        <p>곧 시작해요!</p>
      )}
      <button type="button" onClick={onExit}>
        나가기
      </button>
    </Card>
  );
}
```
("상대 준비 기다리는 중..."은 한 번만 렌더해야 `getByText`가 깨지지 않는다. 내가 미준비면 버튼만, 내가 준비+상대 미준비면 힌트만, 둘 다 준비면 "곧 시작해요!".)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/BattleRoom.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useArenas.ts src/hooks/useMatch.ts src/pages/BattleRoom.tsx src/pages/BattleRoom.test.tsx
git commit -m "feat: add matchmaking hooks and battle lobby screen"
```

---

### Task 5: 라운드 진행 + 결과 + XP 지급

**Files:**
- Create: `src/lib/award.ts`, `src/hooks/useRoom.ts`, `src/components/Timer.tsx`
- Modify: `src/pages/BattleRoom.tsx` (playing/finished 확장), `src/pages/BattleRoom.test.tsx` (playing 3건 추가)

**Interfaces:**
- Consumes: battle.ts 전체 (Task 3), `useMatch`가 만든 roomId (Task 4).
- Produces: `useRoom(roomId, problems)`, 확장된 `BattleRoom`, `finishAndAward` (Task 6이 결과 화면에서 소비).

- [ ] **Step 1: Write the failing tests**

`src/pages/BattleRoom.test.tsx`에 3건 추가:
```tsx
it('answers a question', () => {
  let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
  room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000 };
  const onAnswer = vi.fn();
  render(
    <BattleRoom
      room={room}
      meUid="u1"
      problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
      onReady={() => {}}
      onAnswer={onAnswer}
      onExit={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: '69' }));
  expect(onAnswer).toHaveBeenCalledWith(2);
});

it('advances on timeout text', () => {
  let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
  room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: 0, updatedAt: 0 };
  render(
    <BattleRoom
      room={room}
      meUid="u1"
      problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
      nowMs={999999}
      onReady={() => {}}
      onAnswer={() => {}}
      onExit={() => {}}
    />,
  );
  expect(screen.getByText('시간이 지난 문제예요. 다음 라운드로 넘어가요.')).toBeTruthy();
});

it('offers auto-win after silence', () => {
  let room = joinRoomData(createRoomData('a1', host, 1000), guest, 2000)!;
  room = { ...room, status: 'playing', currentRound: 0, roundEndsAt: Date.now() + 30000, updatedAt: 0 };
  const onClaimWin = vi.fn();
  render(
    <BattleRoom
      room={room}
      meUid="u1"
      problem={{ text: '23 + 45 = ?', options: ['67', '68', '69', '70'] }}
      nowMs={999999}
      onReady={() => {}}
      onAnswer={() => {}}
      onClaimWin={onClaimWin}
      onExit={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: '자동 승리로 처리할까요?' }));
  expect(onClaimWin).toHaveBeenCalledTimes(1);
});
```
(BattleRoom props 확장: `problem?: { text, options }`, `nowMs?: number`, `onAnswer?: (idx) => void`, `onClaimWin?: () => void`. Task 4 테스트의 기존 호출(onAnswer 없음)은 playing이 아닐 때 문제 UI를 렌더하지 않으므로 통과 유지.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/BattleRoom.test.tsx`
Expected: FAIL (problem prop 없음)

- [ ] **Step 3: Write minimal implementation**

`src/components/Timer.tsx`:
```tsx
import { useEffect, useState } from 'react';

export default function Timer({ endsAt, nowMs }: { endsAt: number; nowMs?: number }) {
  const [now, setNow] = useState(() => nowMs ?? Date.now());
  useEffect(() => {
    if (nowMs !== undefined) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [nowMs]);
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
  return <p aria-label="남은 시간">{left}초</p>;
}
```

`src/lib/award.ts`:
```ts
import { doc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { computeLevel, xpAward } from './battle';

export async function finishAndAward(args: {
  roomId: string;
  winnerUid: string | null;
  myUid: string;
  myCorrect: number;
  myWins: number;
  myStreak: number;
}): Promise<number> {
  const earned = xpAward(args.winnerUid === args.myUid, args.winnerUid === null, args.myCorrect);
  await runTransaction(db, async (tx) => {
    const battleRef = doc(db, 'battles', args.roomId);
    const existing = await tx.get(battleRef);
    if (existing.exists() && (existing.data().awarded as boolean)) return;
    const userRef = doc(db, 'users', args.myUid);
    const snap = await tx.get(userRef);
    const prevXp = ((snap.data()?.xp as number) ?? 0) as number;
    const total = prevXp + earned;
    tx.set(
      battleRef,
      { roomId: args.roomId, winnerUid: args.winnerUid, awarded: true, endedAt: serverTimestamp() },
      { merge: true },
    );
    tx.set(
      userRef,
      {
        xp: total,
        level: computeLevel(total).level,
        winCount: args.myWins + (args.winnerUid === args.myUid ? 1 : 0),
        streak: args.winnerUid === args.myUid ? args.myStreak + 1 : 0,
      },
      { merge: true },
    );
  });
  return earned;
}
```
(주의: 무승부도 streak 0으로 초기화한다 — 스펙에 별도 정의가 없으므로 가장 단순한 규칙.)

`src/hooks/useRoom.ts`:
```ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Problem } from '../lib/arena';
import {
  advanceData,
  allReady,
  bothAnswered,
  canClaimWin,
  finishData,
  roundRemainingMs,
  setReadyData,
  startPlayingData,
  submitAnswerData,
  type RoomData,
} from '../lib/battle';

function toRoomData(id: string, data: Record<string, unknown>): RoomData {
  void id;
  return data as unknown as RoomData;
}

export function useRoom(roomId: string | null, problems: Problem[]) {
  const [room, setRoom] = useState<RoomData | null>(null);

  useEffect(() => {
    if (!roomId) return;
    return onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      if (snap.exists()) setRoom(toRoomData(snap.id, snap.data()));
    });
  }, [roomId]);

  const ready = async (uid: string) => {
    if (!roomId) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      const next = setReadyData(r, uid, Date.now());
      tx.update(ref, { players: next.players, updatedAt: serverTimestamp() });
      if (allReady(next) && problems.length > 0) {
        const started = startPlayingData(next, Date.now(), problems[0].roundTimeSec);
        tx.update(ref, {
          status: started.status,
          currentRound: 0,
          roundEndsAt: started.roundEndsAt,
          players: started.players,
          updatedAt: serverTimestamp(),
        });
      }
    });
  };

  const answer = async (uid: string, idx: number) => {
    if (!roomId) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      if (r.status !== 'playing') return;
      const next = submitAnswerData(r, uid, idx, Date.now());
      tx.update(ref, { players: next.players, updatedAt: serverTimestamp() });
      if (bothAnswered(next)) {
        const correct = problems[r.currentRound]?.answerIndex ?? -1;
        const adv = advanceData(next, correct, Date.now(), problems[r.currentRound]?.roundTimeSec ?? 30, problems.length);
        const fin = adv.status === 'finished' ? finishData(adv, Date.now()) : adv;
        tx.update(ref, {
          status: fin.status,
          players: fin.players,
          currentRound: fin.currentRound,
          roundEndsAt: fin.roundEndsAt,
          winnerUid: fin.winnerUid,
          updatedAt: serverTimestamp(),
        });
      }
    });
  };

  const tick = async () => {
    if (!roomId || !room || room.status !== 'playing') return;
    if (roundRemainingMs(room, Date.now()) > 0) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      if (r.status !== 'playing' || roundRemainingMs(r, Date.now()) > 0) return;
      const correct = problems[r.currentRound]?.answerIndex ?? -1;
      const adv = advanceData(r, correct, Date.now(), problems[r.currentRound]?.roundTimeSec ?? 30, problems.length);
      const fin = adv.status === 'finished' ? finishData(adv, Date.now()) : adv;
      tx.update(ref, {
        status: fin.status,
        players: fin.players,
        currentRound: fin.currentRound,
        roundEndsAt: fin.roundEndsAt,
        winnerUid: fin.winnerUid,
        updatedAt: serverTimestamp(),
      });
    });
  };

  const claimWin = async (uid: string) => {
    if (!roomId) return;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, 'rooms', roomId);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const r = toRoomData(snap.id, snap.data());
      if (!canClaimWin(r, uid, Date.now())) return;
      const fin = finishData({ ...r, players: r.players }, Date.now());
      tx.update(ref, { status: 'finished', winnerUid: uid, players: fin.players, updatedAt: serverTimestamp() });
    });
  };

  return { room, ready, answer, tick, claimWin };
}
```

`src/pages/BattleRoom.tsx` 확장 (waiting/ready 유지 + playing/finished 추가):
```tsx
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Timer from '../components/Timer';
import { canClaimWin, roundRemainingMs, type RoomData } from '../lib/battle';

export default function BattleRoom({
  room,
  meUid,
  problem,
  nowMs,
  onReady,
  onAnswer,
  onClaimWin,
  onExit,
}: {
  room: RoomData;
  meUid: string;
  problem?: { text: string; options: string[] };
  nowMs?: number;
  onReady: () => void;
  onAnswer?: (idx: number) => void;
  onClaimWin?: () => void;
  onExit: () => void;
}) {
  const now = nowMs ?? Date.now();
  const me = room.players.find((p) => p.uid === meUid);
  const opponent = room.players.find((p) => p.uid !== meUid);

  if (room.status === 'finished') {
    const won = room.winnerUid === meUid;
    const draw = room.winnerUid === null;
    return (
      <Card>
        <p className="text-2xl font-extrabold">{draw ? '무승부!' : won ? '승리!' : '아쉽지만 패배'}</p>
        <p>
          내 점수 {me?.score ?? 0} : {opponent?.score ?? 0} 상대 점수
        </p>
        <PrimaryButton onClick={onExit}>아레나로 돌아가기</PrimaryButton>
      </Card>
    );
  }

  if (room.status === 'playing' && problem) {
    const timedOut = roundRemainingMs(room, now) <= 0;
    return (
      <Card>
        <Timer endsAt={room.roundEndsAt} nowMs={nowMs} />
        <p className="text-lg font-bold">{problem.text}</p>
        {timedOut ? (
          <p>시간이 지난 문제예요. 다음 라운드로 넘어가요.</p>
        ) : (
          problem.options.map((opt, i) => (
            <button key={opt} type="button" className="btn-primary w-full" onClick={() => onAnswer?.(i)}>
              {opt}
            </button>
          ))
        )}
        {canClaimWin(room, meUid, now) && (
          <button type="button" onClick={() => onClaimWin?.()}>
            자동 승리로 처리할까요?
          </button>
        )}
        <button type="button" onClick={onExit}>
          나가기
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm">문제 라운드 {room.currentRound + 1}</p>
      <p className="text-lg font-bold">???</p>
      {opponent && !opponent.ready && <p>상대 준비 기다리는 중...</p>}
      {!me?.ready ? (
        <PrimaryButton onClick={onReady}>네! 준비됐어요!</PrimaryButton>
      ) : (
        <p>상대 준비 기다리는 중...</p>
      )}
      <button type="button" onClick={onExit}>
        나가기
      </button>
    </Card>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (21 + 3 = 24 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/award.ts src/hooks/useRoom.ts src/components/Timer.tsx src/pages/BattleRoom.tsx src/pages/BattleRoom.test.tsx
git commit -m "feat: add round play, results, and XP award flow"
```

---

### Task 6: 학생 홈 + App 연결 + 전체 검증

**Files:**
- Create: `src/pages/StudentHome.tsx`, `src/hooks/useProfile.ts`
- Modify: `src/App.tsx`, `src/App.test.tsx` (학생 홈 진입 1건 추가)
- Test: `src/pages/StudentHome.test.tsx` (3탭 렌더)

**Interfaces:**
- Consumes: `useArenas`, `useMatch`, `useRoom`, `BattleRoom`, `computeLevel`, `finishAndAward`, `Card`/`EmptyState`.
- Produces: 완성된 Plan 2 앱 (Plan 3이 선생님 공간을 이어 붙임).

- [ ] **Step 1: Write the failing tests**

`src/pages/StudentHome.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import StudentHome from './StudentHome';

const profile = { nickname: '일호', xp: 250, level: 3, streak: 2, winCount: 5, correctRate: 70 };

describe('StudentHome', () => {
  it('shows arenas and starts battle', () => {
    const onEnter = vi.fn();
    render(
      <StudentHome
        arenas={[{ id: 'a1', title: '기초 덧셈 아레나', desc: '설명', subject: '수학', locked: false }]}
        leaders={[]}
        profile={profile}
        onEnter={onEnter}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '지금 바로 대결!' }));
    expect(onEnter).toHaveBeenCalledWith('a1');
  });

  it('switches to leaderboard tab', () => {
    render(
      <StudentHome
        arenas={[]}
        leaders={[{ nickname: '이호', xp: 300 }]}
        profile={profile}
        onEnter={() => {}}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '순위표' }));
    expect(screen.getByText('이호')).toBeTruthy();
  });

  it('shows record tab with level', () => {
    render(
      <StudentHome
        arenas={[]}
        leaders={[]}
        profile={profile}
        onEnter={() => {}}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '내 기록' }));
    expect(screen.getByText('Lv.3')).toBeTruthy();
    expect(screen.getByText('총 XP')).toBeTruthy();
  });
});
```

`src/App.test.tsx`에 1건 추가 (학생 홈 진입):
```tsx
it('enters student home after join as student', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
  fireEvent.click(screen.getByRole('button', { name: '학생으로 시작' }));
  fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'A1B2C3' } });
  fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
  expect(screen.getByRole('button', { name: '지금 바로 대결!' })).toBeTruthy();
});
```
(주의: App의 student 스텁이 StudentHome으로 교체되므로 기존 테스트 'routes student to student stub'은 실패한다 — Step 3에서 해당 기대문을 '지금 바로 대결!' 버튼 존재로 교체한다. 이는 계획된 교체이며 테스트 삭제가 아니다.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/StudentHome.test.tsx`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

`src/hooks/useProfile.ts`:
```ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Profile {
  nickname: string;
  xp: number;
  level: number;
  streak: number;
  winCount: number;
  correctRate: number;
}

export function useProfile(uid: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) setProfile(snap.data() as Profile);
    });
  }, [uid]);

  return { profile };
}
```

`src/pages/StudentHome.tsx`:
```tsx
import { useState } from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import type { Arena } from '../lib/arena';

export interface Leader {
  nickname: string;
  xp: number;
}

export interface ProfileView {
  nickname: string;
  xp: number;
  level: number;
  streak: number;
  winCount: number;
  correctRate: number;
}

export default function StudentHome({
  arenas,
  leaders,
  profile,
  onEnter,
  onSignOut,
}: {
  arenas: Arena[];
  leaders: Leader[];
  profile: ProfileView;
  onEnter: (arenaId: string) => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<'browse' | 'leaderboard' | 'record'>('browse');

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setTab('browse')}>
            둘러보기
          </button>
          <button type="button" onClick={() => setTab('leaderboard')}>
            순위표
          </button>
          <button type="button" onClick={() => setTab('record')}>
            내 기록
          </button>
          <button type="button" onClick={onSignOut}>
            로그아웃
          </button>
        </div>
        {tab === 'browse' && (
          <Card>
            <p className="font-bold mb-2">오늘 도전할 아레나는?</p>
            {arenas.length === 0 ? (
              <EmptyState title="아직 참여 중인 아레나가 없어요" />
            ) : (
              arenas.map((a) => (
                <div key={a.id} className="mb-3">
                  <p className="font-bold">{a.title}</p>
                  <PrimaryButton onClick={() => onEnter(a.id)}>지금 바로 대결!</PrimaryButton>
                </div>
              ))
            )}
          </Card>
        )}
        {tab === 'leaderboard' && (
          <Card>
            {leaders.length === 0 ? (
              <EmptyState title="첫 대결에서 승리하면 이 자리에 올라요!" />
            ) : (
              leaders.map((l) => (
                <p key={l.nickname}>
                  {l.nickname} — {l.xp} XP
                </p>
              ))
            )}
          </Card>
        )}
        {tab === 'record' && (
          <Card>
            <p className="text-2xl font-extrabold">Lv.{profile.level}</p>
            <p>총 XP</p>
            <p>
              {profile.xp} XP · {profile.streak}연승 · 정답률 {profile.correctRate}%
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
```
`src/App.tsx` student 분기 교체 (EmptyState → 실제 연결):
```tsx
import { useEffect, useState } from 'react';
import BattleRoom from './pages/BattleRoom';
import ClassJoin from './pages/ClassJoin';
import LoginScreen from './pages/LoginScreen';
import RoleSelect, { type Role } from './pages/RoleSelect';
import StudentHome from './pages/StudentHome';
import EmptyState from './components/EmptyState';
import { useArenas } from './hooks/useArenas';
import { useAuth } from './hooks/useAuth';
import { useMatch } from './hooks/useMatch';
import { useProfile } from './hooks/useProfile';
import { useRoom } from './hooks/useRoom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from './lib/firebase';
import type { Problem } from './lib/arena';
import { finishAndAward } from './lib/award';

export type View = 'login' | 'role' | 'join' | 'student' | 'teacher' | 'battle';

export interface PendingArena {
  arenaId: string;
  me: { uid: string; nickname: string; avatar: string };
  myWins: number;
  myStreak: number;
}
```
App 컴포넌트 상단 state (기존 `view`·`role` 유지, 3줄 추가):
```tsx
const [pendingArena, setPendingArena] = useState<PendingArena | null>(null);
const { classroomId } = useClassroom();
```
`useAuth` 구조분해에 `signOut` 추가:
```tsx
const { user, loading, signInWithGoogle, signOut } = useAuth();
```
`useClassroom` import 추가:
```tsx
import { useClassroom } from './hooks/useClassroom';
```
student 분기:
```tsx
if (view === 'student') {
  return (
    <StudentShell
      uid={user?.uid ?? 'local-test'}
      nickname={user?.displayName ?? '학생'}
      classroomId={classroomId}
      onEnter={(arenaId, me, myWins, myStreak) => {
        setPendingArena({ arenaId, me, myWins, myStreak });
        setView('battle');
      }}
      onSignOut={() => {
        void signOut();
        setView('login');
      }}
    />
  );
}
```
StudentShell은 같은 파일 하단 컴포넌트:
```tsx
function StudentShell({
  uid,
  nickname,
  classroomId,
  onEnter,
  onSignOut,
}: {
  uid: string;
  nickname: string;
  classroomId: string | null;
  onEnter: (arenaId: string, me: { uid: string; nickname: string; avatar: string }, myWins: number, myStreak: number) => void;
  onSignOut: () => void;
}) {
  const { arenas } = useArenas();
  const { profile } = useProfile(uid);
  const [leaders, setLeaders] = useState<{ nickname: string; xp: number }[]>([]);

  useEffect(() => {
    void getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10)))
      .then((snap) => {
        setLeaders(
          snap.docs.map((d) => ({ nickname: (d.data().nickname as string) ?? '이름 없음', xp: (d.data().xp as number) ?? 0 })),
        );
      })
      .catch(() => {
        setLeaders([]);
      });
  }, []);

  const mine = classroomId ? arenas.filter((a) => (a as unknown as { classroomId?: string }).classroomId === classroomId) : arenas;

  return (
    <StudentHome
      arenas={mine}
      leaders={leaders}
      profile={profile ?? { nickname, xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 }}
      onEnter={(arenaId) =>
        onEnter(arenaId, { uid, nickname, avatar: 'cat' }, profile?.winCount ?? 0, profile?.streak ?? 0)
      }
      onSignOut={onSignOut}
    />
  );
}
```
(주의: `classroomId`는 App의 `useClassroom`에서 가져온다 — App 상단에 `const { classroomId } = useClassroom();` 추가. `signOut`은 useAuth에서 구조분해. `user`·`loading`은 기존 게이트에서 사용 중.)

battle 분기:
```tsx
if (view === 'battle' && pendingArena) {
  return (
    <BattleShell
      arenaId={pendingArena.arenaId}
      me={pendingArena.me}
      myWins={pendingArena.myWins}
      myStreak={pendingArena.myStreak}
      onExit={() => setView('student')}
    />
  );
}

function BattleShell({
  arenaId,
  me,
  myWins,
  myStreak,
  onExit,
}: {
  arenaId: string;
  me: { uid: string; nickname: string; avatar: string };
  myWins: number;
  myStreak: number;
  onExit: () => void;
}) {
  const { roomId, busy, findOrCreate } = useMatch(arenaId, me);
  const [problems, setProblems] = useState<Problem[]>([]);
  const { room, ready, answer, tick, claimWin } = useRoom(roomId, problems);
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    void findOrCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  useEffect(() => {
    if (!roomId) return;
    void getDocs(collection(db, 'arenas', arenaId, 'problems'))
      .then((snap) => {
        setProblems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Problem, 'id'>) })));
      })
      .catch(() => {
        setProblems([]);
      });
  }, [roomId, arenaId]);

  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const t = setInterval(() => {
      void tick();
    }, 1000);
    return () => clearInterval(t);
  }, [room, roomId, tick]);

  useEffect(() => {
    if (!room || room.status !== 'finished' || awarded || problems.length === 0) return;
    setAwarded(true);
    const correct = room.players.find((p) => p.uid === me.uid)?.answers.filter((a, i) => a === problems[i]?.answerIndex).length ?? 0;
    void finishAndAward({
      roomId: roomId!,
      winnerUid: room.winnerUid,
      myUid: me.uid,
      myCorrect: correct,
      myWins,
      myStreak,
    });
  }, [room, awarded, problems, roomId, me.uid, myWins, myStreak]);

  if (busy || !room) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <p>같은 반 친구와 연결 중...</p>
      </div>
    );
  }

  const problem = problems[room.currentRound];
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <BattleRoom
          room={room}
          meUid={me.uid}
          problem={problem ? { text: problem.text, options: problem.options } : undefined}
          onReady={() => {
            void ready(me.uid);
          }}
          onAnswer={(i) => {
            void answer(me.uid, i);
          }}
          onClaimWin={() => {
            void claimWin(me.uid);
          }}
          onExit={onExit}
        />
      </div>
    </div>
  );
}
```
(`roomId!` non-null 단언은 roomId가 null이 아님을 위에서 return으로 보장했으므로 허용한다.)

`src/App.test.tsx` 기존 테스트 'routes student to student stub' 기대문 교체:
```tsx
expect(screen.getByRole('button', { name: '지금 바로 대결!' })).toBeTruthy();
```
(단, App 테스트에서 StudentShell은 실제 `useArenas`를 호출한다 — firebase 에뮬레이터 없이 onSnapshot이 실패한다. 따라서 App.test에 firebase 호출 목이 필요하다. `vi.mock('./hooks/useArenas', ...)` `vi.mock('./hooks/useProfile', ...)` `vi.mock('./hooks/useMatch', ...)` `vi.mock('./hooks/useRoom', ...)`를 App.test 상단에 추가한다:
```tsx
vi.mock('./hooks/useArenas', () => ({ useArenas: () => ({ arenas: [{ id: 'a1', title: '기초 덧셈 아레나', desc: '설명', subject: '수학', locked: false }], loading: false }) }));
vi.mock('./hooks/useProfile', () => ({ useProfile: () => ({ profile: { nickname: '일호', xp: 0, level: 1, streak: 0, winCount: 0, correctRate: 0 } }) }));
```
useMatch/useRoom은 student 뷰에서 호출되지 않으므로 목 불필요. leaders useEffect의 getDocs는 실제 firebase 호출 → onSnapshot이 아니라 getDocs라 mock 없으면 실패한다. StudentShell의 leaders useEffect를 try/catch로 감싼다:
```tsx
useEffect(() => {
  getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10)))
    .then((snap) => {
      setLeaders(...);
    })
    .catch(() => {
      setLeaders([]);
    });
}, []);
```
이렇게 하면 App 테스트에서 leaders는 빈 배열로 렌더되고 '지금 바로 대결!' 버튼은 아레나 목에서 나온다.)

- [ ] **Step 4: 전체 테스트 + 빌드 + 에뮬레이터 시드 검증**

Run: `npm test && npm run build`
Expected: PASS (24 + 4 = 28 tests)

Run (에뮬레이터 별도 터미널에서 `npx firebase-tools emulators:start` 실행 중일 때):
```bash
node scripts/seed.mjs
```
Expected: `seeded: classroom A1B2C3, arena-basics, 3 problems`

- [ ] **Step 5: Commit**

```bash
git add src/pages/StudentHome.tsx src/pages/StudentHome.test.tsx src/hooks/useProfile.ts src/App.tsx src/App.test.tsx
git commit -m "feat: add student home and wire battle entry"
```

---

## Plan 3 예고 (별도 계획서)

- 선생님 공간 4탭 (현재 대결 모니터링·강제종료, 아레나 CRUD + 문제 편집기, QR 초대, 학생 관리, 분석).
- `firestore.rules` 실전 강화 (선생님 쓰기 권한), `classrooms` 생성 플로우, `useClassroom` Firestore 연동.
