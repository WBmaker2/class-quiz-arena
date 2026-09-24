import { describe, expect, it } from 'vitest';
import { MASTER_ADMIN_EMAIL, TEACHER_NOT_ALLOWLISTED, isMasterEmail } from './admin';

describe('admin', () => {
  it('recognizes the master email', () => {
    expect(isMasterEmail(MASTER_ADMIN_EMAIL)).toBe(true);
    expect(isMasterEmail('ketarou85@dc.es.kr')).toBe(false);
    expect(isMasterEmail(null)).toBe(false);
    expect(isMasterEmail(undefined)).toBe(false);
  });

  it('has a help message for unlisted teachers', () => {
    expect(TEACHER_NOT_ALLOWLISTED).toContain('마스터 관리자');
  });
});
