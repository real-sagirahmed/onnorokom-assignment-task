'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import type { Class } from '@/types';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ name: string; description?: string }>();

  const fetchClasses = async () => {
    setLoading(true);
    const { data } = await api.get<Class[]>('/classes');
    setClasses(data);
    setLoading(false);
  };

  useEffect(() => { fetchClasses(); }, []);

  const onSubmit = async (data: { name: string; description?: string }) => {
    setSubmitting(true);
    try {
      await api.post('/classes', data);
      toast.success('Class created!');
      reset();
      setShowModal(false);
      fetchClasses();
    } catch { toast.error('Failed to create class.'); }
    finally { setSubmitting(false); }
  };

  const deleteClass = async (id: number) => {
    await api.delete(`/classes/${id}`);
    toast.success('Class removed.');
    fetchClasses();
  };

  return (
    <DashboardLayout title="Class Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{classes.length} classes</p>
        <Button onClick={() => setShowModal(true)}>+ Add Class</Button>
      </div>

      <Table
        data={classes}
        loading={loading}
        columns={[
          { key: 'name', header: 'Class Name' },
          { key: 'description', header: 'Description', render: (c) => c.description ?? '—' },
          { key: 'actions', header: 'Actions', render: (c) => (
            <Button size="sm" variant="danger" onClick={() => deleteClass(c.id)}>Remove</Button>
          )},
        ]}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Class">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="name" label="Class Name" placeholder="e.g. Class 10-A" {...register('name', { required: true })} />
          <Textarea id="description" label="Description (optional)" rows={3} {...register('description')} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
