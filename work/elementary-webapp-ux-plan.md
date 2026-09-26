# 초등 학습자 관점 프로젝트 감사 계획

- 날짜: 2026-09-26
- 대상: `class-quiz-arena` 현재 로컬 `main` 체크아웃
- 모드: `audit-only` (사용자 요청은 분석 및 개선점 도출)
- 범위: 학생 첫 진입부터 학급 참여, 대전, 결과와 복습까지의 흐름; 교사 제작·운영 화면; 코드 구조, 상태·보상 알고리즘, Firebase 권한, 디자인·UI·UX, 한국어 문구
- 경계: 앱 코드, 설정, 이미지, 의존성을 수정하거나 커밋·푸시·배포하지 않는다. 조사 기록만 `work/`에 저장한다. VoiceOver 검증은 제외한다.

## 조사 순서

1. Stage 0 결과와 프로젝트 규칙, 기존 변경 상태 확인
2. 실행 경로·데이터 모델·화면 상태 전이 및 테스트 구조 파악
3. `ego-browser`로 실제 앱을 320×800, 375×812, 1280×900에서 관찰하고 가능한 학생·교사 흐름을 따라간다
4. 기본 아레나의 학년 분포를 확인하여 초등 3–4학년 준호를 주 페르소나로, 초등 1–2학년 민서와 5–6학년 서윤을 가드레일로 문구·행동·오류 회복을 감사한다
5. 전투·XP/별·문항 선택·권한 알고리즘을 소스와 테스트로 확인하고 기존 테스트·빌드를 실행한다
6. `ui-ux-pro-max` 한 경로와 스킬의 아동 UX 루브릭으로 시각·조작·접근성 검토
7. P0–P3 이슈별 관찰 근거, 원인 가설, 변경안, 같은 시나리오의 확인 기준을 보고한다

## 산출물

- `work/elementary-webapp-ux-bootstrap.md`
- `work/elementary-webapp-ux-language-candidates.md`
- `work/elementary-webapp-ux-language-audit.md`
- `work/elementary-webapp-ux-simulation-decision.md`
- `work/elementary-webapp-ux-audit.md` (최종 분석과 우선순위)

로그인이나 외부 서비스 접근 때문에 실행하지 못한 상태는 코드 추론과 구분해 `not run` 또는 `blocked`로 기록한다.
