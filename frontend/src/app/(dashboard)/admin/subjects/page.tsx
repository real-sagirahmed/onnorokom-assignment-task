'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import type { Class, Subject, User } from '@/types';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const createForm = useForm<{ name: string; code?: string; description?: string }>();
  const assignForm = useForm<{ teacherId: number; subjectId: number; classId: number }>();

  const fetchAll = async () => {
    setLoading(true);
    const [s, u, c] = await Promise.all([
      api.get<Subject[]>('/subjects'),
      api.get<User[]>('/users'),
      api.get<Class[]>('/classes'),
    ]);
    setSubjects(s.data);
    setTeachers(u.data.filter((u) => u.role === 'Teacher' && u.isActive));
    setClasses(c.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const onCreate = async (data: { name: string; code?: string; description?: string }) => {
    setSubmitting(true);
    try {
      await api.post('/subjects', data);
      toast.success('Subject created!');
      createForm.reset();
      setShowCreate(false);
      fetchAll();
    } catch { toast.error('Failed.'); }
    finally { setSubmitting(false); }
  };

  const onAssign = async (data: { teacherId: number; subjectId: number; classId: number }) => {
    setSubmitting(true);
    try {
      await api.post('/subjects/assign-teacher', {
        teacherId: Number(data.teacherId),
        subjectId: Number(data.subjectId),
        classId: Number(data.classId),
      });
      toast.success('Teacher assigned!');
      assignForm.reset();
      setShowAssign(false);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Assignment failed.');
    } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Subject Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{subjects.length} subjects</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowAssign(true)}>Assign Teacher</Button>
          <Button onClick={() => setShowCreate(true)}>+ Add Subject</Button>
        </div>
      </div>

      <Table
        data={subjects}
        loading={loading}
        columns={[
          { key: 'name', header: 'Subject' },
          { key: 'code', header: 'Code', render: (s) => s.code ?? '—' },
          { key: 'description', header: 'Description', render: (s) => s.description ?? '—' },
        ]}
      />

      {/* Create subject modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Subject">
        <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
          <Input id="subName" label="Subject Name" placeholder="e.g. Mathematics" {...createForm.register('name', { required: true })} />
          <Input id="code" label="Code (optional)" placeholder="e.g. MATH101" {...createForm.register('code')} />
          <Textarea id="desc" label="Description" rows={2} {...createForm.register('description')} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Assign teacher modal */}
      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Teacher to Subject">
        <form onSubmit={assignForm.handleSubmit(onAssign)} className="space-y-4">
          <Select id="teacher" label="Teacher"
            options={teachers.map((t) => ({ value: t.id, label: t.name }))}
            {...assignForm.register('teacherId', { required: true })} />
          <Select id="subject" label="Subject"
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            {...assignForm.register('subjectId', { required: true })} />
          <Select id="class" label="Class"
            options={classes.map((c) => ({ value: c.id, label: c.name }))}
            {...assignForm.register('classId', { required: true })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowAssign(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Assign</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
