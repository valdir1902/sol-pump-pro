import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
  solBalance: number;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiClient.verifyToken();
      if (response.data.valid) {
        // Se o token é válido, buscar o perfil completo
        const profileResponse = await apiClient.getProfile();
        setUser(profileResponse.data.user);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      setUser(userData);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await apiClient.register({ email, password, username });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      setUser(userData);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao criar conta';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(current => current ? { ...current, ...userData } : null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}