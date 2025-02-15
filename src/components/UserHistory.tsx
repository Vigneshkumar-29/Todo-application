import React, { useState } from 'react';
import { Clock, CheckCircle2, Edit2, Trash2, Plus, XCircle, Loader2 } from 'lucide-react';
import { useActivity, ActivityLog } from '../hooks/useActivity';

const getActionIcon = (action: string) => {
  switch (action) {
    case 'completed':
      return <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />;
    case 'created':
      return <Plus className="text-blue-600 dark:text-blue-400" size={20} />;
    case 'edited':
      return <Edit2 className="text-amber-600 dark:text-amber-400" size={20} />;
    case 'deleted':
      return <Trash2 className="text-red-600 dark:text-red-400" size={20} />;
    case 'uncompleted':
      return <XCircle className="text-gray-600 dark:text-gray-400" size={20} />;
    default:
      return <Clock className="text-blue-600 dark:text-blue-400" size={20} />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'completed':
      return 'bg-emerald-100 dark:bg-emerald-900/20';
    case 'created':
      return 'bg-blue-100 dark:bg-blue-900/20';
    case 'edited':
      return 'bg-amber-100 dark:bg-amber-900/20';
    case 'deleted':
      return 'bg-red-100 dark:bg-red-900/20';
    case 'uncompleted':
      return 'bg-gray-100 dark:bg-gray-900/20';
    default:
      return 'bg-blue-100 dark:bg-blue-900/20';
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case 'completed':
      return 'Completed';
    case 'created':
      return 'Added';
    case 'edited':
      return 'Modified';
    case 'deleted':
      return 'Removed';
    case 'uncompleted':
      return 'Reopened';
    default:
      return action;
  }
};

export function UserHistory() {
  const [timeRange, setTimeRange] = useState(30); // Default to 30 days
  const { activityLogs, loading } = useActivity(timeRange);

  const groupedLogs = activityLogs.reduce((groups, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, ActivityLog[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track your task management journey
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Object.entries(groupedLogs).map(([date, logs]) => (
          <div key={date} className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 sticky top-0 bg-white dark:bg-gray-800 py-2">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <div className="mt-3 space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {getActionLabel(log.action)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {log.taskName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {activityLogs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Clock className="text-gray-500 dark:text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activity yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start managing your tasks to see your activity history
            </p>
          </div>
        )}
      </div>
    </div>
  );
}