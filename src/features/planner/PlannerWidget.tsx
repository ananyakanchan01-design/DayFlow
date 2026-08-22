import React, { useState } from 'react';
import { Task } from '@/types/task';
import { TaskItem } from '../tasks/TaskItem';
import { Calendar, Plus } from 'lucide-react';

interface PlannerWidgetProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenAddTask: () => void;
}

export function PlannerWidget({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenAddTask,
}: PlannerWidgetProps) {
  const [activeTab, setActiveTab] = useState<'Today' | 'Tomorrow' | 'This Week'>('Today');

  const todayTasks = tasks.filter((t) => t.dueDate === 'Today');
  const tomorrowTasks = tasks.filter((t) => t.dueDate === 'Tomorrow');
  const weekTasks = tasks.filter((t) => t.dueDate !== 'Today' && t.dueDate !== 'Tomorrow');

  const getDisplayedTasks = () => {
    switch (activeTab) {
      case 'Tomorrow':
        return tomorrowTasks;
      case 'This Week':
        return weekTasks;
      case 'Today':
      default:
        return todayTasks;
    }
  };

  const displayed = getDisplayedTasks();

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-dayflow-blue/20 text-dayflow-blue flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-dayflow-text dark:text-dayflow-text-dark">
              Upcoming Schedule
            </h3>
            <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Organize your days ahead
            </p>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark">
          {(['Today', 'Tomorrow', 'This Week'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-dayflow-surface-dark text-dayflow-text dark:text-dayflow-text-dark shadow-clay-sm'
                  : 'text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:text-dayflow-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-3">
        {displayed.length > 0 ? (
          displayed.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          <div className="py-12 text-center space-y-2 border-2 border-dashed border-dayflow-border dark:border-dayflow-border-dark rounded-3xl">
            <span className="text-3xl">🍃</span>
            <h4 className="font-serif text-base font-bold text-dayflow-text dark:text-dayflow-text-dark">
              Nothing scheduled for {activeTab.toLowerCase()}
            </h4>
            <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Leave some room for yourself or add a new goal.
            </p>
            <button
              onClick={onOpenAddTask}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-dayflow-coral text-dayflow-text text-xs font-bold shadow-clay hover:scale-105 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
