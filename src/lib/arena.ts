export interface Arena {
  id: string;
  title: string;
  desc: string;
  subject: string;
  locked: boolean;
  grade?: number;
  topic?: string;
  standards?: string[];
  cardTheme?: { bg: string; emoji: string };
  status?: 'draft' | 'published';
}

export interface Problem {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  roundTimeSec: number;
}
