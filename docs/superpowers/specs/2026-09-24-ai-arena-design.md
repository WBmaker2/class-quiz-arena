# AI 아레나 생성 + 학생 10문제 대결 Spec

날짜: 2026-09-24
원본 참고: https://battlestudyground.web.app/ (학생홈, 리더보드 화면 참고 — 그대로 복사 금지)
상태: 사용자 승인 (Functions+Gemini / 색상+이모지 / 6개 / JSON 내장 / 리더보드 재해석 / 10문제 랜덤)

## 1. 목표

교사가 학년·과목 → 2022 개정 성취기준(내장 JSON) → 문항수(최대 20, 기본 20) → 주제 입력 → 생성 버튼으로 AI 초안을 받고, 검토·수정·추가·삭제 후 아레나를 공개한다. 학생은 공개 아레나에서 1:1 매칭 후 10문제를 랜덤으로 풀어 속도·정확도 대결을 하고 XP·레벨·리더보드로 확인한다. 초등학생용 쉬운 말·짧은 문장.

## 2. 저작권 회피 (필수)

- 원본 로고(금색 그을림), 이름(BattleStudyGround/배틀필드/전투), 병사 캐릭터, 원본 문구·이미지(charlogo.png, logo.png) 사용 금지.
- 리더보드 첨부 이미지는 참고만 한다. 똑같이 만들지 않는다. 변경점: 제목은 자체 문구(예: "우리 반 명예榜" 대신 "우리 반 최고 대결왕"), 순위뱃지 색·모양 자체 디자인, 아바타는 자체 동물 7종, 행 레이아웃 간격·서체·색코드 다르게, "명예의 전당 🏆 / LEADERBOARD · TOP 20" 문구 그대로 사용 금지.
- 교육과정 성취기준 원문 복붙 금지. 요점 paraphrase + "[학년-과목-번호]" 코드로 표기, 출처(교육부 2022 개정) 명시.

## 3. 데이터 모델

- `arenas/{id}`: classroomId, title(주제), desc, grade(1-6), subject(국어/수학/사회/과학/영어), standards[string[]](기준 코드), questionCount(10-20, 기본20), cardTheme{bg, emoji}, isPublic(bool, 기존 locked 대체 — locked=true는 비공개), createdBy, status(draft/published), createdAt
  - 기존 `locked`는 유지하되 의미 고정: `locked==true` = 학생에게 숨김. 신규 `isPublic`과 이중 관리 금지 — `locked` 하나로 통일하고 UI 문구는 "공개/비공개"로 표시.
- `arenas/{id}/problems/{pid}`: text, options[4], answerIndex, explanation(1줄), standardCode, roundTimeSec(30 고정)
- `rooms/{roomId}`: 기존 + `problemIds: string[]`(10개, 매칭 확정 시 고정), `totalRounds=10`
- `users/{uid}`: 기존 유지 (xp, level, streak, winCount, correctRate)
- 규칙 추가: 아레나 publish는 문제 10개 이상일 때만. 10개 미만은 "문제를 10개 이상 넣어주세요" 에러.

## 4. 교육과정 JSON

- `src/data/curriculum2022.ts`: `{ grade: 1-6, subject, standards: [{ code, summary }] }`
- 1차 범위: 6개 기본 아레나에 필요한 학년·과목만 (3수학, 4수학, 4사회, 5과학, 5영어, 6국어). 각 과목 3-5개 기준이면 충분.
- 교사는 1개 이상 체크해야 생성 가능.

## 5. 교사 플로우

1. 새 아레나 → 학년·과목 선택 → 기준 체크리스트 → 문항수(기본20, 10-20) → 주제 입력 → [AI로 초안 만들기]
2. Functions `generateArena` 호출 (Gemini): 입력 기준+주제+문항수로 객관식 4지선다 JSON 생성. 서버에서 검증(개수, options 4개, answerIndex 범위, 빈문항 제거) 후 draft problems 저장.
3. 검토 화면: 문항별 텍스트·선택지·정답·해설 수정, 추가, 삭제. 10개 미만이면 publish 불가 표시.
4. [공개하기] → locked=false. [비공개] → locked=true. 학생 목록에 즉시 반영.

## 6. 학생 플로우 (10문제 랜덤)

- 공개 아레나(`locked==false` + 내 학급)만 카드 노출. 카드: 과목뱃지·학년뱃지·주제·설명·문항수(20문제 중 10문제 대결)·색상+이모지.
- 입장 → 대기(자동매칭) → 둘 다 ready → 방 생성자가 아레나 20문제 중 10개를 랜덤 추출해 `room.problemIds`에 고정 → 양쪽 같은 10문제로 playing → finished → XP 지급.
- 랜덤은 서버시간+roomId 시드 shuffle. 한 번 정하면 방이 끝나도 바뀌지 않음.
- 기존 3문제·전체풀기 로직은 `totalRounds = problemIds.length`로 일반화. 문제 부족(10개 미만) 방은 생성 차단.
- XP: 기존 유지 (정답 10XP, 승리 50, 무승부 20). 10문제로 바뀌어도 단가 동일.

## 6b. 리더보드 (재해석)

- 범위: 같은 학급 Top 20 (`users` where classroomId==내학급 orderBy xp desc limit 20). 기존 전역 Top10에서 변경.
- 행 구성: 순위뱃지(자체 색) + 동물아바타 + 닉네임 + Lv + 승리수 + 정답률 + XP. 원본과 순서·색·문구 다르게.
- 빈 상태: "첫 대결에서 승리하면 이 자리에 올라요!" 유지.
- 내 순위는 목록 상단에 별도 하이라이트 (Top20 밖이어도 "내 순위 N위" 표시).

## 7. 기본 아레나 6개 (각 20문항 저장, 대결은 10 랜덤)

1. 덧셈뺄셈 (3학년 수학, ➗ 하늘색) — 세 자리 덧뺄셈·문장제
2. 관용표현 배틀 (6학년 국어, 📖 분홍) — 실생활 예문 빈칸
3. 분수 첫걸음 (4학년 수학, 🍕 노랑) — 읽기·쓰기·크기비교
4. 물의 여행 (5학년 과학, 💧 파랑) — 순환·상태변화 순서
5. 우리 동네 지도 (4학년 사회, 🗺️ 초록) — 방위·기호·약도
6. Hello English (5학년 영어, 🔤 주황) — 인사·소개 빈칸
- 전부 4지선다·해설 1줄·초등 쉬운 말. `scripts/seedDefaultArenas.mjs`로 주입.

## 8. 테스트

- 단위: shuffle-10(중복없음·10개·방고정), publish 가드(10개 미만 불가), 리더보드 매퍼(Top20 정렬·내순위), locked 필터.
- 에뮬: 방 생성 시 problemIds 10개 고정 + 양쪽 동일 문제 확인, AI draft 저장 모킹.
- 브라우저: 교사 생성→공개→학생 입장→10라운드 완주→XP·리더보드 확인.
