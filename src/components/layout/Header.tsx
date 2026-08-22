import React from 'react';
import { ViewMode } from '@/types/task';
import { Sparkles, Sun, Moon, Bell, Search, LayoutGrid, Compass, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAddTask?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export function Header({
  viewMode,
  onToggleViewMode,
  theme,
  onToggleTheme,
  searchQuery = '',
  onSearchChange,
  onOpenAddTask,
  onOpenNotifications,
  onOpenProfile,
}: HeaderProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-dayflow-bg/85 dark:bg-dayflow-bg-dark/85 border-b border-dayflow-border/60 dark:border-dayflow-border-dark/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-dayflow-coral text-dayflow-text flex items-center justify-center font-serif text-lg font-bold shadow-clay-sm">
            🌱
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-wide text-dayflow-text dark:text-dayflow-text-dark">
              DAYFLOW
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold tracking-widest text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              Plan. Focus. Achieve.
            </span>
          </div>
        </div>

        {/* SEARCH BAR (For Workspace mode / General) */}
        {onSearchChange && (
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-dayflow-text-muted dark:text-dayflow-text-muted-dark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral/50 transition-all shadow-soft"
            />
          </div>
        )}

        {/* VIEW MODE TOGGLE SWITCH (Story ↔ Workspace) */}
        <div className="flex items-center gap-2 bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark p-1 rounded-full border border-dayflow-border dark:border-dayflow-border-dark shadow-inner">
          <button
            onClick={() => onToggleViewMode('story')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'story'
                ? 'bg-white dark:bg-dayflow-surface-dark text-dayflow-text dark:text-dayflow-text-dark shadow-soft'
                : 'text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:text-dayflow-text dark:hover:text-dayflow-text-dark'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-dayflow-coral" />
            <span>Story</span>
          </button>
          <button
            onClick={() => onToggleViewMode('workspace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'workspace'
                ? 'bg-white dark:bg-dayflow-surface-dark text-dayflow-text dark:text-dayflow-text-dark shadow-soft'
                : 'text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:text-dayflow-text dark:hover:text-dayflow-text-dark'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-dayflow-blue" />
            <span>Workspace</span>
          </button>
        </div>

        {/* RIGHT CONTROLS: Add Task, Notifications, Theme, Profile/Login */}
        <div className="flex items-center gap-2">
          {onOpenAddTask && (
            <button
              onClick={onOpenAddTask}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text text-xs font-bold shadow-clay transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Task</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-dayflow-text dark:text-dayflow-text-dark shadow-soft hover:scale-105 transition-all cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-dayflow-text-muted" />
            ) : (
              <Sun className="w-4 h-4 text-dayflow-coral" />
            )}
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-full bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-dayflow-text dark:text-dayflow-text-dark shadow-soft hover:scale-105 transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-dayflow-text-muted dark:text-dayflow-text-muted-dark" />
            <span className="w-2 h-2 rounded-full bg-dayflow-coral absolute top-1 right-1" />
          </button>

          {/* User Profile Pill or Sign In Button */}
          {isAuthenticated ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-dayflow-border dark:border-dayflow-border-dark hover:opacity-90 transition-opacity cursor-pointer"
              title="View Profile & Login Details"
            >
              <div className="w-8 h-8 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark flex items-center justify-center text-sm font-bold border border-dayflow-coral/40">
                {user?.avatar || '👤'}
              </div>
              <span className="hidden lg:inline-block text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
                {user?.name.split(' ')[0] || 'User'}
              </span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-dayflow-text dark:text-dayflow-text-dark text-xs font-bold shadow-soft hover:scale-105 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-dayflow-coral" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
