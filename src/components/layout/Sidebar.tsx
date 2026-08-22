import React from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Target, 
  BookOpen, 
  Settings, 
  Home,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const navItems = [
    { id: 'today', label: 'Today', icon: Home, badge: '4' },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus', label: 'Focus', icon: Clock },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between p-4 bg-white dark:bg-dayflow-surface-dark border-r border-dayflow-border dark:border-dayflow-border-dark min-h-[calc(100vh-4rem)] transition-colors">
      
      {/* NAVIGATION ITEMS */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-dayflow-cream/80 dark:bg-dayflow-surface-muted-dark text-dayflow-text dark:text-dayflow-text-dark shadow-clay-sm'
                  : 'text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark/50 hover:text-dayflow-text dark:hover:text-dayflow-text-dark'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-dayflow-coral' : ''}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-dayflow-coral/30 text-dayflow-text dark:text-dayflow-text-dark font-extrabold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* BOTTOM DAILY REMINDER CARD */}
      <div className="space-y-4 pt-4 border-t border-dayflow-border/60 dark:border-dayflow-border-dark/60">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-dayflow-cream via-white to-dayflow-mint/20 dark:from-[#25323A] dark:to-[#182127] border border-dayflow-border dark:border-dayflow-border-dark relative overflow-hidden shadow-soft">
          <div className="flex items-center gap-1.5 text-dayflow-coral mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Daily Reminder</span>
          </div>
          <p className="text-xs font-serif font-bold text-dayflow-text dark:text-dayflow-text-dark mb-3 leading-snug">
            Small progress is still progress. 🌱
          </p>
          <div className="w-full h-20 rounded-2xl bg-white/70 dark:bg-dayflow-surface-dark/70 flex items-center justify-center border border-dayflow-border/40">
            <span className="text-3xl">🪴</span>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark">
          <div className="w-9 h-9 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-dark flex items-center justify-center text-base border border-dayflow-coral/40">
            👩🏻‍💻
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark truncate">
              Ananya
            </h5>
            <p className="text-[10px] text-dayflow-text-muted dark:text-dayflow-text-muted-dark truncate">
              Keep going! ✨
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
