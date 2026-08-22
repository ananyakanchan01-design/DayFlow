import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Check, MoreVertical, Trash2, Edit, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Category Color Map
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Personal Project':
        return 'bg-dayflow-cream text-dayflow-text dark:bg-dayflow-cream/20 dark:text-dayflow-cream';
      case 'College':
        return 'bg-dayflow-peach/30 text-dayflow-text dark:bg-dayflow-peach/20 dark:text-dayflow-peach';
      case 'Coding':
        return 'bg-dayflow-mint/30 text-dayflow-text dark:bg-dayflow-mint/20 dark:text-dayflow-mint';
      case 'Work':
        return 'bg-dayflow-blue/20 text-dayflow-text dark:bg-dayflow-blue/20 dark:text-dayflow-blue';
      case 'Fitness':
        return 'bg-dayflow-coral/20 text-dayflow-text dark:bg-dayflow-coral/20 dark:text-dayflow-coral';
      default:
        return 'bg-dayflow-beige text-dayflow-text dark:bg-dayflow-beige/20 dark:text-dayflow-beige';
    }
  };

  // Priority Dot Color
  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-dayflow-coral shadow-sm shadow-dayflow-coral/50';
      case 'Medium':
        return 'bg-amber-400 shadow-sm shadow-amber-400/50';
      case 'Low':
      default:
        return 'bg-dayflow-mint shadow-sm shadow-dayflow-mint/50';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex items-center justify-between p-4 rounded-3xl border transition-all duration-300 ${
        task.completed
          ? 'bg-dayflow-surface-muted/60 dark:bg-dayflow-surface-muted-dark/40 border-dayflow-border/50 dark:border-dayflow-border-dark/50 opacity-75'
          : 'bg-white dark:bg-dayflow-surface-dark border-dayflow-border dark:border-dayflow-border-dark shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        
        {/* ANIMATED CHECKBOX */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
            task.completed
              ? 'bg-dayflow-mint border-dayflow-mint text-white scale-105'
              : 'border-dayflow-text-muted/40 hover:border-dayflow-coral hover:scale-110'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </button>

        {/* TASK TITLE & METADATA */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4
              className={`text-sm font-bold text-dayflow-text dark:text-dayflow-text-dark transition-all duration-300 ${
                task.completed ? 'line-through text-dayflow-text-muted dark:text-dayflow-text-muted-dark' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Category Tag */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${getCategoryBadgeClass(
                task.category
              )}`}
            >
              <Tag className="w-2.5 h-2.5" />
              {task.category}
            </span>
          </div>

          {/* Subtitle / Time / Note */}
          <div className="flex items-center gap-3 text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-dayflow-blue" />
              <span>
                {task.dueDate} {task.dueTime ? `· ${task.dueTime}` : ''}
              </span>
            </div>

            {task.note && (
              <span className="hidden sm:inline-block truncate max-w-[200px] text-[11px] italic opacity-80">
                &quot;{task.note}&quot;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT ACTION ITEMS: Priority Dot & Options */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        {/* Priority Dot */}
        <div
          className={`w-2.5 h-2.5 rounded-full ${getPriorityDot(task.priority)}`}
          title={`Priority: ${task.priority}`}
        />

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-1.5 rounded-full hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark text-dayflow-text-muted dark:text-dayflow-text-muted-dark opacity-80 group-hover:opacity-100 transition-opacity"
            aria-label="Task options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-8 z-30 w-36 py-1.5 rounded-2xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft-lg"
              >
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-dayflow-text dark:text-dayflow-text-dark hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5 text-dayflow-blue" />
                    <span>Edit Task</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(task.id);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
