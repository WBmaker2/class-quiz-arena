export type TeacherTab = 'live' | 'arenas' | 'students' | 'analysis' | 'reports' | 'classroom' | 'admin';

export default function TeacherNav({ tab, showAdmin, onChange, onLogout }: {
  tab: TeacherTab;
  showAdmin?: boolean;
  onChange: (tab: TeacherTab) => void;
  onLogout: () => void;
}) {
  const navButton = (id: TeacherTab, label: string) => (
    <button type="button" onClick={() => onChange(id)} aria-current={tab === id ? 'page' : undefined} className={tab === id ? 'tab-active' : undefined}>
      {label}
    </button>
  );

  return (
    <nav aria-label="선생님 메뉴" className="teacher-nav flex flex-wrap gap-2 mb-5">
      {navButton('live', '현재 대결')}
      {navButton('arenas', '아레나')}
      {navButton('students', '학생')}
      {navButton('analysis', '분석')}
      {navButton('reports', '신고')}
      {navButton('classroom', '학급')}
      {showAdmin && navButton('admin', '선생님 관리')}
      <button type="button" onClick={onLogout}>로그아웃</button>
    </nav>
  );
}
