/**
 * Centralized Tenant Management Utility
 *
 * Manages tenant slug and name from API login response.
 * Uses document.cookie for client-side storage only.
 */

// Cookie keys for tenant information
const TENANT_KEYS = {
  SLUG: 'tenant_slug',
  NAME: 'tenant_name',
  ID: 'tenant_id',
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
 * Get the current tenant slug
 * @returns The tenant slug or null if not found
 */
export const getTenantSlug = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Get from cookie only
  return getCookie(TENANT_KEYS.SLUG);
};

/**
 * Get the current tenant name
 * @returns The tenant name or null if not found
 */
export const getTenantName = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Get from cookie only
  return getCookie(TENANT_KEYS.NAME);
};

/**
 * Get the current tenant ID
 * @returns The tenant ID or null if not found
 */
export const getTenantId = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Get from cookie only
  return getCookie(TENANT_KEYS.ID);
};

/**
 * Store tenant information from API response
 * @param slug - The tenant slug
 * @param name - The tenant name (optional)
 * @param id - The tenant ID (optional)
 */
export const setTenantInfo = (slug: string, name?: string, id?: string): void => {
  if (typeof window === 'undefined') return;

  // Store in cookies only
  setCookie(TENANT_KEYS.SLUG, slug);

  if (name) {
    setCookie(TENANT_KEYS.NAME, name);
  }

  if (id) {
    setCookie(TENANT_KEYS.ID, id);
  }

  console.log('Tenant info stored in cookies:', slug);
};

/**
 * Clear all tenant information
 */
export const clearTenantInfo = (): void => {
  if (typeof window === 'undefined') return;

  // Clear cookies only
  deleteCookie(TENANT_KEYS.SLUG);
  deleteCookie(TENANT_KEYS.NAME);
  deleteCookie(TENANT_KEYS.ID);
};

/**
 * Migrate legacy tenant data from localStorage to cookies (one-time migration)
 */
export const migrateLegacyTenantData = (): void => {
  if (typeof window === 'undefined') return;

  // Check if we already have tenant in cookies
  const existingSlug = getCookie(TENANT_KEYS.SLUG);
  if (existingSlug) return; // Already migrated

  // Try to get from localStorage (for one-time migration)
  try {
    const lsSlug = localStorage.getItem(TENANT_KEYS.SLUG) ||
                   localStorage.getItem('tenant_slug'); // legacy key

    if (lsSlug) {
      const lsName = localStorage.getItem(TENANT_KEYS.NAME) ||
                     localStorage.getItem('tenant_name');
      const lsId = localStorage.getItem(TENANT_KEYS.ID) ||
                   localStorage.getItem('tenant_id');

      setTenantInfo(lsSlug, lsName || undefined, lsId || undefined);

      // Clean up localStorage after migration
      localStorage.removeItem(TENANT_KEYS.SLUG);
      localStorage.removeItem(TENANT_KEYS.NAME);
      localStorage.removeItem(TENANT_KEYS.ID);
      localStorage.removeItem('tenant_slug');
      localStorage.removeItem('tenant_name');
      localStorage.removeItem('tenant_id');

      console.log('✅ Migrated tenant data from localStorage to cookies');
    }
  } catch (error) {
    console.warn('Failed to migrate tenant data:', error);
  }
};

/**
 * Get tenant info for headers
 * @returns Object with tenant slug for API headers
 */
export const getTenantHeaders = (): Record<string, string> => {
  const slug = getTenantSlug();

  if (!slug) {
    console.warn('No tenant slug found in cookies');
    return {};
  }

  return {
    'x-tenant-id': slug,
  };
};

/**
 * Check if tenant information is available
 * @returns true if tenant slug exists, false otherwise
 */
export const hasTenantInfo = (): boolean => {
  return getTenantSlug() !== null;
};
