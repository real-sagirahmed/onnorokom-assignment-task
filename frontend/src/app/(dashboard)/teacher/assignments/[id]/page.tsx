'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { SubmissionCard } from '@/components/submissions/SubmissionCard';
import { Modal } from '@/components/ui/Modal';
import { GradeForm } from '@/components/submissions/GradeForm';
import { Button } from '@/components/ui/Button';
import type { Assignment, Submission } from '@/types';

export default function TeacherAssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grading, setGrading] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Assignment>(`/assignments/${id}`),
      api.get<Submission[]>(`/submissions?assignmentId=${id}`),
    ]).then(([a, s]) => {
      setAssignment(a.data);
      setSubmissions(s.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleGraded = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setGrading(null);
  };

  if (loading) return <DashboardLayout title="Loading..."><div className="animate-pulse h-40 bg-card rounded-xl" /></DashboardLayout>;
  if (!assignment) return <DashboardLayout title="Not Found"><p className="text-slate-400">Assignment not found.</p></DashboardLayout>;

  return (
    <DashboardLayout title={assignment.title}>
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            <Badge status={assignment.status}>{assignment.status}</Badge>
            <Badge variant="default">{assignment.subjectName}</Badge>
            <Badge variant="default">{assignment.className}</Badge>
          </div>
          <span className="text-sm text-slate-400">Max {assignment.maxMarks} marks</span>
        </div>
        <p className="text-slate-300 whitespace-pre-wrap">{assignment.description}</p>
        <p className="text-xs text-slate-500 mt-4">
          Deadline: {format(new Date(assignment.deadline), 'MMMM d, yyyy · h:mm a')}
        </p>
      </div>

      <h2 className="text-base font-semibold text-slate-200 mb-4">
        Submissions ({submissions.length})
      </h2>

      {submissions.length === 0 ? (
        <p className="text-slate-500 text-sm">No submissions yet.</p>
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
