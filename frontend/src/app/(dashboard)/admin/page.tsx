'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Stats { users: number; classes: number; subjects: number; assignments: number; submissions: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/users'), api.get('/classes'), api.get('/subjects'),
      api.get('/assignments'), api.get('/submissions'),
    ]).then(([u, c, s, a, sub]) => setStats({
      users: u.data.length, classes: c.data.length, subjects: s.data.length,
      assignments: a.data.length, submissions: sub.data.length,
    })).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats?.users, color: 'from-indigo-600 to-indigo-800' },
    { label: 'Classes', value: stats?.classes, color: 'from-purple-600 to-purple-800' },
    { label: 'Subjects', value: stats?.subjects, color: 'from-pink-600 to-pink-800' },
    { label: 'Assignments', value: stats?.assignments, color: 'from-amber-600 to-amber-800' },
    { label: 'Submissions', value: stats?.submissions, color: 'from-emerald-600 to-emerald-800' },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-5 shadow-lg`}>
            <p className="text-3xl font-bold text-white mb-1">
              {stats ? c.value : <span className="animate-pulse">—</span>}
            </p>
            <p className="text-sm text-white/70">{c.label}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
