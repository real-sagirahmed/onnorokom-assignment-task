'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import type { CreateUserPayload, User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserPayload>();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<User[]>('/users');
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onSubmit = async (data: CreateUserPayload) => {
    setSubmitting(true);
    try {
      await api.post('/users', data);
      toast.success('User created!');
      reset();
      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error creating user.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (user: User) => {
    await api.put(`/users/${user.id}`, { isActive: !user.isActive });
    toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}.`);
    fetchUsers();
  };

  return (
    <DashboardLayout title="User Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{users.length} users total</p>
        <Button onClick={() => setShowModal(true)}>+ Add User</Button>
      </div>

      <Table
        data={users}
        loading={loading}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'role', header: 'Role', render: (u) => <Badge status={u.role}>{u.role}</Badge> },
          { key: 'className', header: 'Class', render: (u) => u.className ?? '—' },
          { key: 'isActive', header: 'Status', render: (u) => (
            <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
          )},
          { key: 'actions', header: 'Actions', render: (u) => (
            <Button size="sm" variant={u.isActive ? 'danger' : 'secondary'} onClick={() => toggleActive(u)}>
              {u.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          )},
        ]}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="name" label="Full Name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input id="email" label="Email" type="email" error={errors.email?.message}
            {...register('email', { required: 'Email is required' })} />
          <Input id="password" label="Password" type="password" error={errors.password?.message}
            placeholder="Min 8 chars, uppercase + number"
            {...register('password', { required: 'Password is required', minLength: 8 })} />
          <Select id="role" label="Role"
            options={[{ value: 'Admin', label: 'Admin' }, { value: 'Teacher', label: 'Teacher' }, { value: 'Student', label: 'Student' }]}
            error={errors.role?.message}
            {...register('role', { required: 'Role is required' })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create User</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
