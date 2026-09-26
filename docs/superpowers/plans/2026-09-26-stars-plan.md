# 별 재화·개구리 시작·아바타 8종 구현 계획 (2026-09-26)

## 목표
- XP는 평생 누적(레벨·순위표 전용, 절대 안 깎임), 상점 구매는 새 재화 ‘별⭐’로 분리.
- 신규 가입은 개구리로 시작. 고양이·강아지 포함 나머지는 별 구매.
- 초등학생 취향 아바타 8종 추가 (총 15종).

## 별 획득표 (1판 기준)
- 문제 정답 1개: 1별 (최대 10별)
- 승리: 5별 / 무승부: 2별 / 패배: 0별
- 레벨업 보너스: 10별 × 오른 레벨 수
- 연승 보너스: 새 연승이 3 이상이면 +2별
- 기존 XP의 별 전환 없음 (0부터 시작)

## 상점 가격 (별)
- 개구리 0 · 고양이 10 · 강아지 10 · 거북이 15
- 토끼 20 · 병아리 20 · 호랑이 30
- 판다 40 · 햄스터 40 · 여우 40 · 유니콘 50
- 펭귄 60 · 부엉이 60 · 드래곤 80 · 공룡 100
- 칭호: 새싹 0 · 도전자 10 · 연승왕 30 · 퀴즈박사 60 · 수호자 100 · 전설 200

## 새 아바타 8종
- 토끼🐰 rabbit · 병아리🐤 chick · 판다🐼 panda · 햄스터🐹 hamster
- 여우🦊 fox · 펭귄🐧 penguin · 부엉이🦉 owl · 공룡🦕 dino

## 변경 파일
1. `src/lib/battle.ts` — `STAR_*` 상수 + `starAward()` (기본 별). 테스트 추가.
2. `src/lib/award.ts` — 정산에서 `xp`(누적) + `stars`(지급·0부터) + 레벨업/연승 보너스 함께 기록. 반환을 `{ xp, stars }`로.
3. `src/lib/award.emu.test.ts` — 반환·stars 적립 기대값 갱신.
4. `src/hooks/useProfile.ts` — `Profile`에 `stars?: number`.
5. `src/data/shop.ts` — 위 가격표 + 8종 상품.
6. `src/components/Avatar.tsx` — `Animal` 8종 + 이모지.
7. `src/pages/StudentHome.tsx` — `ANIMALS` 8종, `toAnimal` 대체값 frog, 상점 ‘내 별’·별 차감 표시, 기록 화면 별 표시.
8. `src/App.tsx` — `animal` 초기값 frog, 구매 시 stars 차감.
9. `src/pages/RoleSelect.tsx` — 동물 고르기 삭제, 개구리 시작 안내, `onSelect(..., 'frog')`.
10. `src/pages/JoinFlow.test.tsx` — `'cat'` → `'frog'` (2곳).
11. `src/data/shop.test.ts` — 무료 시작품 frog, 총 15종.
12. `docs/UPDATELOG.md` + `src/data/updatelog.ts` 동일 문구 기록.

## 검증
- `npx vitest run` + `tsc --noEmit`.
- 수동: 대결 1판 → 별 적립 → 상점 구매 → XP·레벨 그대로, 별만 차감 확인.
