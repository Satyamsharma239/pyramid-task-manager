'use client';

import React from 'react';
import { Task, TaskStatus, STATUS_ORDER } from '@/types';
import TaskColumn from './TaskColumn';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

interface BoardViewProps {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
}

export default function BoardView({ tasks, onAddTask, onEditTask, onDeleteTask, onMoveTask }: BoardViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overColumn = over.id as string;

    // Check if dropped over a column
    if (Object.values(TaskStatus).includes(overColumn as TaskStatus)) {
      const targetTasks = getTasksByStatus(overColumn as TaskStatus);
      onMoveTask(taskId, overColumn as TaskStatus, targetTasks.length);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // If dragged over another task, find which column it belongs to
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      const targetTasks = getTasksByStatus(overTask.status);
      const overIndex = targetTasks.findIndex((t) => t.id === over.id);
      onMoveTask(activeTask.id, overTask.status, overIndex >= 0 ? overIndex : targetTasks.length);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {STATUS_ORDER.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
