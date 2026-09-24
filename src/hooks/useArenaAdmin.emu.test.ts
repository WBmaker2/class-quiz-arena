import { act, renderHook } from '@testing-library/react';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { auth, db } from '../lib/firebase';
import { useArenaAdmin } from './useArenaAdmin';

describe('useArenaAdmin on emulator', () => {
  it('preserves problems and lock on edit, cascades on delete', async () => {
    const cred = await signInAnonymously(auth);
    const uid = cred.user.uid;
    await setDoc(doc(db, 'users', uid), { nickname: '선생', role: 'teacher', classroomId: 'A1B2C3' });

    const { result } = renderHook(() => useArenaAdmin('A1B2C3'));
    let id = '';
    await act(async () => {
      id = await result.current.saveArena(
        null,
        { title: 't', desc: 'd', subject: '수학', aiCount: 0 },
        [
          { text: 'Q1', options: ['O', 'X', '', ''], answerIndex: 0 },
          { text: 'Q2', options: ['O', 'X', '', ''], answerIndex: 1 },
        ],
      );
    });

    const loaded = await result.current.loadProblems(id);
    expect(loaded).toHaveLength(2);
    expect(loaded[0].text).toBe('Q1');

    await act(async () => {
      await result.current.setLocked(id, true);
    });
    await act(async () => {
      await result.current.saveArena(id, { title: 't2', desc: 'd', subject: '수학', aiCount: 1 }, loaded);
    });
    const arena = (await getDoc(doc(db, 'arenas', id))).data() as { title: string; locked: boolean };
    expect(arena.title).toBe('t2');
    expect(arena.locked).toBe(true);
    expect(await result.current.loadProblems(id)).toHaveLength(2);

    await act(async () => {
      await result.current.removeArena(id);
    });
    expect((await getDoc(doc(db, 'arenas', id))).exists()).toBe(false);
    expect((await getDocs(collection(db, 'arenas', id, 'problems'))).size).toBe(0);
  }, 60000);
});
