# Class Quiz Arena 릴리스 결과

- 날짜: 2026-09-26
- Firebase 프로젝트: `class-quiz-arena`
- 커밋: [`ed0801b1b4b36a92b112ef8887021db7edddf5ca`](https://github.com/WBmaker2/class-quiz-arena/commit/ed0801b1b4b36a92b112ef8887021db7edddf5ca)
- 원격 푸시: `origin/main` 성공. 코드 릴리스 `ed0801b1b4b36a92b112ef8887021db7edddf5ca` 및 이전 문서 후속 커밋 `ba0d0d0fd304485593f02c4cda53ac01472f46fd` 포함 (`cc63ef9`부터 반영)
- 공개 확인 링크: [Class Quiz Arena](https://class-quiz-arena.web.app/)

## 서비스별 결과

| 서비스 | 결과 | 확인 내용 |
| --- | --- | --- |
| Firestore 인덱스 | 배포 성공 | Firebase CLI 원격 인덱스 정의 5개와 저장소 정의 5개가 일치. 실제 `READY`/`BUILDING` 상태는 CLI 응답에 없고 gcloud 목록 권한도 없어 미검증 |
| Cloud Functions | 배포 완료 | 대결·문제 함수 10개가 `ACTIVE`임을 read-only 목록으로 확인 |
| Firestore Rules | 배포 완료 | 규칙 파일 컴파일 및 운영 release 성공 |
| Firebase Hosting | 배포 완료 | HTML과 새 JS 자산 HTTP 200, 첫 화면 브라우저 확인 통과 |

## 브라우저 확인

- ego-browser에서 페이지 제목 `퀴즈 아레나`, Google 시작 버튼, 배포 스크립트 `/assets/index-B37uD_Ub.js` 로드를 확인했다.
- 320px, 375px, 1280px 화면에서 문서 가로 넘침은 0이며, 시작 버튼 높이는 52px이었다.
- 로그인 후 학생·교사·대결 흐름은 인증된 테스트 계정이 없어 미검증이다.
- HVC 등록은 하지 않았다. 위 공개 URL에서 배포 화면을 확인할 수 있다.

## 후속 참고

- Firestore 인덱스 배포는 성공했으나 인덱스 빌드 상태는 별도 조회 권한이 없어 확인하지 못했다.
- Functions는 Node.js 20 런타임 경고와 오래된 `firebase-functions` 패키지 경고를 출력했다. Firebase 안내에 따르면 Node.js 20은 2026-10-30 이후 배포할 수 없으므로 런타임 업그레이드가 필요하다.
- Firestore Rules 컴파일은 성공했지만 일부 `request` 및 `resource` 이름에 대한 경고가 출력됐다.
