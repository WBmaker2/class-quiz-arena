import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const { signInMock, signOutMock, setPersistenceMock, providerInstances } = vi.hoisted(() => ({
  signInMock: vi.fn().mockResolvedValue(undefined),
  signOutMock: vi.fn().mockResolvedValue(undefined),
  setPersistenceMock: vi.fn().mockResolvedValue(undefined),
  providerInstances: [] as { params?: unknown }[],
}));

vi.mock('firebase/auth', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...mod,
    signInWithPopup: signInMock,
    signOut: signOutMock,
    setPersistence: setPersistenceMock,
    browserLocalPersistence: 'test-local',
    browserSessionPersistence: 'test-session',
    GoogleAuthProvider: class {
      params?: unknown;
      constructor() {
        providerInstances.push(this);
      }
      setCustomParameters(params: unknown) {
        this.params = params;
      }
    },
    onAuthStateChanged: (_auth: unknown, cb: (u: null) => void) => {
      cb(null);
      return () => {};
    },
  };
});

vi.mock('../lib/firebase', () => ({ auth: {} }));

import { useAuth } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    providerInstances.length = 0;
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

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

  it('delegates sign-out to firebase', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signOut();
    });
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it('saves the remember choice and applies persistence', async () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.remember).toBeNull();
    await act(async () => {
      await result.current.applyRemember(true);
    });
    expect(setPersistenceMock).toHaveBeenCalledWith(expect.anything(), 'test-local');
    expect(window.localStorage.getItem('quiz-arena-remember')).toBe('keep');
    expect(result.current.remember).toBe(true);
  });

  it('uses session-only persistence for one-time login', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.applyRemember(false);
    });
    expect(setPersistenceMock).toHaveBeenCalledWith(expect.anything(), 'test-session');
    expect(window.localStorage.getItem('quiz-arena-remember')).toBe('once');
  });

  it('forces the account chooser only after sign-out', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(providerInstances).toHaveLength(1);
    expect(providerInstances[0].params).toBeUndefined();
    await act(async () => {
      await result.current.signOut();
    });
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(providerInstances).toHaveLength(2);
    expect(providerInstances[1].params).toEqual({ prompt: 'select_account' });
  });
});
