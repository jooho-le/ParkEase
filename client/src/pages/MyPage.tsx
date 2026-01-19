import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AppShell from '../components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { useToast } from '../components/ui/use-toast';
import Countdown from '../components/Countdown';
import { cancelReservation, confirmEntry, getMyReservations, getParkingLots } from '../api/mockServer';
import { useAuthStore } from '../store/auth';

export default function MyPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(['lot-a']);

  const { data: reservations = [] } = useQuery({
    queryKey: ['myReservations', user?.id],
    queryFn: () => getMyReservations(user?.id ?? ''),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
  });

  const { data: lots = [] } = useQuery({
    queryKey: ['parkingLots'],
    queryFn: getParkingLots,
  });

  const current = useMemo(
    () => reservations.find((res) => res.status === 'HELD' || res.status === 'ACTIVE'),
    [reservations]
  );

  const history = useMemo(
    () => reservations.filter((res) => res.status !== 'HELD' && res.status !== 'ACTIVE'),
    [reservations]
  );

  const statusLabel = (status: string) => {
    switch (status) {
      case 'HELD':
        return '홀드';
      case 'ACTIVE':
        return '활성';
      case 'COMPLETED':
        return '완료';
      case 'EXPIRED':
        return '만료';
      case 'CANCELLED':
        return '취소';
      default:
        return status;
    }
  };

  const handleCancel = async () => {
    if (!current) return;
    try {
      await cancelReservation(current.id);
      toast({ title: '예약이 취소되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['myReservations', user?.id] });
    } catch (error) {
      toast({
        title: '취소 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    if (!current) return;
    try {
      await confirmEntry(current.id);
      toast({ title: '입차 완료', description: '예약이 완료되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['myReservations', user?.id] });
    } catch (error) {
      toast({
        title: '입차 처리 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>현재 예약</CardTitle>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">홀드 만료까지</p>
                  <p className="text-2xl font-semibold">
                    <Countdown target={current.holdExpiresAt} />
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>취소</Button>
                  <Button onClick={handleConfirm}>입차 완료</Button>
                </div>
              </div>
              <p className="text-sm text-slate-600">예약 ID: {current.id}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">진행 중인 예약이 없습니다.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>지난 예약</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">예약 이력이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>예약 ID</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>생성</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell>{res.id}</TableCell>
                    <TableCell>{statusLabel(res.status)}</TableCell>
                    <TableCell>{res.createdAt.slice(0, 16).replace('T', ' ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between text-sm text-slate-600">
            만석 {'\u2192'} 여석 알림
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">즐겨찾기 주차장</p>
            <div className="grid gap-2 md:grid-cols-2">
              {lots.map((lot) => (
                <label key={lot.id} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={favorites.includes(lot.id)}
                    onChange={(event) => {
                      setFavorites((prev) =>
                        event.target.checked
                          ? [...prev, lot.id]
                          : prev.filter((id) => id !== lot.id)
                      );
                    }}
                  />
                  {lot.name}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
