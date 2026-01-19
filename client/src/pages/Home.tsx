import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getParkingLots } from '../api/mockServer';
import { PanelMode } from '../lib/types';
import AppShell from '../components/layout/AppShell';
import { Skeleton } from '../components/ui/skeleton';
import { pickRecommendedLot } from '../lib/parking';
import StatusChips from '../components/home/StatusChips';
import MapPanel from '../components/home/MapPanel';
import SidePanel from '../components/home/SidePanel';
import BottomSheet from '../components/home/BottomSheet';

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('distance');
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('DEFAULT');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['parkingLots'],
    queryFn: getParkingLots,
    refetchInterval: 10000,
  });

  const summary = useMemo(() => {
    const lots = data ?? [];
    const totalAvailable = lots.reduce((sum, lot) => sum + lot.availableSlots, 0);
    const fullLots = lots.filter((lot) => lot.availableSlots === 0).length;
    const congested = lots.filter((lot) => lot.congestionLevel === 'HIGH').length;
    return { totalAvailable, fullLots, congested };
  }, [data]);

  const filtered = useMemo(() => {
    let lots = (data ?? []).filter((lot) =>
      lot.name.toLowerCase().includes(search.toLowerCase())
    );

    if (onlyAvailable) {
      lots = lots.filter((lot) => lot.availableSlots > 0);
    }

    if (sort === 'availability') {
      lots = [...lots].sort((a, b) => b.availableSlots - a.availableSlots);
    } else if (sort === 'congestion') {
      const order = { LOW: 0, MEDIUM: 1, HIGH: 2 } as const;
      lots = [...lots].sort((a, b) => order[a.congestionLevel] - order[b.congestionLevel]);
    }

    return lots;
  }, [data, search, onlyAvailable, sort]);

  const recommendedId = useMemo(() => pickRecommendedLot(filtered), [filtered]);
  const latestUpdate = useMemo(() => {
    const lots = data ?? [];
    const latest = lots.reduce((acc, lot) => (lot.updatedAt > acc ? lot.updatedAt : acc), lots[0]?.updatedAt ?? new Date().toISOString());
    return latest;
  }, [data]);

  useEffect(() => {
    if (selectedLotId && panelMode === 'DEFAULT') {
      setPanelMode('SELECTED');
    }
    if (!selectedLotId && panelMode !== 'DEFAULT') {
      setPanelMode('DEFAULT');
    }
  }, [panelMode, selectedLotId]);

  useEffect(() => {
    if (selectedLotId && !filtered.some((lot) => lot.id === selectedLotId)) {
      setSelectedLotId(null);
      setPanelMode('DEFAULT');
    }
  }, [filtered, selectedLotId]);

  const handleSelectLot = (id: string) => {
    setSelectedLotId((prev) => {
      const next = prev === id ? null : id;
      setPanelMode(next ? 'SELECTED' : 'DEFAULT');
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedLotId(null);
    setPanelMode('DEFAULT');
  };

  const handleEnterFocus = () => {
    if (selectedLotId) {
      setPanelMode('FOCUS');
    }
  };

  const handleExitFocus = () => {
    setPanelMode(selectedLotId ? 'SELECTED' : 'DEFAULT');
  };

  return (
    <AppShell>
      <motion.div initial="hidden" animate="visible" variants={pageVariants} className="space-y-6">
        <StatusChips
          totalAvailable={summary.totalAvailable}
          fullLots={summary.fullLots}
          congested={summary.congested}
          updatedAt={latestUpdate}
        />

        {isLoading && (
          <section className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`lot-skel-${index}`} className="h-40 w-full rounded-2xl" />
            ))}
          </section>
        )}

        {isError && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            주차장 목록을 불러오지 못했습니다.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="hidden lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
              <MapPanel
                lots={filtered}
                selectedId={selectedLotId}
                onSelect={handleSelectLot}
              />
              <SidePanel
                lots={filtered}
                recommendedId={recommendedId}
                search={search}
                onSearch={setSearch}
                sort={sort}
                onSort={setSort}
                onlyAvailable={onlyAvailable}
                onToggleAvailable={setOnlyAvailable}
                panelMode={panelMode}
                selectedLotId={selectedLotId}
                onSelectLot={handleSelectLot}
                onClearSelection={handleClearSelection}
                onEnterFocus={handleEnterFocus}
                onExitFocus={handleExitFocus}
              />
            </div>

            <div className="relative lg:hidden">
              <MapPanel
                lots={filtered}
                selectedId={selectedLotId}
                onSelect={handleSelectLot}
              />
              <BottomSheet mode={panelMode}>
                <SidePanel
                  lots={filtered}
                  recommendedId={recommendedId}
                  search={search}
                  onSearch={setSearch}
                  sort={sort}
                  onSort={setSort}
                  onlyAvailable={onlyAvailable}
                  onToggleAvailable={setOnlyAvailable}
                  panelMode={panelMode}
                  selectedLotId={selectedLotId}
                  onSelectLot={handleSelectLot}
                  onClearSelection={handleClearSelection}
                  onEnterFocus={handleEnterFocus}
                  onExitFocus={handleExitFocus}
                />
              </BottomSheet>
            </div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
