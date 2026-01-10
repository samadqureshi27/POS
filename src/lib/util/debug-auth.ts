/**
 * Debug utility to check authentication state
 * Use this to diagnose auth issues
 */

export function debugAuthState() {
  if (typeof window === 'undefined') {
    return;
  }


  // Check cookies

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);


  // Also check legacy cookie names
  if (cookies.accessToken) {
  }
  if (cookies.refreshToken) {
  }

  // Check localStorage
  try {
    const user = localStorage.getItem('user');
  } catch (error) {
  }

  // Check tenant info
  const tenantSlug = cookies.tenant_slug;
  const tenantId = cookies.tenant_id;

}

// Auto-run on import in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Run after a small delay to ensure cookies are loaded
  setTimeout(() => {
    debugAuthState();
  }, 100);
}
