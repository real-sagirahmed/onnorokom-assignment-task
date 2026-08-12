'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import type { Assignment } from '@/types';

export default function CreateAssignmentPage() {
  const router = useRouter();
  return (
    <DashboardLayout title="Create Assignment">
      <div className="max-w-2xl mx-auto card">
        <AssignmentForm
          onSuccess={(a: Assignment) => router.push(`/teacher/assignments/${a.id}`)}
          onCancel={() => router.back()}
        />
      </div>
    </DashboardLayout>
  );
}
