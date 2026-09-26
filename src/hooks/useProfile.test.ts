import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({ listeners: [] as Array<{ next: (snap: { exists: () => boolean; data: () => unknown }) => void; error: (error: unknown) => void }>, doc: vi.fn((_db, uid: string) => ({ uid })), onSnapshot: vi.fn((_ref, next, error) => { mocked.listeners.push({ next, error }); return vi.fn(); }) }));
vi.mock('firebase/firestore', () => ({ doc: mocked.doc, onSnapshot: mocked.onSnapshot }));
vi.mock('../lib/firebase', () => ({ db: {} }));
import { useProfile } from './useProfile';

describe('useProfile', () => {
  beforeEach(() => { mocked.listeners.length = 0; mocked.onSnapshot.mockClear(); });

  it('clears profile data on uid change and reports subscription errors with retry', () => {
    const { result, rerender } = renderHook(({ uid }) => useProfile(uid), { initialProps: { uid: 'u1' } });
    act(() => mocked.listeners[0].next({ exists: () => true, data: () => ({ nickname: '일호', xp: 1 }) }));
    expect(result.current.profile?.nickname).toBe('일호');

    rerender({ uid: 'u2' });
    expect(result.current.profile).toBeNull();
    act(() => mocked.listeners[mocked.listeners.length - 1].error(new Error('offline')));
    expect(result.current.error).toContain('기록을 불러오지 못했어요');

    act(() => result.current.retry());
    expect(mocked.onSnapshot).toHaveBeenCalledTimes(3);
    expect(result.current.error).toBeNull();
  });
});
