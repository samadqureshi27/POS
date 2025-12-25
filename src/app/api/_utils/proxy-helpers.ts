// Shared utilities for API proxy routes

const REMOTE_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://api.tritechtechnologyllc.com";

// Enable/disable detailed API logging
const ENABLE_API_LOGGING = true;

/**
 * Log API request details to console
 */
function logApiRequest(method: string, url: string, headers: Record<string, string>, body?: any) {
  if (!ENABLE_API_LOGGING) return;

  console.log('\n🌐 API REQUEST:', {
    method,
    url,
    headers: {
      'x-tenant-id': headers['x-tenant-id'],
      'Authorization': headers['Authorization'] ? 'Bearer ***' : 'None',
      'Content-Type': headers['Content-Type']
    },
    body: body ? JSON.stringify(body).substring(0, 200) : undefined
  });
}

/**
 * Log API response details to console
 */
function logApiResponse(url: string, status: number, data?: any) {
  if (!ENABLE_API_LOGGING) return;

  const statusEmoji = status >= 200 && status < 300 ? '✅' : '❌';
  console.log(`${statusEmoji} API RESPONSE:`, {
    url,
    status,
    data: data ? JSON.stringify(data).substring(0, 200) + '...' : undefined
  });
}

/**
 * Get tenant slug from request headers or environment
 * Throws an error if tenant slug is not configured
 */
export function getTenantSlug(req: Request): string {
  // Priority: header > env var
  const fromHeader = req.headers.get("x-tenant-id");
  if (fromHeader) return fromHeader;

  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;
  if (envSlug) return envSlug;

  // No default - tenant slug MUST be explicitly configured
  throw new Error(
    'Tenant slug not configured. Please set NEXT_PUBLIC_TENANT_SLUG environment variable.'
  );
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

/**
 * Wrapper for fetch with automatic logging
 */
export async function proxyFetch(url: string, options: RequestInit & { logBody?: any } = {}) {
  const { logBody, ...fetchOptions } = options;

  logApiRequest(
    fetchOptions.method || 'GET',
    url,
    (fetchOptions.headers as Record<string, string>) || {},
    logBody
  );

  const response = await fetch(url, fetchOptions);

  // Try to parse response for logging
  const contentType = response.headers.get("content-type");
  let responseData;
  if (contentType?.includes("application/json")) {
    const clone = response.clone();
    try {
      responseData = await clone.json();
    } catch (e) {
      // Failed to parse, ignore
    }
  }

  logApiResponse(url, response.status, responseData);

  return response;
}
