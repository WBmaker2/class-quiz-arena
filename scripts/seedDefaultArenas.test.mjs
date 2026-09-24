import { describe, expect, it } from 'vitest';
import { ARENAS, CLASSROOM_ID, EXPECTED_ARENAS, OWNER_ID, validateArenas } from './seedDefaultArenas.mjs';

describe('seedDefaultArenas', () => {
  it('has 6 default arenas with expected id/grade/subject', () => {
    expect(ARENAS).toHaveLength(6);
    for (const exp of EXPECTED_ARENAS) {
      const found = ARENAS.find((a) => a.id === exp.id);
      expect(found, `missing ${exp.id}`).toBeDefined();
      expect(found.grade).toBe(exp.grade);
      expect(found.subject).toBe(exp.subject);
    }
  });

  it('stores exactly 20 problems per arena', () => {
    for (const arena of ARENAS) {
      expect(arena.problems, arena.id).toHaveLength(20);
      expect(arena.questionCount).toBe(20);
    }
  });

  it('publishes to classroom A1B2C3 unlocked with card theme', () => {
    for (const arena of ARENAS) {
      expect(arena.classroomId).toBe(CLASSROOM_ID);
      expect(arena.classroomId).toBe('A1B2C3');
      expect(arena.createdBy).toBe(OWNER_ID);
      expect(arena.locked).toBe(false);
      expect(arena.status).toBe('published');
      expect(arena.cardTheme.bg).toMatch(/^#/);
      expect(arena.cardTheme.emoji.trim()).not.toBe('');
      expect(arena.standards.length).toBeGreaterThan(0);
    }
  });

  it('keeps every problem shape valid (4 options, answer 0-3, 1-line explanation, 30s)', () => {
    for (const arena of ARENAS) {
      const texts = new Set();
      for (const p of arena.problems) {
        expect(p.text.trim(), arena.id).not.toBe('');
        expect(texts.has(p.text), `duplicate in ${arena.id}: ${p.text}`).toBe(false);
        texts.add(p.text);
        expect(p.options).toHaveLength(4);
        for (const o of p.options) expect(o.trim()).not.toBe('');
        expect(new Set(p.options).size).toBe(4);
        expect(p.answerIndex).toBeGreaterThanOrEqual(0);
        expect(p.answerIndex).toBeLessThanOrEqual(3);
        expect(p.options[p.answerIndex].trim()).not.toBe('');
        expect(p.explanation.trim()).not.toBe('');
        expect(p.explanation).not.toContain('\n');
        expect(arena.standards).toContain(p.standardCode);
        expect(p.roundTimeSec).toBe(30);
      }
    }
  });

  it('passes the shared validator used by --dry seeding', () => {
    expect(validateArenas()).toEqual([]);
  });

  it('covers answer positions 0-3 across the seed', () => {
    const seen = new Set(ARENAS.flatMap((a) => a.problems.map((p) => p.answerIndex)));
    expect([...seen].sort()).toEqual([0, 1, 2, 3]);
  });
});
