import { useAuthStore } from '../store/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, { method = 'GET', body, token }: RequestOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!response.ok) {
    const message = data?.error || '요청에 실패했습니다.';
    throw new Error(message);
  }

  return data as T;
}

export type ServerUser = {
  id: string;
  name: string;
  userType: 'STUDENT' | 'STAFF' | string;
  carNumber?: string | null;
};

export async function registerUser(payload: {
  id: string;
  password: string;
  name: string;
  userType: string;
  carNumber?: string | null;
}) {
  return request<{ token: string; user: ServerUser }>('/api/users', {
    method: 'POST',
    body: payload,
  });
}

export async function loginUser(payload: { id: string; password: string }) {
  return request<{ token: string; user: ServerUser }>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function getMe(token: string) {
  return request<{ user: ServerUser }>('/api/users/me', { token });
}

export async function updateMe(token: string, payload: {
  name?: string;
  userType?: string;
  carNumber?: string | null;
  password?: string;
}) {
  return request<{ user: ServerUser }>('/api/users/me', {
    method: 'PUT',
    body: payload,
    token,
  });
}

export async function deleteMe(token: string) {
  return request<{ success: boolean }>('/api/users/me', {
    method: 'DELETE',
    token,
  });
}

export async function getProfile(token: string) {
  return request<{ user: ServerUser }>('/api/profile', { token });
}

export async function updateProfile(token: string, payload: { carNumber?: string | null }) {
  return request<{ user: ServerUser }>('/api/profile', {
    method: 'PUT',
    body: payload,
    token,
  });
}

export async function getNotificationSettings(token: string) {
  return request<{ userId: string; pushEnabled: number | boolean; marketingEnabled: number | boolean; updatedAt: string }>(
    '/api/notification-settings',
    { token }
  );
}

export async function updateNotificationSettings(token: string, payload: {
  pushEnabled: boolean;
  marketingEnabled: boolean;
}) {
  return request<{ userId: string; pushEnabled: number | boolean; marketingEnabled: number | boolean; updatedAt: string }>(
    '/api/notification-settings',
    { method: 'PUT', body: payload, token }
  );
}

export async function getReservations(token: string) {
  return request<{ data: Array<{ id: string; lotName: string; status: string; createdAt: string; expiresAt: string; updatedAt: string }> }>('/api/reservations', { token });
}

export async function cancelReservation(token: string, id: string) {
  return request<{ id: string; lotName: string; status: string; createdAt: string; expiresAt: string; updatedAt: string }>(
    `/api/reservations/${id}`,
    { method: 'DELETE', token }
  );
}
