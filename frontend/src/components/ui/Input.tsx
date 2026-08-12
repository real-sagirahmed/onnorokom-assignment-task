import { clsx } from 'clsx';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx('input', error && 'border-red-500 focus:ring-red-500', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={clsx('input resize-none', error && 'border-red-500', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={clsx('input', error && 'border-red-500', className)}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';
