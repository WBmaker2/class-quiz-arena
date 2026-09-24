import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function InviteQR({ code }: { code: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(`quiz-arena-join:${code}`, { width: 220 }).then((url) => {
      if (alive) setSrc(url);
    }).catch(() => {
      if (alive) setSrc(null);
    });
    return () => {
      alive = false;
    };
  }, [code]);

  if (!src) return <p>QR을 만드는 중...</p>;
  return <img src={src} alt="학급 초대 QR" />;
}
