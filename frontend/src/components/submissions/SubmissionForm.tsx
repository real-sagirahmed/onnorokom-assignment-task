'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import type { Submission } from '@/types';

interface SubmissionFormProps {
  assignmentId: number;
  existingSubmission?: Submission;
  onSuccess: (submission: Submission) => void;
}

export function SubmissionForm({ assignmentId, existingSubmission, onSuccess }: SubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { answer: existingSubmission?.answer ?? '' },
  });

  const onSubmit = async (data: { answer: string }) => {
    setLoading(true);
    try {
      let result: Submission;
      if (existingSubmission) {
        const { data: updated } = await api.put<Submission>(`/submissions/${existingSubmission.id}`, data);
        result = updated;
        toast.success('Submission updated!');
      } else {
        const { data: created } = await api.post<Submission>('/submissions', { ...data, assignmentId });
        result = created;
        toast.success('Submitted successfully!');
      }
      onSuccess(result);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Submission failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        id="answer"
        label="Your Answer"
        rows={8}
        placeholder="Write your answer here..."
        error={errors.answer?.message}
        {...register('answer', { required: 'Answer is required', minLength: { value: 10, message: 'Answer too short.' } })}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {existingSubmission ? 'Update Submission' : 'Submit Answer'}
        </Button>
      </div>
    </form>
  );
}
