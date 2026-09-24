/** 닉네임 금칙어 검사. 초등학생용 짧은 목록 + 변형 정규화. */

const BANNED = [
  '시발',
  '씨발',
  '새끼',
  '병신',
  '지랄',
  '미친놈',
  '미친년',
  '좆',
  '좃',
  '썅',
  '닥쳐',
  '꺼져',
  '죽어',
  '엿먹',
  'fuck',
  'shit',
  'bitch',
  'damn',
];

// 자모 약자 (ㅅㅂ=시발, ㅄ=씨발, ㅈㄹ=지랄, ㅁㅊ=미친, ㅂㅅ=병신)
const BANNED_JAMO = ['ㅅㅂ', 'ㅄ', 'ㅈㄹ', 'ㅁㅊ', 'ㅂㅅ'];

const NOISE = /[\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`·…ー─]+/g;

/** 비교용 정규화: 소문자 + 공백·기호 제거. */
export function normalizeNickname(v: string): string {
  return v.toLowerCase().replace(NOISE, '');
}

export function containsBanned(name: string): boolean {
  const norm = normalizeNickname(name);
  if (!norm) return false;
  return [...BANNED, ...BANNED_JAMO].some((w) => norm.includes(w));
}

export const MAX_NICKNAME_LENGTH = 8;

/** 문제 있으면 사람이 읽는 문구, 없으면 null. */
export function validateNickname(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return '이름을 입력해주세요';
  if (trimmed.length > MAX_NICKNAME_LENGTH) return '이름은 8자까지 쓸 수 있어요';
  if (containsBanned(trimmed)) return '쓸 수 없는 말이 들어있어요. 다른 이름으로 해주세요';
  return null;
}
