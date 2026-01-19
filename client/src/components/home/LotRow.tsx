import { motion } from 'framer-motion';
import { ParkingLot } from '../../lib/types';
import CountUp from '../CountUp';
import { getInsight } from '../../lib/parking';

const congestionLabel = (level: ParkingLot['congestionLevel']) => {
  if (level === 'HIGH') return '혼잡';
  if (level === 'MEDIUM') return '보통';
  return '여유';
};

const congestionClass = (level: ParkingLot['congestionLevel']) => {
  if (level === 'HIGH') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (level === 'MEDIUM') return 'border-emerald-200/60 bg-emerald-100/60 text-emerald-700';
  return 'border-emerald-200/60 bg-emerald-100 text-emerald-700';
};

export default function LotRow({ lot, onSelect }: { lot: ParkingLot; onSelect: () => void }) {
  const insight = getInsight(lot);

  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-emerald-100/60 bg-white px-4 py-3 text-left transition hover:border-emerald-200 hover:shadow-sm"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">{lot.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{insight}</span>
          <span className={`rounded-full border px-2 py-0.5 ${congestionClass(lot.congestionLevel)}`}>
            {congestionLabel(lot.congestionLevel)}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-semibold text-slate-900">
          <CountUp value={lot.availableSlots} />
        </p>
        <p className="text-xs text-slate-500">여석</p>
      </div>
    </motion.button>
  );
}
