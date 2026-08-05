'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Task, LABEL_OPTIONS } from '@/types';
import { MoreHorizontal, Calendar, Trash2, Edit3 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = [
  '#7C5CFC', '#F59E0B', '#EF4444', '#10B981', '#3B82F6',
  '#EC4899', '#8B5CF6', '#06B6D4', '#14B8A6', '#F97316',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const assigneeName = task.assignee || 'Admin';
  const assigneeInitial = assigneeName.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(assigneeName);

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  const getLabelColor = (label: string) => {
    const found = LABEL_OPTIONS.find((l) => l.value === label);
    return found?.color || '#6366F1';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 mb-2 ${
        isDragging ? 'scale-[1.02] opacity-80' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div
        className="rounded-[6px] p-0"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '0.5px solid var(--border-color)',
        }}
      >
        <div className="p-3.5">
          {/* Title + Menu */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h4
              className="text-[13px] font-medium leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {task.title}
            </h4>
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowMenu(!showMenu);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1 rounded-md hover:bg-[var(--bg-card-hover)] flex-shrink-0 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <MoreHorizontal size={15} />
              </button>
              {showMenu && (
                <div
                  className="absolute right-0 top-8 rounded-lg shadow-2xl z-30 py-1 min-w-[130px] animate-scale-in"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(task.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] transition-colors"
                    style={{ color: '#EF4444' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assignee + Due Date row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: avatarColor, color: '#FFFFFF' }}
              >
                {assigneeInitial}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {assigneeName}
              </span>
            </div>
            {task.dueDate && (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                }}
              >
                <Calendar size={11} />
                {formatDueDate(task.dueDate)}
              </div>
            )}
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: `${getLabelColor(label)}20`,
                    color: getLabelColor(label),
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
