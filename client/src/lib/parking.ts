import { ParkingLot } from './types';

export type ParkingCardVariant = 'default' | 'recommended' | 'alert';

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const pickRecommendedLot = (lots: ParkingLot[]) => {
  if (lots.length === 0) return null;
  const preferred = lots
    .filter((lot) => lot.availableSlots > 0)
    .sort((a, b) => b.availableSlots - a.availableSlots);
  return (preferred[0] ?? lots[0]).id;
};

export const getCardVariant = (lot: ParkingLot, recommendedId?: string | null): ParkingCardVariant => {
  if (recommendedId && lot.id === recommendedId) return 'recommended';
  if (lot.congestionLevel === 'HIGH' || lot.availableSlots <= 3) return 'alert';
  return 'default';
};

export const getCtaLabel = (lot: ParkingLot) => {
  if (lot.availableSlots <= 0) return '대기 알림 받기';
  if (lot.availableSlots >= Math.max(5, Math.round(lot.totalSlots * 0.35))) return '바로 안내받기';
  if (lot.congestionLevel === 'HIGH' || lot.availableSlots <= 5) return '대체 주차장 보기';
  return '상세/예약';
};

export const getInsight = (lot: ParkingLot) => {
  const seed = hashString(lot.id);
  const choice = seed % 3;

  if (choice === 0) {
    const delta = (seed % 7) - 3;
    const sign = delta >= 0 ? '+' : '';
    return `최근 10분 ${sign}${delta}면`;
  }

  if (choice === 1) {
    const minutes = 2 + (seed % 6);
    return `도보 ${minutes}분`;
  }

  const availableZones = lot.zones
    .filter((zone) => zone.availableSlots > 0)
    .map((zone) => zone.name)
    .slice(0, 2);
  if (availableZones.length === 0) {
    return '예약 가능 구역 확인 필요';
  }
  return `예약 가능 구역 ${availableZones.join(', ')}`;
};
