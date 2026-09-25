// src/data/curriculum2022.ts
//
// 2022 개정 초등 교육과정 성취기준. 원천은 docs/2022standards.json (공식 학년군 코드 verbatim).
// - 학년군은 3개: '1-2', '3-4', '5-6'. 앱의 학년 선택(1-6학년)은 해당 학년군으로 매핑한다.
// - 과목은 학년군마다 다르다 (1-2: 바른/슬기로운/즐거운 생활 + 국어/수학, 3-4·5-6: 9-10개 교과).
export interface Standard { code: string; summary: string; }

import rawBands from '../../docs/2022standards.json';

type BandData = Record<string, [string, string][]>;
const BANDS = rawBands as unknown as Record<string, BandData>;

export const GRADE_BANDS = ['1-2', '3-4', '5-6'];

/** 학년 → 학년군. */
export function bandOfGrade(grade: number): string {
  if (grade <= 2) return '1-2';
  if (grade <= 4) return '3-4';
  return '5-6';
}

/** 학년군 과목 목록 (파일 순서 유지). */
export function subjectsOfBand(band: string): string[] {
  return Object.keys(BANDS[band] ?? {});
}

/** 학년 과목 목록. */
export function subjectsOfGrade(grade: number): string[] {
  return subjectsOfBand(bandOfGrade(grade));
}

export function getStandards(grade: number, subject: string): Standard[] {
  const list = BANDS[bandOfGrade(grade)]?.[subject] ?? [];
  return list.map(([code, summary]) => ({ code, summary }));
}

export const GRADES = [1, 2, 3, 4, 5, 6];
// 3-4학년군 기본 과목 (하위 호환용, 신규 코드는 subjectsOfGrade 사용)
export const SUBJECTS = ['국어', '수학', '사회', '과학', '영어'];

/** 코드로 기준 찾기 (전 학년군 검색). */
export function findStandard(code: string): { band: string; subject: string; summary: string } | null {
  for (const [band, subs] of Object.entries(BANDS)) {
    for (const [subject, list] of Object.entries(subs)) {
      const found = list.find(([c]) => c === code);
      if (found) return { band, subject, summary: found[1] };
    }
  }
  return null;
}

/** 학급 아레나들의 standards[]에 코드가 하나라도 있으면 출제됨. */
export function coverageOf(
  standards: Standard[],
  arenas: { standards?: string[] }[],
): { code: string; summary: string; covered: boolean }[] {
  const covered = new Set<string>();
  for (const a of arenas) {
    for (const c of a.standards ?? []) covered.add(c);
  }
  return standards.map((s) => ({ code: s.code, summary: s.summary, covered: covered.has(s.code) }));
}
