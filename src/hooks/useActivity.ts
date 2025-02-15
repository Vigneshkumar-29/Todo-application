import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  taskName: string;
}

export function useActivity(days: number = 30) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logsRef = collection(db, `users/${user.uid}/activity`);
    const q = query(
      logsRef,
      where('timestamp', '>=', startDate.toISOString()),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActivityLog[];
        setActivityLogs(logs);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching activity logs:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, days]);

  return { activityLogs, loading };
}