import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ call: vi.fn(), name: '' }));
vi.mock('firebase/functions', () => ({
  httpsCallable: (_functions: unknown, name: string) => {
    state.name = name;
    return state.call;
  },
}));
vi.mock('./firebase', () => ({ functions: {} }));

import { finishAndAward } from './award';

describe('server-authoritative rewards', () => {
  beforeEach(() => {
    state.name = '';
    state.call.mockReset().mockResolvedValue({ data: { xp: 70, stars: 7 } });
  });

  it('sends only the finished room id; score and reward inputs stay on the server', async () => {
    await expect(finishAndAward('room-1')).resolves.toEqual({ xp: 70, stars: 7 });
    expect(state.name).toBe('awardBattle');
    expect(state.call).toHaveBeenCalledWith({ roomId: 'room-1' });
  });
});
