
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageKeys } from '@/lib/utils';

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(localStorageKeys.USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem(localStorageKeys.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(localStorageKeys.USER);
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, we're not implementing real authentication
    // In a real app, you'd validate against a backend service
    if (username && password.length >= 4) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
