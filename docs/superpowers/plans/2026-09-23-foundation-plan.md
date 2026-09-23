# Foundation Implementation Plan (Plan 1/3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 재해석 디자인 기반 앱 껍데기 + 구글 로그인 + 역할 선택 + 학급 입장까지 에뮬레이터上で 동작하게 만든다.

**Architecture:** Vite + React + TypeScript SPA 1개. 라우터 없이 `View` 상태로 화면을 전환한다. Firebase Auth/Firestore는 에뮬레이터 우선으로 연결하고, 실프로젝트 연결은 명시된 수동 1단계로만 처리한다.

**Tech Stack:** Node 20+, Vite ^7, React ^19, TypeScript ~5.8, Tailwind CSS ^4 (+ @tailwindcss/vite), Firebase JS SDK ^12, Vitest ^3 + @testing-library/react ^16 + jsdom, firebase-tools (에뮬레이터)

**Spec:** `docs/superpowers/specs/2026-09-23-battle-study-ground-design.md`

## Global Constraints

- 금지어 사용 금지: BattleStudyGround, 배틀필드, 전투, charlogo.png, logo.png 원본 에셋 사용 금지.
- 대체어 고정: 아레나, 대결, 문제 라운드.
- 로그인 버튼 문구 고정: "Google 계정으로 시작하기". 안내 문구 고정: "학교 계정으로 안전하게 시작하세요".
- 타이틀 문구 고정: "선생님 문제로 친구와 1:1 퀴즈 대결!".
- 색 고정: paper #FAF6EC, ink #26211A, primary navy #2545A0, 모서리 16px, 버튼 섀도우 3px.
- 1단계 Cloud Functions 금지. 실프로젝트 연결 전에는 에뮬레이터로만 동작.
- 매 작업 TDD 순서 준수 (실패 테스트 → 최소 구현 → 통과 확인 → 커밋).

---

## File Structure

- `package.json` — 의존성·스크립트 (dev/build/test). 신규 생성.
- `vite.config.ts` — react + tailwindcss 플러그인, vitest jsdom 환경. 신규 생성.
- `tsconfig.json` — strict. 신규 생성.
- `index.html` — 타이틀 "퀴즈 아레나", 폰트 링크, notranslate 메타. 신규 생성.
- `src/main.tsx` — 진입점. 신규 생성.
- `src/index.css` — tailwind v4 `@theme` 토큰 + `.card-ink`·`.btn-primary` 클래스. 신규 생성.
- `src/lib/firebase.ts` — `auth`, `db` export. 에뮬레이터 분기 포함. 신규 생성.
- `src/lib/classroom.ts` — `normalizeInviteCode(code: string): string` export. 신규 생성.
- `src/hooks/useAuth.ts` — `useAuth()` export. 신규 생성.
- `src/hooks/useClassroom.ts` — `useClassroom()` export. 신규 생성.
- `src/components/Card.tsx`, `PrimaryButton.tsx`, `Avatar.tsx`, `EmptyState.tsx` — 신규 생성.
- `src/pages/LoginScreen.tsx`, `RoleSelect.tsx`, `ClassJoin.tsx` — 신규 생성.
- `src/App.tsx` — `View` 타입 + 화면 전환. 신규 생성.
- `firebase.json`, `firestore.rules`, `.env.example` — 신규 생성.
- `src/components/*.test.tsx`, `src/lib/*.test.ts`, `src/hooks/*.test.tsx`, `src/App.test.tsx` — 테스트. 신규 생성.

---

### Task 1: 프로젝트 스캐폴드 + Tailwind 테마 기반

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/index.css`

**Interfaces:**
- Consumes: 없음.
- Produces: `npm run build` 성공, `src/index.css`의 `.card-ink`·`.btn-primary` 클래스 (Task 2가 사용).

- [ ] **Step 1: 설정 파일 작성**

`package.json`:
```json
{
  "name": "quiz-arena-clone",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "firebase": "^12.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/react": "^16.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^25.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.8.3",
    "vite": "^7.0.0",
    "vitest": "^3.0.0"
  }
}
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: 'jsdom' },
});
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

`index.html`:
```html
<!doctype html>
<html lang="ko" translate="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="google" content="notranslate" />
    <title>퀴즈 아레나</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@500;700&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-paper: #faf6ec;
  --color-ink: #26211a;
  --color-primary: #2545a0;
  --font-sans: "Pretendard Variable", Pretendard, ui-sans-serif, system-ui, sans-serif;
}

body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.card-ink {
  background: #fffdf6;
  border: 2px solid #26211a;
  border-radius: 16px;
  box-shadow: #26211a 0px 6px 0px, rgba(38, 33, 26, 0.15) 0px 20px 50px;
}

.btn-primary {
  background: #2545a0;
  color: #fff;
  border: 2px solid #26211a;
  border-radius: 16px;
  box-shadow: #26211a 0px 3px 0px;
  height: 52px;
  font-weight: 700;
  font-size: 16px;
}
```

- [ ] **Step 2: 임시 App 작성 (빌드용)**

`src/App.tsx`:
```tsx
export default function App() {
  return <div>퀴즈 아레나</div>;
}
```

- [ ] **Step 3: 설치 후 빌드 확인**

Run: `npm install && npm run build`
Expected: PASS (dist 생성, 타입 에러 없음)

- [ ] **Step 4: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src/main.tsx src/index.css src/App.tsx
git commit -m "feat: scaffold vite react-ts app with reinterpreted theme"
```

---

### Task 2: 디자인 시스템 컴포넌트 (Card, PrimaryButton, Avatar, EmptyState)

**Files:**
- Create: `src/components/Card.tsx`, `src/components/PrimaryButton.tsx`, `src/components/Avatar.tsx`, `src/components/EmptyState.tsx`
- Test: `src/components/DesignSystem.test.tsx`

**Interfaces:**
- Consumes: `src/index.css`의 `.card-ink`·`.btn-primary`.
- Produces: `Card({children})`, `PrimaryButton({children, onClick})`, `Avatar({animal, size?})`, `EmptyState({title, actionLabel?, onAction?})`, `Animal` 타입 (Task 4·5가 사용).

- [ ] **Step 1: Write the failing test**

`src/components/DesignSystem.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Card from './Card';
import PrimaryButton from './PrimaryButton';
import Avatar from './Avatar';
import EmptyState from './EmptyState';

describe('design system', () => {
  it('renders card content', () => {
    render(<Card>내용</Card>);
    expect(screen.getByText('내용')).toBeTruthy();
  });

  it('calls onClick when primary button pressed', () => {
    const onClick = vi.fn();
    render(<PrimaryButton onClick={onClick}>시작</PrimaryButton>);
    fireEvent.click(screen.getByRole('button', { name: '시작' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('maps each animal to its emoji', () => {
    const { rerender } = render(<Avatar animal="cat" />);
    expect(screen.getByText('🐱')).toBeTruthy();
    rerender(<Avatar animal="turtle" />);
    expect(screen.getByText('🐢')).toBeTruthy();
  });

  it('renders empty state with action', () => {
    const onAction = vi.fn();
    render(<EmptyState title="아직 없어요" actionLabel="만들기" onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: '만들기' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/DesignSystem.test.tsx`
Expected: FAIL with "Failed to resolve import" (컴포넌트 없음)

- [ ] **Step 3: Write minimal implementation**

`src/components/Card.tsx`:
```tsx
import type { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }) {
  return <div className="card-ink px-9 py-10">{children}</div>;
}
```

`src/components/PrimaryButton.tsx`:
```tsx
import type { ReactNode } from 'react';

export default function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className="btn-primary w-full" onClick={onClick}>
      {children}
    </button>
  );
}
```

`src/components/Avatar.tsx`:
```tsx
export type Animal = 'cat' | 'dog' | 'tiger' | 'frog' | 'unicorn' | 'dragon' | 'turtle';

const EMOJI: Record<Animal, string> = {
  cat: '🐱',
  dog: '🐶',
  tiger: '🐯',
  frog: '🐸',
  unicorn: '🦄',
  dragon: '🐲',
  turtle: '🐢',
};

export default function Avatar({ animal, size = 56 }: { animal: Animal; size?: number }) {
  return (
    <span
      role="img"
      aria-label={animal}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#E4E9F7',
        border: '2px solid #26211A',
        fontSize: size * 0.55,
      }}
    >
      {EMOJI[animal]}
    </span>
  );
}
```

`src/components/EmptyState.tsx`:
```tsx
export default function EmptyState({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-10">
      <p className="mb-4">{title}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn-primary px-6" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/DesignSystem.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add reinterpreted design system components"
```

---

### Task 3: Firebase 연결 + 구글 인증 훅

**Files:**
- Create: `src/lib/firebase.ts`, `src/hooks/useAuth.ts`, `firebase.json`, `firestore.rules`, `.env.example`
- Test: `src/hooks/useAuth.test.tsx`

**Interfaces:**
- Consumes: 없음.
- Produces: `auth`, `db`, `useAuth() → { user, loading, signInWithGoogle, signOut }` (Task 5가 사용).

- [ ] **Step 1: Write the failing test**

`src/hooks/useAuth.test.tsx`:
```tsx
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const signInMock = vi.fn().mockResolvedValue(undefined);
const signOutMock = vi.fn().mockResolvedValue(undefined);

vi.mock('firebase/auth', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...mod,
    signInWithPopup: signInMock,
    signOut: signOutMock,
    GoogleAuthProvider: class {},
    onAuthStateChanged: (_auth: unknown, cb: (u: null) => void) => {
      cb(null);
      return () => {};
    },
  };
});

vi.mock('../lib/firebase', () => ({ auth: {} }));

import { useAuth } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts signed out', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('delegates google sign-in to firebase', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(signInMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useAuth.test.tsx`
Expected: FAIL with "Failed to resolve import" (`./useAuth` 없음)

- [ ] **Step 3: Write minimal implementation**

`.env.example`:
```
VITE_USE_EMULATOR=true
```

`src/lib/firebase.ts`:
```ts
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'demo-key',
  authDomain: 'demo.local',
  projectId: 'demo-quiz-arena',
});

export const auth = getAuth(app);
export const db = getFirestore(app);

if (import.meta.env.VITE_USE_EMULATOR !== 'false') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
```

`src/hooks/useAuth.ts`:
```ts
import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setLoading(false);
  }), []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return { user, loading, signInWithGoogle, signOut };
}
```

`firebase.json`:
```json
{
  "hosting": { "public": "dist", "ignore": ["firebase.json", "**/.*", "**/node_modules/**"] },
  "firestore": { "rules": "firestore.rules" },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "ui": { "enabled": true }
  }
}
```

`firestore.rules`:
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
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useAuth.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 실프로젝트 연결 (수동 1회, 에뮬레이터 이후)**

Run: `npx firebase-tools use --add` 후 `.env`에 `VITE_USE_EMULATOR=false`와 실프로젝트 `VITE_FIREBASE_*` 값을 넣는다. 이 단계에서는 실행만 하고 코드 변경이 없으면 커밋하지 않는다.

- [ ] **Step 6: Commit**

```bash
git add src/lib/firebase.ts src/hooks/useAuth.ts src/hooks/useAuth.test.tsx firebase.json firestore.rules .env.example
git commit -m "feat: add firebase emulator-first auth hook"
```

---

### Task 4: 역할 선택 + 학급 입장

**Files:**
- Create: `src/lib/classroom.ts`, `src/hooks/useClassroom.ts`, `src/pages/RoleSelect.tsx`, `src/pages/ClassJoin.tsx`
- Test: `src/lib/classroom.test.ts`, `src/pages/JoinFlow.test.tsx`

**Interfaces:**
- Consumes: `Card`, `PrimaryButton` (Task 2).
- Produces: `normalizeInviteCode(code) → string`, `RoleSelect({onSelect})`, `ClassJoin({onJoin})` (Task 5가 사용).

- [ ] **Step 1: Write the failing tests**

`src/lib/classroom.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { normalizeInviteCode } from './classroom';

describe('normalizeInviteCode', () => {
  it('trims and uppercases', () => {
    expect(normalizeInviteCode('  ab12cd ')).toBe('AB12CD');
  });

  it('removes inner spaces and dashes', () => {
    expect(normalizeInviteCode('AB-12 CD')).toBe('AB12CD');
  });
});
```

`src/pages/JoinFlow.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RoleSelect from './RoleSelect';
import ClassJoin from './ClassJoin';

describe('join flow', () => {
  it('selects teacher role', () => {
    const onSelect = vi.fn();
    render(<RoleSelect onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: '선생님으로 시작' }));
    expect(onSelect).toHaveBeenCalledWith('teacher');
  });

  it('shows error for short invite code', () => {
    render(<ClassJoin onJoin={() => {}} />);
    fireEvent.change(screen.getByLabelText('초대 코드'), { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: '학급 들어가기' }));
    expect(screen.getByText('초대 코드 6자리를 확인해주세요')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/classroom.test.ts src/pages/JoinFlow.test.tsx`
Expected: FAIL with "Failed to resolve import"

- [ ] **Step 3: Write minimal implementation**

`src/lib/classroom.ts`:
```ts
export function normalizeInviteCode(code: string): string {
  return code.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidInviteCode(code: string): boolean {
  return normalizeInviteCode(code).length === 6;
}
```

`src/hooks/useClassroom.ts`:
```ts
import { useState } from 'react';
import { isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export function useClassroom() {
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const join = async (code: string) => {
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    setError(null);
    setClassroomId(normalizeInviteCode(code));
  };

  return { classroomId, join, error };
}
```

`src/pages/RoleSelect.tsx`:
```tsx
import Card from '../components/Card';

export type Role = 'teacher' | 'student';

export default function RoleSelect({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <Card>
      <h1>반가워요! 누구신가요?</h1>
      <p>한 번만 골라주면 끝!</p>
      <button type="button" className="btn-primary w-full" onClick={() => onSelect('teacher')}>
        선생님으로 시작
      </button>
      <button type="button" className="btn-primary w-full" onClick={() => onSelect('student')}>
        학생으로 시작
      </button>
    </Card>
  );
}
```

`src/pages/ClassJoin.tsx`:
```tsx
import { useState } from 'react';
import Card from '../components/Card';
import { isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export default function ClassJoin({ onJoin }: { onJoin: (code: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
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
      <label htmlFor="invite-code">초대 코드</label>
      <input
        id="invite-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="예: A1B2C3"
      />
      {error && <p role="alert">{error}</p>}
      <button type="button" className="btn-primary w-full" onClick={submit}>
        학급 들어가기
      </button>
    </Card>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/classroom.test.ts src/pages/JoinFlow.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/classroom.ts src/hooks/useClassroom.ts src/pages/RoleSelect.tsx src/pages/ClassJoin.tsx src/lib/classroom.test.ts src/pages/JoinFlow.test.tsx
git commit -m "feat: add role select and classroom join flow"
```

---

### Task 5: 앱 셸 + 로그인 화면 + 전체 검증

**Files:**
- Create: `src/pages/LoginScreen.tsx`
- Modify: `src/App.tsx` (Task 1 임시 내용 교체)
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `useAuth` (Task 3), `useClassroom` + `RoleSelect` + `ClassJoin` (Task 4), `Card` + `PrimaryButton` + `EmptyState` (Task 2).
- Produces: 동작하는 Plan 1 앱. `role` 상태는 Plan 2의 학생/선생님 분기에서 소비함.

- [ ] **Step 1: Write the failing test**

`src/App.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, signInWithGoogle: vi.fn(), signOut: vi.fn() }),
}));

import App from './App';

describe('App', () => {
  it('shows login first', () => {
    render(<App />);
    expect(screen.getByText('선생님 문제로 친구와 1:1 퀴즈 대결!')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Google 계정으로 시작하기' })).toBeTruthy();
  });

  it('moves to role select after login tap', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Google 계정으로 시작하기' }));
    expect(screen.getByText('반가워요! 누구신가요?')).toBeTruthy();
  });
});
```

참고: 2번째 테스트를 통과하려면 LoginScreen의 버튼이 목된 `signInWithGoogle`가 아니라 화면 전환을 직접 일으켜야 한다. 그래서 LoginScreen은 `onStart` prop을 받고, App이 `setView('role')`과 실제 `signInWithGoogle()`를 함께 호출하는 구조로 만든다 (Step 3 코드 참조).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL (LoginScreen·View 전환 없음)

- [ ] **Step 3: Write minimal implementation**

`src/pages/LoginScreen.tsx`:
```tsx
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <Card>
          <p className="text-5xl mb-3" aria-hidden="true">
            🛡️
          </p>
          <p className="text-4xl font-extrabold mb-5 tracking-tight">퀴즈 아레나</p>
          <p className="text-[15px] mb-7">
            선생님 문제로
            <br />
            <b>친구와 1:1 퀴즈 대결!</b>
          </p>
          <PrimaryButton onClick={onStart}>Google 계정으로 시작하기</PrimaryButton>
          <div className="mt-4 text-[11px]">학교 계정으로 안전하게 시작하세요</div>
        </Card>
      </div>
    </div>
  );
}
```

`src/App.tsx`:
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
  const { signInWithGoogle } = useAuth();

  if (view === 'login') {
    return (
      <LoginScreen
        onStart={() => {
          void signInWithGoogle().catch(() => {});
          setView('role');
        }}
      />
    );
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
          <ClassJoin onJoin={() => setView('student')} />
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

- [ ] **Step 4: 전체 테스트 + 빌드 통과 확인**

Run: `npm test && npm run build`
Expected: PASS (전 테스트 통과, dist 생성)

- [ ] **Step 5: Commit**

```bash
git add src/pages/LoginScreen.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: wire app shell with login, role, and join views"
```

---

## Plan 2·3 예고 (별도 계획서로 작성)

- Plan 2: `arenas` 목록, "지금 바로 대결!" 매칭, `rooms` 상태머신(waiting→ready→playing→finished), 라운드 타이머·자동 승리, `battles` 기록 + XP 트랜잭션, 학생 홈 3탭.
- Plan 3: 아레나 CRUD + 문제 편집기, QR 초대, 학생 관리, 전투 모니터링·강제종료, 분석, `firestore.rules` 실전 강화.
