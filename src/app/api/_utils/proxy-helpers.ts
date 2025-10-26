// Shared utilities for API proxy routes

const REMOTE_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://api.tritechtechnologyllc.com";

const DEFAULT_TENANT_SLUG = 'extraction-testt';

/**
 * Get tenant slug from request headers or environment
 */
export function getTenantSlug(req: Request): string {
  // Priority: header > env var > default
  const fromHeader = req.headers.get("x-tenant-id");
  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;
  return fromHeader || envSlug || DEFAULT_TENANT_SLUG;
}

/**
 * Build headers for proxying to tenant API
 * Automatically includes x-tenant-id header with tenant slug
 */
export function buildTenantHeaders(req: Request, includeAuth: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  // Always include tenant identifier
  const tenantSlug = getTenantSlug(req);
  headers["x-tenant-id"] = tenantSlug;

  // Include auth token if provided
  if (includeAuth) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
  }

  return headers;
}

/**
 * Get the remote API base URL
 */
export function getRemoteBase(): string {
  return REMOTE_BASE;
}
