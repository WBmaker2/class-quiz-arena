# 일러스트 8개씩 구현 계획 (2026-09-25)

## 목표
- 교사 로그인 → `새 아레나 만들기` → `{과목} 일러스트 카드 고르기` 갤러리를 **전 과목 8개씩(13과목 × 8 = 104종)**으로 맞춘다.
- 과목 성격·성취기준 맥락에 맞는 모티프만 고른다. 기존 ID는 유지(학생 카드 깨짐 방지).

## 현황
- `src/components/illustrations.tsx`: 30종, 5과목 × 6종 (수학·국어·사회·과학·영어).
- `subjectsOfGrade()` 실제 과목 13개: 바른 생활, 슬기로운 생활, 즐거운 생활, 국어, 수학, 사회, 과학, 도덕, 체육, 음악, 미술, 영어, 실과.
- 나머지 8과목은 `galleryOf()` 폴백으로 30종 뒤섞어 표시 → 부적합.
- 테스트: `illustrations.test.tsx`에 30/6 하드코딩.

## 추가 목록 (74종)

### 기존 5과목 +2종 (10종)
- 수학: `math-scale` 접시저울(무게·측정), `math-dice` 주사위(규칙·자료)
- 국어: `kor-mic` 발표 마이크(발표·토의), `kor-lens` 돋보기(읽기·탐색)
- 사회: `soc-jar` 항아리 유물(역사자료 추론), `soc-coin` 동전(시장·교환)
- 과학: `sci-scope` 현미경(관찰·분류), `sci-cloud` 구름·해(날씨·지구)
- 영어: `eng-book` 영어 그림책(읽기), `eng-pen` 쓰기 연필(쓰기)

### 신규 8과목 × 8종 (64종)
- 도덕 (`mor-`): heart 하트(감정·존중), hands 손잡기(배려·우애), balance 천칭(공정), sprout 새싹지구(생태·공생), lamp 등불(성찰), family 지붕하트(효·가족), badge 방패체크(약속·규범), gift 나눔상자(봉사)
- 체육 (`phy-`): ball 축구공, rope 줄넘기, shoe 운동화, whistle 호각(규칙), medal 메달(도전), mat 체조매트, cone 콘(민첩), ribbon 리듬리본(표현)
- 음악 (`mus-`): note 음표, drum 북, flute 리코더, keys 건반, bell 핸드벨, speaker 스피커(듣기), song 노래마이크, janggu 장구(국악)
- 미술 (`art-`): palette 팔레트, crayon 크레파스, frame 액자(감상), scissors 가위, pot 도자기, camera 카메라(매체), rainbow 무지개(색), stamp 판화도장
- 실과 (`pra-`): pot 요리냄비, needle 바늘실, hammer 망치(발명), robot 로봇(코딩), plug 플러그(기술), recycle 재활용, sprout 모종삽(농업), pig 저금통(용돈관리)
- 바른 생활 (`bar-`): tooth 칫솔(습관), light 신호등(안전), taegeuk 태극깃발(나라사랑), clock 아침시계(하루), handheart 손하트(배려), bin 분리수거함(지속가능), bag 책가방(학교생활), umbrella 우산(계절)
- 슬기로운 생활 (`slu-`): school 학교, map 마을지도, hanok 한옥(우리문화), globe 세계(다른나라), leafcal 잎달력(계절), tool 공구함(생활도구), bulb 전구책(조사), seed 씨앗(생태)
- 즐거운 생활 (`joy-`): kite 연, ball 놀이공, drum 소고(신체표현), mask 탈(공연), flower 꽃(자연감상), blocks 쌓기나무(만들기), crayon 그림(상상표현), slide 미끄럼틀(건강놀이)

## 그리기 규칙
- 기존 팔레트만 사용: INK/BLUE/YELLOW/PINK/GREEN/ORANGE/PAPER, `viewBox 0 0 64 64`, stroke 3, 납작 스타일.
- 신규는 무문자 도형 위주(기존 ABC/Hi! 2종 예외 유지).
- 영어 mic/phones vs 음악 song/speaker는 색·장식으로 구분.

## 변경 파일
1. `src/components/illustrations.tsx` — `IllustSubject` 13개로 확장, 컴포넌트 74개 + `ART` + `ILLUSTS` 추가, 주석 30종→104종.
2. `src/components/illustrations.test.tsx` — 30→104, 과목별 6→8(13과목 루프), 고유 ID 104.
3. `src/pages/ArenaEditor.tsx` — 로직 변경 없음(확인만). 버튼에 `title={g.label}` 추가 검토.
4. 하드코딩 grep (`30`, `6 per subject`) 후 관련 테스트·문서 숫자 갱신.
5. `docs/UPDATELOG.md` 맨 위 `## 2026-09-25` 섹션에 쉬운 말로 기록.

## 검증
- `npx vitest run src/components/illustrations.test.tsx src/pages/ArenaEditor.test.tsx src/data/curriculum2022.test.ts`
- 전체: `npx vitest run` (209개 통과 목표), `tsc --noEmit`.
- 전 갤러리 렌더 크래시 테스트(104개 순회)로 통과 확인.
