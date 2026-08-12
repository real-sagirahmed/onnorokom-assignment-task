'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAssignments } from '@/hooks/useAssignments';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import type { Assignment } from '@/types';

export default function TeacherAssignmentsPage() {
  const { assignments, loading, fetchAssignments, deleteAssignment } = useAssignments();
  const [editing, setEditing] = useState<Assignment | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await deleteAssignment(id);
      toast.success('Assignment deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <DashboardLayout title="My Assignments">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{assignments.length} assignments</p>
        <Link href="/teacher/assignments/create">
          <Button>+ Create Assignment</Button>
        </Link>
      </div>

      <AssignmentList
        assignments={assignments}
        loading={loading}
        getHref={(a) => `/teacher/assignments/${a.id}`}
        renderActions={(a) => (
          <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
            <Button size="sm" variant="secondary" onClick={() => setEditing(a)}>Edit</Button>
            <Button size="sm" variant="danger" onClick={() => handleDelete(a.id)}>Del</Button>
          </div>
        )}
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Assignment" size="lg">
        {editing && (
          <AssignmentForm
            defaultValues={editing}
            onSuccess={() => { setEditing(null); fetchAssignments(); }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
