// src/data/curriculum2022.test.ts
import { describe, expect, it } from 'vitest';
import { coverageOf, findStandard, getStandards } from './curriculum2022';
describe('curriculum2022', () => {
  it('returns standards for grade 3 math', () => {
    expect(getStandards(3, '수학').length).toBeGreaterThan(0);
  });
  it('returns empty for unknown combo', () => {
    expect(getStandards(1, '영어')).toEqual([]);
  });
});

describe('findStandard and coverageOf', () => {
  it('finds a standard by code', () => {
    expect(findStandard('3수01-01')).toMatchObject({ grade: 3, subject: '수학' });
    expect(findStandard('없음')).toBeNull();
  });

  it('marks covered standards from classroom arenas', () => {
    const standards = getStandards(3, '수학');
    const rows = coverageOf(standards, [{ standards: ['3수01-01'] }, {}]);
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({ code: '3수01-01', covered: true });
    expect(rows[1]).toMatchObject({ code: '3수01-02', covered: false });
  });
});

describe('curriculum coverage', () => {
  it('covers every grade-subject except lower-grade English', () => {
    for (const grade of [1, 2, 3, 4, 5, 6]) {
      for (const subject of ['국어', '수학', '사회', '과학', '영어']) {
        const list = getStandards(grade, subject);
        if (subject === '영어' && grade <= 2) {
          expect(list).toEqual([]);
        } else {
          expect(list.length).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it('keeps codes unique and findable', () => {
    const codes: string[] = [];
    for (const grade of [1, 2, 3, 4, 5, 6]) {
      for (const subject of ['국어', '수학', '사회', '과학', '영어']) {
        for (const s of getStandards(grade, subject)) {
          codes.push(s.code);
          expect(findStandard(s.code)).not.toBeNull();
        }
      }
    }
    expect(new Set(codes).size).toBe(codes.length);
  });
});
