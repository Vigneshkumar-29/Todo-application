import React from 'react';
import { TaskItem } from './TaskItem';
import { Todo } from '../types/todo';

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdateDueDate: (id: string, dueDate: string) => void;
}

export function TaskList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onUpdateDueDate,
}: TaskListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onUpdateDueDate={onUpdateDueDate}
        />
      ))}
    </div>
  );
}