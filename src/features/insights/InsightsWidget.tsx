import React from 'react';
import { Trophy, CheckCircle2, Clock, Flame } from 'lucide-react';

interface InsightsWidgetProps {
  completionPercentage: number;
  completedCount: number;
  streakDays: number;
}

export function InsightsWidget({
  completionPercentage,
  completedCount,
  streakDays,
}: InsightsWidgetProps) {
  // Weekly completion activity dataset
  const weeklyData = [
    { day: 'Sun', count: 3, height: '40%' },
    { day: 'Mon', count: 6, height: '70%' },
    { day: 'Tue', count: 4, height: '50%' },
    { day: 'Wed', count: 7, height: '85%' },
    { day: 'Thu', count: 5, height: '60%' },
    { day: 'Fri', count: 9, height: '100%' },
    { day: 'Sat', count: 4, height: '45%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 4 PRIMARY EDITORIAL METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* COMPLETION RATE */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            {/* SVG Ring Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-dayflow-cream dark:text-dayflow-surface-muted-dark"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-dayflow-mint transition-all duration-1000 ease-out"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-xs text-dayflow-text dark:text-dayflow-text-dark">
              {completionPercentage}%
            </span>
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Completion Rate
            </h5>
            <p className="text-xs font-semibold text-dayflow-mint dark:text-dayflow-mint-dark mt-0.5">
              +12% from last week
            </p>
          </div>
        </div>

        {/* COMPLETED TASKS */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-dayflow-mint/20 text-dayflow-mint-dark flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-dayflow-text dark:text-dayflow-text-dark">
              {completedCount}
            </div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Tasks Completed
            </h5>
          </div>
        </div>

        {/* DAY STREAK */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-dayflow-coral/20 text-dayflow-coral flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-dayflow-text dark:text-dayflow-text-dark">
              {streakDays} Days
            </div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Streak Active 🔥
            </h5>
          </div>
        </div>

        {/* FOCUS TIME */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-dayflow-blue/20 text-dayflow-blue flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-dayflow-text dark:text-dayflow-text-dark">
              {completedCount === 0 ? '0h 0m' : `${Math.floor((completedCount * 45) / 60)}h ${(completedCount * 45) % 60}m`}
            </div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Focus Time Today
            </h5>
          </div>
        </div>
      </div>

      {/* WEEKLY OVERVIEW BAR CHART */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-serif font-bold text-lg text-dayflow-text dark:text-dayflow-text-dark">
              Weekly Activity
            </h4>
            <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Daily completed tasks breakdown
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark text-dayflow-text dark:text-dayflow-text-dark">
            This Week ▾
          </span>
        </div>

        {/* BARS GRAPH */}
        <div className="h-40 flex items-end justify-between gap-3 sm:gap-6 pt-4 px-2">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark rounded-full h-32 flex items-end p-1 relative overflow-hidden">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-dayflow-mint to-dayflow-coral transition-all duration-700 group-hover:brightness-110"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-xs font-bold text-dayflow-text-muted dark:text-dayflow-text-muted-dark group-hover:text-dayflow-text">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
