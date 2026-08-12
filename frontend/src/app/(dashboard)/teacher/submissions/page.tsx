'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubmissionCard } from '@/components/submissions/SubmissionCard';
import { Modal } from '@/components/ui/Modal';
import { GradeForm } from '@/components/submissions/GradeForm';
import { Button } from '@/components/ui/Button';
import type { Submission } from '@/types';

export default function TeacherSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<Submission | null>(null);

  useEffect(() => {
    api.get<Submission[]>('/submissions')
      .then(({ data }) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  const handleGraded = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => s.id === updated.id ? updated : s));
    setGrading(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="All Submissions">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-36" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="All Submissions">
      <p className="text-slate-400 text-sm mb-6">{submissions.length} submissions</p>

      {submissions.length === 0 ? (
        <p className="text-slate-500">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              showStudent
              actions={
                <Button size="sm" variant="secondary" onClick={() => setGrading(s)}>
                  {s.status === 'Graded' ? 'Re-grade' : 'Grade'}
                </Button>
              }
            />
          ))}
        </div>
      )}

      <Modal isOpen={!!grading} onClose={() => setGrading(null)} title="Grade Submission" size="lg">
        {grading && <GradeForm submission={grading} onSuccess={handleGraded} onCancel={() => setGrading(null)} />}
      </Modal>
    </DashboardLayout>
  );
}
