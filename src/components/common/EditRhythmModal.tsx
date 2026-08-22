import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Sun, BookOpen, Coffee, Code, Dumbbell, Moon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayTimelineItem, TaskCategory } from '@/types/task';

interface EditRhythmModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: DayTimelineItem[];
  onSaveTimeline: (updatedTimeline: DayTimelineItem[]) => void;
}

const ICON_OPTIONS = [
  { name: 'Sun', label: 'Morning / Sun', icon: Sun },
  { name: 'BookOpen', label: 'Study / Reading', icon: BookOpen },
  { name: 'Coffee', label: 'Break / Meal', icon: Coffee },
  { name: 'Code', label: 'Coding / Work', icon: Code },
  { name: 'Dumbbell', label: 'Workout / Fitness', icon: Dumbbell },
  { name: 'Moon', label: 'Night / Wind Down', icon: Moon },
];

export function EditRhythmModal({
  isOpen,
  onClose,
  timeline,
  onSaveTimeline,
}: EditRhythmModalProps) {
  const [items, setItems] = useState<DayTimelineItem[]>(timeline);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [time, setTime] = useState('08:00 AM');
  const [period, setPeriod] = useState('Morning');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('General');
  const [iconName, setIconName] = useState('Sun');

  useEffect(() => {
    setItems(timeline);
  }, [timeline, isOpen]);

  const handleStartEdit = (item: DayTimelineItem) => {
    setEditingId(item.id);
    setTime(item.time);
    setPeriod(item.period);
    setTitle(item.title);
    setCategory(item.category);
    setIconName(item.iconName || 'Sun');
  };

  const handleStartNew = () => {
    setEditingId('new');
    setTime('04:00 PM');
    setPeriod('Afternoon');
    setTitle('');
    setCategory('General');
    setIconName('Coffee');
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId === 'new') {
      const newItem: DayTimelineItem = {
        id: `rhythm_${Date.now()}`,
        time,
        period,
        title: title.trim(),
        category,
        iconName,
      };
      const updated = [...items, newItem];
      setItems(updated);
      onSaveTimeline(updated);
    } else if (editingId) {
      const updated = items.map((item) =>
        item.id === editingId
          ? { ...item, time, period, title: title.trim(), category, iconName }
          : item
      );
      setItems(updated);
      onSaveTimeline(updated);
    }
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onSaveTimeline(updated);
    if (editingId === id) setEditingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dayflow-text/40 dark:bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative w-full max-w-xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark rounded-4xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden space-y-6 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-dayflow-blue/20 text-dayflow-blue flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
                    Edit Daily Rhythm
                  </h3>
                  <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
                    Customize your personal daily routine timeline slots.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark text-dayflow-text-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List & Edit Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Add New Slot Button */}
              {editingId !== 'new' && (
                <button
                  onClick={handleStartNew}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-dayflow-border dark:border-dayflow-border-dark hover:border-dayflow-coral text-dayflow-coral text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Daily Rhythm Slot</span>
                </button>
              )}

              {/* Edit Form */}
              {editingId && (
                <form
                  onSubmit={handleSaveItem}
                  className="p-5 rounded-3xl bg-dayflow-surface-muted/70 dark:bg-dayflow-surface-muted-dark/70 border border-dayflow-coral/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-dayflow-coral uppercase tracking-wider">
                      {editingId === 'new' ? 'Create New Slot' : 'Edit Rhythm Slot'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-xs font-bold text-dayflow-text-muted hover:underline"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-dayflow-text-muted uppercase">
                        Time
                      </label>
                      <input
                        type="text"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g. 08:00 AM"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-dayflow-text-muted uppercase">
                        Period / Label
                      </label>
                      <input
                        type="text"
                        required
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="e.g. Morning"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dayflow-text-muted uppercase">
                      Title / Activity Description
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Morning Stretch & Coffee"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dayflow-text-muted uppercase">
                      Icon Symbol
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ICON_OPTIONS.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = iconName === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setIconName(opt.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-dayflow-coral text-dayflow-text shadow-soft'
                                : 'bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-dayflow-text-muted'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{opt.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-dayflow-coral text-dayflow-text text-xs font-bold shadow-clay hover:scale-[1.01] transition-transform cursor-pointer"
                  >
                    Save Slot
                  </button>
                </form>
              )}

              {/* Timeline Items List */}
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark/50 border border-dayflow-border/60 dark:border-dayflow-border-dark/60 flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark">
                        <span className="text-dayflow-coral">{item.time}</span>
                        <span className="text-dayflow-text-muted">•</span>
                        <span>{item.period}</span>
                      </div>
                      <h5 className="text-xs font-bold text-dayflow-text dark:text-dayflow-text-dark mt-0.5">
                        {item.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 rounded-xl bg-white dark:bg-dayflow-surface-dark hover:text-dayflow-coral text-dayflow-text-muted shadow-soft transition-colors cursor-pointer"
                        title="Edit slot"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-xl bg-white dark:bg-dayflow-surface-dark hover:text-rose-500 text-dayflow-text-muted shadow-soft transition-colors cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-dayflow-border dark:border-dayflow-border-dark flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-dayflow-coral text-dayflow-text text-xs font-bold shadow-clay hover:scale-105 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
