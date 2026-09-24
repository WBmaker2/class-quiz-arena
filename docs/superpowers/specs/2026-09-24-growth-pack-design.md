# 성장팩 설계 (상점·선생님 도구·안전)

날짜: 2026-09-24
상태: 사용자 요청 구현 (F2 상점 / F3-7·8·9 선생님 도구 / F4-10·11 안전)

## F2. 아바타·칭호 상점 (사행성 없음, 순수 수집)

- `users` 확장: `avatar`(기존), `title?: string`(장착 칭호), `unlockedAvatars?: string[]`, `unlockedTitles?: string[]` (없으면 기본값 취급).
- 카탈로그 `src/data/shop.ts`: 아바타 7종(고양이·강아지 무료, 나머지 XP 가격), 칭호 6종(예: 새싹·도전자·연승왕·박사·수호자·전설, XP 가격).
- 구매: 본인 XP 차감 + 목록 추가를 1회 쓰기로 (클라이언트, 기존 XP 지급과 같은 신뢰 수준).
- 학생홈 새 탭 상점: 잠김(가격 표시·구매 버튼) / 보유(선택 버튼). 칭호는 hero와 리더보드에 함께 표시.
- 확률 뽑기 없음. 전부 정가제.

## F3-7. 취약점 리포트 (성취기준 Top3)

- `useAnalytics`가 방의 `problemIds` 순서와 문제의 `standardCode`를 이어서 `RoundRecord.standardCode`를 채운다. 단답형 채점은 `isCorrectAnswer`로 (기존 번호비교는 단답형 오답 처리 버그).
- 기본 범위 최근 7일(`rooms.updatedAt` 기준, 필터 param).
- `weakStandards(rounds, 3)`: 기준별 정답률 집계 → 낮은 순 3개 + 푼 횟수 표시. 분석 탭에 "우리 반이 어려워해요 Top3" 섹션.

## F3-8. 커버리지 지도

- `coverageOf(standards, arenas)`: 학급 아레나들의 `standards[]`에 코드가 하나라도 있으면 출제됨.
- 분석 탭에 학년·과목 선택 + 기준별 초록(출제됨)/회색(안 됨) + "3개 중 1개 출제" 요약.

## F3-9. 문제은행 공유·복제

- 아레나 탭에 은행 섹션: 남의 학급 공개 아레나(`locked==false`, draft 제외) 목록 + 가져오기 버튼.
- 복제본은 내 학급 소속 `locked=true`(비공개 시작) + 제목에 `(복사)` + 문제·성취기준·학년 그대로. 규칙 변경 없음(읽기·내 학급 쓰기 모두 기존 허용).

## F4-10. 저학년 읽어주기 (TTS)

- `src/lib/tts.ts`: `supported()`, `speak(text)`, `stop()`. Web Speech API, 한국어, 속도 0.9.
- 대결 화면 문제 옆 🔊 버튼 (사용자 제스처 1회로 자동재생 정책 통과). 라운드 바뀌면 멈춤.
- 테스트는 `speechSynthesis` 모킹.

## F4-11. 금칙어 + 신고 (부분 구현)

- `src/lib/nickname.ts`: `containsBanned(name)` — 공백·기호 제거 + 자모 변형(ㅅㅂ·ㅄ·ㅈㄹ 등) 정규화 후 대조.
- 적용점: 학생홈 내 기록 탭의 이름 바꾸기(금칙어 저장 차단 + 안내), 선생님 명단의 ⚠ 표시.
- 신고: 결과 화면의 "상대 이름 신고하기" → `reports/{id}` `{reporterUid, reportedUid, reportedNickname, arenaId, classroomId, status:'open', createdAt}`.
- 선생님 신고 탭: 목록 + 처리완료 버튼. 규칙: 생성은 본인만·읽기/처리는 해당 학급 선생님만.
- 승인제(가입 차단 게이트)는 후속 과제 — 현재는 경고+신고+학생삭제(기존) 조합으로 운용.
