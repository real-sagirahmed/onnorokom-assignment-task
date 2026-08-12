'use client';

import { useAssignments } from '@/hooks/useAssignments';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { assignments, loading } = useAssignments();

  const published = assignments.filter((a) => a.status === 'Published').length;
  const draft = assignments.filter((a) => a.status === 'Draft').length;
  const totalSubmissions = assignments.reduce((acc, a) => acc + a.submissionsCount, 0);

  return (
    <DashboardLayout title={`Welcome, ${user?.name ?? 'Teacher'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Published Assignments', value: loading ? '—' : published, color: 'from-indigo-600 to-indigo-800' },
          { label: 'Drafts', value: loading ? '—' : draft, color: 'from-amber-600 to-amber-800' },
          { label: 'Total Submissions', value: loading ? '—' : totalSubmissions, color: 'from-emerald-600 to-emerald-800' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-6 shadow-lg`}>
            <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-sm text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-sm">Go to <strong className="text-slate-300">Assignments</strong> to create or manage assignments.</p>
    </DashboardLayout>
  );
}
