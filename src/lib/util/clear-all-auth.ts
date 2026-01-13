/**
 * Utility to completely clear all authentication data
 * Use this for testing/debugging to ensure clean state
 */

export function clearAllAuthData() {
  if (typeof window === 'undefined') return;


  // Clear all cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name] = cookie.split('=');
    const trimmedName = name.trim();

    // Delete with multiple path variations to ensure cleanup
    document.cookie = `${trimmedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${trimmedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
  }

  // Clear localStorage
  const localStorageKeys = Object.keys(localStorage);
  for (const key of localStorageKeys) {
    localStorage.removeItem(key);
  }

  // Clear sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  for (const key of sessionStorageKeys) {
    sessionStorage.removeItem(key);
  }


  // Verify
}

// Make it available globally for easy access in console
if (typeof window !== 'undefined') {
  (window as any).clearAllAuthData = clearAllAuthData;
}
