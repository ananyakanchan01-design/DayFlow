import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProductivityPlant3D } from '@/scenes/ProductivityPlant3D';
import { TaskFilters } from '@/features/tasks/TaskFilters';
import { TaskItem } from '@/features/tasks/TaskItem';
import { PlannerWidget } from '@/features/planner/PlannerWidget';
import { InsightsWidget } from '@/features/insights/InsightsWidget';
import { FocusTab } from '@/features/focus/FocusTab';
import { GoalsTab } from '@/features/goals/GoalsTab';
import { NotesTab } from '@/features/notes/NotesTab';
import { SettingsTab } from '@/features/settings/SettingsTab';
import { Task, FilterType, PlantInfo } from '@/types/task';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Flag, 
  Plus, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WorkspaceViewProps {
  tasks: Task[];
  filteredTasks: Task[];
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenAddTask: () => void;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  highPriorityCount: number;
  pendingCount: number;
  streakDays: number;
  plantInfo: PlantInfo;
}

export function WorkspaceView({
  tasks,
  filteredTasks,
  activeFilter,
  onSelectFilter,
  onToggleTask,
  onDeleteTask,
  onOpenAddTask,
  completedCount,
  totalCount,
  completionPercentage,
  highPriorityCount,
  pendingCount,
  streakDays,
  plantInfo,
}: WorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState('today');

  const upcomingTasks = tasks.filter((t) => t.dueDate === 'Tomorrow' || t.dueDate === 'Friday');

  return (
    <div className="w-full flex min-h-[calc(100vh-4rem)] bg-dayflow-bg dark:bg-dayflow-bg-dark transition-colors">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-x-hidden">
        
        {/* VIEW 1: TODAY (MAIN DASHBOARD) */}
        {activeTab === 'today' && (
          <div className="space-y-8">
            {/* GREETING & HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dayflow-text dark:text-dayflow-text-dark">
                  Good morning! 👋
                </h1>
                <p className="text-sm font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark mt-1">
                  You have {pendingCount} tasks for today.
                </p>
              </div>

              <button
                onClick={onOpenAddTask}
                className="px-5 py-2.5 rounded-full bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text text-xs font-bold shadow-clay hover:scale-105 transition-transform flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Task</span>
              </button>
            </div>

            {/* 4 QUICK STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* TOTAL TASKS */}
              <div className="p-4 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-dayflow-coral/20 text-dayflow-coral flex items-center justify-center font-bold">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-dayflow-text dark:text-dayflow-text-dark">
                    {totalCount}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                    Total Tasks
                  </div>
                </div>
              </div>

              {/* PENDING */}
              <div className="p-4 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-dayflow-cream dark:bg-dayflow-surface-muted-dark text-amber-500 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-dayflow-text dark:text-dayflow-text-dark">
                    {pendingCount}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                    Pending
                  </div>
                </div>
              </div>

              {/* COMPLETED */}
              <div className="p-4 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-dayflow-mint/20 text-dayflow-mint-dark flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-dayflow-text dark:text-dayflow-text-dark">
                    {completedCount}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                    Completed
                  </div>
                </div>
              </div>

              {/* HIGH PRIORITY */}
              <div className="p-4 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-dayflow-blue/20 text-dayflow-blue flex items-center justify-center font-bold">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-dayflow-text dark:text-dayflow-text-dark">
                    {highPriorityCount}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                    High Priority
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* TODAY'S TASKS WIDGET */}
              <div className="lg:col-span-6 p-6 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-xl text-dayflow-text dark:text-dayflow-text-dark">
                    Today&apos;s Tasks
                  </h3>
                  <button
                    onClick={onOpenAddTask}
                    className="px-3 py-1.5 rounded-full bg-dayflow-coral/20 text-dayflow-coral hover:bg-dayflow-coral hover:text-dayflow-text text-xs font-bold transition-all"
                  >
                    + Add Task
                  </button>
                </div>

                <TaskFilters
                  activeFilter={activeFilter}
                  onSelectFilter={onSelectFilter}
                  counts={{
                    all: totalCount,
                    today: tasks.filter((t) => t.dueDate === 'Today').length,
                    pending: pendingCount,
                    important: highPriorityCount,
                    completed: completedCount,
                  }}
                />

                <div className="space-y-3">
                  {filteredTasks.slice(0, 5).map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </div>

              {/* PROGRESS CHART WIDGET */}
              <div className="lg:col-span-3 p-6 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-lg text-dayflow-text dark:text-dayflow-text-dark">
                    Your Progress
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark text-dayflow-text dark:text-dayflow-text-dark">
                    This Week ▾
                  </span>
                </div>

                <div className="flex flex-col items-center py-2">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-dayflow-cream dark:text-dayflow-surface-muted-dark"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-dayflow-mint transition-all duration-700"
                        strokeDasharray={`${completionPercentage}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="font-extrabold text-base text-dayflow-text dark:text-dayflow-text-dark">
                        {completionPercentage}%
                      </span>
                      <div className="text-[8px] uppercase tracking-wider text-dayflow-text-muted">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
                      24 Tasks Completed
                    </div>
                    <div className="text-[11px] text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                      4h 32m Focus Time
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-dayflow-border dark:border-dayflow-border-dark">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-2">
                    Weekly Overview
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-16 px-1">
                    {[40, 70, 50, 85, 60, 100, 45].map((h, i) => (
                      <div key={i} className="flex-1 bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark rounded-full h-full flex items-end p-0.5">
                        <div
                          className="w-full rounded-full bg-dayflow-mint"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FOCUS PLANT WIDGET */}
              <div className="lg:col-span-3 p-6 rounded-4xl bg-gradient-to-br from-white via-dayflow-bg to-dayflow-mint/20 dark:from-dayflow-surface-dark dark:to-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-lg text-dayflow-text dark:text-dayflow-text-dark">
                    Focus Plant ℹ️
                  </h4>
                </div>

                <ProductivityPlant3D
                  stage={plantInfo.stage}
                  completedCount={completedCount}
                  progressPercentage={plantInfo.progressPercentage}
                  streakDays={streakDays}
                />
              </div>
            </div>

            {/* UPCOMING & BANNER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6 p-6 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-dayflow-blue" />
                      <h4 className="font-serif font-bold text-base text-dayflow-text dark:text-dayflow-text-dark">
                        Upcoming
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {upcomingTasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark/60 border border-dayflow-border/50 dark:border-dayflow-border-dark/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border-2 border-dayflow-text-muted/40" />
                          <span className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
                            {t.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-dayflow-blue/20 text-dayflow-blue">
                            {t.category}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                          {t.dueDate}, {t.dueTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('planner')}
                  className="text-xs font-bold text-dayflow-coral hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>View Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="lg:col-span-6 p-8 rounded-4xl bg-gradient-to-r from-dayflow-cream via-white to-dayflow-mint/30 dark:from-[#25323A] dark:to-[#182127] border border-dayflow-border dark:border-dayflow-border-dark shadow-soft flex items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3 max-w-md z-10">
                  <Sparkles className="w-5 h-5 text-dayflow-coral" />
                  <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark leading-snug">
                    &ldquo;A productive day starts with a clear mind and a focused plan.&rdquo;
                  </h3>
                  <p className="text-xs font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                    Take it one task at a time.
                  </p>
                </div>
                <div className="text-6xl shrink-0 opacity-80 select-none">
                  🪴
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PLANNER */}
        {activeTab === 'planner' && (
          <PlannerWidget
            tasks={tasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onOpenAddTask={onOpenAddTask}
          />
        )}

        {/* VIEW 3: TASKS */}
        {activeTab === 'tasks' && (
          <div className="p-6 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
                  All Workspace Tasks
                </h2>
                <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                  Complete task list manager
                </p>
              </div>
              <button
                onClick={onOpenAddTask}
                className="px-4 py-2 rounded-full bg-dayflow-coral text-dayflow-text text-xs font-bold shadow-clay hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Task</span>
              </button>
            </div>

            <TaskFilters
              activeFilter={activeFilter}
              onSelectFilter={onSelectFilter}
              counts={{
                all: totalCount,
                today: tasks.filter((t) => t.dueDate === 'Today').length,
                pending: pendingCount,
                important: highPriorityCount,
                completed: completedCount,
              }}
            />

            <div className="space-y-3">
              {filteredTasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: FOCUS */}
        {activeTab === 'focus' && <FocusTab />}

        {/* VIEW 5: INSIGHTS */}
        {activeTab === 'insights' && (
          <InsightsWidget
            completionPercentage={completionPercentage}
            completedCount={completedCount}
            streakDays={streakDays}
          />
        )}

        {/* VIEW 6: GOALS */}
        {activeTab === 'goals' && <GoalsTab />}

        {/* VIEW 7: NOTES */}
        {activeTab === 'notes' && <NotesTab />}

        {/* VIEW 8: SETTINGS */}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}
