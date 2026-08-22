import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';

export function NotesTab() {
  const [notes, setNotes] = useState([
    { id: '1', title: 'React 3D & GSAP Ideas', content: 'Use perspective parallax for scroll transitions. R3F float parameters speed=1.4.', date: 'Today, 2:30 PM' },
    { id: '2', title: 'DBMS Revision Points', content: '1. B+ Trees indexing\n2. Two-Phase Locking (2PL)\n3. Normalization forms 1NF to 3NF', date: 'Yesterday' },
    { id: '3', title: 'Weekly Focus Reminders', content: 'Stay calm, drink 3L water, step outside for 20 mins every afternoon.', date: 'Aug 20' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setNotes([
      {
        id: Date.now().toString(),
        title: newTitle.trim(),
        content: newContent.trim(),
        date: 'Just now',
      },
      ...notes,
    ]);
    setNewTitle('');
    setNewContent('');
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
            Scratchpad & Notes 📝
          </h2>
          <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
            Capture quick thoughts, reminders, and study notes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ADD NOTE FORM (5 COLS) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-lg text-dayflow-text dark:text-dayflow-text-dark flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-dayflow-coral" />
            <span>Create New Note</span>
          </h3>

          <form onSubmit={handleAddNote} className="space-y-3">
            <input
              type="text"
              placeholder="Note Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs font-bold focus:outline-none focus:ring-2 focus:ring-dayflow-coral"
            />
            <textarea
              placeholder="Write your note here..."
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs font-medium focus:outline-none focus:ring-2 focus:ring-dayflow-coral resize-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text font-bold text-xs shadow-clay hover:scale-102 transition-transform flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </form>
        </div>

        {/* NOTES LIST (7 COLS) */}
        <div className="lg:col-span-7 space-y-3">
          {notes.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-3xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark shadow-soft space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-dayflow-text dark:text-dayflow-text-dark">
                  {n.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-dayflow-text-muted">{n.date}</span>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1 rounded-full hover:bg-rose-50 text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-dayflow-text-muted dark:text-dayflow-text-muted-dark whitespace-pre-line leading-relaxed">
                {n.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
