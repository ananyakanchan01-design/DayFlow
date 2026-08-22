import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoryView } from '@/views/StoryView';
import { WorkspaceView } from '@/views/WorkspaceView';
import { AddTaskModal } from '@/features/tasks/AddTaskModal';
import { NotificationDrawer } from '@/components/common/NotificationDrawer';
import { ProfileModal } from '@/components/common/ProfileModal';
import { AuthModal } from '@/components/common/AuthModal';
import { AuthProvider } from '@/context/AuthContext';
import { useTasks } from '@/features/tasks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { useViewMode } from '@/hooks/useViewMode';
import { calculatePlantStage } from '@/features/productivity/plantGrowth';
import { Task } from '@/types/task';

function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { viewMode, setViewMode } = useViewMode();
  
  const {
    tasks,
    filteredTasks,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    totalCount,
    completedCount,
    pendingCount,
    highPriorityCount,
    completionPercentage,
    streakDays,
  } = useTasks();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const plantInfo = calculatePlantStage(completedCount, totalCount);

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsAddTaskOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dayflow-bg dark:bg-dayflow-bg-dark text-dayflow-text dark:text-dayflow-text-dark font-sans antialiased transition-colors duration-300 relative">
      
      {/* HEADER */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddTask={handleOpenAddTask}
        onOpenNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* NOTIFICATION DRAWER POPOVER */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* USER PROFILE & LOGIN DETAILS MODAL */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* AUTHENTICATION LOGIN / SIGN UP MODAL */}
      <AuthModal />

      {/* VIEW RENDER: STORY VIEW VS WORKSPACE VIEW */}
      <div className="flex-1">
        {viewMode === 'story' ? (
          <StoryView
            tasks={tasks}
            filteredTasks={filteredTasks}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onOpenAddTask={handleOpenAddTask}
            completedCount={completedCount}
            totalCount={totalCount}
            completionPercentage={completionPercentage}
            highPriorityCount={highPriorityCount}
            pendingCount={pendingCount}
            streakDays={streakDays}
            plantInfo={plantInfo}
          />
        ) : (
          <WorkspaceView
            tasks={tasks}
            filteredTasks={filteredTasks}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onOpenAddTask={handleOpenAddTask}
            completedCount={completedCount}
            totalCount={totalCount}
            completionPercentage={completionPercentage}
            highPriorityCount={highPriorityCount}
            pendingCount={pendingCount}
            streakDays={streakDays}
            plantInfo={plantInfo}
          />
        )}
      </div>

      {/* ADD/EDIT TASK MODAL */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* FOOTER */}
      <Footer onSelectView={setViewMode} onOpenAddTask={handleOpenAddTask} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
