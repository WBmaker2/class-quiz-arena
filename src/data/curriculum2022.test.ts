// src/data/curriculum2022.test.ts
import { describe, expect, it } from 'vitest';
import { getStandards } from './curriculum2022';
describe('curriculum2022', () => {
  it('returns standards for grade 3 math', () => {
    expect(getStandards(3, '수학').length).toBeGreaterThan(0);
  });
  it('returns empty for unknown combo', () => {
    expect(getStandards(1, '영어')).toEqual([]);
  });
});
