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
