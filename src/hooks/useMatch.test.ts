import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ callable: vi.fn(), callableName: '' }));

vi.mock('firebase/functions', () => ({
  httpsCallable: (_functions: unknown, name: string) => {
    state.callableName = name;
    return state.callable;
  },
}));
vi.mock('../lib/firebase', () => ({ functions: {} }));

import { useMatch, ARENA_NOT_READY_MSG } from './useMatch';

const me = { uid: 'u1', nickname: '일호', avatar: 'cat' };

describe('useMatch server-owned matching', () => {
  beforeEach(() => {
    state.callable.mockReset();
    state.callableName = '';
    state.callable.mockResolvedValue({ data: { roomId: 'room-1' } });
  });

  it('delegates room creation/joining to the server callable', async () => {
    const { result } = renderHook(() => useMatch('arena1', me, 'class-1'));
    await act(async () => result.current.findOrCreate());
    expect(state.callableName).toBe('matchBattle');
    expect(state.callable).toHaveBeenCalledWith({ arenaId: 'arena1' });
    expect(result.current.roomId).toBe('room-1');
  });

  it('sends a saved room id for server-side membership validation', async () => {
    const { result } = renderHook(() => useMatch('arena1', me, 'class-1', 'resume-1'));
    await act(async () => result.current.findOrCreate());
    expect(state.callable).toHaveBeenCalledWith({ arenaId: 'arena1', resumeRoomId: 'resume-1' });
    expect(result.current.roomId).toBe('room-1');
  });

  it('does not call the server when no classroom is selected', async () => {
    const { result } = renderHook(() => useMatch('arena1', me, null));
    await act(async () => result.current.findOrCreate());
    expect(state.callable).not.toHaveBeenCalled();
    expect(result.current.error).toContain('학급');
  });

  it('shows the preparation message for a server with fewer than ten problems', async () => {
    state.callable.mockRejectedValue({ code: 'functions/failed-precondition' });
    const { result } = renderHook(() => useMatch('arena1', me, 'class-1'));
    await act(async () => result.current.findOrCreate());
    expect(result.current.error).toBe(ARENA_NOT_READY_MSG);
  });
});
