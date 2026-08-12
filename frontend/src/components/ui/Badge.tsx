import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
  warning: 'bg-amber-900/50 text-amber-400 border border-amber-800',
  danger:  'bg-red-900/50 text-red-400 border border-red-800',
  info:    'bg-blue-900/50 text-blue-400 border border-blue-800',
  purple:  'bg-purple-900/50 text-purple-400 border border-purple-800',
};

const statusVariantMap: Record<string, BadgeVariant> = {
  Published:   'success',
  Draft:       'warning',
  Closed:      'danger',
  Submitted:   'info',
  UnderReview: 'purple',
  Graded:      'success',
  Late:        'danger',
  Admin:       'danger',
  Teacher:     'info',
  Student:     'success',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  status?: string; // auto-maps status string to variant
  className?: string;
}

export function Badge({ children, variant, status, className }: BadgeProps) {
  const resolvedVariant = variant ?? (status ? (statusVariantMap[status] ?? 'default') : 'default');
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantStyles[resolvedVariant], className)}>
      {children}
    </span>
  );
}
