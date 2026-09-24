import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Card from '../components/Card';
import { getStandards } from '../data/curriculum2022';
import type { ArenaInput, EditableProblem } from '../hooks/useArenaAdmin';

const GRADES = [1, 2, 3, 4, 5, 6];
const SUBJECTS = ['수학', '국어', '과학', '사회', '영어'];
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
  arenaId: string;
  problems: { text: string; options: string[]; answerIndex: number; explanation?: string }[];
}

function clampCount(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_COUNT;
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.trunc(n)));
}

function blankProblem(): EditableProblem {
  return { text: '', options: ['', '', '', ''], answerIndex: 0, explanation: '' };
}

function normalizeDraft(p: GenerateArenaResponse['problems'][number]): EditableProblem {
  const options = [p.options?.[0] ?? '', p.options?.[1] ?? '', p.options?.[2] ?? '', p.options?.[3] ?? ''] as [
    string,
    string,
    string,
    string,
  ];
  const answerIndex = Number.isInteger(p.answerIndex) ? Math.min(3, Math.max(0, p.answerIndex)) : 0;
  return { text: p.text ?? '', options, answerIndex, explanation: p.explanation ?? '' };
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
  const [subject, setSubject] = useState(SUBJECTS.includes(initial.subject) ? initial.subject : '수학');
  const [selected, setSelected] = useState<string[]>(initial.standards ?? []);
  const [count, setCount] = useState(initial.aiCount >= MIN_COUNT && initial.aiCount <= MAX_COUNT ? initial.aiCount : DEFAULT_COUNT);
  const [topic, setTopic] = useState(initial.topic ?? '');
  const [items, setItems] = useState<EditableProblem[]>(problems);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiInfo, setAiInfo] = useState<string | null>(null);

  const standards = getStandards(grade, subject);
  const canPublish = items.length >= MIN_PROBLEMS;

  const changeGrade = (next: number) => {
    setGrade(next);
    const codes = new Set(getStandards(next, subject).map((s) => s.code));
    setSelected((prev) => prev.filter((c) => codes.has(c)));
  };

  const changeSubject = (next: string) => {
    setSubject(next);
    const codes = new Set(getStandards(grade, next).map((s) => s.code));
    setSelected((prev) => prev.filter((c) => codes.has(c)));
  };

  const toggleStandard = (code: string) => {
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
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
    } catch {
      // 실패해도 직접 쓴 문제는 그대로 두고 이어서 편집한다
      setAiError('AI 초안 만들기에 실패했어요. 직접 문제를 넣어주세요.');
    } finally {
      setAiBusy(false);
    }
  };

  const publish = () => {
    if (!canPublish) return;
    onSave(
      { title, desc, subject, aiCount: clampCount(count), grade, topic, standards: selected, status: 'published' },
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
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <fieldset>
        <legend>성취기준 (1개 이상 고르기)</legend>
        {standards.length === 0 && <p>이 학년·과목에는 등록된 기준이 없어요</p>}
        {standards.map((s) => (
          <label key={s.code}>
            <input type="checkbox" checked={selected.includes(s.code)} onChange={() => toggleStandard(s.code)} />
            {s.code} {s.summary}
          </label>
        ))}
      </fieldset>
      {selected.length === 0 && <p>성취기준을 1개 이상 골라주세요</p>}

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

      <button type="button" onClick={() => void makeDraft()} disabled={aiBusy || selected.length === 0}>
        {aiBusy ? 'AI가 문제를 만드는 중...' : 'AI로 초안 만들기'}
      </button>
      {aiError && <p>{aiError}</p>}
      {aiInfo && <p>{aiInfo}</p>}

      <p>문제 {items.length}개</p>
      {items.length === 0 && <p>아직 등록된 문제가 없어요</p>}
      {items.map((p, i) => (
        <div key={`problem-${i}`}>
          <label>
            문제 {i + 1} 내용
            <input value={p.text} onChange={(e) => updateItem(i, { text: e.target.value })} />
          </label>
          {p.options.map((opt, k) => (
            <div key={k}>
              <input
                aria-label={`문제 ${i + 1} 선택지 ${k + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, k, e.target.value)}
              />
              <label>
                <input
                  type="radio"
                  name={`answer-${i}`}
                  aria-label={`문제 ${i + 1} 정답: ${k + 1}번`}
                  checked={p.answerIndex === k}
                  onChange={() => updateItem(i, { answerIndex: k })}
                />
                정답
              </label>
            </div>
          ))}
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

      <button type="button" onClick={publish} disabled={!canPublish}>
        공개하기
      </button>
      {!canPublish && <p>문제를 10개 이상 넣어주세요</p>}
      <button type="button" onClick={onCancel}>
        취소
      </button>
    </Card>
  );
}
