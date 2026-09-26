import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Card from '../components/Card';
import { bandOfGrade, getStandards, subjectsOfGrade } from '../data/curriculum2022';
import { ILLUSTS, Illust, illustsOf } from '../components/illustrations';
import type { CardStyle, ProblemKind } from '../lib/arena';
import type { ArenaInput, EditableProblem } from '../hooks/useArenaAdmin';

const GRADES = [1, 2, 3, 4, 5, 6];

/** 과목 그림이 없으면 전체 104종에서 고른다. (전 과목 8종씩 등록됨) */
function galleryOf(subject: string) {
  const mine = illustsOf(subject);
  return mine.length > 0 ? mine : ILLUSTS;
}
const MIN_PROBLEMS = 10;
const MIN_COUNT = 10;
const MAX_COUNT = 20;
const DEFAULT_COUNT = 20;

/** Task 3 generateArena callable 주고받기 (functions 쪽과 같은 모양, src 독립). */
interface GenerateArenaRequest {
  grade: number;
  subject: string;
  standards: string[];
  count: number;
  topic?: string;
}

interface GenerateArenaResponse {
  problems: {
    text: string;
    kind?: ProblemKind;
    options: string[];
    answerIndex: number;
    answerText?: string;
    explanation?: string;
    standardCode?: string;
  }[];
}

export const MAX_SHORT_ANSWER_LENGTH = 30;

const KIND_LABEL: Record<ProblemKind, string> = { choice: '4지선다', ox: 'O/X', short: '단답형' };

function clampCount(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_COUNT;
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.trunc(n)));
}

function blankProblem(kind: ProblemKind = 'choice'): EditableProblem {
  return {
    text: '',
    kind,
    options: kind === 'ox' ? ['O', 'X', '', ''] : ['', '', '', ''],
    answerIndex: 0,
    answerText: '',
    explanation: '',
  };
}

/** 서버 에러 코드에 맞는 한 줄 안내. 원인은 콘솔에도 남겨 다음 진단에 쓴다. */
export function friendlyAiError(err: unknown): string {
  const code = typeof err === 'object' && err !== null ? String((err as { code?: unknown }).code ?? '') : '';
  const message = err instanceof Error ? err.message : '';
  if (code === 'resource-exhausted' || /20회/.test(message)) {
    return '오늘 AI 만들기 20회를 다 썼어요. 내일 다시 해주세요.';
  }
  if (code === 'unauthenticated') {
    return '로그인이 풀렸어요. 다시 로그인한 뒤 눌러주세요.';
  }
  if (code === 'invalid-argument') {
    return '학년·과목·성취기준을 다시 확인하고 눌러주세요.';
  }
  return 'AI 초안 만들기에 실패했어요. 직접 문제를 넣어주세요.';
}

/** 공개 전 내용 검사. 문제 있으면 사람이 읽는 한 줄 설명, 없으면 null. */
export function findProblemError(items: EditableProblem[]): string | null {
  for (const [i, p] of items.entries()) {
    const kind = p.kind ?? 'choice';
    if (!p.text.trim()) return `${i + 1}번 문제 내용이 비었어요`;
    if (kind === 'short') {
      const want = (p.answerText ?? '').trim();
      if (!want) return `${i + 1}번 단답형 정답이 비었어요`;
      if (want.length > MAX_SHORT_ANSWER_LENGTH) return `${i + 1}번 단답형 정답이 너무 길어요`;
      continue;
    }
    const opts = kind === 'ox' ? p.options.slice(0, 2) : p.options;
    if (opts.some((o) => !o.trim())) return `${i + 1}번 빈 선택지가 있어요`;
    if (new Set(opts.map((o) => o.trim())).size !== opts.length) return `${i + 1}번 선택지가 겹쳐요`;
  }
  return null;
}

function normalizeDraft(p: GenerateArenaResponse['problems'][number]): EditableProblem {
  const kind: ProblemKind = p.kind === 'ox' || p.kind === 'short' ? p.kind : 'choice';
  const options =
    kind === 'ox'
      ? (['O', 'X', '', ''] as [string, string, string, string])
      : ([
          p.options?.[0] ?? '',
          p.options?.[1] ?? '',
          p.options?.[2] ?? '',
          p.options?.[3] ?? '',
        ] as [string, string, string, string]);
  const answerIndex = Number.isInteger(p.answerIndex) ? Math.min(3, Math.max(0, p.answerIndex)) : 0;
  return {
    text: p.text ?? '',
    kind,
    options,
    answerIndex,
    answerText: kind === 'short' ? (p.answerText ?? '') : '',
    explanation: p.explanation ?? '',
    ...(typeof p.standardCode === 'string' && p.standardCode ? { standardCode: p.standardCode } : {}),
  };
}

export default function ArenaEditor({
  initial,
  problems,
  onSave,
  onCancel,
}: {
  initial: ArenaInput;
  problems: EditableProblem[];
  onSave: (input: ArenaInput, problems: EditableProblem[]) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [desc, setDesc] = useState(initial.desc);
  const [grade, setGrade] = useState(initial.grade ?? 3);
  const [subject, setSubject] = useState(() => {
    const options = subjectsOfGrade(initial.grade ?? 3);
    return options.includes(initial.subject) ? initial.subject : (options[0] ?? '국어');
  });
  const [selected, setSelected] = useState<string[]>(initial.standards ?? []);
  const [count, setCount] = useState(initial.questionCount >= MIN_COUNT && initial.questionCount <= MAX_COUNT ? initial.questionCount : DEFAULT_COUNT);
  const [topic, setTopic] = useState(initial.topic ?? '');
  const [illustId, setIllustId] = useState(
    initial.illustId ?? galleryOf(subjectsOfGrade(initial.grade ?? 3).includes(initial.subject) ? initial.subject : subjectsOfGrade(initial.grade ?? 3)[0])[0]?.id ?? 'math-plus',
  );
  const [items, setItems] = useState<EditableProblem[]>(problems);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiInfo, setAiInfo] = useState<string | null>(null);

  const standards = getStandards(grade, subject);
  const subjectOptions = subjectsOfGrade(grade);
  const gallery = galleryOf(subject);
  const contentError = findProblemError(items);
  const canPublish = items.length >= MIN_PROBLEMS && contentError === null;

  const changeGrade = (next: number) => {
    setGrade(next);
    const options = subjectsOfGrade(next);
    const nextSubject = options.includes(subject) ? subject : (options[0] ?? subject);
    setSubject(nextSubject);
    const codes = new Set(getStandards(next, nextSubject).map((s) => s.code));
    setSelected((prev) => prev.filter((c) => codes.has(c)));
    const gal = galleryOf(nextSubject);
    setIllustId((prev) => (gal.some((g) => g.id === prev) ? prev : (gal[0]?.id ?? 'math-plus')));
  };

  const changeSubject = (next: string) => {
    setSubject(next);
    const codes = new Set(getStandards(grade, next).map((s) => s.code));
    setSelected((prev) => prev.filter((c) => codes.has(c)));
    const gal = galleryOf(next);
    setIllustId((prev) => (gal.some((g) => g.id === prev) ? prev : (gal[0]?.id ?? 'math-plus')));
  };

  const removeStandard = (code: string) => {
    setSelected((prev) => prev.filter((c) => c !== code));
  };

  const updateItem = (index: number, patch: Partial<EditableProblem>) => {
    setItems(items.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const updateOption = (index: number, opt: number, value: string) => {
    setItems(
      items.map((p, i) => {
        if (i !== index) return p;
        const options = [...p.options] as [string, string, string, string];
        options[opt] = value;
        return { ...p, options };
      }),
    );
  };

  const makeDraft = async () => {
    setAiError(null);
    setAiInfo(null);
    const finalCount = clampCount(count);
    setCount(finalCount);
    setAiBusy(true);
    try {
      const call = httpsCallable<GenerateArenaRequest, GenerateArenaResponse>(getFunctions(), 'generateArena');
      const res = await call({
        grade,
        subject,
        standards: selected,
        count: finalCount,
        ...(topic.trim() ? { topic: topic.trim() } : {}),
      });
      const drafts = (res.data.problems ?? []).map(normalizeDraft);
      setItems((prev) => [...prev, ...drafts]);
      if (drafts.length < finalCount) {
        setAiInfo(`AI가 ${drafts.length}개 문제를 가져왔어요. 나머지는 직접 넣어주세요.`);
      }
    } catch (err) {
      // 실패해도 직접 쓴 문제는 그대로 두고 이어서 편집한다
      console.error('AI 초안 만들기 실패:', err);
      setAiError(friendlyAiError(err));
    } finally {
      setAiBusy(false);
    }
  };

  const publish = () => {
    if (!canPublish) return;
    onSave(
      { title, desc, subject, questionCount: clampCount(count), grade, gradeBand: bandOfGrade(grade), topic, standards: selected, status: 'published', cardStyle: 'illust' as CardStyle, illustId },
      items,
    );
  };

  return (
    <Card>
      <label htmlFor="arena-title">아레나 이름</label>
      <input id="arena-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label htmlFor="arena-desc">설명</label>
      <input id="arena-desc" value={desc} onChange={(e) => setDesc(e.target.value)} />

      <label htmlFor="arena-grade">학년</label>
      <select id="arena-grade" value={grade} onChange={(e) => changeGrade(Number(e.target.value))}>
        {GRADES.map((g) => (
          <option key={g} value={g}>
            {g}학년
          </option>
        ))}
      </select>
      <label htmlFor="arena-subject">과목</label>
      <select id="arena-subject" value={subject} onChange={(e) => changeSubject(e.target.value)}>
        {subjectOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label htmlFor="arena-standard">성취기준 (1개 이상 고르기)</label>
      <select
        id="arena-standard"
        value=""
        onChange={(e) => {
          const code = e.target.value;
          if (code && !selected.includes(code)) setSelected([...selected, code]);
        }}
      >
        <option value="">기준을 골라 추가하세요</option>
        {standards.map((s) => (
          <option key={s.code} value={s.code} disabled={selected.includes(s.code)}>
            {s.code} {s.summary}
          </option>
        ))}
      </select>
      {standards.length === 0 && <p>이 학년·과목에는 등록된 기준이 없어요</p>}
      {selected.length === 0 ? (
        <p>성취기준을 1개 이상 골라주세요</p>
      ) : (
        <ul className="mt-2">
          {selected.map((code) => (
            <li key={code} className="standard-chip">
              <span className="flex-1">{standards.find((s) => s.code === code)?.summary ?? code}</span>
              <button type="button" aria-label={`${code} 삭제`} onClick={() => removeStandard(code)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <label htmlFor="arena-count">문제 수</label>
      <input
        id="arena-count"
        type="number"
        min={MIN_COUNT}
        max={MAX_COUNT}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        onBlur={(e) => setCount(clampCount(Number(e.target.value)))}
      />
      <label htmlFor="arena-topic">주제</label>
      <input
        id="arena-topic"
        value={topic}
        placeholder="예: 받아올림이 있는 덧셈"
        onChange={(e) => setTopic(e.target.value)}
      />

      <fieldset>
        <legend>{subject} 일러스트 카드 고르기</legend>
        <div className="flex flex-wrap gap-2">
          {gallery.map((g) => (
            <button
              key={g.id}
              type="button"
              className="illust-pick"
              aria-label={`${g.label} 그림 고르기`}
              aria-pressed={illustId === g.id}
              onClick={() => setIllustId(g.id)}
            >
              <Illust id={g.id} size={56} />
            </button>
          ))}
        </div>
      </fieldset>

      <button type="button" className={!aiBusy && selected.length > 0 ? 'btn-pulse' : undefined} onClick={() => void makeDraft()} disabled={aiBusy || selected.length === 0}>
        {aiBusy ? 'AI가 문제를 만드는 중...' : 'AI로 초안 만들기'}
      </button>
      {aiError && <p>{aiError}</p>}
      {aiInfo && <p>{aiInfo}</p>}

      <p>문제 {items.length}개</p>
      {items.length === 0 && <p>아직 등록된 문제가 없어요</p>}
      {items.map((p, i) => (
        <div key={`problem-${i}`}>
          {p.standardCode ? <p>{p.standardCode}</p> : null}
          <label>
            문제 {i + 1} 유형
            <select
              aria-label={`문제 ${i + 1} 유형`}
              value={p.kind ?? 'choice'}
              onChange={(e) => {
                const kind = e.target.value as ProblemKind;
                updateItem(i, {
                  kind,
                  options: kind === 'ox' ? ['O', 'X', '', ''] : p.options,
                  answerIndex: kind === 'ox' ? Math.min(1, p.answerIndex) : p.answerIndex,
                });
              }}
            >
              {(Object.keys(KIND_LABEL) as ProblemKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          <label>
            문제 {i + 1} 내용
            <textarea
              rows={3}
              value={p.text}
              onChange={(e) => updateItem(i, { text: e.target.value })}
            />
          </label>
          {(p.kind ?? 'choice') === 'short' ? (
            <label>
              문제 {i + 1} 단답형 정답
              <input
                value={p.answerText ?? ''}
                maxLength={MAX_SHORT_ANSWER_LENGTH}
                onChange={(e) => updateItem(i, { answerText: e.target.value })}
              />
            </label>
          ) : (p.kind ?? 'choice') === 'ox' ? (
            <div>
              <p>O / X 중 정답을 고르세요</p>
              {[0, 1].map((k) => (
                <label key={k}>
                  <input
                    type="radio"
                    name={`answer-${i}`}
                    aria-label={`문제 ${i + 1} 정답: ${k === 0 ? 'O' : 'X'}`}
                    checked={p.answerIndex === k}
                    onChange={() => updateItem(i, { answerIndex: k })}
                  />
                  {k === 0 ? 'O' : 'X'}
                </label>
              ))}
            </div>
          ) : (
            p.options.map((opt, k) => (
              <div key={k}>
                <label>
                  <input
                    type="radio"
                    name={`answer-${i}`}
                    aria-label={`문제 ${i + 1} 정답: ${k + 1}번`}
                    checked={p.answerIndex === k}
                    onChange={() => updateItem(i, { answerIndex: k })}
                  />
                  {k + 1}번 보기 내용
                </label>
                <input
                  aria-label={`문제 ${i + 1} 선택지 ${k + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, k, e.target.value)}
                />
              </div>
            ))
          )}
          <label>
            문제 {i + 1} 해설
            <input value={p.explanation ?? ''} onChange={(e) => updateItem(i, { explanation: e.target.value })} />
          </label>
          <button type="button" aria-label={`문제 ${i + 1} 삭제`} onClick={() => setItems(items.filter((_, j) => j !== i))}>
            삭제
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, blankProblem()])}>
        추가
      </button>

      <button type="button" className={canPublish ? 'btn-pulse' : undefined} onClick={publish} disabled={!canPublish}>
        공개하기
      </button>
      {!canPublish && <p>{items.length < MIN_PROBLEMS ? '문제를 10개 이상 넣어주세요' : contentError}</p>}
      <button type="button" onClick={onCancel}>
        취소
      </button>
    </Card>
  );
}
