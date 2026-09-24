export interface RosterStudent {
  uid: string;
  nickname: string;
  xp: number;
}

export function buildRosterCsv(students: RosterStudent[]): string {
  const head = '이름,XP';
  const rows = students.map((s) => `${s.nickname},${s.xp}`);
  return [head, ...rows].join('\n');
}

export function byXpDesc(a: RosterStudent, b: RosterStudent): number {
  return b.xp - a.xp;
}
