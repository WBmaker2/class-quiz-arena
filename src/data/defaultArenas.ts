import rawArenas from '../../scripts/defaultArenas.json';
import type { CardStyle, ProblemKind } from '../lib/arena';

export interface DefaultProblem {
  text: string;
  kind?: ProblemKind;
  options: string[];
  answerIndex: number;
  answerText?: string;
  explanation: string;
  standardCode: string;
  roundTimeSec: number;
}

export interface DefaultArena {
  id: string;
  title: string;
  topic: string;
  desc: string;
  grade: number;
  gradeBand: string;
  subject: string;
  standards: string[];
  questionCount: number;
  cardTheme: { bg: string; emoji: string };
  cardStyle?: CardStyle;
  illustId?: string;
  problems: DefaultProblem[];
}

const ARENAS = rawArenas as DefaultArena[];

/** 학급용 문서로 조립. ID는 학급마다 달라서 `seed-학급ID-slug`로 고정 (멱등 재시드). */
export function buildDefaultArenaDocs(classroomId: string, ownerUid: string): {
  id: string;
  meta: Record<string, unknown>;
  problems: DefaultProblem[];
}[] {
  return ARENAS.map((a) => ({
    id: `seed-${classroomId}-${a.id}`,
    meta: {
      classroomId,
      title: a.title,
      topic: a.topic,
      desc: a.desc,
      grade: a.grade,
      gradeBand: a.gradeBand,
      subject: a.subject,
      standards: a.standards,
      questionCount: a.problems.length,
      cardTheme: a.cardTheme,
      cardStyle: a.cardStyle ?? 'color',
      ...(a.illustId ? { illustId: a.illustId } : {}),
      // 선생님이 직접 공개하기로 할 때까지 숨김
      locked: true,
      showPlayers: false,
      status: 'published',
      createdBy: ownerUid,
    },
    problems: a.problems,
  }));
}

export function defaultArenaCount(): { arenas: number; problems: number } {
  return {
    arenas: ARENAS.length,
    problems: ARENAS.reduce((n, a) => n + a.problems.length, 0),
  };
}
