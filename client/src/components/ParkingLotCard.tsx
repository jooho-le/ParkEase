import { motion } from 'framer-motion';
import { ParkingLot } from '../lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { congestionLabel } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import CountUp from './CountUp';
import { getCardVariant, getCtaLabel, getInsight } from '../lib/parking';

const badgeColor: Record<string, string> = {
  LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  HIGH: 'bg-rose-100 text-rose-700 border-rose-200',
};

const pulseVariants = {
  LOW: { scale: [1, 1.02, 1] },
  MEDIUM: { scale: [1, 1.03, 1] },
  HIGH: { scale: [1, 1.05, 1] },
};

const variantStyles = {
  default: 'border-emerald-100/60 bg-white shadow-sm',
  recommended: 'border-emerald-200/70 bg-emerald-50/40 shadow-md',
  alert: 'border-emerald-200/80 bg-white shadow-sm',
};

export default function ParkingLotCard({
  lot,
  recommendedId,
}: {
  lot: ParkingLot;
  recommendedId?: string | null;
}) {
  const navigate = useNavigate();
  const variant = getCardVariant(lot, recommendedId);
  const ctaLabel = getCtaLabel(lot);
  const insight = getInsight(lot);
  const isDisabled = lot.availableSlots <= 0;

  return (
    <motion.div layout whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
      <Card className={`transition-shadow hover:shadow-md ${variantStyles[variant]}`}>
        <CardContent className="space-y-4">
          {variant === 'recommended' && (
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span className="rounded-full bg-emerald-100 px-2 py-1">추천</span>
              <span>가장 여유있는 주차장</span>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">{lot.name}</p>
              <p className="text-xs text-slate-500">{lot.updatedAt.slice(11, 16)} 기준 · {insight}</p>
            </div>
            <motion.div
              animate={pulseVariants[lot.congestionLevel]}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Badge className={badgeColor[lot.congestionLevel]}>
                {congestionLabel(lot.congestionLevel)}
              </Badge>
            </motion.div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                <CountUp value={lot.availableSlots} />
              </p>
              <p className="text-xs text-slate-500">여석 / 총 {lot.totalSlots}면</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>거리: 0.{Math.floor(Math.random() * 9)} km</p>
              <p>구역: {lot.zones.length}</p>
            </div>
          </div>

          {variant === 'alert' && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-700">
              혼잡도가 높아 대체 주차장을 추천합니다.
            </div>
          )}

          {isDisabled ? (
            <Button variant="ghost" className="w-full text-emerald-700" disabled>
              대기 알림 받기
            </Button>
          ) : (
            <Button
              className={
                variant === 'recommended'
                  ? 'w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white'
                  : 'w-full rounded-xl bg-emerald-600 text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-400'
              }
              onClick={() => navigate(`/parking/${lot.id}`)}
            >
              {ctaLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
