import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sun, Moon, LayoutDashboard, Activity } from 'lucide-react';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { FilterBar } from './components/FilterBar';
import { AuthForm } from './components/AuthForm';
import { UserHistory } from './components/UserHistory';
import { useTodos } from './hooks/useTodos';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function Navigation() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Task Master
            </h1>
            {user && (
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link
                  to="/activity"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  <Activity size={20} />
                  Activity
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Log out
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </div>
    </div>
  );
}

function Dashboard() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    updateTodoDueDate,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
  } = useTodos();

  return (
    <div className="max-w-3xl mx-auto">
      <TaskInput onAdd={addTodo} />
      <div className="mt-8">
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TaskList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onUpdateDueDate={updateTodoDueDate}
        />
      </div>
    </div>
  );
}

function ActivityPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <UserHistory />
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/signup" element={<AuthForm mode="signup" />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <PrivateRoute>
            <Layout>
              <ActivityPage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}