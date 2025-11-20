/**
 * Application Constants
 *
 * Centralized location for all magic numbers, strings, and configuration values.
 * This eliminates "magic numbers" scattered throughout the codebase and makes
 * configuration changes easier.
 */

/**
 * ============================================================================
 * BUSINESS CONFIGURATION
 * ============================================================================
 */

export const BUSINESS_CONFIG = {
  /** Default timezone for the application */
  DEFAULT_TIMEZONE: "Asia/Karachi",

  /** Default currency code */
  DEFAULT_CURRENCY: "PKR",

  /** Currency symbol */
  CURRENCY_SYMBOL: "₨",

  /** Date format for display */
  DATE_FORMAT: "DD/MM/YYYY",

  /** Time format for display */
  TIME_FORMAT: "HH:mm:ss",

  /** DateTime format for display */
  DATETIME_FORMAT: "DD/MM/YYYY HH:mm:ss",
} as const;

/**
 * ============================================================================
 * API CONFIGURATION
 * ============================================================================
 */

export const API_CONFIG = {
  /** Default request timeout in milliseconds */
  REQUEST_TIMEOUT: 30000, // 30 seconds

  /** Default retry delay in milliseconds */
  RETRY_DELAY: 1000, // 1 second

  /** Maximum number of retry attempts */
  MAX_RETRIES: 3,

  /** HTTP status codes that should trigger a retry */
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],

  /** Debounce delay for search inputs (milliseconds) */
  SEARCH_DEBOUNCE_DELAY: 300,

  /** Throttle delay for frequent operations (milliseconds) */
  THROTTLE_DELAY: 100,
} as const;

/**
 * ============================================================================
 * PAGINATION & LIMITS
 * ============================================================================
 */

export const PAGINATION = {
  /** Default page size for list views */
  DEFAULT_PAGE_SIZE: 20,

  /** Maximum items per page */
  MAX_PAGE_SIZE: 100,

  /** Page size options for dropdowns */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,

  /** Default items per page for grid views */
  GRID_PAGE_SIZE: 21,
} as const;

/**
 * ============================================================================
 * VALIDATION LIMITS
 * ============================================================================
 */

export const VALIDATION_LIMITS = {
  /** Maximum length for short text fields (name, title) */
  SHORT_TEXT_MAX: 200,

  /** Maximum length for medium text fields (description) */
  MEDIUM_TEXT_MAX: 500,

  /** Maximum length for long text fields (detailed description) */
  LONG_TEXT_MAX: 1000,

  /** Minimum password length */
  PASSWORD_MIN_LENGTH: 6,

  /** Maximum password length */
  PASSWORD_MAX_LENGTH: 128,

  /** Maximum email length */
  EMAIL_MAX_LENGTH: 255,

  /** Maximum file size for uploads (bytes) - 10MB */
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  /** Allowed image file types */
  ALLOWED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const,

  /** Allowed document file types */
  ALLOWED_DOCUMENT_TYPES: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'] as const,
} as const;

/**
 * ============================================================================
 * AUTHENTICATION & SECURITY
 * ============================================================================
 */

export const AUTH_CONFIG = {
  /** Access token expiry time (milliseconds) - 1 hour */
  ACCESS_TOKEN_EXPIRY: 60 * 60 * 1000,

  /** Refresh token expiry time (milliseconds) - 7 days */
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,

  /** Session timeout (milliseconds) - 30 minutes of inactivity */
  SESSION_TIMEOUT: 30 * 60 * 1000,

  /** Password reset link expiry (milliseconds) - 1 hour */
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000,

  /** OTP expiry time (milliseconds) - 5 minutes */
  OTP_EXPIRY: 5 * 60 * 1000,

  /** Maximum login attempts before lockout */
  MAX_LOGIN_ATTEMPTS: 5,

  /** Lockout duration after max attempts (milliseconds) - 15 minutes */
  LOCKOUT_DURATION: 15 * 60 * 1000,
} as const;

/**
 * ============================================================================
 * UI/UX CONSTANTS
 * ============================================================================
 */

export const UI_CONFIG = {
  /** Toast notification duration (milliseconds) */
  TOAST_DURATION: 3000,

  /** Toast success duration (milliseconds) */
  TOAST_SUCCESS_DURATION: 2000,

  /** Toast error duration (milliseconds) */
  TOAST_ERROR_DURATION: 4000,

  /** Modal animation duration (milliseconds) */
  MODAL_ANIMATION_DURATION: 300,

  /** Loading state minimum display time (milliseconds) */
  MIN_LOADING_TIME: 300,

  /** Skeleton loader count for lists */
  SKELETON_ITEM_COUNT: 5,

  /** Skeleton loader count for dashboard cards */
  SKELETON_CARD_COUNT: 8,
} as const;

/**
 * ============================================================================
 * BREAKPOINTS (Tailwind defaults for reference)
 * ============================================================================
 */

export const BREAKPOINTS = {
  /** Small devices (640px) */
  SM: 640,

  /** Medium devices (768px) */
  MD: 768,

  /** Large devices (1024px) */
  LG: 1024,

  /** Extra large devices (1280px) */
  XL: 1280,

  /** 2XL devices (1536px) */
  '2XL': 1536,
} as const;

/**
 * ============================================================================
 * DATA FORMATTING
 * ============================================================================
 */

export const FORMAT_CONFIG = {
  /** Decimal places for currency */
  CURRENCY_DECIMAL_PLACES: 2,

  /** Decimal places for percentages */
  PERCENTAGE_DECIMAL_PLACES: 1,

  /** Decimal places for quantities */
  QUANTITY_DECIMAL_PLACES: 2,

  /** Large number abbreviation threshold (e.g., 1000 → 1K) */
  LARGE_NUMBER_THRESHOLD: 1000,

  /** Maximum items to show in dropdown before scroll */
  MAX_DROPDOWN_ITEMS: 10,
} as const;

/**
 * ============================================================================
 * INVENTORY & STOCK MANAGEMENT
 * ============================================================================
 */

export const INVENTORY_CONFIG = {
  /** Low stock threshold percentage */
  LOW_STOCK_THRESHOLD: 20,

  /** Critical stock threshold percentage */
  CRITICAL_STOCK_THRESHOLD: 10,

  /** Days before expiry to show warning */
  EXPIRY_WARNING_DAYS: 7,

  /** Days before expiry to show critical alert */
  EXPIRY_CRITICAL_DAYS: 3,

  /** Default reorder point */
  DEFAULT_REORDER_POINT: 10,

  /** Default reorder quantity */
  DEFAULT_REORDER_QUANTITY: 50,
} as const;

/**
 * ============================================================================
 * STORAGE KEYS (LocalStorage/SessionStorage)
 * ============================================================================
 */

export const STORAGE_KEYS = {
  /** Authentication tokens */
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',

  /** User data */
  USER_DATA: 'user',
  USER_PREFERENCES: 'userPreferences',

  /** Tenant information */
  TENANT_ID: 'tenant_id',
  TENANT_SLUG: 'tenant_slug',

  /** UI state */
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarState',
  VIEW_MODE: 'viewMode',

  /** Cached data */
  CACHED_CATEGORIES: 'cachedCategories',
  CACHED_MENU_ITEMS: 'cachedMenuItems',

  /** Session data */
  LAST_ACTIVITY: 'lastActivity',
  SESSION_ID: 'sessionId',
} as const;

/**
 * ============================================================================
 * ERROR MESSAGES (Centralized error strings)
 * ============================================================================
 */

export const ERROR_MESSAGES = {
  /** Generic errors */
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',

  /** Auth errors */
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',

  /** Validation errors */
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',

  /** Data errors */
  NOT_FOUND: 'The requested resource was not found.',
  DUPLICATE_ENTRY: 'This item already exists.',
  DELETE_FAILED: 'Failed to delete item. Please try again.',
  UPDATE_FAILED: 'Failed to update item. Please try again.',
  CREATE_FAILED: 'Failed to create item. Please try again.',
} as const;

/**
 * ============================================================================
 * SUCCESS MESSAGES (Centralized success strings)
 * ============================================================================
 */

export const SUCCESS_MESSAGES = {
  /** Generic success */
  SAVED: 'Saved successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  CREATED: 'Created successfully!',

  /** Auth success */
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
  PASSWORD_CHANGED: 'Password changed successfully!',

  /** Data operations */
  IMPORT_SUCCESS: 'Import completed successfully!',
  EXPORT_SUCCESS: 'Export completed successfully!',
  SYNC_SUCCESS: 'Data synced successfully!',
} as const;

/**
 * ============================================================================
 * ORDER & TRANSACTION STATUS
 * ============================================================================
 */

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'Cash',
  CARD: 'Card',
  ONLINE: 'Online',
  WALLET: 'Wallet',
} as const;

/**
 * ============================================================================
 * ROLES & PERMISSIONS
 * ============================================================================
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  STAFF: 'staff',
  CUSTOMER: 'customer',
} as const;

/**
 * ============================================================================
 * TYPE EXPORTS (for TypeScript type safety)
 * ============================================================================
 */

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];