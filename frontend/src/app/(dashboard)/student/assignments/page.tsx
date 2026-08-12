'use client';

import { useAssignments } from '@/hooks/useAssignments';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AssignmentList } from '@/components/assignments/AssignmentList';

export default function StudentAssignmentsPage() {
  const { assignments, loading } = useAssignments();

  return (
    <DashboardLayout title="My Assignments">
      <p className="text-slate-400 text-sm mb-6">{assignments.length} published assignments for your class</p>
      <AssignmentList
        assignments={assignments}
        loading={loading}
        getHref={(a) => `/student/assignments/${a.id}`}
        emptyMessage="No assignments yet. Check back later!"
      />
    </DashboardLayout>
  );
}
