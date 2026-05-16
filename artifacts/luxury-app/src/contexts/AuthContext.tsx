import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isLocked: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const BASE_PATH = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mh_user_token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async (tok: string) => {
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/me`, { headers: { Authorization: `Bearer ${tok}` } });
      if (res.ok) {
        setUser(await res.json());
      } else {
        localStorage.removeItem('mh_user_token');
        setToken(null);
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('mh_user_token');
    if (savedToken) {
      fetchMe(savedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback((newUser: User, newToken: string) => {
    localStorage.setItem('mh_user_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mh_user_token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => setUser(updatedUser), []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
