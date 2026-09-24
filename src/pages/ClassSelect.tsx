import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import type { TeacherClassroom } from '../hooks/useClassroom';

export default function ClassSelect({
  classrooms,
  onSelect,
}: {
  classrooms: TeacherClassroom[];
  onSelect: (id: string) => void;
}) {
  return (
    <Card>
      <h1>어느 학급으로 들어갈까요?</h1>
      {classrooms.length === 0 ? (
        <EmptyState title="들어갈 학급이 없어요. 선생님께 초대 코드를 받아주세요!" />
      ) : (
        classrooms.map((c) => (
          <button
            key={c.id}
            type="button"
            className="btn-primary w-full mb-2"
            onClick={() => onSelect(c.id)}
          >
            {c.name} · 초대 코드 {c.inviteCode}
          </button>
        ))
      )}
    </Card>
  );
}
