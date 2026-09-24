import { useState } from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import type { Arena } from '../lib/arena';

export interface Leader {
  nickname: string;
  xp: number;
}

export interface ProfileView {
  nickname: string;
  xp: number;
  level: number;
  streak: number;
  winCount: number;
  correctRate: number;
}

export default function StudentHome({
  arenas,
  leaders,
  profile,
  onEnter,
  onSignOut,
}: {
  arenas: Arena[];
  leaders: Leader[];
  profile: ProfileView;
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
                <div key={a.id} className="mb-3">
                  <p className="font-bold">{a.title}</p>
                  <PrimaryButton onClick={() => onEnter(a.id)}>지금 바로 대결!</PrimaryButton>
                </div>
              ))
            )}
          </Card>
        )}
        {tab === 'leaderboard' && (
          <Card>
            {leaders.length === 0 ? (
              <EmptyState title="첫 대결에서 승리하면 이 자리에 올라요!" />
            ) : (
              leaders.map((l) => (
                <p key={l.nickname}>
                  <span>{l.nickname}</span> — {l.xp} XP
                </p>
              ))
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
