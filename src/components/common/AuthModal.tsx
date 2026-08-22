alooimport React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
        setSuccessMessage('Logged in successfully!');
      } else {
        await signup(name, email, password);
        setSuccessMessage('Account created successfully!');
      }
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-dayflow-text/40 dark:bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark rounded-4xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-dayflow-surface-muted dark:hover:bg-dayflow-surface-muted-dark text-dayflow-text-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Brand */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center justify-center gap-2 w-12 h-12 rounded-2xl bg-dayflow-coral/20 text-dayflow-coral text-2xl shadow-soft mb-1">
                🌱
              </div>
              <h3 className="font-serif font-bold text-2xl text-dayflow-text dark:text-dayflow-text-dark">
                Welcome to DayFlow
              </h3>
              <p className="text-xs font-medium text-dayflow-text-muted dark:text-dayflow-text-muted-dark max-w-xs mx-auto">
                Sign in to sync your daily focus and tasks across devices.
              </p>
            </div>

            {/* Tabbed Navigation (Log In vs Sign Up) */}
            <div className="flex items-center p-1 rounded-2xl bg-dayflow-surface-muted dark:bg-dayflow-surface-muted-dark border border-dayflow-border dark:border-dayflow-border-dark">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'login'
                    ? 'bg-white dark:bg-dayflow-surface-dark text-dayflow-text dark:text-dayflow-text-dark shadow-soft'
                    : 'text-dayflow-text-muted hover:text-dayflow-text dark:hover:text-dayflow-text-dark'
                  }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'signup'
                    ? 'bg-white dark:bg-dayflow-surface-dark text-dayflow-text dark:text-dayflow-text-dark shadow-soft'
                    : 'text-dayflow-text-muted hover:text-dayflow-text dark:hover:text-dayflow-text-dark'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold text-rose-600 dark:text-rose-300 flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-600 dark:text-emerald-300 flex items-center gap-2.5"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-dayflow-text-muted dark:text-dayflow-text-muted-dark uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 absolute left-3.5 text-dayflow-text-muted" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral/50 transition-all shadow-soft"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-dayflow-text-muted dark:text-dayflow-text-muted-dark uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3.5 text-dayflow-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral/50 transition-all shadow-soft"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-dayflow-text-muted dark:text-dayflow-text-muted-dark uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3.5 text-dayflow-text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-dayflow-surface-dark border border-dayflow-border dark:border-dayflow-border-dark text-xs text-dayflow-text dark:text-dayflow-text-dark focus:outline-none focus:ring-2 focus:ring-dayflow-coral/50 transition-all shadow-soft"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-dayflow-coral hover:bg-dayflow-coral-hover text-dayflow-text font-bold text-xs shadow-clay hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-dayflow-text border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{activeTab === 'login' ? 'Log In to Account' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[11px] text-dayflow-text-muted dark:text-dayflow-text-muted-dark">
              <span>Secure encrypted session authentication</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
