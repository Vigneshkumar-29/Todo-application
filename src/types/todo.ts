export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  category?: string;
}

export type FilterType = 'all' | 'active' | 'completed';