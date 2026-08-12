'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-purple-900/10 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-600/30">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9 12 3zM5 13.18v4L12 21l7-3.82v-4l-7 4-7-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Assignment System</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@school.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <Button type="submit" loading={loading} className="w-full justify-center text-base py-2.5">
              Sign In
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-slate-500 text-center mb-3">Demo credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { role: 'Admin', email: 'admin@school.com', password: 'Admin@123' },
                { role: 'Teacher', email: 'teacher@school.com', password: 'Teacher@123' },
                { role: 'Student', email: 'student@school.com', password: 'Student@123' },
              ].map(({ role, email, password }) => (
                <div key={role} className="bg-surface border border-border rounded-lg p-2 text-center">
                  <p className="font-semibold text-primary-400 mb-1">{role}</p>
                  <p className="text-slate-500 truncate">{email}</p>
                  <p className="text-slate-500">{password}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
