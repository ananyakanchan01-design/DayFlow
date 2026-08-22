import { Task } from '@/types/task';

/**
 * Calculates real-time consecutive productivity streak days based on task completion dates.
 */
export function calculateStreakDays(tasks: Task[]): number {
  const completedTasks = tasks.filter((t) => t.completed);
  if (completedTasks.length === 0) return 0;

  const uniqueDates = new Set<string>();
  completedTasks.forEach((t) => {
    const timestamp = t.completedAt || t.createdAt;
    if (timestamp) {
      try {
        const dateStr = new Date(timestamp).toISOString().split('T')[0];
        uniqueDates.add(dateStr);
      } catch {
        // ignore malformed dates
      }
    }
  });

  if (uniqueDates.size === 0) return 0;

  const today = new Date();
  const getFormattedDate = (d: Date) => d.toISOString().split('T')[0];

  let streak = 0;
  const cur = new Date(today);

  // Check if today has completed tasks
  const todayStr = getFormattedDate(cur);
  if (uniqueDates.has(todayStr)) {
    streak++;
    cur.setDate(cur.getDate() - 1);
    while (uniqueDates.has(getFormattedDate(cur))) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    }
  } else {
    // Check if yesterday has completed tasks to keep active streak
    cur.setDate(cur.getDate() - 1);
    const yesterdayStr = getFormattedDate(cur);
    if (uniqueDates.has(yesterdayStr)) {
      streak++;
      cur.setDate(cur.getDate() - 1);
      while (uniqueDates.has(getFormattedDate(cur))) {
        streak++;
        cur.setDate(cur.getDate() - 1);
      }
    }
  }

  return streak;
}
