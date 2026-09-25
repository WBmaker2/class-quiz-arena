// src/data/curriculum2022.test.ts
import { describe, expect, it } from 'vitest';
import {
  bandOfGrade,
  coverageOf,
  findStandard,
  getStandards,
  subjectsOfBand,
  subjectsOfGrade,
} from './curriculum2022';

describe('curriculum2022 bands', () => {
  it('maps grades to the 3 bands', () => {
    expect(bandOfGrade(1)).toBe('1-2');
    expect(bandOfGrade(2)).toBe('1-2');
    expect(bandOfGrade(3)).toBe('3-4');
    expect(bandOfGrade(4)).toBe('3-4');
    expect(bandOfGrade(5)).toBe('5-6');
    expect(bandOfGrade(6)).toBe('5-6');
  });

  it('lists integrated subjects for grades 1-2', () => {
    expect(subjectsOfGrade(1)).toEqual(['바른 생활', '슬기로운 생활', '즐거운 생활', '국어', '수학']);
  });

  it('returns official 3-4 math standards for grade 3', () => {
    const list = getStandards(3, '수학');
    expect(list.length).toBeGreaterThan(40);
    expect(list.some((s) => s.code === '[4수01-03]')).toBe(true);
  });

  it('returns empty for unknown combo', () => {
    expect(getStandards(1, '영어')).toEqual([]);
    expect(getStandards(1, '사회')).toEqual([]);
  });
});

describe('findStandard and coverageOf', () => {
  it('finds a standard by official code', () => {
    expect(findStandard('[4수01-03]')).toMatchObject({ band: '3-4', subject: '수학' });
    expect(findStandard('[6국04-03]')).toMatchObject({ band: '5-6', subject: '국어' });
    expect(findStandard('없음')).toBeNull();
  });

  it('marks covered standards from classroom arenas', () => {
    const standards = getStandards(4, '수학');
    const rows = coverageOf(standards, [{ standards: ['[4수01-09]'] }, {}]);
    expect(rows.length).toBe(standards.length);
    expect(rows.find((r) => r.code === '[4수01-09]')).toMatchObject({ covered: true });
    expect(rows.find((r) => r.code === '[4수01-03]')).toMatchObject({ covered: false });
  });
});

describe('curriculum coverage', () => {
  it('keeps codes unique and findable', () => {
    const codes: string[] = [];
    const repGrade: Record<string, number> = { '1-2': 1, '3-4': 3, '5-6': 5 };
    for (const band of ['1-2', '3-4', '5-6']) {
      for (const subject of subjectsOfBand(band)) {
        for (const s of getStandards(repGrade[band], subject)) {
          codes.push(s.code);
          expect(findStandard(s.code)).not.toBeNull();
        }
      }
    }
    expect(codes.length).toBeGreaterThan(500);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
