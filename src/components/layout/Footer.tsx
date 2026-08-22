import React from 'react';
import { ViewMode } from '@/types/task';

interface FooterProps {
  onSelectView: (mode: ViewMode) => void;
  onOpenAddTask: () => void;
}

export function Footer({ onSelectView, onOpenAddTask }: FooterProps) {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectView = (mode: ViewMode) => {
    onSelectView(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white dark:bg-dayflow-surface-dark border-t border-dayflow-border dark:border-dayflow-border-dark py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* BRAND & QUOTE */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-lg">🌱</span>
            <span className="font-serif font-bold text-xl text-dayflow-text dark:text-dayflow-text-dark tracking-wide">
              DAYFLOW
            </span>
          </div>
          <p className="font-serif italic text-sm text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
            &ldquo;Make today count. One task at a time.&rdquo;
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
          <button
            onClick={() => handleSelectView('story')}
            className="hover:text-dayflow-coral transition-colors cursor-pointer"
          >
            Story Experience
          </button>
          <button
            onClick={() => handleSelectView('workspace')}
            className="hover:text-dayflow-coral transition-colors cursor-pointer"
          >
            Workspace Dashboard
          </button>
          <button
            onClick={onOpenAddTask}
            className="hover:text-dayflow-coral transition-colors cursor-pointer"
          >
            + New Task
          </button>
          <button
            onClick={handleScrollToTop}
            className="hover:text-dayflow-coral transition-colors cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>

        {/* COPYRIGHT */}
        <div className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
          © {new Date().getFullYear()} DayFlow. Crafted with calm efficiency.
        </div>
      </div>
    </footer>
  );
}
