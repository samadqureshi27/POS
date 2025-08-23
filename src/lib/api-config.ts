// API Configuration for Django Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiEndpoints = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login/`,
  logout: `${API_BASE_URL}/auth/logout/`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password/`,
  resetPassword: `${API_BASE_URL}/auth/reset-password/`,
  refreshToken: `${API_BASE_URL}/auth/refresh/`,
  
  // User endpoints
  profile: `${API_BASE_URL}/auth/me/`,
  updateProfile: `${API_BASE_URL}/auth/profile/`,
};

// HTTP Client configuration for Django
export const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

// Token management
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

// Request interceptor for adding auth token
export const createAuthenticatedRequest = (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};