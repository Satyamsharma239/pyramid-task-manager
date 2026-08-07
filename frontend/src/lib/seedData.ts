import { api } from './api';

const SEED_TASKS = [
  {
    title: 'Write API Documentation',
    status: 'TODO',
    priority: 'HIGH',
    assignee: 'Admin',
    dueDate: '2026-07-29',
    labels: ['Deployment', 'Backend'],
  },
  {
    title: 'Implement Search Function',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: 'Admin',
    dueDate: '2026-07-29',
    labels: ['Deployment', 'Backend'],
  },
  {
    title: 'Deploy to Production',
    status: 'TODO',
    priority: 'HIGH',
    assignee: 'Admin',
    dueDate: '2026-07-29',
    labels: ['Deployment', 'Backend'],
  },
  {
    title: 'Code Review Completed',
    status: 'DOING',
    priority: 'MEDIUM',
    assignee: 'Admin',
    dueDate: '2026-07-29',
    labels: ['Deployment', 'Backend'],
  },
  {
    title: 'Design Mockups Finalized',
    status: 'DOING',
    priority: 'LOW',
    assignee: 'Admin',
    dueDate: '2026-07-29',
    labels: ['Deployment', 'Backend'],
  },
  {
    title: 'Feature Testing Passed',
    status: 'COMPLETED',
    priority: 'HIGH',
    assignee: 'QA Team',
    dueDate: '2026-07-30',
    labels: ['Testing', 'Review'],
  },
  {
    title: 'UI Design Updated',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    assignee: 'Designer',
    dueDate: '2026-07-31',
    labels: ['Design', 'Frontend'],
  },
  {
    title: 'Security Audit Scheduled',
    status: 'ON_HOLD',
    priority: 'HIGH',
    assignee: 'Security',
    dueDate: '2026-08-01',
    labels: ['Audit', 'Security'],
  },
  {
    title: 'Design Homepage',
    status: 'TODO',
    priority: 'HIGH',
    assignee: 'Admin',
    dueDate: '2026-09-12',
    labels: ['Design', 'Frontend'],
  },
  {
    title: 'Develop Login Feature',
    status: 'DOING',
    priority: 'LOW',
    assignee: 'CN',
    dueDate: '2026-09-15',
    labels: ['Backend', 'Frontend'],
  },
  {
    title: 'Test Payment Gateway',
    status: 'ON_HOLD',
    priority: 'MEDIUM',
    assignee: 'Admin',
    dueDate: '2026-09-18',
    labels: ['Testing', 'Backend'],
  },
];

export async function seedTasksIfEmpty(): Promise<boolean> {
  try {
    const existingTasks = await api.getTasks();
    if (existingTasks.length > 0) {
      return false; // Already has tasks
    }

    // Create all seed tasks
    for (const task of SEED_TASKS) {
      await api.createTask(task);
    }
    return true; // Seeded successfully
  } catch (error) {
    console.error('Failed to seed tasks:', error);
    return false;
  }
}
