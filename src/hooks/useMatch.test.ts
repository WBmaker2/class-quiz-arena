import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pickBattleProblems } from '../lib/battle';

const state = vi.hoisted(() => ({
  problemDocs: [] as { id: string }[],
  waitingDocs: [] as { id: string; data: () => Record<string, unknown>; ref: { id: string } }[],
  setCalls: [] as { ref: unknown; data: Record<string, unknown> }[],
  updateCalls: [] as { ref: unknown; data: Record<string, unknown> }[],
}));

const tx = {
  get: vi.fn(),
  set: vi.fn((ref: unknown, data: Record<string, unknown>) => {
    state.setCalls.push({ ref, data });
  }),
  update: vi.fn((ref: unknown, data: Record<string, unknown>) => {
    state.updateCalls.push({ ref, data });
  }),
};

vi.mock('firebase/firestore', () => ({
  collection: (_db: unknown, ...segs: string[]) => ({ __kind: 'col', path: segs.join('/') }),
  doc: (arg: unknown) => ({ __kind: 'doc', id: 'room-new' }),
  where: () => ({ __kind: 'where' }),
  query: (col: unknown) => ({ __kind: 'qry', col }),
  serverTimestamp: () => 0,
  getDocs: (arg: { __kind: string }) => {
    if (arg.__kind === 'col') return Promise.resolve({ docs: state.problemDocs });
    return Promise.resolve({ docs: state.waitingDocs });
  },
  runTransaction: (_db: unknown, fn: (t: unknown) => Promise<string>) => fn(tx),
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

import { useMatch } from './useMatch';

const me = { uid: 'u1', nickname: '일호', avatar: 'cat' };
const ids20 = Array.from({ length: 20 }, (_, i) => `p${i + 1}`);

function openRoomDoc(problemIds: string[]) {
  return {
    id: 'room-open',
    ref: { id: 'room-open' },
    data: () => ({
      players: [{ uid: 'u2', nickname: '이호', avatar: 'dog' }],
      problemIds,
    }),
  };
}

describe('useMatch problemIds (10 fixed per room)', () => {
  beforeEach(() => {
    state.problemDocs = ids20.map((id) => ({ id }));
    state.waitingDocs = [];
    state.setCalls = [];
    state.updateCalls = [];
    vi.clearAllMocks();
  });

  it('creator stores 10 picked problemIds on the new room', async () => {
    const { result } = renderHook(() => useMatch('arena1', me));
    await act(async () => {
      await result.current.findOrCreate();
    });
    expect(result.current.roomId).toBe('room-new');
    expect(state.setCalls).toHaveLength(1);
    const stored = state.setCalls[0].data;
    expect(stored.problemIds).toHaveLength(10);
    expect(stored.problemIds).toEqual(pickBattleProblems(ids20, 'room-new', 10));
  });

  it('joiner reuses the existing problemIds without creating a room', async () => {
    const existing = Array.from({ length: 10 }, (_, i) => `p${i + 1}`);
    state.waitingDocs = [openRoomDoc(existing)];
    const { result } = renderHook(() => useMatch('arena1', me));
    await act(async () => {
      await result.current.findOrCreate();
    });
    expect(result.current.roomId).toBe('room-open');
    expect(state.setCalls).toHaveLength(0);
    expect(state.updateCalls).toHaveLength(1);
  });

  it('blocks entry when the arena has fewer than 10 problems', async () => {
    state.problemDocs = Array.from({ length: 5 }, (_, i) => ({ id: `p${i + 1}` }));
    const { result } = renderHook(() => useMatch('arena1', me));
    await act(async () => {
      await result.current.findOrCreate();
    });
    expect(result.current.roomId).toBeNull();
    expect(result.current.error).toBe('선생님이 문제를 준비 중이에요');
    expect(state.setCalls).toHaveLength(0);
  });
});
