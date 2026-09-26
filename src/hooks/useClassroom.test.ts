import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  setCalls: [] as unknown[],
  deleteCalls: [] as unknown[],
  classroomDocs: [] as { id: string; name: string }[],
  arenaDocs: [] as { id: string }[],
  roomDocs: [] as { id: string }[],
  problemDocs: [] as { id: string }[],
}));

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => ({ path: args.join('/') }),
  doc: (...args: unknown[]) => ({ path: args.join('/') }),
  getDoc: () =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ locked: false }),
    }),
  getDocs: (q: { path?: string }) => {
    if (q?.path?.includes('classrooms')) {
      return Promise.resolve({ docs: state.classroomDocs.map((d) => ({ id: d.id, data: () => ({ name: d.name }) })) });
    }
    if (q?.path?.includes('arenas') && q?.path?.includes('problems')) {
      return Promise.resolve({ docs: state.problemDocs.map((d) => ({ id: d.id, data: () => ({}) })) });
    }
    if (q?.path?.includes('arenas')) {
      return Promise.resolve({ docs: state.arenaDocs.map((d) => ({ id: d.id, data: () => ({}) })) });
    }
    return Promise.resolve({ docs: state.roomDocs.map((d) => ({ id: d.id, data: () => ({}) })) });
  },
  setDoc: (...args: unknown[]) => {
    state.setCalls.push(args);
    return Promise.resolve();
  },
  deleteDoc: (...args: unknown[]) => {
    state.deleteCalls.push(args);
    return Promise.resolve();
  },
  query: (ref: { path?: string }) => ({ path: ref?.path ?? '' }),
  where: () => ({}),
  onSnapshot: () => () => {},
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

import { useClassroom } from './useClassroom';

describe('useClassroom nickname gate', () => {
  beforeEach(() => {
    state.setCalls = [];
    state.deleteCalls = [];
    state.classroomDocs = [];
    state.arenaDocs = [];
    state.roomDocs = [];
    state.problemDocs = [];
  });

  it('blocks join with a banned nickname before any write', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.join('A1B2C3', 'u1', { nickname: '시발', role: 'student', avatar: 'cat' });
    });
    expect(result.current.error).toContain('쓸 수 없는 말');
    expect(result.current.classroomId).toBeNull();
    expect(state.setCalls).toHaveLength(0);
  });

  it('joins with a clean nickname', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.join('A1B2C3', 'u1', { nickname: '일호', role: 'student', avatar: 'cat' });
    });
    expect(result.current.error).toBeNull();
    expect(result.current.classroomId).toBe('A1B2C3');
    expect(state.setCalls).toHaveLength(1);
  });

  it('blocks create with a banned nickname', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.create('4학년 3반', 'u1', 'ㅅㅂ', 'cat');
    });
    expect(result.current.error).toContain('쓸 수 없는 말');
    expect(state.setCalls).toHaveLength(0);
  });
});

describe('useClassroom duplicate names', () => {
  beforeEach(() => {
    state.setCalls = [];
    state.classroomDocs = [{ id: 'C1', name: '4학년 3반' }];
  });

  it('blocks create with an existing classroom name', async () => {
    const { result } = renderHook(() => useClassroom());
    let code: string | null = 'unset';
    await act(async () => {
      code = await result.current.create('4학년 3반', 'teacher-1', '김선생', 'cat');
    });
    expect(code).toBeNull();
    expect(result.current.error).toContain('같은 이름');
  });

  it('treats spaced names as the same', async () => {
    const { result } = renderHook(() => useClassroom());
    let code: string | null = 'unset';
    await act(async () => {
      code = await result.current.create('  4학년   3반 ', 'teacher-1', '김선생', 'cat');
    });
    expect(code).toBeNull();
    expect(result.current.error).toContain('같은 이름');
  });

  it('blocks rename to another classroom name but allows its own', async () => {
    const { result } = renderHook(() => useClassroom());
    let err: string | null = null;
    await act(async () => {
      err = await result.current.renameClassroom('C2', '4학년 3반', 'teacher-1');
    });
    expect(err).toContain('같은 이름');
    await act(async () => {
      err = await result.current.renameClassroom('C1', '4학년 3반', 'teacher-1');
    });
    expect(err).toBeNull();
  });
});

describe('useClassroom delete cascade', () => {
  beforeEach(() => {
    state.deleteCalls = [];
    state.classroomDocs = [
      { id: 'C1', name: '1반' },
      { id: 'C2', name: '2반' },
    ];
    state.arenaDocs = [{ id: 'a1' }];
    state.roomDocs = [{ id: 'r1' }];
    state.problemDocs = [{ id: 'p1' }, { id: 'p2' }];
  });

  it('deletes rooms, arenas, problems and the classroom, then moves on', async () => {
    const { result } = renderHook(() => useClassroom());
    let out: { ok: boolean; next: string | null } = { ok: false, next: null };
    await act(async () => {
      out = await result.current.deleteClassroom('C1', 'teacher-1');
    });
    expect(out).toEqual({ ok: true, next: 'C2' });
    // 방 1 + 문제 2 + 아레나 1 + 학급 1
    expect(state.deleteCalls).toHaveLength(5);
  });
});

describe('useClassroom default seeding', () => {
  it('seeds 6 locked arenas on create', async () => {
    const { result } = renderHook(() => useClassroom());
    let code: string | null = null;
    await act(async () => {
      code = await result.current.create('4학년 3반', 'teacher-1', '김선생', 'cat');
    });
    expect(code).not.toBeNull();
    const datas = state.setCalls.map((c) => (c as unknown[])[1] as Record<string, unknown>);
    const arenaWrites = datas.filter((d) => d.questionCount === 20);
    expect(arenaWrites).toHaveLength(6);
    for (const data of arenaWrites) {
      expect(data.locked).toBe(true);
      expect(data.classroomId).toBe(code);
    }
  });
});
