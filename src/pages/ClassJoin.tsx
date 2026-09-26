import { useState } from 'react';
import Card from '../components/Card';
import { isValidInviteCode, normalizeInviteCode } from '../lib/classroom';
import { validateNickname } from '../lib/nickname';

export default function ClassJoin({
  defaultNickname,
  onJoin,
}: {
  defaultNickname: string;
  onJoin: (code: string, nickname: string) => Promise<{ ok: boolean; error?: string } | boolean | void> | { ok: boolean; error?: string } | boolean | void;
}) {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState(defaultNickname);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    const nameError = validateNickname(nickname);
    if (nameError) {
      setError(nameError);
      return;
    }
    setError(null);
    setSubmitting(true);
    void Promise.resolve(onJoin(normalizeInviteCode(code), nickname.trim()))
      .then((joined) => {
        if (joined === false) setError('학급에 들어가지 못했어요. 다시 시도해주세요');
        else if (joined && typeof joined === 'object' && !joined.ok) setError(joined.error ?? '학급에 들어가지 못했어요. 다시 시도해주세요');
      })
      .catch(() => setError('연결에 실패했어요. 다시 시도해주세요'))
      .finally(() => setSubmitting(false));
  };

  return (
    <Card>
      <h1>어떤 학급에 들어갈까요?</h1>
      <form onSubmit={submit}>
        <label htmlFor="invite-code">초대 코드</label>
        <input
          id="invite-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="예: A1B2C3"
          maxLength={8}
        />
        <label htmlFor="nickname">내 이름</label>
        <input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예: 김일호"
          maxLength={8}
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full btn-pulse">
          {submitting ? '학급을 확인하고 있어요...' : '학급 들어가기'}
        </button>
      </form>
    </Card>
  );
}
