'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubmissionCard } from '@/components/submissions/SubmissionCard';
import type { Submission } from '@/types';

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Submission[]>('/submissions')
      .then(({ data }) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Submissions">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse h-36" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Submissions">
      <p className="text-slate-400 text-sm mb-6">{submissions.length} submissions</p>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-slate-500">
          <p className="text-sm">You haven't submitted anything yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <SubmissionCard key={s.id} submission={s} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
