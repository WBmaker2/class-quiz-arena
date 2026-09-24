export interface Arena {
  id: string;
  title: string;
  desc: string;
  subject: string;
  locked: boolean;
}

export interface Problem {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  roundTimeSec: number;
}
