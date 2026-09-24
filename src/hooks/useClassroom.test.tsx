import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useClassroom } from './useClassroom';

describe('useClassroom', () => {
  it('joins with normalized code', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.join('a1b2c3');
    });
    expect(result.current.classroomId).toBe('A1B2C3');
    expect(result.current.error).toBeNull();
  });

  it('rejects short code', async () => {
    const { result } = renderHook(() => useClassroom());
    await act(async () => {
      await result.current.join('ab');
    });
    expect(result.current.classroomId).toBeNull();
    expect(result.current.error).toBe('초대 코드 6자리를 확인해주세요');
  });
});
