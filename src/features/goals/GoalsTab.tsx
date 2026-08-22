import React from 'react';
import { Target, Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export function GoalsTab() {
  const goals = [
    { id: '1', title: 'Complete React 3D Website Project', target: '100% finished', progress: 85, category: 'Coding', color: 'bg-dayflow-coral' },
    { id: '2', title: 'Maintain 14-Day Study & LeetCode Streak', target: '7/14 days', progress: 50, category: 'Personal Growth', color: 'bg-dayflow-mint' },
    { id: '3', title: 'Read 2 Books this Month', target: '1/2 books', progress: 50, category: 'Personal Growth', color: 'bg-dayflow-blue' },
    { id: '4', title: 'Run 50km Total in August', target: '32/50 km', progress: 64, category: 'Fitness', color: 'bg-amber-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
            Goals & Milestones 🎯
          </h2>
          <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
            Track long-term targets and personal habits
          </p>
        </div>

        <button className="px-4 py-2 rounded-full bg-dayflow-coral text-dayflow-text text-xs font-bold shadow-clay hover:scale-105 transition-transform flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Set New Goal</span>
        </button>
      </div>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <div
            key={g.id}
            className="p-6 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark text-dayflow-text-muted">
                  {g.category}
                </span>
                <h4 className="font-bold text-base text-dayflow-text dark:text-dayflow-text-dark mt-2">
                  {g.title}
                </h4>
              </div>
              <div className="p-2 rounded-2xl bg-dayflow-cream dark:bg-dayflow-surface-muted-dark text-dayflow-coral">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
                <span>Progress: {g.target}</span>
                <span>{g.progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark overflow-hidden">
                <div
                  className={`h-full ${g.color} rounded-full transition-all duration-500`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
