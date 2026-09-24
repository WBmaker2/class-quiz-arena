export const MASTER_ADMIN_EMAIL = 'ketarou85@gmail.com';

export function isMasterEmail(email: string | null | undefined): boolean {
  return email === MASTER_ADMIN_EMAIL;
}

export const TEACHER_NOT_ALLOWLISTED = '등록된 선생님 계정이 아니에요. 마스터 관리자에게 문의해주세요';
