import { motion } from 'framer-motion';
import { ParkingLot } from '../../lib/types';

export default function LotRowAlert({ lot, onSelect }: { lot: ParkingLot; onSelect?: () => void }) {
  const status = lot.availableSlots <= 0 ? '만석' : '혼잡';

  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-left opacity-90"
    >
      <div>
        <p className="text-sm font-semibold text-slate-700">{lot.name}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-emerald-700">
          <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5">{status}</span>
          <span>여석 {lot.availableSlots}</span>
        </div>
      </div>
      <span className="text-xs text-emerald-700">대기 알림</span>
    </motion.button>
  );
}
