import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <Card>
          <p className="text-5xl mb-3" aria-hidden="true">
            🛡️
          </p>
          <p className="text-4xl font-extrabold mb-5 tracking-tight">퀴즈 아레나</p>
          <p className="text-[15px] mb-7 whitespace-pre-line font-bold">
            {'선생님 문제로\n친구와 1:1 퀴즈 대결!'}
          </p>
          <PrimaryButton onClick={onStart}>Google 계정으로 시작하기</PrimaryButton>
          <div className="mt-4 text-[11px]">학교 계정으로 안전하게 시작하세요</div>
        </Card>
      </div>
    </div>
  );
}
