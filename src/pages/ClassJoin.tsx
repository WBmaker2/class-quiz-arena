import { useState } from 'react';
import Card from '../components/Card';
import { isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export default function ClassJoin({ onJoin }: { onJoin: (code: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    setError(null);
    onJoin(normalizeInviteCode(code));
  };

  return (
    <Card>
      <h1>어떤 학급에 들어갈까요?</h1>
      <label htmlFor="invite-code">초대 코드</label>
      <input
        id="invite-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="예: A1B2C3"
      />
      {error && <p role="alert">{error}</p>}
      <button type="button" className="btn-primary w-full" onClick={submit}>
        학급 들어가기
      </button>
    </Card>
  );
}
