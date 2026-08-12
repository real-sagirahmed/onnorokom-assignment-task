'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import type { Assignment, Class, CreateAssignmentPayload, Subject } from '@/types';

interface AssignmentFormProps {
  defaultValues?: Partial<Assignment>;
  onSuccess: (assignment: Assignment) => void;
  onCancel: () => void;
}

export function AssignmentForm({ defaultValues, onSuccess, onCancel }: AssignmentFormProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateAssignmentPayload>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      deadline: defaultValues?.deadline
        ? new Date(defaultValues.deadline).toISOString().slice(0, 16)
        : '',
      maxMarks: defaultValues?.maxMarks ?? 100,
      status: defaultValues?.status ?? 'Draft',
      classId: defaultValues?.classId ?? 0,
      subjectId: defaultValues?.subjectId ?? 0,
    },
  });

  useEffect(() => {
    Promise.all([
      api.get<Class[]>('/classes'),
      api.get<Subject[]>('/subjects'),
    ]).then(([c, s]) => {
      setClasses(c.data);
      setSubjects(s.data);
    }).catch(() => toast.error('Failed to load classes/subjects.'));
  }, []);

  const onSubmit = async (data: CreateAssignmentPayload) => {
    setLoading(true);
    try {
      const payload = { ...data, classId: Number(data.classId), subjectId: Number(data.subjectId) };
      let result: Assignment;
      if (defaultValues?.id) {
        const { data: updated } = await api.put<Assignment>(`/assignments/${defaultValues.id}`, payload);
        result = updated;
      } else {
        const { data: created } = await api.post<Assignment>('/assignments', payload);
        result = created;
      }
      toast.success(defaultValues?.id ? 'Assignment updated!' : 'Assignment created!');
      onSuccess(result);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Something went wrong.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="title"
        label="Title"
        placeholder="e.g. Chapter 3 Exercise"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />
      <Textarea
        id="description"
        label="Description"
        rows={4}
        placeholder="Describe the assignment..."
        error={errors.description?.message}
        {...register('description', { required: 'Description is required' })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="deadline"
          label="Deadline"
          type="datetime-local"
          error={errors.deadline?.message}
          {...register('deadline', { required: 'Deadline is required' })}
        />
        <Input
          id="maxMarks"
          label="Max Marks"
          type="number"
          min={1}
          max={100}
          error={errors.maxMarks?.message}
          {...register('maxMarks', { required: true, min: 1, max: 100, valueAsNumber: true })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="classId"
          label="Class"
          options={classes.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.classId?.message}
          {...register('classId', { required: 'Class is required', validate: v => Number(v) > 0 || 'Class is required' })}
        />
        <Select
          id="subjectId"
          label="Subject"
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          error={errors.subjectId?.message}
          {...register('subjectId', { required: 'Subject is required', validate: v => Number(v) > 0 || 'Subject is required' })}
        />
      </div>
      <Select
        id="status"
        label="Status"
        options={[
          { value: 'Draft', label: 'Draft — save without publishing' },
          { value: 'Published', label: 'Published — visible to students' },
        ]}
        {...register('status')}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  );
}
