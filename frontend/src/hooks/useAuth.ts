'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { clearAuth, getAuth, saveAuth } from '@/lib/auth';
import type { AuthUser, LoginResponse } from '@/types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getAuth();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      const authUser: AuthUser = {
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email,
        userId: data.userId,
      };
      saveAuth(authUser);
      setUser(authUser);

      // Redirect by role
      const roleRoutes: Record<string, string> = {
        Admin: '/admin',
        Teacher: '/teacher',
        Student: '/student',
      };
      router.push(roleRoutes[data.role] ?? '/login');
    },
    [router]
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, loading, login, logout };
}
