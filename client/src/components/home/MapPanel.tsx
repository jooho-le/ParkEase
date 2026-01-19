import { AnimatePresence, motion } from 'framer-motion';
import { ParkingLot } from '../../lib/types';

const pinPosition = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 97;
  const x = 20 + (hash % 60);
  const y = 20 + ((hash * 7) % 60);
  return { left: `${x}%`, top: `${y}%` };
};

export default function MapPanel({
  lots,
  selectedId,
  onSelect,
}: {
  lots: ParkingLot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = lots.find((lot) => lot.id === selectedId) ?? null;

  return (
    <div className="relative h-[560px] overflow-hidden rounded-[24px] border border-emerald-100/60 bg-[#dff7e6]">
      <div className="absolute inset-0 opacity-40" style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.12), transparent 45%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.12), transparent 40%)',
      }} />
      <div className="absolute left-4 top-4 z-10 flex flex-col overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
        <button className="h-9 w-9 text-lg font-semibold text-emerald-600">+</button>
        <div className="h-px w-full bg-emerald-100" />
        <button className="h-9 w-9 text-lg font-semibold text-emerald-600">−</button>
      </div>

      {lots.map((lot) => {
        const isActive = lot.id === selectedId;
        const dimmed = selectedId && !isActive;
        return (
          <motion.button
            key={lot.id}
            type="button"
            className={`absolute ${dimmed ? 'opacity-50' : 'opacity-100'}`}
            style={pinPosition(lot.id)}
            onClick={() => onSelect(lot.id)}
            animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.6 }}
            aria-label={`${lot.name} 선택`}
          >
            <span
              className={
                isActive
                  ? 'flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-emerald-200'
                  : 'flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/60'
              }
            />
          </motion.button>
        );
      })}

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-md"
          >
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-slate-900">{selected.name}</p>
                <p className="text-xs text-slate-500">여석 {selected.availableSlots} · 구역 {selected.zones.length}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">지도 선택</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
