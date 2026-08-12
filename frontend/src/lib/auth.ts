import type { AuthUser } from '@/types';

const AUTH_KEY = 'auth';

export function saveAuth(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    const authString = JSON.stringify(user);
    localStorage.setItem(AUTH_KEY, authString);
    // Set cookie for Next.js middleware (7 days)
    document.cookie = `${AUTH_KEY}=${encodeURIComponent(authString)}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
  }
}

export function getAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getAuth()?.token ?? null;
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    // Clear cookie
    document.cookie = `${AUTH_KEY}=; path=/; max-age=0`;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
