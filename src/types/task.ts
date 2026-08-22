export type Priority = 'High' | 'Medium' | 'Low';

export type TaskCategory = 
  | 'Personal Project' 
  | 'College' 
  | 'Coding' 
  | 'Work' 
  | 'Personal Growth'
  | 'Fitness'
  | 'General';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: Priority;
  completed: boolean;
  dueDate: string; // e.g. "Today", "Tomorrow", "2026-08-23"
  dueTime?: string; // e.g. "5:00 PM"
  note?: string;
  createdAt: string;
  completedAt?: string;
  userId?: string;
}

export type FilterType = 'All' | 'Today' | 'Pending' | 'Important' | 'Completed';

export type ViewMode = 'story' | 'workspace';

export type PlantStage = 'Seed' | 'Sprout' | 'Plant' | 'Flower' | 'Tree';

export interface PlantInfo {
  stage: PlantStage;
  progressPercentage: number; // 0 to 100 towards next stage
  streakDays: number;
  completedCount: number;
  totalTasks: number;
  nextStageInTasks: number;
}

export interface DayTimelineItem {
  id: string;
  time: string;
  period: string;
  title: string;
  category: TaskCategory;
  iconName: string;
  completed?: boolean;
}
