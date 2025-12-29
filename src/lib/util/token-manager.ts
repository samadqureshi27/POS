/**
 * Centralized Token Management Utility
 *
 * This ensures all parts of the application use the SAME token storage key
 * and prevents duplicate token storage issues.
 *
 * IMPORTANT: All services should import and use these functions instead of
 * directly accessing localStorage or cookies.
 */

// Single source of truth for token storage keys
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

/**
 * Helper to set a cookie
 */
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded};expires=${expires.toUTCString()};path=/;SameSite=Lax;${secure}`;
};

/**
 * Helper to get a cookie value
 */
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

/**
 * Helper to delete a cookie
 */
const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Get the current access token from cookies
 * @returns The access token or null if not found
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getCookie(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Get the current refresh token from cookies
 * @returns The refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getCookie(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Store access and refresh tokens in cookies
 * @param accessToken - The access token to store
 * @param refreshToken - The refresh token to store (optional)
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;

  setCookie(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

  if (refreshToken) {
    setCookie(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Update only the access token (used during token refresh)
 * @param accessToken - The new access token
 */
export const updateAccessToken = (accessToken: string): void => {
  if (typeof window === 'undefined') return;
  setCookie(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
};

/**
 * Clear all authentication tokens from cookies
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;

  deleteCookie(TOKEN_KEYS.ACCESS_TOKEN);
  deleteCookie(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Check if user is authenticated (has a valid token)
 * @returns true if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Migrate any legacy tokens from localStorage/sessionStorage to cookies (one-time migration)
 * Call this on app initialization to clean up old token storage
 */
export const migrateLegacyTokens = (): void => {
  if (typeof window === 'undefined') return;

  // Check if we already have token in cookies
  const existingToken = getCookie(TOKEN_KEYS.ACCESS_TOKEN);
  if (existingToken) return; // Already migrated

  try {
    // Check for tokens stored under old keys in localStorage
    const legacyKeys = ['auth_token', 'access_token', 'accessToken', 'token'];

    for (const key of legacyKeys) {
      const token = localStorage.getItem(key);
      if (token && !getAccessToken()) {
        // Migrate to cookies
        setTokens(token);
        console.log(`✅ Migrated token from localStorage key: ${key}`);
      }
      // Clean up localStorage
      localStorage.removeItem(key);
    }

    // Clean up sessionStorage
    const sessionToken = sessionStorage.getItem('access_token');
    if (sessionToken && !getAccessToken()) {
      setTokens(sessionToken);
      console.log('✅ Migrated token from sessionStorage');
    }
    sessionStorage.removeItem('access_token');

    // Clean up other common localStorage keys
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.warn('Failed to migrate tokens:', error);
  }
};
