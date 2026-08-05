'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, STATUS_ORDER, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, FieldVisibility } from '@/types';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Trash2, Edit3 } from 'lucide-react';

interface ListViewProps {
  tasks: Task[];
  fieldVisibility: FieldVisibility;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function ListView({ tasks, fieldVisibility, onAddTask, onEditTask, onDeleteTask }: ListViewProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<TaskStatus>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleSection = (status: TaskStatus) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-0 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
      {STATUS_ORDER.map((status) => {
        const statusTasks = getTasksByStatus(status);
        const isCollapsed = collapsedSections.has(status);

        return (
          <div key={status}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(status)}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              {STATUS_LABELS[status]}
              <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>({statusTasks.length})</span>
            </button>

            {!isCollapsed && (
              <>
                {/* Table header */}
                <div
                  className="grid items-center px-4 py-2 text-xs font-medium uppercase tracking-wider"
                  style={{
                    gridTemplateColumns: `1fr ${fieldVisibility.priority ? '100px' : ''} ${fieldVisibility.members ? '100px' : ''} ${fieldVisibility.dueDate ? '130px' : ''} 60px`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <span>Task</span>
                  {fieldVisibility.priority && <span>Priority</span>}
                  {fieldVisibility.members && <span>Members</span>}
                  {fieldVisibility.dueDate && <span>Due Date</span>}
                  <span>Actions</span>
                </div>

                {/* Task rows */}
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="grid items-center px-4 py-3 text-sm transition-colors cursor-pointer"
                    style={{
                      gridTemplateColumns: `1fr ${fieldVisibility.priority ? '100px' : ''} ${fieldVisibility.members ? '100px' : ''} ${fieldVisibility.dueDate ? '130px' : ''} 60px`,
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => onEditTask(task)}
                  >
                    <span className="font-medium truncate pr-2">{task.title}</span>

                    {fieldVisibility.priority && (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                        />
                        <span className="text-xs" style={{ color: PRIORITY_COLORS[task.priority] }}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </div>
                    )}

                    {fieldVisibility.members && (
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                          style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
                        >
                          {task.assignee?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      </div>
                    )}

                    {fieldVisibility.dueDate && (
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(task.dueDate)}
                      </span>
                    )}

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === task.id ? null : task.id);
                        }}
                        className="p-1 rounded hover:opacity-80"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === task.id && (
                        <div
                          className="absolute right-0 top-7 rounded-lg shadow-xl z-20 py-1 min-w-[120px] animate-scale-in"
                          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onEditTask(task);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:opacity-80"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onDeleteTask(task.id);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm"
                            style={{ color: '#EF4444' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add task button */}
                <button
                  onClick={() => onAddTask(status)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}
                >
                  <Plus size={16} /> Add Task
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
