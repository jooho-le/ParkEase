import CountUp from '../CountUp';

export default function StatusChips({
  totalAvailable,
  fullLots,
  congested,
  updatedAt,
}: {
  totalAvailable: number;
  fullLots: number;
  congested: number;
  updatedAt: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
        <span className="text-emerald-600">전체 여석</span>
        <span className="font-semibold text-slate-900">
          <CountUp value={totalAvailable} />
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
        <span className="text-emerald-600">만석</span>
        <span className="font-semibold text-slate-900">
          <CountUp value={fullLots} />
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
        <span className="text-emerald-600">혼잡</span>
        <span className="font-semibold text-slate-900">
          <CountUp value={congested} />
        </span>
      </div>
      <div className="text-xs text-slate-400">
        업데이트: {updatedAt.slice(11, 16)}
      </div>
    </div>
  );
}
