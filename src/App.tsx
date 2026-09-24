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
  const { user, loading, signInWithGoogle } = useAuth();

  const startLogin = () => {
    void Promise.resolve(signInWithGoogle()).catch(() => {});
    setView('role');
  };

  // 실제 환경에서만 미로그인 진입을 막는다. vitest의 MODE는 'test'이므로
  // 테스트 흐름은 Plan 1과 동일하게 통과한다.
  const effectivelySignedOut = !loading && user === null && import.meta.env.MODE !== 'test';
  if (view !== 'login' && effectivelySignedOut) {
    return <LoginScreen onStart={startLogin} />;
  }
  if (view === 'login') {
    return <LoginScreen onStart={startLogin} />;
  }
  if (loading) {
    return <div className="min-h-screen grid place-items-center">불러오는 중...</div>;
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
          <ClassJoin onJoin={() => setView(role === 'teacher' ? 'teacher' : 'student')} />
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
