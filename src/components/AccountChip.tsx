/** 오른쪽 위에 두는 로그인 계정 표시 (구글 프로필 사진·이름). */
export default function AccountChip({
  name,
  email,
  photoURL,
}: {
  name: string;
  email?: string | null;
  photoURL?: string | null;
}) {
  return (
    <span className="flex items-center gap-2" title={email ?? undefined}>
      {photoURL && (
        <img src={photoURL} alt="" width={28} height={28} className="rounded-full" referrerPolicy="no-referrer" />
      )}
      <span className="text-sm font-bold">{name}</span>
    </span>
  );
}
