import { describe, expect, it } from 'vitest';
import { buildDefaultArenaDocs, defaultArenaCount } from './defaultArenas';

describe('defaultArenas', () => {
  it('holds 6 arenas x 20 problems from the shared JSON', () => {
    expect(defaultArenaCount()).toEqual({ arenas: 6, problems: 120 });
  });

  it('builds locked classroom-scoped docs', () => {
    const docs = buildDefaultArenaDocs('A1B2C3', 'teacher-1');
    expect(docs).toHaveLength(6);
    const ids = docs.map((d) => d.id);
    expect(new Set(ids).size).toBe(6);
    for (const d of docs) {
      expect(d.id.startsWith('seed-A1B2C3-')).toBe(true);
      expect(d.meta.classroomId).toBe('A1B2C3');
      expect(d.meta.locked).toBe(true);
      expect(d.meta.createdBy).toBe('teacher-1');
      expect(d.problems).toHaveLength(20);
    }
    // 학급이 다르면 ID가 달라진다
    const other = buildDefaultArenaDocs('Z9Y8X7', 'teacher-1').map((d) => d.id);
    expect(other.some((id) => ids.includes(id))).toBe(false);
  });

  it('keeps every problem standardCode inside arena standards', () => {
    for (const d of buildDefaultArenaDocs('A1B2C3', 'teacher-1')) {
      const allowed = d.meta.standards as string[];
      for (const p of d.problems) {
        expect(allowed).toContain(p.standardCode);
      }
    }
  });
});

describe('default arena card art', () => {
  it('uses known illustrations', async () => {
    const { ILLUSTS } = await import('../components/illustrations');
    const ids = new Set(ILLUSTS.map((m) => m.id));
    for (const d of buildDefaultArenaDocs('A1B2C3', 'teacher-1')) {
      expect((d.meta as { cardStyle: string }).cardStyle).toBe('illust');
      const illustId = (d.meta as { illustId: string }).illustId;
      expect(ids.has(illustId)).toBe(true);
    }
  });
});

describe('default arena curriculum match', () => {
  it('resolves every standardCode in the official file with matching band and subject', async () => {
    const { findStandard } = await import('./curriculum2022');
    for (const d of buildDefaultArenaDocs('A1B2C3', 'teacher-1')) {
      const band = (d.meta as { gradeBand: string }).gradeBand;
      const subject = (d.meta as { subject: string }).subject;
      const allowed = (d.meta as { standards: string[] }).standards;
      expect(band).toMatch(/^(1-2|3-4|5-6)$/);
      for (const code of allowed) {
        const found = findStandard(code);
        expect(found, `${d.id} ${code}`).not.toBeNull();
        expect(found!.band).toBe(band);
        expect(found!.subject).toBe(subject);
      }
      for (const p of d.problems) {
        expect(allowed).toContain(p.standardCode);
      }
    }
  });
});
