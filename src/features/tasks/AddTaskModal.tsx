import React, { useState, useEffect } from 'react';
import { Task, Priority, TaskCategory } from '@/types/task';
import { X, Sparkles, Calendar, Clock, Tag, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  editingTask?: Task | null;
}

export function AddTaskModal({ isOpen, onClose, onSave, editingTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal Project');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('Today');
  const [dueTime, setDueTime] = useState('5:00 PM');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '5:00 PM');
      setNote(editingTask.note || '');
    } else {
      setTitle('');
      setCategory('Personal Project');
      setPriority('High');
      setDueDate('Today');
      setDueTime('5:00 PM');
      setNote('');
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      category,
      priority,
      dueDate,
      dueTime,
      note: note.trim() || undefined,
    });
    onClose();
  };

  const categories: TaskCategory[] = [
    'Personal Project',
    'College',
    'Coding',
    'Work',
    'Personal Growth',
    'Fitness',
    'General',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dayflow-text/40 dark:bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark rounded-4xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-2xl bg-dayflow-coral/30 text-dayflow-coral flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-xl text-dayflow-text dark:text-dayflow-text-dark">
                  {editingTask ? 'Edit Task' : 'New Focus Task'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark text-dayflow-text-muted dark:text-dayflow-text-muted-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete React 3D Website"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-sm font-semibold text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral transition-all"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-dayflow-blue" />
                    <span>Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs font-semibold text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-1.5 flex items-center gap-1">
                    <Flag className="w-3 h-3 text-dayflow-coral" />
                    <span>Priority</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark">
                    {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          priority === p
                            ? p === 'High'
                              ? 'bg-dayflow-coral text-dayflow-text shadow-sm'
                              : p === 'Medium'
                              ? 'bg-amber-400 text-dayflow-text shadow-sm'
                              : 'bg-dayflow-mint text-dayflow-text shadow-sm'
                            : 'text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:text-dayflow-text'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-dayflow-mint" />
                    <span>Due Date</span>
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="Today / Tomorrow / Date"
                    className="w-full px-3 py-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs font-semibold text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral"
                  />
                </div>

                {/* Due Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-dayflow-blue" />
                    <span>Due Time</span>
                  </label>
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="5:00 PM"
                    className="w-full px-3 py-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs font-semibold text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral"
                  />
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dayflow-text-muted dark:text-dayflow-text-muted-dark mb-1.5">
                  Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Key steps or details..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs font-medium text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dayflow-border dark:border-dayflow-border-dark">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-dayflow-text-muted dark:text-dayflow-text-muted-dark hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text text-xs font-bold shadow-clay transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
