import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ketto_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ketto_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ketto_user');
    }
  }, [user]);

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
    setAuthError(null);
  };

  const login = async (emailOrUsername, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await loginUser(emailOrUsername, password);
      if (res && res.user) {
        setUser(res.user);
        closeAuth();
        return { success: true };
      } else {
        throw new Error(res?.message || 'Login failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await registerUser(userData);
      if (res && res.user) {
        setUser(res.user);
        closeAuth();
        return { success: true };
      } else {
        throw new Error(res?.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ketto_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authModalOpen,
        authModalMode,
        authLoading,
        authError,
        setAuthModalMode,
        openAuth,
        closeAuth,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
