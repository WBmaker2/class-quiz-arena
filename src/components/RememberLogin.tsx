import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';

/** 로그인에 성공했는데 유지 선택을 아직 안 했으면 한 번만 묻는다. */
export default function RememberLogin() {
  const { user, loading, remember, applyRemember } = useAuth();
  if (loading || !user || remember !== null) return null;
  return (
    <Modal title="로그인 유지" onClose={() => void applyRemember(false)}>
      <p className="font-bold mb-2 text-lg">이 브라우저에 로그인 정보를 저장할까요?</p>
      <p className="text-sm mb-4">저장하면 다음에 같은 구글 프로필로 자동으로 로그인돼요.</p>
      <div className="flex gap-2">
        <button type="button" className="btn-primary flex-1" onClick={() => void applyRemember(true)}>
          저장하기
        </button>
        <button type="button" className="flex-1" onClick={() => void applyRemember(false)}>
          이번만 사용
        </button>
      </div>
    </Modal>
  );
}
