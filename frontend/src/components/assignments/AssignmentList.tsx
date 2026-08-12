import { AssignmentCard } from './AssignmentCard';
import type { Assignment } from '@/types';

interface AssignmentListProps {
  assignments: Assignment[];
  loading: boolean;
  renderActions?: (assignment: Assignment) => React.ReactNode;
  getHref?: (assignment: Assignment) => string;
  emptyMessage?: string;
}

export function AssignmentList({
  assignments, loading, renderActions, getHref, emptyMessage = 'No assignments found.',
}: AssignmentListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-4" />
            <div className="h-5 bg-slate-700 rounded w-3/4 mb-3" />
            <div className="h-3 bg-slate-700 rounded w-full mb-2" />
            <div className="h-3 bg-slate-700 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-slate-500">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {assignments.map((a) => (
        <AssignmentCard
          key={a.id}
          assignment={a}
          href={getHref?.(a)}
          actions={renderActions?.(a)}
        />
      ))}
    </div>
  );
}
