/**
 * Centralized API Client Utility
 *
 * This provides a standardized way to make API calls across all services
 * with consistent header handling, error handling, and token management.
 *
 * INDUSTRY BEST PRACTICES:
 * - Single source of truth for API configuration
 * - Consistent error handling
 * - Automatic token injection
 * - Retry logic for transient failures
 * - Type-safe responses
 */

import { getAccessToken } from './token-manager';
import { API_CONFIG } from '@/lib/constants';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '';
const USE_API_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || 'true').toLowerCase() === 'true';

/**
 * Get tenant information from localStorage or environment
 */
function getTenantInfo(): { id: string | null; slug: string | null } {
  if (typeof window === 'undefined') {
    return {
      id: process.env.NEXT_PUBLIC_TENANT_ID || null,
      slug: process.env.NEXT_PUBLIC_TENANT_SLUG || null,
    };
  }

  return {
    id: localStorage.getItem('tenant_id') || process.env.NEXT_PUBLIC_TENANT_ID || null,
    slug: localStorage.getItem('tenant_slug') || process.env.NEXT_PUBLIC_TENANT_SLUG || null,
  };
}

/**
 * Build standardized headers for API requests
 * This is the SINGLE source of truth for headers across all services
 */
export function buildApiHeaders(includeContentType = true): HeadersInit {
  const headers: HeadersInit = {};

  // Content-Type header (JSON by default)
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  // Authentication token
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Tenant identification headers
  const { id, slug } = getTenantInfo();
  if (slug) {
    headers['x-tenant-id'] = slug;  // API expects x-tenant-id with slug value
  }
  if (id) {
    headers['x-tenant-uuid'] = id;  // Some endpoints may use UUID
  }

  return headers;
}

/**
 * Build the complete API URL
 * Handles proxy mode vs direct API access
 */
export function buildApiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (USE_API_PROXY) {
    // Use Next.js API proxy
    return `/api${normalizedPath}`;
  }

  // Direct access to backend API
  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Standard API error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Parse API response and handle errors consistently
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    const errorData = isJson ? await response.json() : await response.text();
    const errorMessage = typeof errorData === 'object'
      ? errorData.message || errorData.error || 'API request failed'
      : errorData || 'API request failed';

    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (isJson) {
    return await response.json();
  }

  // For non-JSON responses (like CSV exports), return text
  return await response.text() as unknown as T;
}

/**
 * Retry configuration for failed requests
 */
interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryOn?: readonly number[]; // HTTP status codes to retry on
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: API_CONFIG.MAX_RETRIES,
  retryDelay: API_CONFIG.RETRY_DELAY,
  retryOn: API_CONFIG.RETRY_STATUS_CODES,
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main API client function with retry logic
 */
export async function apiClient<T = any>(
  path: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  const url = buildApiUrl(path);
  const headers = buildApiHeaders();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= (config.maxRetries || 0); attempt++) {
    try {
      const response = await fetch(url, requestOptions);

      // Check if we should retry based on status code
      if (!response.ok && config.retryOn?.includes(response.status) && attempt < (config.maxRetries || 0)) {
        lastError = new ApiError(response.status, `HTTP ${response.status}`, null);
        await sleep((config.retryDelay || API_CONFIG.RETRY_DELAY) * Math.pow(2, attempt)); // Exponential backoff
        continue;
      }

      return await handleApiResponse<T>(response);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on network errors if we've exhausted retries
      if (attempt >= (config.maxRetries || 0)) {
        break;
      }

      // Wait before retrying
      await sleep((config.retryDelay || API_CONFIG.RETRY_DELAY) * Math.pow(2, attempt));
    }
  }

  // If we get here, all retries failed
  throw lastError || new Error('Request failed after retries');
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(path: string, options?: RequestInit) =>
    apiClient<T>(path, { ...options, method: 'GET' }),

  post: <T = any>(path: string, data?: any, options?: RequestInit) =>
    apiClient<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(path: string, data?: any, options?: RequestInit) =>
    apiClient<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(path: string, data?: any, options?: RequestInit) =>
    apiClient<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(path: string, options?: RequestInit) =>
    apiClient<T>(path, { ...options, method: 'DELETE' }),
};

/**
 * Type-safe API response wrapper
 * Use this for consistent API response handling
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any;
  result?: any; // Backend sometimes uses 'result' instead of 'data'
}

/**
 * Normalize backend responses to a consistent format
 * Handles various response structures from the backend
 */
export function normalizeApiResponse<T>(response: any): ApiResponse<T> {
  // If response already has success field, use it
  if ('success' in response) {
    return {
      success: response.success,
      data: response.data || response.result,
      message: response.message,
      error: response.error,
      errors: response.errors,
    };
  }

  // If response has result field (common backend pattern)
  if ('result' in response) {
    return {
      success: true,
      data: response.result,
      message: response.message,
    };
  }

  // If response has status field
  if ('status' in response) {
    return {
      success: response.status === 'success' || response.status === true,
      data: response.data || response.result,
      message: response.message,
    };
  }

  // Assume success if we got here
  return {
    success: true,
    data: response,
  };
}
