import { describe, expect, it } from 'vitest';
import { containsBanned, validateNickname } from './nickname';

describe('containsBanned', () => {
  it('detects plain profanity', () => {
    expect(containsBanned('시발놈')).toBe(true);
    expect(containsBanned('병신')).toBe(true);
  });

  it('detects spaced and symbol-obfuscated variants', () => {
    expect(containsBanned('시 발')).toBe(true);
    expect(containsBanned('시!발')).toBe(true);
    expect(containsBanned('FUCK')).toBe(true);
  });

  it('detects jamo abbreviations', () => {
    expect(containsBanned('ㅅㅂ')).toBe(true);
    expect(containsBanned('ㅄ')).toBe(true);
  });

  it('allows normal names', () => {
    expect(containsBanned('일호')).toBe(false);
    expect(containsBanned('박서연')).toBe(false);
    expect(containsBanned('')).toBe(false);
  });
});

describe('validateNickname', () => {
  it('rejects empty and long names', () => {
    expect(validateNickname('  ')).toBe('이름을 입력해주세요');
    expect(validateNickname('아주아주긴이름이에요')).toBe('이름은 8자까지 쓸 수 있어요');
  });

  it('rejects banned words with a friendly message', () => {
    expect(validateNickname('시발')).toContain('쓸 수 없는 말');
  });

  it('accepts normal names', () => {
    expect(validateNickname('일호')).toBeNull();
  });
});
