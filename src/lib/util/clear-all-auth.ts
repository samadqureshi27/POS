/**
 * Utility to completely clear all authentication data
 * Use this for testing/debugging to ensure clean state
 */

export function clearAllAuthData() {
  if (typeof window === 'undefined') return;

  console.group('🧹 Clearing All Auth Data');

  // Clear all cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name] = cookie.split('=');
    const trimmedName = name.trim();

    // Delete with multiple path variations to ensure cleanup
    document.cookie = `${trimmedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${trimmedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
    console.log(`🗑️ Deleted cookie: ${trimmedName}`);
  }

  // Clear localStorage
  const localStorageKeys = Object.keys(localStorage);
  for (const key of localStorageKeys) {
    localStorage.removeItem(key);
    console.log(`🗑️ Deleted localStorage: ${key}`);
  }

  // Clear sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  for (const key of sessionStorageKeys) {
    sessionStorage.removeItem(key);
    console.log(`🗑️ Deleted sessionStorage: ${key}`);
  }

  console.log('✅ All auth data cleared');
  console.groupEnd();

  // Verify
  console.group('🔍 Verification');
  console.log('Remaining cookies:', document.cookie || '(none)');
  console.log('Remaining localStorage items:', Object.keys(localStorage).length);
  console.log('Remaining sessionStorage items:', Object.keys(sessionStorage).length);
  console.groupEnd();
}

// Make it available globally for easy access in console
if (typeof window !== 'undefined') {
  (window as any).clearAllAuthData = clearAllAuthData;
  console.log('💡 Debug utility available: window.clearAllAuthData()');
}
