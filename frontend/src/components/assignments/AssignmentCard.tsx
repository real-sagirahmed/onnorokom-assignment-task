import Link from 'next/link';
import { format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import type { Assignment } from '@/types';

interface AssignmentCardProps {
  assignment: Assignment;
  href?: string;
  actions?: React.ReactNode;
}

export function AssignmentCard({ assignment, href, actions }: AssignmentCardProps) {
  const isOverdue = isPast(new Date(assignment.deadline)) && assignment.status === 'Published';

  const card = (
    <div className="card group hover:border-primary-600/50 transition-all duration-300 hover:shadow-primary-600/10 hover:shadow-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge status={assignment.status}>{assignment.status}</Badge>
          <Badge variant="default">{assignment.subjectName}</Badge>
          {isOverdue && <Badge variant="danger">Overdue</Badge>}
        </div>
        {actions}
      </div>

      <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-primary-400 transition-colors">
        {assignment.title}
      </h3>
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{assignment.description}</p>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={isOverdue ? 'text-red-400' : ''}>
            {format(new Date(assignment.deadline), 'MMM d, yyyy · h:mm a')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Max {assignment.maxMarks} marks
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
          {assignment.className}
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {assignment.submissionsCount} submissions
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}
