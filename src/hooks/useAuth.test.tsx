import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const { signInMock, signOutMock } = vi.hoisted(() => ({
  signInMock: vi.fn().mockResolvedValue(undefined),
  signOutMock: vi.fn().mockResolvedValue(undefined),
}));

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
