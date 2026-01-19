import { ParkingLot, Reservation, User } from '../lib/types';

const LATENCY = 600;
const STORAGE_KEY = 'parkease_mock_state_v1';

type State = {
  parkingLots: ParkingLot[];
  reservations: Reservation[];
  users: User[];
};

const nowIso = () => new Date().toISOString();

const seedState: State = {
  parkingLots: [
    {
      id: 'lot-a',
      name: '공대 1 주차장',
      totalSlots: 120,
      availableSlots: 24,
      congestionLevel: 'MEDIUM',
      location: { lat: 35.846, lng: 127.129 },
      zones: [
        { id: 'a-1', name: 'Zone A1', availableSlots: 8 },
        { id: 'a-2', name: 'Zone A2', availableSlots: 10 },
        { id: 'a-3', name: 'Zone A3', availableSlots: 6 },
      ],
      updatedAt: nowIso(),
    },
    {
      id: 'lot-b',
      name: '중앙도서관 지하',
      totalSlots: 90,
      availableSlots: 4,
      congestionLevel: 'HIGH',
      location: { lat: 35.845, lng: 127.128 },
      zones: [
        { id: 'b-1', name: 'B1', availableSlots: 2 },
        { id: 'b-2', name: 'B2', availableSlots: 1 },
        { id: 'b-3', name: 'B3', availableSlots: 1 },
      ],
      updatedAt: nowIso(),
    },
    {
      id: 'lot-c',
      name: '체육관 지상',
      totalSlots: 60,
      availableSlots: 41,
      congestionLevel: 'LOW',
      location: { lat: 35.847, lng: 127.131 },
      zones: [
        { id: 'c-1', name: 'North', availableSlots: 18 },
        { id: 'c-2', name: 'South', availableSlots: 23 },
      ],
      updatedAt: nowIso(),
    },
  ],
  reservations: [],
  users: [
    { id: 'student-01', role: 'STUDENT', name: '학생 김' },
    { id: 'staff-01', role: 'STAFF', name: '교직원 박' },
  ],
};

const cloneSeed = (): State => JSON.parse(JSON.stringify(seedState)) as State;

const loadState = (): State => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return cloneSeed();
  }
  try {
    return JSON.parse(raw) as State;
  } catch {
    return cloneSeed();
  }
};

const saveState = (state: State) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

let state = loadState();

const delay = async <T>(value: T, ms = LATENCY) =>
  new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

const deriveCongestion = (available: number, total: number) => {
  const ratio = total === 0 ? 0 : available / total;
  if (ratio <= 0.1) return 'HIGH';
  if (ratio <= 0.3) return 'MEDIUM';
  return 'LOW';
};

const expireReservations = () => {
  const now = Date.now();
  let changed = false;

  state.reservations = state.reservations.map((res) => {
    if (res.status === 'HELD' && new Date(res.holdExpiresAt).getTime() < now) {
      changed = true;
      return { ...res, status: 'EXPIRED' };
    }
    return res;
  });

  if (changed) saveState(state);
};

const updateAvailability = () => {
  state.parkingLots = state.parkingLots.map((lot) => {
    const delta = Math.floor(Math.random() * 5) - 2;
    const next = Math.max(0, Math.min(lot.totalSlots, lot.availableSlots + delta));
    const zones = lot.zones.map((zone) => {
      const zoneDelta = Math.floor(Math.random() * 3) - 1;
      const zoneNext = Math.max(0, Math.min(lot.totalSlots, zone.availableSlots + zoneDelta));
      return { ...zone, availableSlots: zoneNext };
    });
    return {
      ...lot,
      availableSlots: next,
      congestionLevel: deriveCongestion(next, lot.totalSlots),
      zones,
      updatedAt: nowIso(),
    };
  });
  saveState(state);
};

setInterval(() => {
  expireReservations();
  updateAvailability();
}, 10000);

export const mockAuthLogin = async (role: User['role']) => {
  const user = state.users.find((u) => u.role === role) ?? state.users[0];
  return delay({ token: 'dummy-jwt-token', user });
};

export const mockAuthRegister = async ({
  name,
  role,
}: {
  name: string;
  role: User['role'];
}) => {
  const user: User = {
    id: `user-${Math.random().toString(36).slice(2, 8)}`,
    role,
    name: name || (role === 'STUDENT' ? '학생 신규' : '교직원 신규'),
  };
  state.users.push(user);
  saveState(state);
  return delay({ token: 'dummy-jwt-token', user });
};

export const getParkingLots = async () => {
  expireReservations();
  return delay([...state.parkingLots]);
};

export const getParkingLot = async (id: string) => {
  expireReservations();
  const lot = state.parkingLots.find((item) => item.id === id);
  if (!lot) {
    throw new Error('주차장을 찾을 수 없습니다.');
  }
  return delay({ ...lot });
};

export const getMyReservations = async (userId: string) => {
  expireReservations();
  const list = state.reservations.filter((r) => r.userId === userId);
  return delay([...list]);
};

export const createReservation = async (parkingLotId: string, userId: string) => {
  expireReservations();
  const existing = state.reservations.find(
    (r) => r.userId === userId && (r.status === 'HELD' || r.status === 'ACTIVE')
  );
  if (existing) {
    throw new Error('이미 진행 중인 예약이 있습니다.');
  }

  const lot = state.parkingLots.find((item) => item.id === parkingLotId);
  if (!lot) {
    throw new Error('주차장을 찾을 수 없습니다.');
  }
  if (lot.availableSlots <= 0) {
    throw new Error('여석이 없습니다.');
  }

  const now = Date.now();
  const reservation: Reservation = {
    id: `res-${Math.random().toString(36).slice(2, 8)}`,
    parkingLotId,
    userId,
    status: 'HELD',
    createdAt: new Date(now).toISOString(),
    holdExpiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
  };

  state.reservations.push(reservation);
  saveState(state);
  return delay(reservation);
};

export const cancelReservation = async (id: string) => {
  expireReservations();
  const index = state.reservations.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('예약을 찾을 수 없습니다.');
  }
  state.reservations[index] = { ...state.reservations[index], status: 'CANCELLED' };
  saveState(state);
  return delay(state.reservations[index]);
};

export const confirmEntry = async (id: string) => {
  expireReservations();
  const index = state.reservations.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('예약을 찾을 수 없습니다.');
  }
  const current = state.reservations[index];
  if (current.status !== 'HELD') {
    throw new Error('홀드 상태의 예약이 아닙니다.');
  }
  state.reservations[index] = { ...current, status: 'COMPLETED' };
  saveState(state);
  return delay(state.reservations[index]);
};
