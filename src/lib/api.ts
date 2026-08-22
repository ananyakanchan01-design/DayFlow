import { Task } from '@/types/task';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface BackendStatus {
  status: string;
  activeDriver: 'neon' | 'mongodb' | 'local';
  timestamp: string;
}

// Authentication API calls
export async function signupUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to sign up account');
  }
  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid email or password');
  }
  return data;
}

export async function fetchCurrentUser(token: string): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch session user:', err);
    return null;
  }
}

export async function fetchHealth(): Promise<BackendStatus | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend health check failed, using fallback mode:', err);
    return null;
  }
}

export async function fetchTasksFromBackend(userId?: string): Promise<Task[] | null> {
  try {
    const url = userId ? `/api/tasks?userId=${encodeURIComponent(userId)}` : '/api/tasks';
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch tasks from backend:', err);
    return null;
  }
}

export async function createTaskInBackend(
  taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>
): Promise<Task | null> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to create task on backend:', err);
    return null;
  }
}

export async function updateTaskInBackend(
  id: string,
  updatedFields: Partial<Task>
): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to update task on backend:', err);
    return false;
  }
}

export async function toggleTaskInBackend(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to toggle task on backend:', err);
    return false;
  }
}

export async function deleteTaskInBackend(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to delete task from backend:', err);
    return false;
  }
}
