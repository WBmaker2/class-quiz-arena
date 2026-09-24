import type { Animal } from '../components/Avatar';

export interface AvatarGood {
  id: Animal;
  name: string;
  price: number;
}

export interface TitleGood {
  id: string;
  label: string;
  price: number;
}

/** 전부 정가제. 확률 뽑기 없음. */
export const AVATAR_GOODS: AvatarGood[] = [
  { id: 'cat', name: '고양이', price: 0 },
  { id: 'dog', name: '강아지', price: 0 },
  { id: 'frog', name: '개구리', price: 100 },
  { id: 'turtle', name: '거북이', price: 150 },
  { id: 'tiger', name: '호랑이', price: 300 },
  { id: 'unicorn', name: '유니콘', price: 500 },
  { id: 'dragon', name: '드래곤', price: 800 },
];

export const TITLE_GOODS: TitleGood[] = [
  { id: 'sprout', label: '새싹', price: 0 },
  { id: 'challenger', label: '도전자', price: 100 },
  { id: 'streak', label: '연승왕', price: 300 },
  { id: 'doctor', label: '퀴즈박사', price: 600 },
  { id: 'guardian', label: '수호자', price: 1000 },
  { id: 'legend', label: '전설', price: 2000 },
];

export function avatarPrice(id: string): number {
  return AVATAR_GOODS.find((g) => g.id === id)?.price ?? Number.MAX_SAFE_INTEGER;
}

export function titlePrice(id: string): number {
  return TITLE_GOODS.find((g) => g.id === id)?.price ?? Number.MAX_SAFE_INTEGER;
}

/** 0원 상품은 처음부터 보유. */
export function ownsAvatar(unlocked: readonly string[] | undefined, id: string): boolean {
  if (avatarPrice(id) === 0) return true;
  return unlocked?.includes(id) ?? false;
}

export function ownsTitle(unlocked: readonly string[] | undefined, id: string): boolean {
  if (titlePrice(id) === 0) return true;
  return unlocked?.includes(id) ?? false;
}

export function canAfford(xp: number, price: number): boolean {
  return xp >= price;
}
