/**
 * Centralized Service Helper Functions
 *
 * This file provides shared utility functions used by all service files.
 * Import these instead of duplicating getToken/getTenantInfo/buildHeaders in each service.
 *
 * USAGE in service files:
 * ```typescript
 * import { getToken, getTenantInfo, buildHeaders } from '@/lib/util/service-helpers';
 * ```
 */

import AuthService from "@/lib/auth-service";
import { getAccessToken } from './token-manager';

/**
 * Get authentication token from AuthService or localStorage
 * @returns Authentication token or null
 */
export function getToken(): string | null {
  // Try to get from AuthService first (centralized token manager)
  const token = getAccessToken();
  if (token) return token;

  // Fallback to AuthService instance method
  const authToken = AuthService.getToken();
  if (authToken) return authToken;

  // Last resort: check localStorage/sessionStorage (legacy support)
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      null
    );
  }

  return null;
}

/**
 * Get tenant information from storage or environment variables
 * @returns Object with tenant id and slug
 */
export function getTenantInfo(): { id: string | null; slug: string | null } {
  if (typeof window === "undefined") {
    return {
      id: process.env.NEXT_PUBLIC_TENANT_ID || null,
      slug: process.env.NEXT_PUBLIC_TENANT_SLUG || null,
    };
  }

  return {
    id:
      localStorage.getItem("tenant_id") ||
      sessionStorage.getItem("tenant_id") ||
      process.env.NEXT_PUBLIC_TENANT_ID ||
      null,
    slug:
      localStorage.getItem("tenant_slug") ||
      sessionStorage.getItem("tenant_slug") ||
      process.env.NEXT_PUBLIC_TENANT_SLUG ||
      null,
  };
}

/**
 * Build standardized headers for API requests
 * @param includeContentTypeOrExtra - Boolean for includeContentType, or object for extra headers
 * @param skipContentType - Whether to skip Content-Type header (for FormData uploads)
 * @returns Headers object ready for fetch requests
 */
export function buildHeaders(
  includeContentTypeOrExtra: boolean | Record<string, string> = true,
  skipContentType?: boolean
): HeadersInit {
  const headers: Record<string, string> = {};

  // Handle overloaded parameters
  let includeContentType = true;
  let extraHeaders: Record<string, string> = {};

  if (typeof includeContentTypeOrExtra === "boolean") {
    includeContentType = includeContentTypeOrExtra;
  } else {
    extraHeaders = includeContentTypeOrExtra;
  }

  // Override if skipContentType is explicitly set
  if (skipContentType !== undefined) {
    includeContentType = !skipContentType;
  }

  // Content-Type header (JSON by default)
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  // Authentication token
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Tenant identification
  const { id, slug } = getTenantInfo();
  if (id) {
    headers["x-tenant-id"] = id;
  } else if (slug) {
    headers["x-tenant-id"] = slug;
  }

  // Merge extra headers (they can override defaults)
  return { ...headers, ...extraHeaders };
}

/**
 * Build tenant slug (for backward compatibility with some service files)
 * @returns Tenant slug or null
 */
export function getTenantSlug(): string | null {
  const { slug } = getTenantInfo();
  return slug;
}

/**
 * Build tenant ID (for backward compatibility with some service files)
 * @returns Tenant ID or null
 */
export function getTenantId(): string | null {
  const { id } = getTenantInfo();
  return id;
}