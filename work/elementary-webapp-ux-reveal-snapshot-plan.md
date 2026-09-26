# 완료 대결의 문제 정보 스냅샷 보완 계획

- 작성일: 2026-09-26
- 목적: 문제 문서가 나중에 수정돼도 완료된 대결의 문제별 통계가 당시 내용을 유지하게 한다.
- 범위: 서버 내부 `StoredQuestion`에 성취기준을 보존하고, 결과 공개 시 문제 문구와 성취기준을 reveal 스냅샷에 저장한다. 교사 분석은 스냅샷을 우선 사용하고 기존 기록은 현재 문제 문서로 보완한다.
- 개인정보·정답 경계: 학생에게 대전 중 전달하는 `PublicQuestion`에는 정답과 성취기준을 포함하지 않는다. 정답은 기존과 같이 양쪽 제출/결과 공개 후 reveal 경로로만 제공한다.
- 변경 파일: `functions/src/battleLogic.ts`, `functions/src/battleLogic.test.ts`, `src/hooks/useAnalytics.ts`, `src/lib/analytics.ts`, `src/lib/analytics.test.ts`.
- 검증: 스냅샷 생성과 공개 질문 경계 테스트, 분석 메타데이터 우선/legacy fallback 테스트, 전체 관련 테스트 및 Functions 빌드.
