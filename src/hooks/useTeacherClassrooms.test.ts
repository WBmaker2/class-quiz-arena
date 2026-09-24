import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  docs: [] as { id: string; data: () => Record<string, unknown> }[],
  fail: false,
}));

vi.mock('firebase/firestore', () => ({
  collection: () => ({}),
  doc: () => ({}),
  getDoc: () => Promise.resolve({ exists: () => false, data: () => ({}) }),
  setDoc: () => Promise.resolve(),
  query: () => ({}),
  where: () => ({}),
  onSnapshot: (_q: unknown, ok: (snap: unknown) => void, err: () => void) => {
    if (state.fail) {
      err();
    } else {
      ok({ docs: state.docs });
    }
    return () => {};
  },
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

import { useTeacherClassrooms } from './useClassroom';

describe('useTeacherClassrooms', () => {
  it('maps classroom docs', async () => {
    state.fail = false;
    state.docs = [{ id: 'C1', data: () => ({ name: '4학년 3반', inviteCode: 'AAAAAA' }) }];
    const { result } = renderHook(() => useTeacherClassrooms('u1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.classrooms).toEqual([{ id: 'C1', name: '4학년 3반', inviteCode: 'AAAAAA' }]);
  });

  it('falls back to empty on query failure', async () => {
    state.fail = true;
    const { result } = renderHook(() => useTeacherClassrooms('u1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.classrooms).toEqual([]);
    state.fail = false;
  });
});
