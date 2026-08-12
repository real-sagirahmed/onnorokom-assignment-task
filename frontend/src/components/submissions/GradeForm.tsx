'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import type { GradeSubmissionPayload, Submission } from '@/types';

interface GradeFormProps {
  submission: Submission;
  onSuccess: (updated: Submission) => void;
  onCancel: () => void;
}

export function GradeForm({ submission, onSuccess, onCancel }: GradeFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<GradeSubmissionPayload>({
    defaultValues: {
      marksAwarded: submission.marksAwarded ?? 0,
      feedback: submission.feedback ?? '',
      status: 'Graded',
    },
  });

  const onSubmit = async (data: GradeSubmissionPayload) => {
    setLoading(true);
    try {
      const { data: updated } = await api.patch<Submission>(
        `/submissions/${submission.id}/grade`,
        { ...data, marksAwarded: Number(data.marksAwarded) }
      );
      toast.success('Submission graded!');
      onSuccess(updated);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Grading failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-surface rounded-lg p-4 border border-border">
        <p className="text-xs text-slate-500 mb-1">Student Answer</p>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">{submission.answer}</p>
      </div>

      <Input
        id="marksAwarded"
        label={`Marks (max: ${submission.maxMarks})`}
        type="number"
        min={0}
        max={submission.maxMarks}
        error={errors.marksAwarded?.message}
        {...register('marksAwarded', {
          required: 'Marks required',
          min: { value: 0, message: 'Cannot be negative' },
          max: { value: submission.maxMarks, message: `Cannot exceed ${submission.maxMarks}` },
          valueAsNumber: true,
        })}
      />

      <Textarea
        id="feedback"
        label="Feedback (optional)"
        rows={3}
        placeholder="Write your feedback for the student..."
        {...register('feedback')}
      />

      <Select
        id="status"
        label="Status"
        options={[
          { value: 'Graded', label: 'Graded' },
          { value: 'UnderReview', label: 'Under Review' },
        ]}
        {...register('status')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Grade</Button>
      </div>
    </form>
  );
}
