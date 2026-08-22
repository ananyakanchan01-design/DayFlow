import { PlantInfo, PlantStage } from '@/types/task';

export function calculatePlantStage(completedCount: number, totalTasks: number): PlantInfo {
  let stage: PlantStage = 'Seed';
  let progressPercentage = 0;
  let nextStageInTasks = 3;

  if (completedCount >= 21) {
    stage = 'Tree';
    progressPercentage = 100;
    nextStageInTasks = 0;
  } else if (completedCount >= 11) {
    stage = 'Flower';
    // 11 to 20 (10 steps)
    progressPercentage = Math.min(100, Math.round(((completedCount - 11) / 10) * 100));
    nextStageInTasks = 21 - completedCount;
  } else if (completedCount >= 6) {
    stage = 'Plant';
    // 6 to 10 (5 steps)
    progressPercentage = Math.min(100, Math.round(((completedCount - 6) / 5) * 100));
    nextStageInTasks = 11 - completedCount;
  } else if (completedCount >= 3) {
    stage = 'Sprout';
    // 3 to 5 (3 steps)
    progressPercentage = Math.min(100, Math.round(((completedCount - 3) / 3) * 100));
    nextStageInTasks = 6 - completedCount;
  } else {
    stage = 'Seed';
    // 0 to 2 (3 steps)
    progressPercentage = Math.min(100, Math.round((completedCount / 3) * 100));
    nextStageInTasks = 3 - completedCount;
  }

  return {
    stage,
    progressPercentage,
    streakDays: 7,
    completedCount,
    totalTasks,
    nextStageInTasks,
  };
}
