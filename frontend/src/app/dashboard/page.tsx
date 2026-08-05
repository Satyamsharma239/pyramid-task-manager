'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task, TaskStatus, TaskPriority, ViewMode, FieldVisibility } from '@/types';
import Sidebar from '@/components/Sidebar';
import BoardView from '@/components/BoardView';
import ListView from '@/components/ListView';
import TaskModal from '@/components/TaskModal';
import FieldsDropdown from '@/components/FieldsDropdown';
import { Search, Filter, Plus, Loader2, X } from 'lucide-react';
import { seedTasksIfEmpty } from '@/lib/seedData';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>(TaskStatus.TODO);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true);
      // Seed sample tasks if this is a fresh account
      await seedTasksIfEmpty();
      const data = await api.getTasks(searchQuery ? { search: searchQuery } : undefined);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (data: Partial<Task>) => {
    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, data);
      } else {
        await api.createTask(data as any);
      }
      await fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus, newOrder: number) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, order: newOrder } : t))
      );
      await api.reorderTask({ taskId, status: newStatus, order: newOrder });
    } catch (error) {
      console.error('Failed to move task:', error);
      await fetchTasks();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin-slow" size={32} style={{ color: 'var(--brand-primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      {/* Main content */}
      <main className="md:ml-[240px] p-4 md:p-6 pt-16 md:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Tasks</h1>
            {/* User avatars */}
            <div className="flex -space-x-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-[var(--bg-primary)]"
                style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}
              >
                {user?.displayName?.charAt(0) || 'G'}
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-[var(--bg-primary)]"
                style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
              >
                +
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center gap-2 animate-slide-down">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      autoFocus
                      className="pl-8 pr-8 py-1.5 rounded-lg text-sm w-48 outline-none"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                    className="p-1.5 rounded-lg"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Fields dropdown */}
            <FieldsDropdown
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              fieldVisibility={fieldVisibility}
              onFieldVisibilityChange={setFieldVisibility}
            />

            {/* Filter button */}
            <button
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Filter size={18} />
            </button>

            {/* Add Task button */}
            <button
              onClick={() => handleAddTask(TaskStatus.TODO)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoadingTasks ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin-slow" size={28} style={{ color: 'var(--brand-primary)' }} />
          </div>
        ) : viewMode === 'board' ? (
          <BoardView
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        ) : (
          <ListView
            tasks={tasks}
            fieldVisibility={fieldVisibility}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
