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
// Note: Using obfuscated names to avoid browser/extension blocking
// Some browsers block cookies named "accessToken" for security reasons
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'auth_session',  // Changed from 'accessToken' to avoid blocking
  REFRESH_TOKEN: 'auth_refresh',  // Changed for consistency
} as const;

/**
 * Helper to set a cookie with production-ready attributes
 */
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Production-ready cookie attributes:
  // - Secure: Only send over HTTPS in production
  // - SameSite=Lax: Protect against CSRF while allowing normal navigation
  // - path=/: Available across entire site
  // - max-age: Alternative to expires for better browser support
  const maxAge = days * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  const encoded = encodeURIComponent(value);

  // Set cookie with both expires and max-age for maximum compatibility
  const cookieString = `${name}=${encoded};expires=${expires.toUTCString()};max-age=${maxAge};path=/;SameSite=Lax;${secure}`;
  document.cookie = cookieString;

  // Debug logging
  console.log(`🍪 Setting cookie: ${name}`, {
    length: value.length,
    cookieString: cookieString.substring(0, 100) + '...'
  });

  // Persistent logging (survives redirect)
  if (typeof window !== 'undefined') {
    import('./persistent-logger').then(({ PersistentLogger }) => {
      PersistentLogger.log(`Setting cookie: ${name}`, { length: value.length });
    });
  }

  // Verify cookie was set (debugging aid)
  if (process.env.NODE_ENV !== 'production') {
    const verification = getCookie(name);
    if (!verification) {
      console.error(`❌ Failed to set cookie: ${name}`);
      console.error('Current cookies:', document.cookie);

      // Persistent error log
      if (typeof window !== 'undefined') {
        import('./persistent-logger').then(({ PersistentLogger }) => {
          PersistentLogger.error(`Failed to set cookie: ${name}`, { allCookies: document.cookie });
        });
      }
    } else {
      console.log(`✅ Cookie verified: ${name} (length: ${verification.length})`);

      // Persistent success log
      if (typeof window !== 'undefined') {
        import('./persistent-logger').then(({ PersistentLogger }) => {
          PersistentLogger.log(`Cookie verified: ${name}`, { length: verification.length });
        });
      }
    }
  }
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
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch (e) {
        console.error('Failed to decode cookie:', name, e);
        return c.substring(nameEQ.length, c.length);
      }
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
 * Wait for access token to be available (useful on page load)
 * This is helpful when cookies aren't immediately accessible after navigation/refresh
 * @param maxAttempts - Maximum number of attempts to check for token (default: 10)
 * @param delayMs - Delay between attempts in milliseconds (default: 100)
 * @returns Promise that resolves with token or null if not found
 */
export const waitForAccessToken = async (maxAttempts: number = 10, delayMs: number = 100): Promise<string | null> => {
  for (let i = 0; i < maxAttempts; i++) {
    const token = getAccessToken();
    if (token) {
      // Log only if we had to retry (indicates cookie access delay)
      if (i > 0 && process.env.NODE_ENV !== 'production') {
        console.debug(`✅ Token found after ${i + 1} attempt(s) (${i * delayMs}ms delay)`);
      }
      return token;
    }

    // Wait before next attempt (but not after the last attempt)
    if (i < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  // Only log warning if we actually tried multiple times
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`⚠️ No access token found after ${maxAttempts} attempts (${maxAttempts * delayMs}ms total)`);
  }
  return null;
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

  console.log('🔐 setTokens called with:', {
    accessTokenLength: accessToken?.length,
    refreshTokenLength: refreshToken?.length,
    accessTokenKey: TOKEN_KEYS.ACCESS_TOKEN,
    refreshTokenKey: TOKEN_KEYS.REFRESH_TOKEN
  });

  // Set access token
  setCookie(TOKEN_KEYS.ACCESS_TOKEN, accessToken);

  // Immediately verify it was set
  const verifyAccess = getCookie(TOKEN_KEYS.ACCESS_TOKEN);
  console.log('🔍 Access token verification:', {
    wasSet: !!verifyAccess,
    length: verifyAccess?.length,
    allCookies: document.cookie
  });

  if (refreshToken) {
    setCookie(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  }

  // Final verification
  setTimeout(() => {
    const finalAccess = getCookie(TOKEN_KEYS.ACCESS_TOKEN);
    const finalRefresh = getCookie(TOKEN_KEYS.REFRESH_TOKEN);
    console.log('✅ Final cookie check:', {
      accessToken: finalAccess ? 'SET' : 'MISSING',
      refreshToken: finalRefresh ? 'SET' : 'MISSING'
    });
  }, 100);
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
 * Note: This does NOT clear user from localStorage - that's handled by auth-service
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;

  deleteCookie(TOKEN_KEYS.ACCESS_TOKEN);
  deleteCookie(TOKEN_KEYS.REFRESH_TOKEN);

  // Also clear user from localStorage when clearing tokens
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.warn('Failed to clear user from localStorage:', error);
  }
};

/**
 * Check if user is authenticated (has a valid token)
 * @returns true if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Migrate any legacy tokens from localStorage/sessionStorage/old cookies to new cookie names
 * Call this on app initialization to clean up old token storage
 */
export const migrateLegacyTokens = (): void => {
  if (typeof window === 'undefined') return;

  // Check if we already have token in NEW cookies
  const existingToken = getCookie(TOKEN_KEYS.ACCESS_TOKEN);
  if (existingToken) {
    // We have a valid token in new cookies - just clean up legacy storage
    try {
      const legacyKeys = ['auth_token', 'access_token', 'token', 'accessToken'];
      for (const key of legacyKeys) {
        localStorage.removeItem(key);
      }
      sessionStorage.removeItem('access_token');

      // Clean up old cookie names
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    } catch (error) {
      console.debug('Failed to clean up legacy tokens:', error);
    }
    return;
  }

  try {
    // Priority 1: Check old cookie names (accessToken, refreshToken)
    const oldAccessToken = getCookie('accessToken');
    const oldRefreshToken = getCookie('refreshToken');

    if (oldAccessToken) {
      console.log('✅ Migrating from old accessToken cookie to auth_session');
      setTokens(oldAccessToken, oldRefreshToken || undefined);
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      return;
    }

    // Priority 2: Check localStorage
    const legacyKeys = ['auth_token', 'access_token', 'accessToken', 'token'];

    for (const key of legacyKeys) {
      const token = localStorage.getItem(key);
      if (token && !getAccessToken()) {
        console.log(`✅ Migrated token from localStorage key: ${key}`);
        setTokens(token);
        break;
      }
    }

    // Priority 3: Check sessionStorage
    const sessionToken = sessionStorage.getItem('access_token');
    if (sessionToken && !getAccessToken()) {
      console.log('✅ Migrated token from sessionStorage');
      setTokens(sessionToken);
    }

    // Clean up all legacy storage
    for (const key of legacyKeys) {
      localStorage.removeItem(key);
    }
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');
  } catch (error) {
    console.warn('Failed to migrate tokens:', error);
  }
};

/**
 * Test cookie setting capability (for debugging)
 * Tests if browser allows setting accessToken cookie specifically
 */
export const testCookieSetting = (): void => {
  if (typeof window === 'undefined') {
    console.error('Cannot test cookies - not in browser environment');
    return;
  }

  console.group('🧪 Cookie Setting Test');

  // Test 1: Can we set a test cookie?
  const testValue = 'test_' + Date.now();
  setCookie('test_cookie', testValue);
  const testResult = getCookie('test_cookie');
  console.log('Test cookie:', testResult === testValue ? '✅ SUCCESS' : '❌ FAILED');

  // Test 2: Can we set accessToken specifically?
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
  setCookie(TOKEN_KEYS.ACCESS_TOKEN, testToken);
  const accessResult = getCookie(TOKEN_KEYS.ACCESS_TOKEN);
  console.log('accessToken cookie:', accessResult === testToken ? '✅ SUCCESS' : '❌ FAILED');

  // Test 3: Show all cookies
  console.log('All cookies:', document.cookie);

  // Test 4: Check cookie size limits
  const largeToken = 'x'.repeat(4000); // ~4KB token
  setCookie('large_test', largeToken);
  const largeResult = getCookie('large_test');
  console.log('Large cookie (4KB):', largeResult === largeToken ? '✅ SUCCESS' : '❌ FAILED');

  // Cleanup
  deleteCookie('test_cookie');
  deleteCookie(TOKEN_KEYS.ACCESS_TOKEN);
  deleteCookie('large_test');

  console.groupEnd();

  console.log('\n💡 If accessToken test FAILED, there may be:');
  console.log('  - Browser security settings blocking it');
  console.log('  - Cookie size limits');
  console.log('  - Third-party cookie blocking');
  console.log('\nRun this in console: testCookieSetting()');
};

// Make test function globally available
if (typeof window !== 'undefined') {
  (window as any).testCookieSetting = testCookieSetting;
}
