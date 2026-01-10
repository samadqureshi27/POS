/**
 * Common Types - Shared Across All Modules
 *
 * This file contains type definitions used across multiple modules to eliminate duplication.
 * Instead of defining ApiResponse in 22 different files, we define it once here.
 *
 * Production Best Practice: DRY (Don't Repeat Yourself) principle for types
 */

/**
 * Standard API Response wrapper
 * Used by all API calls to maintain consistent response structure
 *
 * @template T - The type of data being returned
 *
 * @example
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: 1, name: "John" },
 *   message: "User fetched successfully"
 * }
 */
export interface ApiResponse<T> {
  /** Whether the API call was successful */
  success: boolean;

  /** The payload data (type varies by endpoint) */
  data?: T;

  /** Optional message (success or error description) */
  message?: string;
}

/**
 * Paginated API Response
 * Extends ApiResponse to include pagination metadata
 *
 * @template T - The type of items in the paginated list
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Common Status Type
 * Used across multiple entities (Staff, Branch, Payment, etc.)
 */
export type Status = "Active" | "Inactive";

/**
 * Alternative lowercase status (used by some entities like POS)
 */
export type StatusLowercase = "active" | "inactive";

/**
 * Toast/Notification Message State
 * Used for temporary user feedback
 */
export interface ToastState {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

/**
 * Generic Entity with ID
 * Base interface for entities that have an ID field
 */
export interface WithId {
  ID: string | number;
}

/**
 * Generic Entity with Branch Association
 * Base interface for entities belonging to a branch
 */
export interface WithBranchId {
  Branch_ID_fk: string | number;
}

/**
 * Generic Entity with Status
 * Base interface for entities that can be active/inactive
 */
export interface WithStatus {
  Status: Status;
}

/**
 * Generic Entity with Timestamps
 * Base interface for entities with created/updated timestamps
 */
export interface WithTimestamps {
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Generic CRUD Entity
 * Combines common fields for most database entities
 */
export interface BaseEntity extends WithId, WithBranchId, WithStatus, WithTimestamps {}

/**
 * Form Validation Error
 * Standard structure for form validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Form Validation Result
 * Result of form validation containing errors if any
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Generic Filter Options
 * Common filter pattern used across list views
 */
export interface FilterOptions {
  searchTerm?: string;
  statusFilter?: Status | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Generic Modal State
 * Common state structure for modal dialogs
 */
export interface ModalState<T = any> {
  isOpen: boolean;
  editingItem: T | null;
}

/**
 * Generic Selection State
 * For managing multi-select in tables
 */
export interface SelectionState {
  selectedItems: (string | number)[];
  isAllSelected: boolean;
}

/**
 * Generic Loading State
 * Standard loading indicators
 */
export interface LoadingState {
  loading: boolean;
  actionLoading: boolean;
}
