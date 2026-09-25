import { useState } from 'react';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Avatar, { type Animal } from '../components/Avatar';

export type Role = 'teacher' | 'student';

const ANIMALS: Animal[] = ['cat', 'dog', 'tiger', 'frog', 'unicorn', 'dragon', 'turtle'];

export default function RoleSelect({ onSelect }: { onSelect: (role: Role, animal: Animal) => void }) {
  const [animal, setAnimal] = useState<Animal>('cat');

  return (
    <Card>
      <h1>반가워요! 누구신가요?</h1>
      <p>한 번만 골라주면 끝!</p>
      <p>마음에 드는 동물을 골라보세요</p>
      <div>
        {ANIMALS.map((a) => (
          <button key={a} type="button" aria-label={`아바타 ${a}`} aria-pressed={a === animal} onClick={() => setAnimal(a)}>
            <Avatar animal={a} size={44} />
          </button>
        ))}
      </div>
      <PrimaryButton pulse onClick={() => onSelect('teacher', animal)}>선생님으로 시작</PrimaryButton>
      <div style={{ height: 12 }} />
      <PrimaryButton pulse onClick={() => onSelect('student', animal)}>학생으로 시작</PrimaryButton>
    </Card>
  );
}
