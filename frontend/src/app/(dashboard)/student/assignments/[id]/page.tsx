'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format, isPast } from 'date-fns';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { SubmissionForm } from '@/components/submissions/SubmissionForm';
import { SubmissionCard } from '@/components/submissions/SubmissionCard';
import type { Assignment, Submission } from '@/types';

export default function StudentAssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Assignment>(`/assignments/${id}`),
      api.get<Submission[]>(`/submissions?studentId=${user?.userId}`),
    ]).then(([a, s]) => {
      setAssignment(a.data);
      setSubmission(s.data.find((sub) => sub.assignmentId === parseInt(id)) ?? null);
    }).finally(() => setLoading(false));
  }, [id, user?.userId]);

  const isDeadlinePassed = assignment ? isPast(new Date(assignment.deadline)) : false;
  const canUpdate = submission && !isDeadlinePassed && submission.status !== 'Graded';

  if (loading) return <DashboardLayout title="Loading..."><div className="animate-pulse h-40 bg-card rounded-xl" /></DashboardLayout>;
  if (!assignment) return <DashboardLayout title="Not Found"><p className="text-slate-400">Assignment not found.</p></DashboardLayout>;

  return (
    <DashboardLayout title={assignment.title}>
      {/* Assignment detail */}
      <div className="card mb-8">
        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge status={assignment.status}>{assignment.status}</Badge>
          <Badge variant="default">{assignment.subjectName}</Badge>
          {isDeadlinePassed && <Badge variant="danger">Deadline Passed</Badge>}
        </div>
        <p className="text-slate-300 whitespace-pre-wrap mb-4">{assignment.description}</p>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <span>📅 Deadline: {format(new Date(assignment.deadline), 'MMMM d, yyyy · h:mm a')}</span>
          <span>⭐ Max Marks: {assignment.maxMarks}</span>
          <span>👨‍🏫 {assignment.teacherName}</span>
        </div>
      </div>

      {/* Submission section */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-4">
          {submission ? 'Your Submission' : 'Submit Answer'}
        </h2>

        {submission ? (
          <div className="space-y-4">
            <SubmissionCard submission={submission} />
            {canUpdate && (
              <div className="card">
                <h3 className="text-sm font-medium text-slate-300 mb-4">Update your answer</h3>
                <SubmissionForm
                  assignmentId={assignment.id}
                  existingSubmission={submission}
                  onSuccess={setSubmission}
                />
              </div>
            )}
          </div>
        ) : isDeadlinePassed ? (
          <div className="card text-center text-slate-500">
            <p>The deadline has passed. You can no longer submit.</p>
          </div>
        ) : (
          <div className="card">
            <SubmissionForm
              assignmentId={assignment.id}
              onSuccess={setSubmission}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
