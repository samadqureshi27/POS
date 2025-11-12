// types/menu.ts

// ===== MENU CATEGORY TYPES =====

export interface MenuCategory {
  _id?: string;
  name: string;
  slug: string;
  code: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  displayOrder: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategoryPayload {
  name: string;
  slug: string;
  code: string;
  description?: string;
  parentId?: string | null;
  isActive?: boolean;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

// ===== MENU ITEM TYPES =====

export interface MenuItem {
  _id?: string;
  name: string;
  slug: string;
  code: string;
  description?: string;
  categoryId: string;
  recipeId?: string;
  pricing: {
    basePrice: number;
    priceIncludesTax: boolean;
    currency: string;
  };
  isActive: boolean;
  displayOrder: number;
  tags?: string[];
  media?: MenuItemMedia[];
  branchIds?: string[];
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemMedia {
  url: string;
  alt?: string;
  type: string;
}

export interface MenuItemPayload {
  name: string;
  slug: string;
  code: string;
  description?: string;
  categoryId: string;
  recipeId?: string;
  pricing: {
    basePrice: number;
    priceIncludesTax?: boolean;
    currency?: string;
  };
  isActive?: boolean;
  displayOrder?: number;
  tags?: string[];
  media?: MenuItemMedia[];
  branchIds?: string[];
  metadata?: Record<string, any>;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// ===== FILTER & UI STATE TYPES =====

export interface CategoryFilterOptions {
  searchTerm: string;
  statusFilter: "" | "active" | "inactive";
  parentFilter: string; // parent category ID
}

export interface MenuItemFilterOptions {
  searchTerm: string;
  statusFilter: "" | "active" | "inactive";
  categoryFilter: string; // category ID
}

export interface ModalState<T> {
  isOpen: boolean;
  editingItem: T | null;
}

export interface LoadingState {
  loading: boolean;
  actionLoading: boolean;
}

// ===== FORM VALIDATION TYPES =====

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ToastMessage {
  message: string;
  type: "success" | "error";
}

// ===== CONSTANTS =====

export const MENU_STATUS = ["active", "inactive"] as const;
export type MenuStatus = typeof MENU_STATUS[number];

export const CURRENCY_OPTIONS = ["SAR", "USD", "EUR", "GBP"] as const;
export type Currency = typeof CURRENCY_OPTIONS[number];

// ===== DISPLAY/UI TYPES =====

export interface MenuCategoryOption {
  ID: string;
  Name: string;
  Code: string;
  Status: "Active" | "Inactive";
  Description: string;
  ParentCategory?: string;
  DisplayOrder: number;
  _raw?: MenuCategory; // Store raw data for editing
}

export interface MenuItemOption {
  ID: string;
  Name: string;
  Slug?: string;
  Code: string;
  Status: "Active" | "Inactive";
  Description: string;
  Category: string;
  CategoryId: string;
  Recipe?: string;
  RecipeId?: string;
  BasePrice: number;
  Currency: string;
  PriceIncludesTax: boolean;
  Tags: string[];
  DisplayOrder: number;
  ImageUrl?: string;
  _raw?: MenuItem; // Store raw data for editing
}
