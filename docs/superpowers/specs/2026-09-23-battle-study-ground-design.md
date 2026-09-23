# Battle Study Ground 클론 — 기본 설계

날짜: 2026-09-23
원본: https://battlestudyground.web.app/
방향: 전체 기능 클론 + Firebase 그대로 + 디자인 재해석 (저작권 회피)
상태: 사용자 승인 완료 (2026-09-23)

## 1. 목표

선생님이 낸 문제로 친구와 1:1 퀴즈 대결을 하는 학습 게임의 작동 방식을 그대로 재현한다. 겉모습은 비슷하게 만들되, 이름·문구·그림·버튼은 일부러 다르게 만들어 저작권 문제를 피한다.

## 2. 기술 구성

- 프론트: Vite + React (SPA 한 개), 상태 값으로 화면 전환 (라우터 라이브러리 없음)
- 스타일: Tailwind CSS v4, Pretendard Variable 본문 + Bebas Neue 제목 + JetBrains Mono 숫자
- 아이콘: Lucide
- 백엔드: Firebase Auth(구글 로그인) + Firestore(실시간 구독) + Firebase Hosting
- 1단계에서는 Cloud Functions를 쓰지 않는다. 승리·경험치 지급은 클라이언트 트랜잭션과 `awarded` 플래그로 중복 지급을 막는다.
- 폴더 구조: `src/pages`(역할별 화면), `src/hooks`(useAuth, useClassroom, useBattleRoom), `src/components`(카드, 버튼, 아바타, 타이머), `src/lib`(firebase 설정, XP 계산, 상태머신)

## 3. 화면과 흐름

### 3.1 로그인
크림색 배경 + 떠다니는 게임 아이콘 + 가운데 카드. 카드 안에 자체 캐릭터, 자체 로고, 안내 문구, 구글 로그인 버튼이 들어간다.

### 3.2 역할 선택
로그인 후 선생님/학생 중 하나를 고른다. 한 번 고르면 저장되고, 학급 입장 화면으로 넘어간다.

### 3.3 학생 홈 (탭 3개)
- 둘러보기: 참여 중인 아레나 목록, "지금 바로 대결!" 버튼 (같은 반 친구와 자동 연결)
- 순위표: 반 순위, 첫 승리 전에는 안내 문구 표시
- 내 기록: 총 XP, 레벨(다음 레벨까지 남은 XP), 연승, 정답률

### 3.4 대결 흐름
대기(자동 매칭) → 준비 확인(상대 이름은 ??? 로 가림) → 문제 라운드(타이머, 미응답이면 다음 라운드) → 결과(XP·연승 반영). 오래 답이 없으면 "자동 승리" 버튼이 나온다.

### 3.5 선생님 공간 (탭 4개)
- 현재 대결: 진행 중 목록, 강제 종료, 방치된 대결 표시
- 아레나 관리: 만들기·수정·삭제·잠금/해제, 문제 편집기(새 문제 추가, AI 문제 개수 표시)
- 학생: QR 초대(탭해서 확대), 일괄 관리, 삭제
- 분석: 어려운 문제, 맞힌/틀린 평균, 응답이 20라운드 이상인 학생 기준 통계. 기록이 없으면 빈 화면 안내를 보여준다.

## 4. 데이터 구조 (Firestore)

- `users/{uid}`: nickname, role(teacher/student), avatar(자체 동물 7종 중 1개), classroomId, xp, level, streak, winCount, correctRate
- `classrooms/{id}`: name, inviteCode, teacherId, locked
- `arenas/{id}`: classroomId, title, desc, subject, locked, createdBy (원본의 battlefields를 다른 이름으로 부름)
- `arenas/{id}/problems/{pid}`: text, options(배열), answerIndex, roundTimeSec
- `rooms/{roomId}`: arenaId, status(waiting/ready/playing/finished/abandoned), players(2명: uid, nickname, avatar, score, hp, ready), currentRound, roundEndsAt, winnerUid, locked
- `battles/{battleId}`: roomId, rounds(문제별: questionId, p1Answer, p2Answer, correctUid), awarded(중복 지급 방지), endedAt
- 실측에서 확인된 이름 `users`, `rooms`, `battles`는 그대로 쓴다. `battlefields`는 `arenas`로 바꾼다.

## 5. 실시간 규칙

- 상태 순서: waiting → ready(둘 다 준비) → playing(라운드 반복) → finished/abandoned
- 시간 기준은 Firestore 서버 시간을 쓰고, `roundEndsAt`이 지나면 자동으로 다음 라운드로 넘긴다.
- 결과 확정은 트랜잭션 1회로 처리하고, `awarded`가 이미 참이면 다시 지급하지 않는다.
- 준비 화면에서는 상대 이름을 ??? 로 가리고, 라운드가 시작되면 공개한다.
- 선생님은 잠금 토글로 입장을 막을 수 있고, 진행 중 대결을 강제 종료할 수 있다.

## 6. 저작권 회피 변형표 (필수)

원본과 헷갈리지 않게 아래 항목은 반드시 다르게 만든다.

- 이름: BattleStudyGround, 배틀필드, 전투 사용 금지. 대신 아레나, 대결, 문제 라운드로 부른다.
- 로고: 금색 그을린 글씨 스타일 금지. 납작한 방패+번개 엠블럼과 둥근 한글 로고로 새로 만든다.
- 캐릭터: 헬멧+와이셔츠 병사 그림 금지. 자체 동물 아바타 7종(고양이, 강아지, 호랑이, 개구리, 유니콘, 드래곤, 거북이)을 새로 그린다.
- 문구 예시: "선생님이 만든 문제로 친구와 1:1 퀴즈 배틀!" → "선생님 문제로 친구와 1:1 퀴즈 대결!". "구글로 로그인하기" → "Google 계정으로 시작하기". "지금 바로 배틀!" → "지금 바로 대결!". "준비 중/곧 시작/무승부" 톤은 유지하되 문장을 그대로 복사하지 않는다.
- 버튼: 검정 그라데이션+4px 하드 섀도우 원본 스타일 대신, 남색 단색+3px 섀도우+둥근 모서리 16px로 바꾼다.
- 배경: 크림 페이퍼 느낌은 유지하되 색 코드와 카드 그림자 수치를 다르게 하고, 떠다니는 아이콘의 위치·색·조합을 바꾼다.
- 교육과정 성취기준 문장은 그대로 넣지 않는다. 문제 예시는 직접 쓴 짧은 문장으로 대체한다.

## 7. 에러와 빈 화면

- 잘못된 초대 링크: 초대 링크가 올바르지 않다는 뜻의 자체 문구 + 돌아가기 버튼
- 닫힌 아레나: 선생님이 아레나를 잠시 닫았다는 뜻의 자체 문구
- 진행 중 대결 없음, 종료된 대결 없음, 등록된 문제 없음, 등록된 학생 없음: 각 화면에 맞는 짧은 안내와 다음 행동 버튼을 보여준다.
- 네트워크 끊김: Firestore 구독 에러를 카드형 안내로 보여주고 다시 시도 버튼을 둔다.

## 8. 테스트

- 단위 테스트(Vitest): XP·레벨 계산, 연승·정답률 계산, 상태머신 전이, awarded 중복 방지
- 브라우저 테스트(Playwright): 로그인 → 역할 선택 → 아레나 입장 → 매칭 → 1라운드 → 결과까지 통과
- Firestore 에뮬레이터로 룸 2인 접속, 타이머 만료, 강제 종료, 중복 지급 방지를 확인한다.

## 9. 1단계에서 하지 않는 것

- Cloud Functions 서버 로직, 리포트 PDF, 결제, 관리자 모드, 푸시 알림은 만들지 않는다.
- 원본 이미지(charlogo.png, logo.png)를 내려받아 쓰지 않는다.

## 10. 승인 기록

- 2026-09-23: 아키텍처, 화면 IA, 스키마, 상태머신, 대체 디자인, 에러·테스트 6개 섹션 모두 승인됨.
- 다음 단계: 구현 계획서 작성 (writing-plans 스킬).
