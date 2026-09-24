import { useState } from 'react';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import type { ArenaInput, EditableProblem } from '../hooks/useArenaAdmin';

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
  const [input, setInput] = useState(initial);
  const [items, setItems] = useState<EditableProblem[]>(problems);

  const addProblem = () => {
    setItems([...items, { text: '', options: ['O', 'X', '', ''], answerIndex: 0 }]);
  };

  const updateProblemText = (index: number, text: string) => {
    setItems(items.map((p, i) => (i === index ? { ...p, text } : p)));
  };

  return (
    <Card>
      <label htmlFor="arena-title">아레나 이름</label>
      <input id="arena-title" value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} />
      <label htmlFor="arena-desc">설명</label>
      <input id="arena-desc" value={input.desc} onChange={(e) => setInput({ ...input, desc: e.target.value })} />
      <p>AI 문제 개수: {input.aiCount}</p>
      {items.length === 0 && <p>아직 등록된 문제가 없어요</p>}
      {items.map((p, i) => (
        <div key={`problem-${i}`}>
          <label htmlFor={`problem-text-${i}`}>문제 내용</label>
          <input
            id={`problem-text-${i}`}
            value={p.text}
            onChange={(e) => updateProblemText(i, e.target.value)}
          />
          <p>{p.text}</p>
        </div>
      ))}
      <button type="button" onClick={addProblem}>
        새 문제 추가
      </button>
      <PrimaryButton onClick={() => onSave(input, items)}>저장하기</PrimaryButton>
      <button type="button" onClick={onCancel}>
        취소
      </button>
    </Card>
  );
}
