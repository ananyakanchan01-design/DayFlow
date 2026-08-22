import React from 'react';
import { FilterType } from '@/types/task';
import { motion } from 'framer-motion';

interface TaskFiltersProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  counts: {
    all: number;
    today: number;
    pending: number;
    important: number;
    completed: number;
  };
}

export function TaskFilters({ activeFilter, onSelectFilter, counts }: TaskFiltersProps) {
  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'All', label: 'All', count: counts.all },
    { id: 'Today', label: 'Today', count: counts.today },
    { id: 'Pending', label: 'Pending', count: counts.pending },
    { id: 'Important', label: 'Important', count: counts.important },
    { id: 'Completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-dayflow-border dark:border-dayflow-border-dark overflow-x-auto no-scrollbar pb-1">
      {filters.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectFilter(tab.id)}
            className={`relative pb-3 text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              isActive
                ? 'text-dayflow-text dark:text-dayflow-text-dark'
                : 'text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:text-dayflow-text dark:hover:text-dayflow-text-dark'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive
                  ? 'bg-dayflow-coral/30 text-dayflow-text dark:text-dayflow-text-dark font-extrabold'
                  : 'bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark text-dayflow-text-muted dark:text-dayflow-text-muted-dark'
              }`}
            >
              {tab.count}
            </span>

            {/* Minimal Underline Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeFilterUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-dayflow-coral rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
