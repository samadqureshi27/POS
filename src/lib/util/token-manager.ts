/**
 * Centralized Token Management Utility
 *
 * This ensures all parts of the application use the SAME token storage key
 * and prevents duplicate token storage issues.
 *
 * IMPORTANT: All services should import and use these functions instead of
 * directly accessing localStorage.
 */

// Single source of truth for token storage keys
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

/**
 * Get the current access token from localStorage
 * @returns The access token or null if not found
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Get the current refresh token from localStorage
 * @returns The refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Store access and refresh tokens
 * @param accessToken - The access token to store
 * @param refreshToken - The refresh token to store (optional)
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

  if (refreshToken) {
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Update only the access token (used during token refresh)
 * @param accessToken - The new access token
 */
export const updateAccessToken = (accessToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
};

/**
 * Clear all authentication tokens from storage
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem('user');

  // Clean up any legacy token keys that might exist
  localStorage.removeItem('auth_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  sessionStorage.removeItem('access_token');
};

/**
 * Check if user is authenticated (has a valid token)
 * @returns true if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Migrate any legacy tokens to the new standard key
 * Call this on app initialization to clean up old token storage
 */
export const migrateLegacyTokens = (): void => {
  if (typeof window === 'undefined') return;

  // Check for tokens stored under old keys
  const legacyKeys = ['auth_token', 'access_token', 'token'];

  for (const key of legacyKeys) {
    const token = localStorage.getItem(key);
    if (token && !getAccessToken()) {
      // Migrate to new key
      setTokens(token);
      localStorage.removeItem(key);
      console.warn(`Migrated token from legacy key: ${key}`);
    }
  }

  // Clean up sessionStorage
  const sessionToken = sessionStorage.getItem('access_token');
  if (sessionToken && !getAccessToken()) {
    setTokens(sessionToken);
    sessionStorage.removeItem('access_token');
  }
};
