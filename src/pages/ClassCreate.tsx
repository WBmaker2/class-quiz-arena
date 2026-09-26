import { useState } from 'react';
import Card from '../components/Card';
import { normalizeClassroomName } from '../hooks/useClassroom';

export default function ClassCreate({ onCreate, onCancel, existingNames }: { onCreate: (name: string) => void; onCancel?: () => void; existingNames?: string[] }) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('학급 이름을 입력해주세요');
      return;
    }
    const want = normalizeClassroomName(name);
    if ((existingNames ?? []).some((n) => normalizeClassroomName(n) === want)) {
      setError('같은 이름의 학급이 이미 있어요');
      return;
    }
    setError(null);
    onCreate(name.trim());
  };

  return (
    <Card>
      <h1>새 학급을 만들어볼까요?</h1>
      <form onSubmit={submit}>
        <label htmlFor="class-name">학급 이름</label>
        <input
          id="class-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 4학년 3반"
          maxLength={30}
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="btn-primary w-full btn-pulse">
          학급 만들기
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            돌아가기
          </button>
        )}
      </form>
    </Card>
  );
}
