import { motion } from 'framer-motion';
import { ParkingLot } from '../../lib/types';
import CountUp from '../CountUp';
import { Button } from '../ui/button';
import { getInsight } from '../../lib/parking';

export default function LotCardRecommended({ lot, onSelect }: { lot: ParkingLot; onSelect: () => void }) {
  const insight = getInsight(lot);

  return (
    <motion.div layout className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-4 shadow-md">
      <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
        <span className="rounded-full bg-emerald-100 px-2 py-1">추천</span>
        <span>가장 여유있는 주차장</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">{lot.name}</p>
          <p className="text-xs text-slate-500">{lot.updatedAt.slice(11, 16)} 기준 · {insight}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold text-slate-900"><CountUp value={lot.availableSlots} /></p>
          <p className="text-xs text-slate-500">여석 / 총 {lot.totalSlots}면</p>
        </div>
      </div>
      <Button
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white"
        onClick={onSelect}
      >
        바로 안내받기
      </Button>
    </motion.div>
  );
}
