# Class Quiz Arena 개선판 릴리스 계획

- 날짜: 2026-09-26
- 승인 범위: 이번 로컬 구현의 커밋, `origin/main` 푸시, Firebase 프로젝트 `class-quiz-arena` 배포.
- 역할: 주 에이전트가 순서와 증거를 검토하고, 실제 코드 수정·커밋·푸시·배포는 `gpt-6-luna` subagent가 수행한다.

## 릴리스 전 확인

1. 변경 목록을 확인하고 `.DS_Store`, 비밀 설정, 생성물은 커밋에서 제외한다. `docs/UPDATELOG.md`와 `src/data/updatelog.ts`는 함께 포함한다.
2. 전체 테스트, 웹 빌드, Functions 빌드, `git diff --check`를 재실행한다.
3. Firebase 에뮬레이터를 실행할 수 있으면 기존 통합 테스트와 역할별 Rules 거부·허용 시나리오를 확인한다. 접근 권한 검증이 실패하면 원인을 고치고 다시 확인한 뒤 배포한다.
4. Firebase CLI 로그인 상태, 대상 프로젝트, 배포할 서비스와 Firestore 인덱스를 확인한다.

## 배포 순서

1. 검증된 변경만 한 커밋으로 묶어 `origin/main`에 푸시한다.
2. Firestore 인덱스와 Functions를 먼저 배포하고, 새 대결 API가 준비된 것을 확인한다.
3. Firestore Rules와 Hosting을 배포한다. 배포 오류가 발생하면 성공한 범위와 남은 범위를 정확히 기록한다.
4. 실제 Hosting 주소의 HTTP 응답·자산 로드·첫 화면을 확인한다. 로그인 이후 흐름은 테스트 계정으로 확인할 수 있을 때만 통과로 기록한다.

## 보고

커밋 SHA, 원격 푸시 결과, 각 Firebase 서비스 배포 결과, 공개 URL, 브라우저 확인 범위, 남은 검증 제한을 구분해 보고한다.
