import React, { useState } from 'react';
import { Settings, Bell, Moon, Shield, RefreshCw, Trash2, Check } from 'lucide-react';

export function SettingsTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoConfetti, setAutoConfetti] = useState(true);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all tasks to default seed state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
          Workspace Settings ⚙️
        </h2>
        <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
          Manage your app preferences and task engine settings
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-6">
        
        {/* NOTIFICATIONS */}
        <div className="flex items-center justify-between py-2 border-b border-dayflow-border dark:border-dayflow-border-dark">
          <div>
            <h4 className="font-bold text-sm text-dayflow-text dark:text-dayflow-text-dark flex items-center gap-2">
              <Bell className="w-4 h-4 text-dayflow-coral" />
              <span>Enable Task Reminders</span>
            </h4>
            <p className="text-xs text-dayflow-text-muted">Receive popover reminders when tasks are due</p>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-5 h-5 accent-dayflow-coral rounded cursor-pointer"
          />
        </div>

        {/* CELEBRATION EFFECTS */}
        <div className="flex items-center justify-between py-2 border-b border-dayflow-border dark:border-dayflow-border-dark">
          <div>
            <h4 className="font-bold text-sm text-dayflow-text dark:text-dayflow-text-dark flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-dayflow-mint" />
              <span>Completion Confetti Effects</span>
            </h4>
            <p className="text-xs text-dayflow-text-muted">Play particle burst animation on completing a task</p>
          </div>
          <input
            type="checkbox"
            checked={autoConfetti}
            onChange={(e) => setAutoConfetti(e.target.checked)}
            className="w-5 h-5 accent-dayflow-mint rounded cursor-pointer"
          />
        </div>

        {/* RESET DATA */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-bold text-sm text-rose-600 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Reset Local Workspace Data</span>
            </h4>
            <p className="text-xs text-dayflow-text-muted">Clear all stored tasks and reset to initial sample tasks</p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}
