# 후속 수정 설계 (Top3 30일·문구·TTS 설정·가입 차단)

날짜: 2026-09-24
상태: 사용자 요청 6건 중 코드 4건 구현 + GitHub·배포

## 1. 취약점 Top3 30일 기준

- `ANALYTICS_WINDOW_MS` 7일 → 30일. 라벨 "최근 7일" → "최근 30일".
- 이유: 주 1회 수업 반은 7일치가 비는 경우가 많아 Top3가 비어 보임.

## 2. 문구 수정

- 문제은행 섹션 제목: "문제은행에서 가져오기" → "다른 반 공개 아레나 가져오기".

## 3. 아레나별 읽어주기 (기본 off)

- `arenas.ttsEnabled?: boolean` (없으면 off). 선생님 아레나 탭에 읽기 켜기/끄기 토글.
- 방 생성 시 값을 `rooms.ttsEnabled`에 복사 고정 (참가자 공개와 같은 방식).
- 대결 화면 🔊 버튼은 `ttsEnabled && ttsSupported()`일 때만 표시. 브라우저 미지원이면 숨김.
- 라운드 변경·화면 이동 시 읽기 중단 (기존 동작 유지).

## 4. 가입 시 금칙어 차단 (2중)

- 1차(화면): 학급 들어가기에 "내 이름" 입력 추가 (기본값=구글 이름). `validateNickname` 실패 시 inline 안내 + 입장 차단.
- 2차(hook): `useClassroom.join/create`가 금칙어를 한 번 더 검사하고 `setError` 후 저장 중단 (우회 저장 방지).
- 선생님 만들기 화면은 그대로 (실명 계정), hook 차단은 동일 적용.

## 6. GitHub·배포

- 레포지토리: `WBmaker2/battle-study-ground` (private). 커밋 정리 후 main 푸시.
- hosting 배포: `npm run build` + `firebase deploy --only hosting --project class-quiz-arena`.
- 비밀값: GEMINI 키는 Secret Manager에만, `.env*`·`*.secret.local`은 git 무시済. 빌드 산출물(`dist/`, `functions/lib/`)도 무시.
