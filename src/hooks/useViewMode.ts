import { useState, useEffect } from 'react';
import { ViewMode } from '@/types/task';

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('dayflow.viewMode');
    if (saved === 'story' || saved === 'workspace') return saved;
    return 'story'; // Default to cinematic story view
  });

  useEffect(() => {
    localStorage.setItem('dayflow.viewMode', viewMode);
  }, [viewMode]);

  return { viewMode, setViewMode };
}
