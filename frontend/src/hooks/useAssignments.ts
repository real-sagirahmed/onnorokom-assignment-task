'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Assignment, CreateAssignmentPayload } from '@/types';

export function useAssignments(classId?: number) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const params = classId ? { classId } : {};
      const { data } = await api.get<Assignment[]>('/assignments', { params });
      setAssignments(data);
    } catch {
      toast.error('Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const createAssignment = useCallback(async (payload: CreateAssignmentPayload) => {
    const { data } = await api.post<Assignment>('/assignments', payload);
    setAssignments((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateAssignment = useCallback(async (id: number, payload: Partial<CreateAssignmentPayload>) => {
    const { data } = await api.put<Assignment>(`/assignments/${id}`, payload);
    setAssignments((prev) => prev.map((a) => (a.id === id ? data : a)));
    return data;
  }, []);

  const deleteAssignment = useCallback(async (id: number) => {
    await api.delete(`/assignments/${id}`);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { assignments, loading, fetchAssignments, createAssignment, updateAssignment, deleteAssignment };
}
