import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.getMe();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await api.login(email, password);
      setUser(loggedInUser);
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Check your credentials.', 'error');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword?: string) => {
    try {
      const { user: registeredUser } = await api.register(name, email, password, confirmPassword);
      setUser(registeredUser);
      showToast(`Welcome to StoreX, ${registeredUser.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      showToast('You have been signed out.', 'info');
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
