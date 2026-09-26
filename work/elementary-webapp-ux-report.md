# Class Quiz Arena 개선 결과 보고서

- 날짜: 2026-09-26
- 범위: 승인된 로컬 구현과 검증, 커밋·푸시 및 Firebase 배포 완료. HVC 등록은 수행하지 않음.
- 릴리스 커밋: [`ed0801b1b4b36a92b112ef8887021db7edddf5ca`](https://github.com/WBmaker2/class-quiz-arena/commit/ed0801b1b4b36a92b112ef8887021db7edddf5ca)
- 기준 문서: [`elementary-webapp-ux-implementation-plan.md`](elementary-webapp-ux-implementation-plan.md), [`elementary-webapp-ux-audit.md`](elementary-webapp-ux-audit.md)

## 구현 결과

- 학급 입장에 실패하면 이유와 다시 시도할 방법을 보여주고, 학생 화면에는 소속 학급의 공개 문제만 표시한다.
- 대결 중 새로고침 후 진행 중인 방을 복원하고, 한 번 제출한 답을 바꾸지 못하게 했다. 전송 실패는 다시 시도할 수 있다.
- 결과에서 당시 문제, 내 답, 정답과 검토된 해설을 다시 볼 수 있다. 교사 분석은 대결 종료 당시의 문제 문구·성취기준을 저장해 문제 문서가 나중에 수정돼도 기록이 바뀌지 않게 했다. 기존 기록은 당시 스냅샷이 없을 때 현재 문제 자료를 사용한다.
- 문제별 통계는 실제 응답 수를 기준으로 계산하고, 문제 ID·문구·성취기준·정답이 바뀐 버전을 따로 집계한다. 기록이 없으면 0% 대신 ‘기록 없음’으로 표시한다.
- 학생·교사 화면의 좁은 화면 배치, 문제 수와 준비 상태 안내, 로딩·연결 오류 후 재시도 흐름을 보완했다.
- 로그인 화면은 먼저 필요한 부분만 불러오고 학생·교사·대결·문제 편집 화면은 해당 화면을 열 때 불러온다. 첫 JS 청크는 1,012,718 B에서 832,562 B로 약 17.8% 줄었다. 500 kB 경고는 남아 있다.
- 학급 권한·대결 결과·보상 검증을 Rules와 Functions 쪽에 추가했다. 이는 로컬 소스 변경이며 운영 배포 상태를 뜻하지 않는다.

## 검증 결과

| 항목 | 결과 | 증거 |
| --- | --- | --- |
| 전체 테스트 | 통과 | 43개 파일, 279개 테스트. 에뮬레이터를 종료한 상태로 실행 |
| 업데이트 내역 일치 | 통과 | `src/data/updatelog.test.ts` 2개 통과 |
| 대결·자동 승리 경계 | 통과 | `BattleRoom` 화면과 battle 로직 테스트. 30초 및 제한 시간 60초 경계 포함 |
| 웹 빌드 | 통과 | `npm run build`; 첫 청크 832,562 B, gzip 251,991 B. 500 kB 초과 경고가 남음 |
| Functions 빌드 | 통과 | `npm --prefix functions run build` |
| diff 공백 검사 | 통과 | `git diff --check` |
| 배포된 첫 화면·반응형 | 통과 | ego-browser: 페이지 제목 ‘퀴즈 아레나’, Google 시작 버튼 표시, 320/375/1280px에서 가로 넘침 0, 버튼 높이 52px |
| Firebase Rules·callable 에뮬레이터 | 통과 | 4개 통합 테스트 파일 통과. 타 학급 arena/room 차단, 자기 반 공개 arena 읽기, 교사 문제·학급 편집과 대결 목록 3종, 클라이언트 room/battle 쓰기 차단, 보상 중복 방지와 비참가자 거부 확인 |
| Firestore 인덱스 배포 | 배포 성공 | Firebase CLI 원격 정의 5개가 저장소 정의 5개와 일치. `READY`/`BUILDING` 상태는 CLI 응답에 없고 별도 조회 권한이 없어 미검증 |
| Functions 배포 | 배포 및 준비 완료 | 대결·문제 함수 10개가 `ACTIVE`. Node.js 20 및 오래된 `firebase-functions` 버전 경고가 배포 로그에 남음 |
| Firestore Rules 배포 | 배포 성공 | Rules 컴파일 후 운영 규칙 release 완료. 일부 `request`/`resource` 이름 경고가 있었으나 배포는 성공 |
| Hosting 배포 | 배포 성공 | 운영 URL HTML과 새 JS 자산 모두 HTTP 200. 브라우저에서 `/assets/index-B37uD_Ub.js` 로드 확인 |
| 인증 후 학생·교사·대결 흐름 | 미실행 | 인증된 테스트 계정이 없어 브라우저에서 확인하지 않음 |
| HVC 등록 | 미실시 | 이번 승인 범위에 포함되지 않음 |
| VoiceOver | 제외 | 프로젝트 지침에 따름 |

## 결과 확인 링크

- 배포 결과는 [Class Quiz Arena](https://class-quiz-arena.web.app/)에서 확인할 수 있다. 이 링크는 공개 Hosting 사이트이며 HVC 등록을 뜻하지 않는다.

## 남은 확인

실제 배포 후 인증된 학생·교사 계정으로 브라우저 대결 흐름을 확인하지 않았다. 인덱스 정의 배포는 성공했지만 실제 빌드 상태(`READY`/`BUILDING`)는 미확인이다. Node.js 20 런타임은 2026-10-30 이후 배포할 수 없다는 Firebase CLI 경고가 있었으므로 런타임 업그레이드가 후속 과제다.
