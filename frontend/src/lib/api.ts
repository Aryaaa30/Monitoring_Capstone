/**
 * URL dasar Backend API NestJS
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Fungsi: Mengambil token autentikasi JWT dari local storage peramban.
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Fungsi: Mengambil data pengguna yang tersimpan di local storage.
 */
export function getCurrentUser(): any | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Fungsi: Menyimpan sesi login (token dan data pengguna) ke local storage.
 */
export function setAuthSession(token: string, user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * Fungsi: Menghapus sesi login saat pengguna melakukan logout.
 */
export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

/**
 * Fungsi Pembantu: Melakukan panggilan HTTP request ke Backend NestJS dengan header otorisasi otomatis.
 */
export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request gagal dengan status ${response.status}`);
  }

  return data as T;
}

