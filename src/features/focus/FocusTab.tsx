import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Target } from 'lucide-react';

export function FocusTab() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<'Rain' | 'Forest' | 'White Noise' | 'Mute'>('Rain');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-8 rounded-4xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft text-center">
      
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dayflow-blue/20 text-dayflow-blue text-xs font-bold">
          <Target className="w-3.5 h-3.5" />
          <span>Focus Session</span>
        </div>
        <h2 className="font-serif font-bold text-3xl text-dayflow-text dark:text-dayflow-text-dark">
          Deep Focus Mode
        </h2>
        <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
          Eliminate distractions and complete your targeted task.
        </p>
      </div>

      {/* TIMER DISPLAY */}
      <div className="relative w-64 h-64 mx-auto flex flex-col items-center justify-center rounded-full bg-dayflow-cream/60 dark:bg-dayflow-surface-muted-dark/50 border-8 border-dayflow-coral/30 shadow-soft">
        <div className="font-serif font-extrabold text-6xl text-dayflow-text dark:text-dayflow-text-dark tracking-wider">
          {formattedTime}
        </div>
        <span className="text-xs font-bold text-dayflow-coral uppercase tracking-widest mt-2">
          {isRunning ? 'FOCUSING...' : 'PAUSED'}
        </span>
      </div>

      {/* TIMER CONTROLS */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="px-8 py-3.5 rounded-full bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text font-bold text-sm shadow-clay hover:scale-105 transition-all flex items-center gap-2"
        >
          {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-3.5 rounded-full bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark hover:bg-dayflow-surface-muted/80 text-dayflow-text-muted dark:text-dayflow-text-muted-dark transition-all"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SOUND AMBIENCE SELECTOR */}
      <div className="pt-6 border-t border-dayflow-border dark:border-dayflow-border-dark space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-dayflow-text-muted">
          <Volume2 className="w-4 h-4 text-dayflow-mint" />
          <span>Ambient Background Sound</span>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {(['Rain', 'Forest', 'White Noise', 'Mute'] as const).map((snd) => (
            <button
              key={snd}
              onClick={() => setActiveSound(snd)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeSound === snd
                  ? 'bg-dayflow-mint text-dayflow-text shadow-sm'
                  : 'bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark text-dayflow-text-muted hover:text-dayflow-text'
              }`}
            >
              {snd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
