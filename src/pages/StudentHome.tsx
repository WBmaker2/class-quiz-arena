import { useState } from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import Avatar, { type Animal } from '../components/Avatar';
import type { Arena } from '../lib/arena';

export interface Leader {
  uid?: string;
  nickname: string;
  xp: number;
  avatar?: string;
  level?: number;
  winCount?: number;
  correctRate?: number;
  isMe?: boolean;
}

export interface ProfileView {
  nickname: string;
  xp: number;
  level: number;
  streak: number;
  winCount: number;
  correctRate: number;
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
}: {
  arenas: Arena[];
  leaders: Leader[];
  profile: ProfileView;
  myUid?: string | null;
  myRank?: number | null;
  onEnter: (arenaId: string) => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<'browse' | 'leaderboard' | 'record'>('browse');

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
            <p className="text-2xl font-extrabold">Lv.{profile.level}</p>
            <p>총 XP</p>
            <p>
              {profile.xp} XP · {profile.streak}연승 · 정답률 {profile.correctRate}%
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
