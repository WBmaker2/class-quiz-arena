# 에뮬레이터 테스트 방법

실서버를 건드리지 않고 Firestore·Auth를 흉내 내서 테스트하는 방법이에요.

## 준비물 (이 컴퓨터 기준)

- 자바: `export JAVA_HOME=/opt/homebrew/opt/openjdk PATH="$JAVA_HOME/bin:$PATH"`
  (안 하면 에뮬레이터가 켜지지 않아요)

## 순서 (터미널 2개)

터미널 1 — 에뮬레이터 켜기:

```bash
npm run emulators
```

터미널 2 — 자료 넣고 테스트하기:

```bash
npm run seed
npm run test:emu
```

## 명령어 정리

- `npm test` — 가짜 DB 없이 돌아가는 테스트 59개 (에뮬레이터 꺼져 있어도 됨)
- `npm run test:emu` — 에뮬레이터가 켜져 있을 때만 도는 테스트 (`*.emu.test.ts` 2개: XP 지급, 아레나 편집)
- `npm run seed` — 연습용 학급·아레나·문제·사용자 넣기
- `npm run emulators` — Auth(9099) + Firestore(8080) 켜기

## 새 에뮬레이터 테스트를 추가할 때

- 파일 이름을 `이름.emu.test.ts`로 지으면 `npm test`에서는 빠지고 `npm run test:emu`에서만 돌아요.
- 에뮬레이터에 연결된 DB를 쓰므로, 테스트끼리 겹치지 않게 고유한 방 ID (`r-${Date.now()}`)를 쓰세요.
