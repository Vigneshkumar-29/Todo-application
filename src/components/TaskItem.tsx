import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/todo';
import { Check, X, Edit2, Calendar, Trash } from 'lucide-react';

interface TaskItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdateDueDate: (id: string, dueDate: string) => void;
}

export function TaskItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onUpdateDueDate,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  const formatDueDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-400 dark:border-gray-600'
        }`}
      >
        {todo.completed && <Check size={14} className="text-white" />}
      </button>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <span
          className={`flex-1 font-medium ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'
          }`}
        >
          {todo.text}
        </span>
      )}

      {todo.dueDate && (
        <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
          <Calendar size={14} />
          {formatDueDate(todo.dueDate)}
        </span>
      )}

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-600 hover:text-blue-500 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-gray-600 hover:text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}