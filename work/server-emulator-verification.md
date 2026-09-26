# 서버 callable 에뮬레이터 검증 계획

- 작성일: 2026-09-26
- 상태: 2026-09-26 핵심 Rules·callable 시나리오 완료. 전체 경합·라운드 조합은 추가 검증 필요.
- 실행: `JAVA_HOME=/opt/homebrew/opt/openjdk PATH=/opt/homebrew/opt/openjdk/bin:$PATH npm_config_cache=/tmp/codex-firebase-npm-cache XDG_CONFIG_HOME=/tmp/codex-firebase-config npx -y firebase-tools emulators:start --only firestore,auth,functions --project demo-quiz-arena`
- 검증: `npm run test:emu -- --maxWorkers=1 src/lib/releasePreflight.emu.test.ts src/hooks/useTeacherRooms.emu.test.ts src/hooks/useReports.emu.test.ts src/hooks/useArenaAdmin.emu.test.ts` — 4개 파일·4개 테스트 통과.

## 완료한 핵심 시나리오

- 학생의 타 학급 공개 아레나·대결방 읽기 거부, 본인 학급 공개 아레나 읽기 허용.
- 교사의 자기 학급 아레나 조회, 문제 편집, 학급 수정과 대결 목록 3종(live, abandoned, finished) 허용.
- 클라이언트의 대결방·보상 문서 쓰기 거부.
- 참가자의 `awardBattle({ roomId })` 중복 호출은 같은 보상을 반환하고 프로필과 기록을 한 번만 반영. 비참가자 호출은 거부.
- 익명 신고 학생은 학급 프로필이 있을 때 신고 가능, 본인 아닌 신고 작성과 학생 목록 조회는 거부.
- 대결 자동 승리는 30초 이후여도 문제 제한 시간이 남아 있으면 불가하며, 제한 시간 종료 경계에서 가능.

## 아직 실행하지 않은 시나리오

- 참가자 B 보상 누적과 승패·정답 수 전체 조합, 미완료 방·미인증 사용자 보상 요청.
- 상품 구매 위조, 부족한 별·중복 구매·미구매 장착, 정상 구매 원자성.
- 매칭 경쟁 호출 두 개, 양쪽 동시 답안, 중복 답안, 만료 뒤 제출을 포함한 callable 간 경합.
- 대결방 문제 복사본으로 원본 편집·삭제 후 채점, 결과 공개 전 정답·해설 비노출의 전체 callable 흐름.
- 운영 배포 후 실제 인증 브라우저 흐름. 운영 프로젝트 조회는 별도 읽기 전용 CLI 확인에서 가능했으나 배포는 수행하지 않음.

## 이전 보상 에뮬레이터 검증의 대체 시나리오

기존 `award.emu.test.ts`는 클라이언트가 점수와 보상 입력값을 전달하던 이전 계약을 검증했다. 새 `awardBattle({ roomId })` 계약에 맞춰 다음 Functions + Auth + Firestore 에뮬레이터 통합 시나리오를 다시 실행해야 한다.

1. Admin SDK로 두 사용자의 프로필과 `serverManaged: true`, `status: finished`인 10라운드 대결방 및 공개된 라운드별 결과를 시드한다. 클라이언트 SDK에서는 방 생성, 답안 쓰기, 보상 문서 쓰기가 거부되는지 확인한다.
2. 참가자 A가 `awardBattle({ roomId })`를 호출하고 같은 사용자가 중복 호출한다. 두 응답의 XP/별이 같고 프로필 증가와 `battles/{roomId}_{uid}` 문서가 각각 한 번만 반영되는지 확인한다.
3. 참가자 B도 호출한다. A/B의 점수·승패·정답 수에 맞는 보상과 누적 프로필 값이 각각 원자적으로 저장되는지 확인한다.
4. 비참가자와 인증되지 않은 사용자의 호출, 미완료 방 보상 요청을 거부하는지 확인한다.
5. 구매 금액을 입력으로 위조할 수 없음을 확인한다. 존재하지 않는 상품, 별 부족, 중복 구매, 미구매 장착은 거부되고 정상 구매 시 프로필 별 차감과 소유 목록 추가가 함께 저장되어야 한다.
6. 방 생성/매칭 경쟁 호출 두 개, 양쪽 동시 답안, 중복 답안, 라운드 종료 뒤 답안 제출을 확인한다. 방은 한 번만 확정되고 첫 답만 유지되며 만료 뒤 제출은 거부되어야 한다.
7. 아레나 원본 문제 수정·삭제 후에도 대결방의 `roomQuestions` 복사본으로 채점되는지 확인한다. 학생 callable 응답에 정답과 해설이 결과 공개 전에 포함되지 않아야 한다.

에뮬레이터는 종료했다. emulator 실행 로그는 작업이 끝난 뒤 정리한다. Firebase Functions emulator 실행 중 호스트 Node 24가 사용됐다는 경고가 있었으며, callable 주요 경로는 에뮬레이터에서 동작했다.
