import { useState } from 'react';
import LoginScreen from './pages/LoginScreen';
import RoleSelect, { type Role } from './pages/RoleSelect';
import ClassJoin from './pages/ClassJoin';
import EmptyState from './components/EmptyState';
import { useAuth } from './hooks/useAuth';

export type View = 'login' | 'role' | 'join' | 'student' | 'teacher';

export default function App() {
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<Role | null>(null);
  const { signInWithGoogle } = useAuth();

  if (view === 'login') {
    return (
      <LoginScreen
        onStart={() => {
          setView('role');
          void Promise.resolve(signInWithGoogle()).catch(() => {});
        }}
      />
    );
  }

  if (view === 'role') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <RoleSelect
            onSelect={(r: Role) => {
              setRole(r);
              setView('join');
            }}
          />
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="min-h-screen grid place-items-center px-6 py-10">
        <div className="w-full max-w-md">
          <ClassJoin onJoin={() => setView('student')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <EmptyState title={view === 'teacher' ? '선생님 공간은 다음 단계에서 열려요' : '학생 홈은 다음 단계에서 열려요'} />
      </div>
    </div>
  );
}
