export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum TaskPriority {
  NO_PRIORITY = 'NO_PRIORITY',
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  labels?: string[];
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  displayName: string;
  email?: string;
  authType: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export type ViewMode = 'board' | 'list';

export interface FieldVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.DOING]: 'Doing',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.ON_HOLD]: 'On Hold',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.NO_PRIORITY]: '#9CA3AF',
  [TaskPriority.URGENT]: '#EF4444',
  [TaskPriority.HIGH]: '#F97316',
  [TaskPriority.MEDIUM]: '#F59E0B',
  [TaskPriority.LOW]: '#22C55E',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.NO_PRIORITY]: 'No Priority',
  [TaskPriority.URGENT]: 'Urgent',
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.LOW]: 'Low',
};

export const STATUS_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.DOING,
  TaskStatus.COMPLETED,
  TaskStatus.ON_HOLD,
];

export const LABEL_OPTIONS = [
  { value: 'Deployment', color: '#3B82F6' },
  { value: 'Design', color: '#8B5CF6' },
  { value: 'Testing', color: '#10B981' },
  { value: 'Security', color: '#EF4444' },
  { value: 'Backend', color: '#F59E0B' },
  { value: 'Frontend', color: '#EC4899' },
  { value: 'DevOps', color: '#06B6D4' },
  { value: 'Review', color: '#6366F1' },
  { value: 'Audit', color: '#14B8A6' },
  { value: 'Research', color: '#A855F7' },
];
