import { useState } from 'react';
import { isValidInviteCode, normalizeInviteCode } from '../lib/classroom';

export function useClassroom() {
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const join = async (code: string) => {
    if (!isValidInviteCode(code)) {
      setError('초대 코드 6자리를 확인해주세요');
      return;
    }
    setError(null);
    setClassroomId(normalizeInviteCode(code));
  };

  return { classroomId, join, error };
}
