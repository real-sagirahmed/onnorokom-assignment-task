// ─── Auth ────────────────────────────────────────────────────────────────────
export type Role = 'Admin' | 'Teacher' | 'Student';

export interface LoginResponse {
  token: string;
  role: Role;
  name: string;
  email: string;
  userId: number;
  expiresAt: string;
}

export interface AuthUser {
  token: string;
  role: Role;
  name: string;
  email: string;
  userId: number;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  classId?: number;
  className?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  classId?: number;
}

// ─── Class ────────────────────────────────────────────────────────────────────
export interface Class {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export interface Subject {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Assignment ───────────────────────────────────────────────────────────────
export type AssignmentStatus = 'Draft' | 'Published' | 'Closed';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt?: string;
  teacherId: number;
  teacherName: string;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  submissionsCount: number;
}

export interface CreateAssignmentPayload {
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  status: AssignmentStatus;
  classId: number;
  subjectId: number;
}

// ─── Submission ───────────────────────────────────────────────────────────────
export type SubmissionStatus = 'Submitted' | 'UnderReview' | 'Graded' | 'Late';

export interface Submission {
  id: number;
  answer: string;
  status: SubmissionStatus;
  marksAwarded?: number;
  feedback?: string;
  submittedAt: string;
  updatedAt?: string;
  gradedAt?: string;
  studentId: number;
  studentName: string;
  assignmentId: number;
  assignmentTitle: string;
  maxMarks: number;
}

export interface GradeSubmissionPayload {
  marksAwarded: number;
  feedback?: string;
  status: SubmissionStatus;
}
