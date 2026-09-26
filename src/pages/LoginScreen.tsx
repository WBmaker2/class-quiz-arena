import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ onStart, error }: { onStart: () => void; error?: string | null }) {
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <Card>
          <p className="text-5xl mb-3" aria-hidden="true">
            🛡️
          </p>
          <h1 className="text-4xl font-extrabold mb-5 tracking-tight">퀴즈 아레나</h1>
          <p className="text-[15px] mb-7 whitespace-pre-line font-bold">
            {'선생님 문제로\n친구와 1:1 퀴즈 대결!'}
          </p>
          <PrimaryButton pulse onClick={onStart}>Google 계정으로 시작하기</PrimaryButton>
          {error && <p className="mt-3 text-sm font-bold" role="alert">{error}</p>}
        </Card>
      </div>
    </div>
  );
}
