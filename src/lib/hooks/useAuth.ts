// src/lib/hooks/useAuth.ts

'use client';

import React, { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { User, AuthContextType, LoginResponse, UserRole } from '@/lib/types/auth';
import authService from '@/lib/auth-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
          const profileResponse = await authService.getProfile();

          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
            setIsAuthenticated(true);
          } else {
            const refreshed = await authService.refreshAccessToken();

            if (refreshed) {
              const retryProfile = await authService.getProfile();
              if (retryProfile.success && retryProfile.data) {
                setUser(retryProfile.data);
                setIsAuthenticated(true);
              } else {
                await handleLogout();
              }
            } else {
              await handleLogout();
            }
          }
        } else {
          await handleLogout();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

const login = useCallback(
  async (email: string, password: string, role?: "admin" | "manager"): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.adminLogin(email, password, role || 'admin');

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return { 
          success: false, 
          error: response.error || response.message || 'Login failed',
          errors: response.errors 
        };
      }
    } catch (error) {
      console.error('useAuth Login error:', error);
      return { success: false, error: 'Network error during login' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pinLogin = useCallback(async (pin: string, role?: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.pinLogin(pin, role);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return { 
          success: false, 
          error: response.error || response.message || 'Invalid PIN' 
        };
      }
    } catch (error) {
      console.error('PIN login error:', error);
      return { success: false, error: 'Network error during PIN login' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await handleLogout();
  }, [handleLogout]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await authService.refreshAccessToken();
      
      if (refreshed) {
        const profileResponse = await authService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      await handleLogout();
      return false;
    } catch (error) {
      console.error('Refresh auth error:', error);
      await handleLogout();
      return false;
    }
  }, [handleLogout]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }, [user]);

  const hasPermission = useCallback((requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      superadmin: 5,
      admin: 4,
      manager: 3,
      cashier: 2,
      waiter: 1,
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    return hasRole(['superadmin', 'admin']);
  }, [hasRole]);

  const isStaff = useCallback((): boolean => {
    return hasRole(['manager', 'cashier', 'waiter']);
  }, [hasRole]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    pinLogin,
    logout,
    refreshAuth,
    updateUser,
    hasRole,
    hasPermission,
    isAdmin,
    isStaff,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading, user };
}

export function useRequireRole(requiredRole: UserRole | UserRole[], redirectTo: string = '/unauthorized') {
  const { hasRole, isLoading, user, isAuthenticated } = useAuth();
  const hasRequiredRole = hasRole(requiredRole);
  
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRequiredRole) {
      window.location.href = redirectTo;
    }
  }, [hasRequiredRole, isLoading, isAuthenticated, redirectTo]);
  
  return { hasRequiredRole, isLoading, user, isAuthenticated };
}

export function useRequireAdmin(redirectTo: string = '/unauthorized') {
  return useRequireRole(['superadmin', 'admin'], redirectTo);
}

export function useRequireStaff(redirectTo: string = '/login') {
  return useRequireRole(['manager', 'cashier', 'waiter'], redirectTo);
}

export default useAuth;