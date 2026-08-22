import { useState, useEffect, useMemo } from 'react';
import { Task, FilterType } from '@/types/task';
import { triggerTaskConfetti } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { calculateStreakDays } from '@/lib/streak';
import {
  fetchTasksFromBackend,
  createTaskInBackend,
  updateTaskInBackend,
  toggleTaskInBackend,
  deleteTaskInBackend,
  fetchHealth,
  BackendStatus,
} from '@/lib/api';

const STORAGE_KEY_PREFIX = 'dayflow.tasks.v2.';

const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete React Website',
    category: 'Personal Project',
    priority: 'High',
    completed: true,
    dueDate: 'Today',
    dueTime: '5:00 PM',
    note: 'Build cinematic 3D story view and workspace dashboard',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Study DBMS',
    category: 'College',
    priority: 'Medium',
    completed: true,
    dueDate: 'Today',
    dueTime: '7:00 PM',
    note: 'Revise ACID properties and B+ trees',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Solve 3 LeetCode Problems',
    category: 'Coding',
    priority: 'High',
    completed: false,
    dueDate: 'Today',
    dueTime: '9:00 PM',
    note: 'Focus on Dynamic Programming & Graphs',
    createdAt: new Date().toISOString(),
  },
];

export function useTasks() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const isGuest = userId === 'user_1' || userId === 'guest';

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (!isGuest) {
      return [];
    }
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved tasks', e);
    }
    return isGuest ? INITIAL_DEMO_TASKS : [];
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  // Sync tasks when user changes or server responds
  useEffect(() => {
    let isMounted = true;

    async function initBackendData() {
      const status = await fetchHealth();
      if (isMounted && status) {
        setBackendStatus(status);
      }

      const remoteTasks = await fetchTasksFromBackend(userId);
      if (isMounted) {
        if (remoteTasks !== null) {
          setTasks(remoteTasks);
        } else if (!isGuest) {
          setTasks([]);
        }
      }
    }

    initBackendData();

    return () => {
      isMounted = false;
    };
  }, [userId, isGuest]);

  // Local Storage Caching Fallback
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks, userId]);

  const addTask = async (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const tempId = Date.now().toString();
    const task: Task = {
      ...newTaskData,
      id: tempId,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [task, ...prev]);

    const created = await createTaskInBackend({ ...newTaskData, userId } as any);
    if (created && created.id !== tempId) {
      setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }
  };

  const toggleTask = async (id: string) => {
    let targetNewState = false;
    const nowIso = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          targetNewState = !task.completed;
          if (targetNewState) {
            triggerTaskConfetti();
          }
          return {
            ...task,
            completed: targetNewState,
            completedAt: targetNewState ? nowIso : undefined,
          };
        }
        return task;
      })
    );

    await toggleTaskInBackend(id);
  };

  const editTask = async (id: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );

    await updateTaskInBackend(id, updatedFields);
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTaskInBackend(id);
  };

  // Filtered tasks calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.note && task.note.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilter === 'Today') {
        return task.dueDate === 'Today';
      }
      if (activeFilter === 'Pending') {
        return !task.completed;
      }
      if (activeFilter === 'Important') {
        return task.priority === 'High';
      }
      if (activeFilter === 'Completed') {
        return task.completed;
      }
      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  // Derived statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && !t.completed).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Real-time calculated streak days
  const streakDays = useMemo(() => calculateStreakDays(tasks), [tasks]);

  return {
    tasks,
    filteredTasks,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    totalCount,
    completedCount,
    pendingCount,
    highPriorityCount,
    completionPercentage,
    streakDays,
    backendStatus,
  };
}
