import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, signupUser, loginUser, fetchCurrentUser } from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_STORAGE_KEY = 'dayflow.auth.token.v1';
const USER_STORAGE_KEY = 'dayflow.auth.user.v1';

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'user_1',
  name: 'Ananya Sharma',
  email: 'ananya@dayflow.app',
  createdAt: '2026-08-01T00:00:00.000Z',
  avatar: '👩🏻‍💻',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_GUEST_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token).then((res) => {
        if (res) {
          setUser(res);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res));
        }
      });
    }
  }, [token]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, pass: string) => {
    const res = await loginUser(email, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const res = await signupUser(name, email, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(DEFAULT_GUEST_USER);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
