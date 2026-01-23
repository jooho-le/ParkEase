import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AppShell from '../components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { useToast } from '../components/ui/use-toast';
import Countdown from '../components/Countdown';
import { getParkingLots } from '../api/mockServer';
import {
  cancelReservation,
  deleteMe,
  getFavorites,
  getMe,
  getNotificationSettings,
  getReservations,
  updateFavorites,
  updateMe,
  updateNotificationSettings,
} from '../api/server';
import { useAuthStore } from '../store/auth';
import { Input } from '../components/ui/input';

export default function MyPage() {
  const { user, token, login, logout } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['lot-a']);
  const [profileName, setProfileName] = useState('');
  const [profileUserType, setProfileUserType] = useState<'STUDENT' | 'STAFF'>('STUDENT');
  const [carNumber, setCarNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { data: meData, error: meError } = useQuery({
    queryKey: ['me', token],
    queryFn: () => getMe(token || ''),
    enabled: Boolean(token),
  });

  const { data: reservationsData, error: reservationsError } = useQuery({
    queryKey: ['myReservations', token],
    queryFn: () => getReservations(token || ''),
    enabled: Boolean(token),
    refetchInterval: 5000,
  });

  const { data: notificationData, error: notificationError } = useQuery({
    queryKey: ['notificationSettings', token],
    queryFn: () => getNotificationSettings(token || ''),
    enabled: Boolean(token),
  });

  const { data: favoritesData, error: favoritesError } = useQuery({
    queryKey: ['favorites', token],
    queryFn: () => getFavorites(token || ''),
    enabled: Boolean(token),
  });

  const { data: lots = [] } = useQuery({
    queryKey: ['parkingLots'],
    queryFn: getParkingLots,
  });

  useEffect(() => {
    if (meData?.user) {
      setProfileName(meData.user.name ?? '');
      setProfileUserType(meData.user.userType === 'STAFF' ? 'STAFF' : 'STUDENT');
      setCarNumber(meData.user.carNumber ?? '');
    }
  }, [meData]);

  useEffect(() => {
    if (notificationData) {
      setAlertsEnabled(Boolean(notificationData.pushEnabled));
      setMarketingEnabled(Boolean(notificationData.marketingEnabled));
    }
  }, [notificationData]);

  useEffect(() => {
    if (favoritesData?.lotIds) {
      setFavorites(favoritesData.lotIds);
    }
  }, [favoritesData]);

  const reservations = reservationsData?.data ?? [];
  const errorMessage = useMemo(() => {
    const errors = [meError, reservationsError, notificationError, favoritesError].filter(Boolean) as Error[];
    if (errors.length === 0) return null;
    return errors[0].message || '데이터를 불러오지 못했습니다.';
  }, [favoritesError, meError, notificationError, reservationsError]);

  const current = useMemo(
    () => reservations.find((res) => res.status === 'active'),
    [reservations]
  );

  const history = useMemo(
    () => reservations.filter((res) => res.status !== 'active'),
    [reservations]
  );

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'cancelled':
        return '취소';
      case 'expired':
        return '만료';
      default:
        return status;
    }
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      updateMe(token || '', {
        name: profileName.trim(),
        userType: profileUserType,
        carNumber: carNumber.trim() || null,
        password: newPassword ? newPassword : undefined,
      }),
    onSuccess: (data) => {
      login(
        {
          id: data.user.id,
          name: data.user.name,
          role: data.user.userType === 'STAFF' ? 'STAFF' : 'STUDENT',
        },
        token || ''
      );
      setNewPassword('');
      toast({ title: '내 정보가 저장되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['me', token] });
    },
    onError: (error) => {
      toast({
        title: '저장 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const notificationMutation = useMutation({
    mutationFn: (payload: { pushEnabled: boolean; marketingEnabled: boolean }) =>
      updateNotificationSettings(token || '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings', token] });
    },
    onError: (error) => {
      toast({
        title: '알림 설정 저장 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const favoritesMutation = useMutation({
    mutationFn: (payload: { lotIds: string[] }) => updateFavorites(token || '', payload),
    onSuccess: (data) => {
      setFavorites(data.lotIds);
      queryClient.invalidateQueries({ queryKey: ['favorites', token] });
    },
    onError: (error) => {
      toast({
        title: '즐겨찾기 저장 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMe(token || ''),
    onSuccess: () => {
      toast({ title: '계정이 삭제되었습니다.' });
      logout();
    },
    onError: (error) => {
      toast({
        title: '삭제 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const handleCancel = async () => {
    if (!current) return;
    try {
      await cancelReservation(token || '', current.id);
      toast({ title: '예약이 취소되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['myReservations', token] });
    } catch (error) {
      toast({
        title: '취소 실패',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AppShell>
      {errorMessage && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
          {errorMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>내 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">이름</p>
              <Input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500">사용자 유형</p>
              <div className="flex gap-2">
                <Button
                  variant={profileUserType === 'STUDENT' ? 'default' : 'outline'}
                  onClick={() => setProfileUserType('STUDENT')}
                  className="flex-1"
                >
                  학생
                </Button>
                <Button
                  variant={profileUserType === 'STAFF' ? 'default' : 'outline'}
                  onClick={() => setProfileUserType('STAFF')}
                  className="flex-1"
                >
                  교직원
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500">차량 번호</p>
              <Input value={carNumber} onChange={(event) => setCarNumber(event.target.value)} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500">새 비밀번호</p>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="변경 시에만 입력"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? '저장 중...' : '저장'}
            </Button>
            <Button
              variant="outline"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              계정 삭제
            </Button>
          </div>
          {user && (
            <p className="text-xs text-slate-400">아이디: {user.id}</p>
          )}
        </CardContent>
      </Card>

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
                    <Countdown target={current.expiresAt} />
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>취소</Button>
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
            <Switch
              checked={alertsEnabled}
              onCheckedChange={(checked) => {
                setAlertsEnabled(checked);
                notificationMutation.mutate({
                  pushEnabled: checked,
                  marketingEnabled,
                });
              }}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-600">
            이벤트/공지 알림
            <Switch
              checked={marketingEnabled}
              onCheckedChange={(checked) => {
                setMarketingEnabled(checked);
                notificationMutation.mutate({
                  pushEnabled: alertsEnabled,
                  marketingEnabled: checked,
                });
              }}
            />
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
                      const next = event.target.checked
                        ? [...favorites, lot.id]
                        : favorites.filter((id) => id !== lot.id);
                      setFavorites(next);
                      favoritesMutation.mutate({ lotIds: next });
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
