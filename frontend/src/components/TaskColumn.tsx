'use client';

import React from 'react';
import { Task, TaskStatus, STATUS_LABELS } from '@/types';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal, CheckCircle2, Clock, Loader, PauseCircle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.TODO]: <CheckCircle2 size={15} />,
  [TaskStatus.DOING]: <Loader size={15} />,
  [TaskStatus.COMPLETED]: <CheckCircle2 size={15} />,
  [TaskStatus.ON_HOLD]: <PauseCircle size={15} />,
};

const STATUS_ICON_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: '#3B82F6',
  [TaskStatus.DOING]: '#F59E0B',
  [TaskStatus.COMPLETED]: '#10B981',
  [TaskStatus.ON_HOLD]: '#EF4444',
};

export default function TaskColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className="flex flex-col rounded-xl min-w-[280px] max-w-[320px] w-full flex-shrink-0"
      style={{
        backgroundColor: 'var(--column-bg)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-3.5 py-3"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: STATUS_ICON_COLORS[status] }}>
            {STATUS_ICONS[status]}
          </span>
          <h3
            className="text-[13px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {STATUS_LABELS[status]}
          </h3>
          <span
            className="text-[11px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded-md hover:bg-[var(--bg-card-hover)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Plus size={16} />
          </button>
          <button
            className="p-1 rounded-md hover:bg-[var(--bg-card-hover)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Task list */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-1.5 space-y-0 overflow-y-auto max-h-[calc(100vh-220px)] transition-all duration-200 ${
          isOver
            ? 'bg-[var(--brand-primary)]/5 ring-2 ring-inset ring-[var(--brand-primary)]/30 rounded-b-xl'
            : ''
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="py-10 text-center">
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              No tasks yet
            </p>
          </div>
        )}
      </div>

      {/* Add task button at bottom */}
      <button
        onClick={() => onAddTask(status)}
        className="flex items-center gap-2 px-3.5 py-2.5 text-[13px] transition-colors hover:bg-[var(--bg-card-hover)] rounded-b-xl"
        style={{
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <Plus size={15} />
        Add Task
      </button>
    </div>
  );
}
