import Card from '../components/Card';

export type Role = 'teacher' | 'student';

export default function RoleSelect({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <Card>
      <h1>반가워요! 누구신가요?</h1>
      <p>한 번만 골라주면 끝!</p>
      <button type="button" className="btn-primary w-full" onClick={() => onSelect('teacher')}>
        선생님으로 시작
      </button>
      <button type="button" className="btn-primary w-full" onClick={() => onSelect('student')}>
        학생으로 시작
      </button>
    </Card>
  );
}
