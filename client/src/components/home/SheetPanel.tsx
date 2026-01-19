import { motion } from 'framer-motion';
import { ParkingLot } from '../../lib/types';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import LotCardRecommended from './LotCardRecommended';
import LotRow from './LotRow';
import LotRowAlert from './LotRowAlert';
import { getCardVariant } from '../../lib/parking';

const listVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function SheetPanel({
  lots,
  recommendedId,
  search,
  onSearch,
  sort,
  onSort,
  onlyAvailable,
  onToggleAvailable,
  onSelectLot,
}: {
  lots: ParkingLot[];
  recommendedId: string | null;
  search: string;
  onSearch: (value: string) => void;
  sort: string;
  onSort: (value: string) => void;
  onlyAvailable: boolean;
  onToggleAvailable: (value: boolean) => void;
  onSelectLot: (id: string) => void;
}) {
  const recommended = lots.find((lot) => lot.id === recommendedId) || null;
  const rest = lots.filter((lot) => lot.id !== recommendedId);

  return (
    <div className="space-y-4">
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

      {recommended && (
        <LotCardRecommended lot={recommended} onSelect={() => onSelectLot(recommended.id)} />
      )}

      <motion.div variants={listVariants} initial="hidden" animate="visible" layout className="space-y-3">
        {rest.map((lot) => {
          const variant = getCardVariant(lot, recommendedId);
          if (variant === 'alert') {
            return <LotRowAlert key={lot.id} lot={lot} />;
          }
          return <LotRow key={lot.id} lot={lot} onSelect={() => onSelectLot(lot.id)} />;
        })}
      </motion.div>
    </div>
  );
}
