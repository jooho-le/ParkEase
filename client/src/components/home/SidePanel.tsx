import { AnimatePresence, motion } from 'framer-motion';
import { ParkingLot, PanelMode } from '../../lib/types';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import LotCardRecommended from './LotCardRecommended';
import LotRow from './LotRow';
import LotRowAlert from './LotRowAlert';
import { getCardVariant, getCtaLabel, getInsight } from '../../lib/parking';
import { Button } from '../ui/button';
import CountUp from '../CountUp';

const listVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

const congestionChip = (level: ParkingLot['congestionLevel']) => {
  if (level === 'HIGH') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (level === 'MEDIUM') {
    return 'bg-emerald-100/60 text-emerald-700 border-emerald-200/60';
  }
  return 'bg-emerald-100 text-emerald-700 border-emerald-200/60';
};

export default function SidePanel({
  lots,
  recommendedId,
  search,
  onSearch,
  sort,
  onSort,
  onlyAvailable,
  onToggleAvailable,
  panelMode,
  selectedLotId,
  onSelectLot,
  onClearSelection,
  onEnterFocus,
  onExitFocus,
}: {
  lots: ParkingLot[];
  recommendedId: string | null;
  search: string;
  onSearch: (value: string) => void;
  sort: string;
  onSort: (value: string) => void;
  onlyAvailable: boolean;
  onToggleAvailable: (value: boolean) => void;
  panelMode: PanelMode;
  selectedLotId: string | null;
  onSelectLot: (id: string) => void;
  onClearSelection: () => void;
  onEnterFocus: () => void;
  onExitFocus: () => void;
}) {
  const recommended = lots.find((lot) => lot.id === recommendedId) || null;
  const rest = lots.filter((lot) => lot.id !== recommendedId);
  const selected = lots.find((lot) => lot.id === selectedLotId) || null;
  const selectedInsight = selected ? getInsight(selected) : '';

  return (
    <div className="space-y-4">
      {panelMode === 'DEFAULT' ? (
        <div className="rounded-2xl border border-emerald-100/60 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_auto]">
            <Input
              placeholder="주차장 검색"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
            <Select value={sort} onValueChange={onSort}>
              <SelectTrigger>
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">가까운 순</SelectItem>
                <SelectItem value="availability">여석 많은 순</SelectItem>
                <SelectItem value="congestion">혼잡도 낮은 순</SelectItem>
              </SelectContent>
            </Select>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <Switch checked={onlyAvailable} onCheckedChange={onToggleAvailable} />
              여석 있는 곳만
            </label>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-100/60 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-xs text-emerald-600">선택된 주차장</p>
            <p className="text-sm font-semibold text-slate-900">{selected?.name ?? '선택 없음'}</p>
          </div>
          <Button variant="ghost" className="text-emerald-700" onClick={onClearSelection}>
            선택 해제
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {panelMode === 'DEFAULT' && (
          <motion.div
            key="panel-default"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4 text-sm text-emerald-700">
              지도에서 주차장을 선택하면 상세 정보와 예약 버튼이 이곳에 표시됩니다.
            </div>

            {recommended && (
              <LotCardRecommended lot={recommended} onSelect={() => onSelectLot(recommended.id)} />
            )}

            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              layout
              className="space-y-2"
            >
              {rest.map((lot) => {
                const variant = getCardVariant(lot, recommendedId);
                if (variant === 'alert') {
                  return <LotRowAlert key={lot.id} lot={lot} onSelect={() => onSelectLot(lot.id)} />;
                }
                return <LotRow key={lot.id} lot={lot} onSelect={() => onSelectLot(lot.id)} />;
              })}
            </motion.div>
          </motion.div>
        )}

        {panelMode === 'SELECTED' && selected && (
          <motion.div
            key="panel-selected"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-emerald-700">
              <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold">선택됨</span>
              <span className="text-slate-400">지도 ↔ 패널 연동</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                <p className="text-xs text-slate-500">{selected.updatedAt.slice(11, 16)} 기준 · {selectedInsight}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full border px-2 py-1 ${congestionChip(selected.congestionLevel)}`}>
                    {selected.congestionLevel === 'HIGH' ? '혼잡' : selected.congestionLevel === 'MEDIUM' ? '보통' : '여유'}
                  </span>
                  <span className="rounded-full border border-emerald-100 bg-white px-2 py-1 text-slate-500">
                    구역 {selected.zones.length}개
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-semibold text-slate-900">
                  <CountUp value={selected.availableSlots} />
                </p>
                <p className="text-xs text-slate-500">여석 / 총 {selected.totalSlots}면</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
              <Button
                className="rounded-xl"
                onClick={onEnterFocus}
                disabled={selected.availableSlots <= 0}
              >
                {getCtaLabel(selected)}
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={onClearSelection}>
                다른 주차장 보기
              </Button>
            </div>
          </motion.div>
        )}

        {panelMode === 'FOCUS' && selected && (
          <motion.div
            key="panel-focus"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-emerald-700">
              <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold">예약 준비</span>
              <Button variant="ghost" className="h-7 px-2 text-emerald-700" onClick={onExitFocus}>
                닫기
              </Button>
            </div>

            <div className="mt-3">
              <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
              <p className="text-xs text-slate-500">{selectedInsight}</p>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-emerald-50/60 p-3">
                <p className="text-xs font-semibold text-emerald-700">예약 가능 구역</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(selected.zones.filter((zone) => zone.availableSlots > 0).slice(0, 4).length
                    ? selected.zones.filter((zone) => zone.availableSlots > 0).slice(0, 4)
                    : selected.zones.slice(0, 3)
                  ).map((zone) => (
                    <span
                      key={zone.id}
                      className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-xs text-emerald-700"
                    >
                      {zone.name} ({zone.availableSlots})
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 p-3 text-xs text-slate-600">
                <p>홀드 시간 15분 · 15분 내 입차 확인 필요</p>
                <p className="mt-1">만석/혼잡 시 예약이 제한될 수 있습니다.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button className="rounded-xl" disabled={selected.availableSlots <= 0}>
                예약 확정
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={onExitFocus}>
                이전으로
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
