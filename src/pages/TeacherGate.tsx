import { useEffect, useState } from 'react';
import type { Animal } from '../components/Avatar';
import { useTeacherClassrooms } from '../hooks/useClassroom';
import ClassCreate from './ClassCreate';
import ClassSelect from './ClassSelect';

export default function TeacherGate({
  uid,
  displayName,
  animal,
  create,
  onDone,
}: {
  uid: string;
  displayName: string;
  animal: Animal;
  create: (name: string, uid: string, nickname: string, avatar: string) => Promise<string | null>;
  onDone: (classroomId: string) => void;
}) {
  const { classrooms, loading } = useTeacherClassrooms(import.meta.env.MODE === 'test' ? null : uid);
  const [creating, setCreating] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!entered && !loading && !creating && classrooms.length === 1) {
      setEntered(true);
      onDone(classrooms[0].id);
    }
  }, [entered, loading, creating, classrooms, onDone]);

  if (loading) return <p>학급 목록을 불러오는 중...</p>;
  if (creating || classrooms.length === 0) {
    return (
      <ClassCreate
        existingNames={classrooms.map((c) => c.name)}
        onCreate={(name) => {
          void create(name, uid, displayName, animal).then((id) => {
            if (id) onDone(id);
          });
        }}
      />
    );
  }
  if (classrooms.length === 1) return <p>학급으로 들어가는 중...</p>;
  return <ClassSelect classrooms={classrooms} onSelect={onDone} />;
}
