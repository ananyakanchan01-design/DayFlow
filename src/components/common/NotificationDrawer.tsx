import React from 'react';
import { Bell, CheckCircle2, Flame, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const notifications = [
    {
      id: '1',
      title: '7 Day Streak Reached! 🔥',
      message: 'You have completed tasks consistently for 7 days in a row.',
      time: '10m ago',
      icon: Flame,
      color: 'text-dayflow-coral bg-dayflow-coral/20',
    },
    {
      id: '2',
      title: 'Focus Plant Stage Upgraded 🌱',
      message: 'Your plant grew to the Sprout stage! Keep completing tasks to reach Tree.',
      time: '1h ago',
      icon: Sparkles,
      color: 'text-dayflow-mint bg-dayflow-mint/20',
    },
    {
      id: '3',
      title: 'Task Reminder: Complete React Website',
      message: 'Scheduled for Today at 5:00 PM.',
      time: '3h ago',
      icon: CheckCircle2,
      color: 'text-dayflow-blue bg-dayflow-blue/20',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-4 sm:right-12 top-16 z-50 w-80 sm:w-96 p-5 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft-lg"
        >
          <div className="flex items-center justify-between pb-3 border-b border-dayflow-border dark:border-dayflow-border-dark">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-dayflow-coral" />
              <h4 className="font-serif font-bold text-sm text-dayflow-text dark:text-dayflow-text-dark">
                Notifications
              </h4>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark text-dayflow-text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 pt-3 max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className="p-3 rounded-2xl bg-dayflow-surface-muted/60 dark:bg-dayflow-surface-muted-dark/50 border border-dayflow-border/40 dark:border-dayflow-border-dark/40 flex items-start gap-3"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark truncate">
                        {n.title}
                      </h5>
                      <span className="text-[9px] text-dayflow-text-muted shrink-0 ml-1">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-dayflow-text-muted dark:text-dayflow-text-muted-dark mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
