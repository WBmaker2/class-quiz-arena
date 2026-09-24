// src/data/curriculum2022.ts
export interface Standard { code: string; summary: string; }
const DATA: Record<string, Standard[]> = {
  '3-수학': [
    { code: '3수01-01', summary: '세 자리 수 덧셈·뺄셈을 실생활에서 활용하기' },
    { code: '3수01-02', summary: '받아올림·받아내림 문장제 해결하기' },
  ],
  '6-국어': [{ code: '6국02-01', summary: '관용표현 뜻 알기·상황에 맞게 쓰기' }],
  '4-수학': [{ code: '4수02-01', summary: '분수 읽고 쓰기·크기 비교하기' }],
  '5-과학': [{ code: '5과03-01', summary: '물의 순환·상태변화 설명하기' }],
  '4-사회': [{ code: '4사01-01', summary: '지도 방위·기호 읽기' }],
  '5-영어': [{ code: '5영01-01', summary: '인사·소개 기본 표현 주고받기' }],
};
export function getStandards(grade: number, subject: string): Standard[] {
  return DATA[`${grade}-${subject}`] ?? [];
}
