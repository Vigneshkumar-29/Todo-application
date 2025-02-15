import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Todo, FilterType } from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const todosRef = collection(db, `users/${user.uid}/todos`);
    const q = query(todosRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTodos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      setTodos(newTodos);
    });

    return unsubscribe;
  }, [user]);

  const addTodo = async (text: string, dueDate?: string) => {
    if (!user) return;

    const todo = {
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
    };

    const docRef = await addDoc(collection(db, `users/${user.uid}/todos`), todo);
    await addDoc(collection(db, `users/${user.uid}/activity`), {
      action: 'created',
      taskName: text,
      timestamp: new Date().toISOString()
    });
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const todoRef = doc(db, `users/${user.uid}/todos`, id);
    await updateDoc(todoRef, {
      completed: !todo.completed
    });

    await addDoc(collection(db, `users/${user.uid}/activity`), {
      action: todo.completed ? 'uncompleted' : 'completed',
      taskName: todo.text,
      timestamp: new Date().toISOString()
    });
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const todoRef = doc(db, `users/${user.uid}/todos`, id);
    await deleteDoc(todoRef);

    await addDoc(collection(db, `users/${user.uid}/activity`), {
      action: 'deleted',
      taskName: todo.text,
      timestamp: new Date().toISOString()
    });
  };

  const editTodo = async (id: string, text: string) => {
    if (!user) return;

    const todoRef = doc(db, `users/${user.uid}/todos`, id);
    await updateDoc(todoRef, { text });

    await addDoc(collection(db, `users/${user.uid}/activity`), {
      action: 'edited',
      taskName: text,
      timestamp: new Date().toISOString()
    });
  };

  const updateTodoDueDate = async (id: string, dueDate: string) => {
    if (!user) return;

    const todoRef = doc(db, `users/${user.uid}/todos`, id);
    await updateDoc(todoRef, { dueDate });
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);

    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return {
    todos: filteredTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    updateTodoDueDate,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
  };
}