// types/ingredients.ts

export interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Threshold: number;
  Priority: number;
  backendId?: string; // Actual backend ID from API (_id or id)
  // Backend-aligned optional fields
  sku?: string;
  uom?: string; // e.g., g, l, pc
  costPerUom?: number;
}

export interface InventoryItemWithUsage extends InventoryItem {
  usageCount: number;
}

export interface ToastMessage {
  message: string;
  type: "success" | "error";
}

export interface FilterOptions {
  searchTerm: string;
  statusFilter: "" | "Active" | "Inactive";
  unitFilter: string;
}

export interface ModalState {
  isOpen: boolean;
  editItem: InventoryItem | null;
  formData: InventoryItem;
}

export interface SelectionState {
  selectedItems: string[];
  isAllSelected: boolean;
}

export interface LoadingState {
  loading: boolean;
  actionLoading: boolean;
}

// API Response types (for future API integration)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form validation types
export interface ValidationError {
  field: keyof InventoryItem;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Constants
export const INGREDIENT_UNITS = [
  "Kilograms (Kg's)",
  "Grams (g)",
  "Liters (L)",
  "Milliliters (mL)",
  "Pieces",
  "Dozens",
  "Pounds (lbs)",
  "Ounces (oz)",
  "Cups",
  "Tablespoons",
  "Teaspoons"
] as const;

export const INGREDIENT_STATUS = ["Active", "Inactive"] as const;

export type IngredientUnit = typeof INGREDIENT_UNITS[number];
export type IngredientStatus = typeof INGREDIENT_STATUS[number];