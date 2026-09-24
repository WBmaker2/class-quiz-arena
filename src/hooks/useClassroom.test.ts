import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  setCalls: [] as unknown[],
}));

vi.mock('firebase/firestore', () => ({
  collection: () => ({}),
  doc: () => ({}),
  getDoc: () =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ locked: false }),
    }),
  setDoc: (...args: unknown[]) => {
    state.setCalls.push(args);
    return Promise.resolve();
  },
  query: () => ({}),
  where: () => ({}),
  onSnapshot: () => () => {},
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

import { useClassroom } from './useClassroom';

describe('useClassroom nickname gate', () => {
  beforeEach(() => {
    state.setCalls = [];
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
