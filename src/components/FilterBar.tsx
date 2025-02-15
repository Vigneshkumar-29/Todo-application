import React from 'react';
import { Search } from 'lucide-react';
import { FilterType } from '../types/todo';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="relative flex-1 w-full">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-gray-500"
        />
      </div>
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors font-medium ${
              filter === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}