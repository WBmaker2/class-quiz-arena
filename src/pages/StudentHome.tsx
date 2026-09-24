import { useState } from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import Avatar, { type Animal } from '../components/Avatar';
import type { Arena } from '../lib/arena';
import { validateNickname } from '../lib/nickname';
import {
  AVATAR_GOODS,
  TITLE_GOODS,
  canAfford,
  ownsAvatar,
  ownsTitle,
} from '../data/shop';

export interface Leader {
  uid?: string;
  nickname: string;
  xp: number;
  avatar?: string;
  level?: number;
  winCount?: number;
  correctRate?: number;
  title?: string;
  isMe?: boolean;
}

export interface ProfileView {
  nickname: string;
  xp: number;
  level: number;
  streak: number;
  winCount: number;
  correctRate: number;
  avatar?: string;
  title?: string;
  unlockedAvatars?: string[];
  unlockedTitles?: string[];
}

const ANIMALS = ['cat', 'dog', 'tiger', 'frog', 'unicorn', 'dragon', 'turtle'] as const;

function toAnimal(value: string | undefined): Animal {
  return (ANIMALS as readonly string[]).includes(value ?? '') ? (value as Animal) : 'cat';
}

/** 순위뱃지 자체 색 (원본과 겹치지 않는 밝은 교실 색). */
function rankBadgeStyle(rank: number): { background: string; color: string } {
  if (rank === 1) return { background: '#FFB800', color: '#4A2F00' };
  if (rank === 2) return { background: '#9DB4D8', color: '#1E2A44' };
  if (rank === 3) return { background: '#D89A6A', color: '#4A2410' };
  return { background: '#E8ECF3', color: '#33415C' };
}

export default function StudentHome({
  arenas,
  leaders,
  profile,
  myUid,
  myRank,
  onEnter,
  onSignOut,
  onBuyAvatar,
  onEquipAvatar,
  onBuyTitle,
  onEquipTitle,
  onRename,
}: {
  arenas: Arena[];
  leaders: Leader[];
  profile: ProfileView;
  myUid?: string | null;
  myRank?: number | null;
  onEnter: (arenaId: string) => void;
  onSignOut: () => void;
  onBuyAvatar?: (id: string, price: number) => void;
  onEquipAvatar?: (id: string) => void;
  onBuyTitle?: (id: string, price: number) => void;
  onEquipTitle?: (id: string) => void;
  onRename?: (name: string) => void;
}) {
  const [tab, setTab] = useState<'browse' | 'leaderboard' | 'record' | 'shop'>('browse');
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const saveName = () => {
    const err = validateNickname(newName);
    if (err) {
      setNameError(err);
      return;
    }
    setNameError(null);
    onRename?.(newName.trim());
    setNewName('');
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setTab('browse')}>
            둘러보기
          </button>
          <button type="button" onClick={() => setTab('leaderboard')}>
            순위표
          </button>
          <button type="button" onClick={() => setTab('record')}>
            내 기록
          </button>
          <button type="button" onClick={() => setTab('shop')}>
            상점
          </button>
          <button type="button" onClick={onSignOut}>
            로그아웃
          </button>
        </div>
        {tab === 'browse' && (
          <Card>
            <p className="font-bold mb-2">오늘 도전할 아레나는?</p>
            {arenas.length === 0 ? (
              <EmptyState title="아직 참여 중인 아레나가 없어요" />
            ) : (
              arenas.map((a) => (
                <div
                  key={a.id}
                  className="mb-3"
                  style={
                    a.cardTheme?.bg
                      ? { background: a.cardTheme.bg, borderRadius: 12, padding: 12 }
                      : undefined
                  }
                >
                  <div className="flex gap-1 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{a.subject}</span>
                    {a.grade != null && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">{a.grade}학년</span>
                    )}
                  </div>
                  <p className="font-bold">
                    {a.cardTheme?.emoji ? `${a.cardTheme.emoji} ` : ''}
                    {a.title}
                  </p>
                  {a.topic && <p className="text-sm">{a.topic}</p>}
                  {a.desc && <p className="text-sm opacity-70">{a.desc}</p>}
                  <p className="text-sm mt-1">20문제 중 10문제 대결</p>
                  <p className="text-xs mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-white/70">대결 준비됨</span>
                  </p>
                  <PrimaryButton onClick={() => onEnter(a.id)}>지금 바로 대결!</PrimaryButton>
                </div>
              ))
            )}
          </Card>
        )}
        {tab === 'leaderboard' && (
          <Card>
            <p className="font-bold mb-2">우리 반 대결왕 Top 20</p>
            {myRank != null && <p className="text-sm mb-2">내 순위 {myRank}위</p>}
            {leaders.length === 0 ? (
              <EmptyState title="첫 대결에서 승리하면 이 자리에 올라요!" />
            ) : (
              leaders.map((l, i) => {
                const rank = i + 1;
                const highlighted = l.isMe === true || (myUid != null && l.uid != null && l.uid === myUid);
                const badge = rankBadgeStyle(rank);
                return (
                  <div
                    key={l.uid ?? l.nickname}
                    className="flex items-center gap-2 mb-2 px-2 py-1 rounded-lg"
                    style={
                      highlighted
                        ? { background: '#FFF3C4', border: '2px solid #FFB800' }
                        : { background: '#F6F8FC' }
                    }
                  >
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: badge.background, color: badge.color }}
                    >
                      {rank}위
                    </span>
                    <Avatar animal={toAnimal(l.avatar)} size={36} />
                    <div className="flex-1">
                      <p className="font-bold">
                        {l.nickname}
                        {l.title ? <span className="ml-1 text-xs">· {l.title}</span> : null}
                        {highlighted && <span className="ml-1 text-xs">나</span>}
                      </p>
                      <p className="text-xs">
                        Lv{l.level ?? 1} · {l.winCount ?? 0}승 · 정답률 {l.correctRate ?? 0}% · {l.xp} XP
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        )}
        {tab === 'record' && (
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Avatar animal={toAnimal(profile.avatar)} size={48} />
              <div>
                <p className="text-lg font-bold">
                  {profile.nickname}
                  {profile.title ? <span className="ml-1 text-sm">· {profile.title}</span> : null}
                </p>
                <p className="text-2xl font-extrabold">Lv.{profile.level}</p>
              </div>
            </div>
            <p>총 XP</p>
            <p>
              {profile.xp} XP · {profile.streak}연승 · 정답률 {profile.correctRate}%
            </p>
            <div className="mt-3">
              <label htmlFor="nickname-input">내 이름 바꾸기</label>
              <input
                id="nickname-input"
                value={newName}
                maxLength={8}
                placeholder={profile.nickname}
                onChange={(e) => setNewName(e.target.value)}
              />
              {nameError && <p role="alert">{nameError}</p>}
              <button type="button" onClick={saveName}>
                이름 저장
              </button>
            </div>
          </Card>
        )}
        {tab === 'shop' && (
          <Card>
            <p className="font-bold mb-2">아바타 상점</p>
            <p className="text-sm mb-2">내 XP {profile.xp}</p>
            {AVATAR_GOODS.map((g) => {
              const owned = ownsAvatar(profile.unlockedAvatars, g.id);
              const equipped = toAnimal(profile.avatar) === g.id;
              return (
                <div key={g.id} className="flex items-center gap-2 mb-2">
                  <Avatar animal={g.id} size={40} />
                  <p className="flex-1 font-bold">{g.name}</p>
                  {equipped ? (
                    <p className="text-sm">사용 중</p>
                  ) : owned ? (
                    <button type="button" onClick={() => onEquipAvatar?.(g.id)}>
                      사용하기
                    </button>
                  ) : canAfford(profile.xp, g.price) ? (
                    <button type="button" onClick={() => onBuyAvatar?.(g.id, g.price)}>
                      {g.price} XP에 사기
                    </button>
                  ) : (
                    <p className="text-sm">{g.price} XP 필요</p>
                  )}
                </div>
              );
            })}
            <p className="font-bold mt-4 mb-2">칭호 상점</p>
            {TITLE_GOODS.map((g) => {
              const owned = ownsTitle(profile.unlockedTitles, g.id);
              const equipped = (profile.title ?? '새싹') === g.label;
              return (
                <div key={g.id} className="flex items-center gap-2 mb-2">
                  <p className="flex-1 font-bold">{g.label}</p>
                  {equipped ? (
                    <p className="text-sm">사용 중</p>
                  ) : owned ? (
                    <button type="button" onClick={() => onEquipTitle?.(g.label)}>
                      사용하기
                    </button>
                  ) : canAfford(profile.xp, g.price) ? (
                    <button type="button" onClick={() => onBuyTitle?.(g.id, g.price)}>
                      {g.price} XP에 사기
                    </button>
                  ) : (
                    <p className="text-sm">{g.price} XP 필요</p>
                  )}
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
