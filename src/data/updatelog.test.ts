import { describe, expect, it } from 'vitest';
import updateLogMd from '../../docs/UPDATELOG.md?raw';
import { UPDATELOG } from './updatelog';

const md: string = updateLogMd;

describe('updatelog data', () => {
  it('has dates newest-first with at least one item each', () => {
    expect(UPDATELOG.length).toBeGreaterThan(0);
    const dates = UPDATELOG.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    for (const e of UPDATELOG) {
      expect(e.items.length).toBeGreaterThan(0);
    }
  });

  it('stays in sync with docs/UPDATELOG.md', () => {
    for (const e of UPDATELOG) {
      expect(md).toContain(`## ${e.date}`);
      for (const item of e.items) {
        expect(md).toContain(item);
      }
    }
  });
});
