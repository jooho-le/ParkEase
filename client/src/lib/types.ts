export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ParkingLot = {
  id: string;
  name: string;
  totalSlots: number;
  availableSlots: number;
  congestionLevel: CongestionLevel;
  location: { lat: number; lng: number };
  zones: { id: string; name: string; availableSlots: number }[];
  updatedAt: string;
};

export type ReservationStatus =
  | 'HELD'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED';

export type Reservation = {
  id: string;
  parkingLotId: string;
  userId: string;
  status: ReservationStatus;
  createdAt: string;
  holdExpiresAt: string;
};

export type User = {
  id: string;
  role: 'STUDENT' | 'STAFF';
  name: string;
};

export type PanelMode = 'DEFAULT' | 'SELECTED' | 'FOCUS';
