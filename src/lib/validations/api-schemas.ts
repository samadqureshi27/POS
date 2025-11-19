/**
 * API Request Validation Schemas using Zod
 *
 * These schemas validate incoming requests to API routes before processing.
 * This prevents invalid or malicious data from reaching the backend.
 *
 * INDUSTRY BEST PRACTICES:
 * - Validate all user input at the API boundary
 * - Provide clear, actionable error messages
 * - Use type-safe schemas that match TypeScript interfaces
 * - Sanitize and normalize data during validation
 */

import { z } from 'zod';
import { VALIDATION_LIMITS } from '@/lib/constants';

// =============================================================================
// AUTHENTICATION SCHEMAS
// =============================================================================

/**
 * Login Request Schema
 * Validates email/password login requests
 */
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, 'Email is too long')
    .transform(email => email.toLowerCase().trim()),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION_LIMITS.PASSWORD_MAX_LENGTH, 'Password is too long'),

  posId: z.string().nullable().optional(),
  defaultBranchId: z.string().nullable().optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * PIN Login Request Schema
 * Validates PIN-based authentication
 */
export const PinLoginRequestSchema = z.object({
  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN must be at most 6 digits')
    .regex(/^\d+$/, 'PIN must contain only numbers'),

  role: z
    .enum(['manager', 'cashier', 'waiter'])
    .optional(),
});

export type PinLoginRequest = z.infer<typeof PinLoginRequestSchema>;

/**
 * Forgot Password Request Schema
 */
export const ForgotPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform(email => email.toLowerCase().trim()),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

/**
 * Reset Password Request Schema
 */
export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(VALIDATION_LIMITS.PASSWORD_MAX_LENGTH, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

/**
 * Token Refresh Request Schema
 */
export const RefreshTokenRequestSchema = z.object({
  refresh: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

// =============================================================================
// USER MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Create Staff Request Schema
 */
export const CreateStaffRequestSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, dashes, and underscores')
    .transform(username => username.toLowerCase().trim()),

  email: z
    .string()
    .email('Invalid email format')
    .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, 'Email is too long')
    .transform(email => email.toLowerCase().trim())
    .optional(),

  role: z.enum(['manager', 'cashier', 'waiter']),

  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN must be at most 6 digits')
    .regex(/^\d+$/, 'PIN must contain only numbers'),
});

export type CreateStaffRequest = z.infer<typeof CreateStaffRequestSchema>;

/**
 * Update User PIN Schema
 */
export const UpdatePinRequestSchema = z.object({
  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN must be at most 6 digits')
    .regex(/^\d+$/, 'PIN must contain only numbers'),
});

export type UpdatePinRequest = z.infer<typeof UpdatePinRequestSchema>;

/**
 * Reset User Password Schema
 */
export const ResetUserPasswordRequestSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(VALIDATION_LIMITS.PASSWORD_MAX_LENGTH, 'Password is too long'),
});

export type ResetUserPasswordRequest = z.infer<typeof ResetUserPasswordRequestSchema>;

// =============================================================================
// BRANCH MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Create/Update Branch Schema
 */
export const BranchRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'Branch name is required')
    .max(100, 'Branch name is too long')
    .transform(name => name.trim()),

  address: z
    .string()
    .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, 'Address is too long')
    .optional(),

  phone: z
    .string()
    .regex(/^[0-9+\-() ]+$/, 'Invalid phone number format')
    .max(20, 'Phone number is too long')
    .optional(),

  email: z
    .string()
    .email('Invalid email format')
    .optional(),

  timezone: z
    .string()
    .default('Asia/Karachi'),

  currency: z
    .string()
    .length(3, 'Currency code must be 3 characters (e.g., USD, PKR)')
    .default('PKR'),

  isActive: z
    .boolean()
    .default(true),
});

export type BranchRequest = z.infer<typeof BranchRequestSchema>;

// =============================================================================
// INVENTORY SCHEMAS
// =============================================================================

/**
 * Create/Update Inventory Item Schema
 */
export const InventoryItemRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(VALIDATION_LIMITS.SHORT_TEXT_MAX, 'Item name is too long')
    .transform(name => name.trim()),

  sku: z
    .string()
    .max(50, 'SKU is too long')
    .optional(),

  category: z
    .string()
    .optional(),

  unit: z
    .string()
    .min(1, 'Unit is required'),

  quantity: z
    .number()
    .min(0, 'Quantity cannot be negative')
    .default(0),

  minQuantity: z
    .number()
    .min(0, 'Minimum quantity cannot be negative')
    .default(0),

  cost: z
    .number()
    .min(0, 'Cost cannot be negative')
    .default(0),

  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .optional(),

  supplier: z
    .string()
    .optional(),

  description: z
    .string()
    .max(VALIDATION_LIMITS.LONG_TEXT_MAX, 'Description is too long')
    .optional(),
});

export type InventoryItemRequest = z.infer<typeof InventoryItemRequestSchema>;

// =============================================================================
// MENU SCHEMAS
// =============================================================================

/**
 * Create/Update Menu Item Schema
 */
export const MenuItemRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(VALIDATION_LIMITS.SHORT_TEXT_MAX, 'Item name is too long')
    .transform(name => name.trim()),

  description: z
    .string()
    .max(VALIDATION_LIMITS.LONG_TEXT_MAX, 'Description is too long')
    .optional(),

  category: z
    .string()
    .optional(),

  price: z
    .number()
    .min(0, 'Price cannot be negative'),

  cost: z
    .number()
    .min(0, 'Cost cannot be negative')
    .optional(),

  image: z
    .string()
    .url('Invalid image URL')
    .optional(),

  isAvailable: z
    .boolean()
    .default(true),

  preparationTime: z
    .number()
    .min(0, 'Preparation time cannot be negative')
    .optional(),

  calories: z
    .number()
    .min(0, 'Calories cannot be negative')
    .optional(),

  allergens: z
    .array(z.string())
    .optional(),

  tags: z
    .array(z.string())
    .optional(),
});

export type MenuItemRequest = z.infer<typeof MenuItemRequestSchema>;

/**
 * Create/Update Menu Category Schema
 */
export const MenuCategoryRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name is too long')
    .transform(name => name.trim()),

  description: z
    .string()
    .max(VALIDATION_LIMITS.MEDIUM_TEXT_MAX, 'Description is too long')
    .optional(),

  displayOrder: z
    .number()
    .int('Display order must be an integer')
    .min(0, 'Display order cannot be negative')
    .optional(),

  isActive: z
    .boolean()
    .default(true),

  image: z
    .string()
    .url('Invalid image URL')
    .optional(),
});

export type MenuCategoryRequest = z.infer<typeof MenuCategoryRequestSchema>;

// =============================================================================
// PAGINATION & FILTERING SCHEMAS
// =============================================================================

/**
 * Common Pagination Schema
 */
export const PaginationSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).default(1))
    .optional(),

  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100).default(20))
    .optional(),

  sortBy: z
    .string()
    .optional(),

  sortOrder: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional(),

  search: z
    .string()
    .max(100, 'Search query is too long')
    .optional(),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate request body against a Zod schema
 * Returns validated data or throws a validation error
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors into a user-friendly format
      const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new Error(JSON.stringify({
        error: 'Validation failed',
        errors: formattedErrors,
      }));
    }
    throw error;
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}
