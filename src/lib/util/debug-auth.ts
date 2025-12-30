/**
 * Debug utility to check authentication state
 * Use this to diagnose auth issues
 */

export function debugAuthState() {
  if (typeof window === 'undefined') {
    console.log('🔍 Server-side - skipping auth debug');
    return;
  }

  console.group('🔍 Auth Debug Info');

  // Check cookies
  console.log('📦 All Cookies:', document.cookie);

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  console.log('📦 Parsed Cookies:', cookies);
  console.log('🔑 Access Token (auth_session):', cookies.auth_session ? 'EXISTS (length: ' + cookies.auth_session.length + ')' : 'NOT FOUND');
  console.log('🔄 Refresh Token (auth_refresh):', cookies.auth_refresh ? 'EXISTS (length: ' + cookies.auth_refresh.length + ')' : 'NOT FOUND');

  // Also check legacy cookie names
  if (cookies.accessToken) {
    console.warn('⚠️ Legacy accessToken cookie found - should be migrated to auth_session');
  }
  if (cookies.refreshToken) {
    console.warn('⚠️ Legacy refreshToken cookie found - should be migrated to auth_refresh');
  }

  // Check localStorage
  try {
    const user = localStorage.getItem('user');
    console.log('👤 User in localStorage:', user ? JSON.parse(user) : 'NOT FOUND');
  } catch (error) {
    console.error('❌ Error reading user from localStorage:', error);
  }

  // Check tenant info
  const tenantSlug = cookies.tenant_slug;
  const tenantId = cookies.tenant_id;
  console.log('🏢 Tenant Slug:', tenantSlug || 'NOT FOUND');
  console.log('🏢 Tenant ID:', tenantId || 'NOT FOUND');

  console.groupEnd();
}

// Auto-run on import in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Run after a small delay to ensure cookies are loaded
  setTimeout(() => {
    debugAuthState();
  }, 100);
}
