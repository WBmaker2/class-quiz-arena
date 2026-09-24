// src/data/curriculum2022.ts
//
// 2022 개정 초등 교육과정을 바탕으로 한 학년·과목별 성취기준 요약.
// - summary는 교사가 고르고 AI에게 전달하기 위한 짧은 paraphrase다. 교육부 원문 복붙이 아니다.
// - code는 앱 내부 코드(학년+과목+영역-번호). 공식 학년군 코드(2수/4수/6수)와 1:1로 대응하지 않는다.
// - 영어 1~2학년은 정규 교과가 없어서 비어 있다.
export interface Standard { code: string; summary: string; }
const DATA: Record<string, Standard[]> = {
  '1-국어': [
    { code: '1국01-01', summary: '바르게 듣고 말하기 (인사·대답·발표 태도)' },
    { code: '1국02-01', summary: '받침 없는 낱말 읽고 쓰기' },
    { code: '1국02-02', summary: '짧은 글 읽고 누구·어디·무엇 찾기' },
    { code: '1국03-01', summary: '그림 보고 한 문장 쓰기' },
  ],
  '1-수학': [
    { code: '1수01-01', summary: '100까지 수 세고 읽고 쓰기' },
    { code: '1수01-02', summary: '받아올림·받아내림 없는 덧셈뺄셈' },
    { code: '1수02-01', summary: '네모·세모·동그라미 찾기' },
    { code: '1수03-01', summary: '길이 비교하기 (직접·간접 비교)' },
  ],
  '1-사회': [
    { code: '1사01-01', summary: '우리 가족 소개하고 소중히 여기기' },
    { code: '1사01-02', summary: '학교 여러 곳 둘러보고 바르게 이용하기' },
    { code: '1사01-03', summary: '고장 자랑거리 찾아보기' },
  ],
  '1-과학': [
    { code: '1과01-01', summary: '나와 주변 생물·물건 관찰하기' },
    { code: '1과01-02', summary: '낮과 밤·계절 변화 느끼기' },
    { code: '1과01-03', summary: '여러 가지 물건 만져보고 성질 말하기' },
  ],
  '2-국어': [
    { code: '2국01-01', summary: '차례 지키며 듣고 말하기' },
    { code: '2국02-01', summary: '받침 있는 낱말 읽고 쓰기' },
    { code: '2국02-02', summary: '글의 처음·가운데·끝 찾기' },
    { code: '2국03-01', summary: '겪은 일 짧은 글로 쓰기' },
  ],
  '2-수학': [
    { code: '2수01-01', summary: '세 자리 수 읽고 쓰기·크기 비교' },
    { code: '2수01-02', summary: '받아올림·받아내림 덧셈뺄셈' },
    { code: '2수01-03', summary: '곱셈구구 외우고 활용하기' },
    { code: '2수02-01', summary: '상자 모양·둥근 모양 구별하기' },
  ],
  '2-사회': [
    { code: '2사01-01', summary: '우리 동네 모습 살펴보기' },
    { code: '2사01-02', summary: '옛날과 오늘날 생활 모습 비교하기' },
    { code: '2사01-03', summary: '약속 정하고 지키기' },
  ],
  '2-과학': [
    { code: '2과01-01', summary: '동물·식물 사는 곳과 모습 관찰하기' },
    { code: '2과01-02', summary: '자석에 붙는 물건 찾아보기' },
    { code: '2과01-03', summary: '그림자·소리 변화 관찰하기' },
  ],
  '3-국어': [
    { code: '3국01-01', summary: '중요한 내용 들으며 요약하기' },
    { code: '3국02-01', summary: '문단 중심 생각 찾기' },
    { code: '3국03-01', summary: '절차 드러나게 설명하는 글 쓰기' },
    { code: '3국04-01', summary: '높임 표현 이해하고 바르게 쓰기' },
  ],
  '3-수학': [
    { code: '3수01-01', summary: '세 자리 수 덧셈·뺄셈을 실생활에서 활용하기' },
    { code: '3수01-02', summary: '받아올림·받아내림 문장제 해결하기' },
    { code: '3수01-03', summary: '한·두 자리 수 곱셈 원리 이해하기' },
    { code: '3수01-04', summary: '나눗셈 의미와 곱셈·나눗셈 관계 알기' },
    { code: '3수02-01', summary: '분수 읽고 쓰기' },
  ],
  '3-사회': [
    { code: '3사01-01', summary: '우리 지역의 모습과 자랑거리 조사하기' },
    { code: '3사01-02', summary: '지도에서 방위·기호 읽기' },
    { code: '3사01-03', summary: '옛날 사람들의 생활 모습 알아보기' },
  ],
  '3-과학': [
    { code: '3과01-01', summary: '동물의 한살이와 식물 자라기 관찰하기' },
    { code: '3과01-02', summary: '자석 성질과 쓰임새 알아보기' },
    { code: '3과01-03', summary: '여러 가지 물질과 혼합물 관찰하기' },
  ],
  '3-영어': [
    { code: '3영01-01', summary: '알파벳 읽고 쓰기' },
    { code: '3영01-02', summary: '인사·안부 주고받기' },
    { code: '3영01-03', summary: '색·동물·숫자 낱말 말하기' },
  ],
  '4-국어': [
    { code: '4국01-01', summary: '원인과 결과 생각하며 듣고 말하기' },
    { code: '4국02-01', summary: '사실과 의견 구분하며 읽기' },
    { code: '4국03-01', summary: '의견과 이유 드러나게 글 쓰기' },
    { code: '4국04-01', summary: '문장 짜임 이해하고 바르게 쓰기' },
  ],
  '4-수학': [
    { code: '4수01-01', summary: '한 자리 수 나눗셈과 몫·나머지 알기' },
    { code: '4수01-02', summary: '어림셈으로 계산 결과 짐작하기' },
    { code: '4수02-01', summary: '분수 읽고 쓰기·크기 비교하기' },
    { code: '4수02-02', summary: '진분수·가분수·대분수 관계 알기' },
    { code: '4수03-01', summary: '소수 한 자리 수 이해하고 읽고 쓰기' },
  ],
  '4-사회': [
    { code: '4사01-01', summary: '지도 방위·기호 읽기' },
    { code: '4사01-02', summary: '옛날과 오늘날 촌락·도시 생활 비교하기' },
    { code: '4사01-03', summary: '민주주의 의미와 학급 회의 참여하기' },
  ],
  '4-과학': [
    { code: '4과01-01', summary: '지층·화석으로 지표 변화 알기' },
    { code: '4과01-02', summary: '식물의 한살이와 씨앗 퍼짐 관찰하기' },
    { code: '4과01-03', summary: '물체 무게 재고 비교하기' },
  ],
  '4-영어': [
    { code: '4영01-01', summary: '자기소개 주고받기' },
    { code: '4영01-02', summary: '요일·날씨·시간 묻고 답하기' },
    { code: '4영01-03', summary: '좋아하는 것 말하기' },
  ],
  '5-국어': [
    { code: '5국01-01', summary: '의견과 까닭 내세우며 토의하기' },
    { code: '5국02-01', summary: '설명하는 글 중심 내용 찾기' },
    { code: '5국03-01', summary: '주장하는 글 근거와 함께 쓰기' },
    { code: '5국04-01', summary: '낱말 뜻과 쓰임 살펴 바르게 쓰기' },
  ],
  '5-수학': [
    { code: '5수01-01', summary: '약수와 배수 구하기' },
    { code: '5수01-02', summary: '분모가 같은 분수 덧셈뺄셈하기' },
    { code: '5수01-03', summary: '소수 덧셈뺄셈 원리 이해하기' },
    { code: '5수02-01', summary: '다각형 넓이 구하기' },
  ],
  '5-사회': [
    { code: '5사01-01', summary: '우리나라 위치와 지형 읽기' },
    { code: '5사01-02', summary: '선사~조선 역사 흐름 파악하기' },
    { code: '5사01-03', summary: '문화유산 소중히 여기기' },
  ],
  '5-과학': [
    { code: '5과01-01', summary: '우리 몸 기관 구조와 기능 알기' },
    { code: '5과02-01', summary: '용해 현상 관찰하고 진하기 비교하기' },
    { code: '5과03-01', summary: '물의 순환·상태변화 설명하기' },
  ],
  '5-영어': [
    { code: '5영01-01', summary: '인사·소개 기본 표현 주고받기' },
    { code: '5영01-02', summary: '일상 주제 짧은 글 읽기' },
    { code: '5영01-03', summary: '주말·취미 묻고 답하기' },
  ],
  '6-국어': [
    { code: '6국01-01', summary: '주장과 까닭 판단하며 듣기' },
    { code: '6국02-01', summary: '관용표현 뜻·상황에 맞게 쓰기' },
    { code: '6국03-01', summary: '면담하고 기록하는 글 쓰기' },
    { code: '6국04-01', summary: '문장 성분과 호응 이해하기' },
  ],
  '6-수학': [
    { code: '6수01-01', summary: '비와 비율 이해하고 활용하기' },
    { code: '6수01-02', summary: '분수·소수 곱셈나눗셈하기' },
    { code: '6수02-01', summary: '원 넓이와 직육면체 겉넓이 구하기' },
    { code: '6수03-01', summary: '평균 구하고 자료 해석하기' },
  ],
  '6-사회': [
    { code: '6사01-01', summary: '민주 정치 원리와 선거 이해하기' },
    { code: '6사01-02', summary: '경제생활과 현명한 선택하기' },
    { code: '6사01-03', summary: '세계 여러 나라 생활 모습 알아보기' },
  ],
  '6-과학': [
    { code: '6과01-01', summary: '태양계 행성과 별자리 조사하기' },
    { code: '6과02-01', summary: '계절 변화 원리 설명하기' },
    { code: '6과03-01', summary: '산성·염기성 용액 성질 비교하기' },
  ],
  '6-영어': [
    { code: '6영01-01', summary: '자기소개 짧은 글 쓰기' },
    { code: '6영01-02', summary: '길 묻고 답하기' },
    { code: '6영01-03', summary: '전화·초대 표현 주고받기' },
  ],
};
export function getStandards(grade: number, subject: string): Standard[] {
  return DATA[`${grade}-${subject}`] ?? [];
}

export const GRADES = [1, 2, 3, 4, 5, 6];
export const SUBJECTS = ['국어', '수학', '사회', '과학', '영어'];

/** 코드로 기준 찾기 (학년·과목 정보 포함). */
export function findStandard(code: string): { grade: number; subject: string; summary: string } | null {
  for (const [key, list] of Object.entries(DATA)) {
    const found = list.find((s) => s.code === code);
    if (found) {
      const [grade, subject] = key.split('-');
      return { grade: Number(grade), subject, summary: found.summary };
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
