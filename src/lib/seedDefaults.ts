import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { buildDefaultArenaDocs } from '../data/defaultArenas';

/** 새 학급·빈 학급에 기본 6개 아레나(잠김 상태)를 넣는다. */
export async function seedDefaultArenas(classroomId: string, ownerUid: string): Promise<string[]> {
  const docs = buildDefaultArenaDocs(classroomId, ownerUid);
  for (const d of docs) {
    await setDoc(doc(db, 'arenas', d.id), d.meta);
    for (const [i, p] of d.problems.entries()) {
      await setDoc(doc(db, 'arenas', d.id, 'problems', `p${i + 1}`), { ...p, roundTimeSec: 30 });
    }
  }
  return docs.map((d) => d.id);
}
