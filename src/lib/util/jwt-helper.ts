/**
 * JWT Utility Functions
 *
 * Helper functions to decode and extract information from JWT tokens
 */

interface JWTPayload {
  tenant?: boolean;
  tenantSlug?: string;
  tenantName?: string;
  tenantId?: string;
  uid?: string;
  email?: string;
  roles?: string[];
  branchIds?: string[];
  branchId?: string | null;
  posId?: string | null;
  posName?: string | null;
  defaultBranchId?: string | null;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Decode a JWT token without verification
 * @param token - The JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Base64 URL decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Extract tenant information from JWT token
 * @param token - The JWT token string
 * @returns Tenant info object with slug, name, and id
 */
export const extractTenantFromToken = (
  token: string
): { slug: string | null; name: string | null; id: string | null } => {
  const payload = decodeJWT(token);

  if (!payload) {
    return { slug: null, name: null, id: null };
  }

  return {
    slug: payload.tenantSlug || null,
    name: payload.tenantName || null,
    id: payload.tenantId || null,
  };
};

/**
 * Check if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Get time until token expiration
 * @param token - The JWT token string
 * @returns Seconds until expiration, or -1 if already expired or invalid
 */
export const getTokenExpirationTime = (token: string): number => {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return -1;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = payload.exp - currentTime;

  return timeRemaining > 0 ? timeRemaining : -1;
};
