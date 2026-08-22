import React, { useState, useEffect } from 'react';
import { ProductivityPlant3D } from '@/scenes/ProductivityPlant3D';
import { TaskFilters } from '@/features/tasks/TaskFilters';
import { TaskItem } from '@/features/tasks/TaskItem';
import { InsightsWidget } from '@/features/insights/InsightsWidget';
import { PlannerWidget } from '@/features/planner/PlannerWidget';
import { EditRhythmModal } from '@/components/common/EditRhythmModal';
import { useAuth } from '@/context/AuthContext';
import { Task, FilterType, PlantInfo, DayTimelineItem } from '@/types/task';
import { Sparkles, ArrowDown, Plus, Sun, BookOpen, Coffee, Code, Dumbbell, Moon, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoryViewProps {
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

const snappyTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

const DEFAULT_TIMELINE: DayTimelineItem[] = [
  { id: '1', time: '08:00 AM', period: 'Morning', title: 'Morning Stretch & Coffee', category: 'Fitness', iconName: 'Sun' },
  { id: '2', time: '10:00 AM', period: 'Study', title: 'DBMS Deep Dive & Notes', category: 'College', iconName: 'BookOpen' },
  { id: '3', time: '01:00 PM', period: 'Lunch', title: 'Healthy Meal Break', category: 'General', iconName: 'Coffee' },
  { id: '4', time: '03:00 PM', period: 'Coding', title: 'Complete DayFlow React 3D', category: 'Coding', iconName: 'Code' },
  { id: '5', time: '06:00 PM', period: 'Workout', title: 'Cardio & Strength Workout', category: 'Fitness', iconName: 'Dumbbell' },
  { id: '6', time: '09:00 PM', period: 'Wind Down', title: 'Read 20 Pages Atomic Habits', category: 'Personal Growth', iconName: 'Moon' },
];

const RHYTHM_STORAGE_KEY = 'dayflow.rhythm.v1';

export function StoryView({
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
}: StoryViewProps) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const userRhythmKey = `dayflow.rhythm.v1.${userId}`;

  const [dayTimeline, setDayTimeline] = useState<DayTimelineItem[]>(() => {
    try {
      const saved = localStorage.getItem(userRhythmKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_TIMELINE;
  });

  const [isEditRhythmOpen, setIsEditRhythmOpen] = useState(false);

  // Sync timeline when user session switches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userRhythmKey);
      if (saved) {
        setDayTimeline(JSON.parse(saved));
      } else {
        setDayTimeline(DEFAULT_TIMELINE);
      }
    } catch {
      setDayTimeline(DEFAULT_TIMELINE);
    }
  }, [userRhythmKey]);

  const handleSaveTimeline = (updated: DayTimelineItem[]) => {
    setDayTimeline(updated);
    try {
      localStorage.setItem(userRhythmKey, JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const getTimelineIcon = (name: string) => {
    switch (name) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-dayflow-blue" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-dayflow-coral" />;
      case 'Code': return <Code className="w-4 h-4 text-dayflow-mint" />;
      case 'Dumbbell': return <Dumbbell className="w-4 h-4 text-dayflow-coral" />;
      case 'Moon': default: return <Moon className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full space-y-24 pb-20 relative">
      
      {/* SECTION 01 — HERO */}
      <section id="hero" className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 relative overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-dayflow-cream/90 dark:bg-dayflow-surface-muted-dark/50 blur-3xl -z-10 pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full bg-dayflow-mint/30 dark:bg-dayflow-mint/15 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center space-y-8 my-auto pt-8 pb-4 z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={snappyTransition}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 dark:bg-dayflow-surface-dark/90 border border-dayflow-border dark:border-dayflow-border-dark text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark shadow-soft"
          >
            <Sparkles className="w-4 h-4 text-dayflow-coral" />
            <span>A calmer way to get things done</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappyTransition, delay: 0.05 }}
            className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-dayflow-text dark:text-dayflow-text-dark leading-[1.12]"
          >
            Plan your day.{' '}
            <span className="italic text-dayflow-sage font-normal">
              One task
            </span>{' '}
            at a time.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappyTransition, delay: 0.1 }}
            className="text-lg sm:text-xl text-dayflow-text-muted dark:text-dayflow-text-muted-dark font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Designed for focus, depth, and calm productivity. Transform your daily routine into a visual journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappyTransition, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              onClick={onOpenAddTask}
              className="px-8 py-4 rounded-full bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text font-bold text-sm shadow-clay transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Planning</span>
              <span className="text-lg">→</span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              href="#today-section"
              className="px-7 py-4 rounded-full bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-dayflow-text dark:text-dayflow-text-dark font-bold text-xs shadow-soft hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark transition-all cursor-pointer"
            >
              Scroll to explore ↓
            </motion.a>
          </motion.div>

          {/* Quick Status Pill Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-dayflow-text-muted dark:text-dayflow-text-muted-dark font-semibold border-t border-dayflow-border/60 dark:border-dayflow-border-dark/60 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-dayflow-mint animate-pulse" />
              <span>{pendingCount} Active Tasks Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔥 {streakDays}-Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌱 {completionPercentage}% Focus Index</span>
            </div>
          </motion.div>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex flex-col items-center justify-center gap-2 pt-6 text-dayflow-text-muted dark:text-dayflow-text-muted-dark text-xs font-semibold cursor-pointer"
          onClick={() => {
            const el = document.getElementById('today-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>SCROLL TO BEGIN</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-dayflow-coral" />
        </motion.div>
      </section>

      {/* SECTION 02 — TODAY SECTION WITH LOW LATENCY SCROLL REVEAL */}
      <motion.section
        id="today-section"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={snappyTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        {/* SECTION HEADER & PROGRESS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-8 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark mb-3">
              <span>Today&apos;s Focus</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-dayflow-text dark:text-dayflow-text-dark">
              Good morning! ☀️
            </h2>
            <p className="text-sm font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark mt-1">
              You have {pendingCount} things worth focusing on today.
            </p>
          </div>

          {/* PROGRESS METER */}
          <div className="w-full md:w-64 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
              <span>Progress</span>
              <span>{completedCount} / {totalCount} completed</span>
            </div>
            <div className="w-full h-3 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark overflow-hidden p-0.5 border border-dayflow-border dark:border-dayflow-border-dark">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${completionPercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-dayflow-mint to-dayflow-coral rounded-full"
              />
            </div>
          </div>
        </div>

        {/* FILTERS & ADD TASK BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={onOpenAddTask}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text text-xs font-bold shadow-clay transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Task</span>
          </motion.button>
        </div>

        {/* TASK CARDS LIST WITH FAST LOW-LATENCY STAGGER */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.25, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <TaskItem
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={snappyTransition}
              className="py-16 text-center space-y-3 bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark rounded-4xl"
            >
              <span className="text-4xl">🌱</span>
              <h3 className="font-serif text-lg font-bold text-dayflow-text dark:text-dayflow-text-dark">
                Your day is clear.
              </h3>
              <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark max-w-sm mx-auto">
                That&apos;s a beautiful place to start. Add a new task whenever you&apos;re ready.
              </p>
              <button
                onClick={onOpenAddTask}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-dayflow-coral text-dayflow-text text-xs font-bold shadow-clay hover:scale-105 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* SECTION 03 — 3D DAY TIMELINE & PRODUCTIVITY GARDEN GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 3D DAY TIMELINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={snappyTransition}
          className="lg:col-span-5 p-6 sm:p-8 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dayflow-blue/20 text-dayflow-blue text-xs font-bold mb-2">
                <span>Your Day</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
                Daily Rhythm
              </h3>
              <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                Scroll-linked physical depth timeline
              </p>
            </div>
            <button
              onClick={() => setIsEditRhythmOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-dayflow-coral/15 hover:bg-dayflow-coral hover:text-dayflow-text text-dayflow-coral text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-soft"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Rhythm</span>
            </button>
          </div>

          <EditRhythmModal
            isOpen={isEditRhythmOpen}
            onClose={() => setIsEditRhythmOpen(false)}
            timeline={dayTimeline}
            onSaveTimeline={handleSaveTimeline}
          />

          {/* VERTICAL TIMELINE NODE LIST */}
          <div className="relative pl-6 space-y-6 border-l-2 border-dayflow-border dark:border-dayflow-border-dark">
            {dayTimeline.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="relative group transition-all"
              >
                {/* Node Dot */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-dayflow-surface-dark border-2 border-dayflow-coral group-hover:scale-125 transition-transform flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-dayflow-coral" />
                </div>

                <div className="p-3.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark/50 border border-dayflow-border/60 dark:border-dayflow-border-dark/60 group-hover:shadow-clay-sm transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark mb-1">
                    <span className="text-dayflow-text-muted dark:text-dayflow-text-muted-dark">{item.time}</span>
                    <span className="flex items-center gap-1">
                      {getTimelineIcon(item.iconName)}
                      <span>{item.period}</span>
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
                    {item.title}
                  </h5>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT PRODUCTIVITY GARDEN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={snappyTransition}
          className="lg:col-span-7 p-6 sm:p-8 rounded-4xl bg-gradient-to-br from-white via-dayflow-bg to-dayflow-mint/20 dark:from-dayflow-surface-dark dark:to-[#182127] border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dayflow-mint/30 text-dayflow-text dark:text-dayflow-text-dark text-xs font-bold mb-2">
                <span>Productivity Garden</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
                Grow your progress 🌱
              </h3>
              <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                Small actions become meaningful progress.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-2xl bg-dayflow-coral/20 text-dayflow-coral">
              7 DAY STREAK
            </span>
          </div>

          {/* 3D PLANT CANVAS */}
          <ProductivityPlant3D
            stage={plantInfo.stage}
            completedCount={completedCount}
            progressPercentage={plantInfo.progressPercentage}
            streakDays={streakDays}
          />
        </motion.div>
      </section>

      {/* SECTION 04 — PRODUCTIVITY INSIGHTS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={snappyTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div>
          <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
            Your Insights
          </h3>
          <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
            Track your progress and improve every day.
          </p>
        </div>

        <InsightsWidget
          completionPercentage={completionPercentage}
          completedCount={completedCount}
          streakDays={streakDays}
        />
      </motion.section>

      {/* SECTION 05 — PLANNER SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={snappyTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <PlannerWidget
          tasks={tasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onOpenAddTask={onOpenAddTask}
        />
      </motion.section>

      {/* SECTION 06 — FINAL CTA BANNER */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={snappyTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative p-10 sm:p-14 rounded-4xl bg-gradient-to-r from-dayflow-cream via-white to-dayflow-coral/30 dark:from-dayflow-surface-dark dark:to-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft-lg text-center space-y-6 overflow-hidden">
          
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-dayflow-text dark:text-dayflow-text-dark leading-tight">
              A productive day starts with one task.
            </h2>
            <p className="text-xs sm:text-sm font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Join thousands who have simplified their day with calm visual planning.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              onClick={onOpenAddTask}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text font-bold text-sm shadow-clay transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add your first task</span>
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
