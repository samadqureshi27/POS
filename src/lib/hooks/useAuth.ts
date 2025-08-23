"use client";
import { useState } from 'react';
import { LoginCredentials, AuthResponse } from '@/types/auth';
import * as mockApi from '@/lib/mock-api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await mockApi.login(credentials);
      
      if (response.success && response.user && response.token) {
        // Store token (you might want to use a more secure method)
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  return {
    login,
    logout,
    isLoading,
    error,
    user
  };
};