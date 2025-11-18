// API Configuration for Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tritechtechnologyllc.com';

export const apiEndpoints = {
  // Auth endpoints
  login: `${API_BASE_URL}/t/auth/login`,
  logout: `${API_BASE_URL}/t/auth/logout`,
  forgotPassword: `${API_BASE_URL}/t/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/t/auth/reset-password`,
  refreshToken: `${API_BASE_URL}/t/auth/token/refresh`,
  verifyToken: `${API_BASE_URL}/t/auth/verifyToken`,
  register: `${API_BASE_URL}/t/auth/register`,

  // User endpoints
  profile: `${API_BASE_URL}/auth/profile`,
  updateProfile: `${API_BASE_URL}/auth/profile`,
};

// HTTP Client configuration for Django
export const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

// Token management - Now using centralized token manager
import { getAccessToken, setTokens, clearTokens } from './util/token-manager';

export const getAuthToken = (): string | null => {
  return getAccessToken();
};

export const setAuthToken = (token: string): void => {
  setTokens(token);
};

export const removeAuthToken = (): void => {
  clearTokens();
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