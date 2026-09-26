import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Avatar from '../components/Avatar';
import type { Animal } from '../components/Avatar';

export type Role = 'teacher' | 'student';

/** 처음에는 모두 개구리로 시작한다. XP가 아니라 별을 모으면 상점에서 바꿀 수 있다. */
const STARTER_ANIMAL: Animal = 'frog';

export default function RoleSelect({ onSelect }: { onSelect: (role: Role, animal: Animal) => void }) {
  return (
    <Card>
      <h1>반가워요! 누구신가요?</h1>
      <p>처음에는 개구리로 시작해요</p>
      <p>별을 모으면 상점에서 바꿀 수 있어요</p>
      <div>
        <Avatar animal={STARTER_ANIMAL} size={44} />
      </div>
      <PrimaryButton pulse onClick={() => onSelect('teacher', STARTER_ANIMAL)}>선생님으로 시작</PrimaryButton>
      <div style={{ height: 12 }} />
      <PrimaryButton pulse onClick={() => onSelect('student', STARTER_ANIMAL)}>학생으로 시작</PrimaryButton>
    </Card>
  );
}
