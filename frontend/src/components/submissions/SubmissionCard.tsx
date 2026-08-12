import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import type { Submission } from '@/types';

interface SubmissionCardProps {
  submission: Submission;
  showStudent?: boolean;
  actions?: React.ReactNode;
}

export function SubmissionCard({ submission, showStudent = false, actions }: SubmissionCardProps) {
  const scorePercent = submission.marksAwarded != null
    ? Math.round((submission.marksAwarded / submission.maxMarks) * 100)
    : null;

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          {showStudent && (
            <p className="text-sm font-semibold text-slate-200 mb-1">{submission.studentName}</p>
          )}
          <p className="text-xs text-slate-500">
            Submitted {format(new Date(submission.submittedAt), 'MMM d, yyyy · h:mm a')}
            {submission.updatedAt && (
              <span className="ml-2 text-amber-500">· Edited</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={submission.status}>{submission.status}</Badge>
          {actions}
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-border">
        <p className="text-sm text-slate-300 whitespace-pre-wrap">{submission.answer}</p>
      </div>

      {submission.status === 'Graded' && (
        <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">Grade</span>
            <span className="text-lg font-bold text-emerald-300">
              {submission.marksAwarded}/{submission.maxMarks}
              {scorePercent != null && (
                <span className="text-sm ml-1 text-emerald-500">({scorePercent}%)</span>
              )}
            </span>
          </div>
          {submission.feedback && (
            <p className="text-sm text-slate-300 border-t border-emerald-800/50 pt-2">
              <span className="text-emerald-400 font-medium">Feedback: </span>
              {submission.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
