import React from 'react';
import { X, User, Mail, Shield, Trophy, Calendar, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
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
            className="absolute inset-0 bg-dayflow-text/40 dark:bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative w-full max-w-md bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark rounded-4xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark text-dayflow-text-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Avatar & Header */}
            <div className="flex flex-col items-center text-center pt-2 space-y-3">
              <div className="w-20 h-20 rounded-full bg-dayflow-cream dark:bg-dayflow-surface-muted-dark border-4 border-dayflow-coral/50 flex items-center justify-center text-4xl shadow-soft">
                {user?.avatar || '👤'}
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
                  {user?.name || 'Guest User'}
                </h3>
                <p className="text-xs font-semibold text-dayflow-coral">
                  Focus Master 🌱 · Active Session
                </p>
              </div>
            </div>

            {/* Account Information Details */}
            <div className="space-y-3 p-4 rounded-3xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark/50 border border-dayflow-border/60 dark:border-dayflow-border-dark/60 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-dayflow-text-muted flex items-center gap-2">
                  <User className="w-4 h-4 text-dayflow-blue" />
                  <span>Account ID</span>
                </span>
                <span className="font-bold text-dayflow-text dark:text-dayflow-text-dark font-mono text-[11px]">
                  {user?.id || 'guest'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-dayflow-border/40 dark:border-dayflow-border-dark/40">
                <span className="text-dayflow-text-muted flex items-center gap-2">
                  <Mail className="w-4 h-4 text-dayflow-coral" />
                  <span>Email</span>
                </span>
                <span className="font-bold text-dayflow-text dark:text-dayflow-text-dark">
                  {user?.email || 'guest@dayflow.app'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-dayflow-border/40 dark:border-dayflow-border-dark/40">
                <span className="text-dayflow-text-muted flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-dayflow-mint" />
                  <span>Member Since</span>
                </span>
                <span className="font-bold text-dayflow-text dark:text-dayflow-text-dark">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'August 2026'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-dayflow-surface-muted hover:bg-dayflow-surface-muted/80 text-dayflow-text text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
