import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AppShell from '../components/layout/AppShell';
import MapPlaceholder from '../components/MapPlaceholder';
import ReservationDialog from '../components/ReservationDialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/use-toast';
import { createReservation, getParkingLot } from '../api/mockServer';
import { useAuthStore } from '../store/auth';
import CountUp from '../components/CountUp';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';

export default function ParkingDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['parkingLot', id],
    queryFn: () => getParkingLot(id || ''),
    enabled: Boolean(id),
    refetchInterval: 10000,
  });

  const sparkline = useMemo(() => {
    const delta = Math.floor(Math.random() * 8) - 3;
    const symbol = delta >= 0 ? '▲' : '▼';
    return `${symbol}${Math.abs(delta)} (최근 10분 변화)`;
  }, [data]);

  const handleReserve = async () => {
    if (!user || !data) return;
    try {
      await createReservation(data.id, user.id);
      toast({ title: '예약 홀드 완료', description: '15분 동안 홀드가 생성되었습니다.' });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['myReservations', user.id] });
    } catch (error) {
      toast({
        title: '예약 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AppShell>
      {isLoading && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      )}

      {data && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="rounded-2xl border border-emerald-100/60 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1.2fr_1.8fr_1fr_1fr_auto]">
              <Select defaultValue="hourly">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="예약 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">시간/일간</SelectItem>
                  <SelectItem value="daily">일간</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="어디로 가시나요?" />
              <Input type="text" placeholder="시작 시간" />
              <Input type="text" placeholder="종료 시간" />
              <Button variant="outline" className="w-full md:w-auto">검색</Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">필터</Button>
              <Button variant="outline" size="sm">차량 유형</Button>
              <Button variant="outline" size="sm">셀프 주차</Button>
              <Button variant="outline" size="sm">지하 주차</Button>
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <Switch />
              전체 요금 표시
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4">
              <p className="text-sm text-slate-500">정렬: 관련도 순</p>
              <Card className="border border-emerald-100/70 shadow-soft">
                <CardHeader>
                  <CardTitle>{data.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl bg-emerald-50/60 p-4">
                    <p className="text-sm text-slate-500">여석</p>
                    <p className="text-3xl font-semibold text-slate-900">
                      <CountUp value={data.availableSlots} />
                    </p>
                    <p className="text-xs text-slate-500">{sparkline}</p>
                  </div>

                  <Tabs defaultValue={data.zones[0]?.id ?? 'zone'}>
                    <TabsList className="grid w-full grid-cols-2">
                      {data.zones.map((zone) => (
                        <TabsTrigger key={zone.id} value={zone.id}>
                          {zone.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {data.zones.map((zone) => (
                      <TabsContent key={zone.id} value={zone.id}>
                        <div className="rounded-xl border border-emerald-100/70 p-4 text-sm text-slate-600">
                          구역 여석: <span className="font-semibold text-slate-900">{zone.availableSlots}</span>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 text-white hover:from-emerald-700 hover:to-emerald-500"
                    disabled={data.availableSlots <= 0}
                    onClick={() => setOpen(true)}
                  >
                    {data.availableSlots > 0 ? '예약 / 홀드' : '여석 없음'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <MapPlaceholder />
            </motion.div>
          </div>
        </motion.div>
      )}

      <ReservationDialog lot={data ?? null} open={open} onOpenChange={setOpen} onConfirm={handleReserve} />
    </AppShell>
  );
}
