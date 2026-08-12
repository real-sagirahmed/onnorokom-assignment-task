'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { Submission } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Submission[]>('/submissions').then(({ data }) => setSubmissions(data)).finally(() => setLoading(false));
  }, []);

  const graded = submissions.filter((s) => s.status === 'Graded');
  const avg = graded.length > 0
    ? Math.round(graded.reduce((acc, s) => acc + (s.marksAwarded ?? 0) / s.maxMarks, 0) / graded.length * 100)
    : null;

  return (
    <DashboardLayout title={`Welcome, ${user?.name ?? 'Student'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Submitted', value: loading ? '—' : submissions.length, color: 'from-indigo-600 to-indigo-800' },
          { label: 'Graded', value: loading ? '—' : graded.length, color: 'from-emerald-600 to-emerald-800' },
          { label: 'Avg Score', value: loading ? '—' : (avg != null ? `${avg}%` : 'N/A'), color: 'from-purple-600 to-purple-800' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-6 shadow-lg`}>
            <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-sm text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-sm">Go to <strong className="text-slate-300">Assignments</strong> to view and submit your assignments.</p>
    </DashboardLayout>
  );
}
