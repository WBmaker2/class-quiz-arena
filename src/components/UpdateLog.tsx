import { UPDATELOG, type UpdateLogEntry } from '../data/updatelog';

/** 날짜별 업데이트 내역을 보여주는 목록. 팝업(Modal) 안에 넣어서 쓴다. */
export default function UpdateLog({ entries = UPDATELOG }: { entries?: UpdateLogEntry[] }) {
  if (entries.length === 0) return <p>아직 기록된 업데이트가 없어요</p>;
  return (
    <div>
      {entries.map((e) => (
        <section key={e.date} className="mb-4">
          <p className="font-bold mb-1">{e.date}</p>
          <ul className="ml-4 list-disc">
            {e.items.map((item, i) => (
              <li key={i} className="mb-1 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
