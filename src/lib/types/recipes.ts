// types/recipes.ts

export interface RecipeOption {
  ID: number;
  _id?: string; // MongoDB ID for API operations
  Name: string;
  name?: string; // Lowercase for compatibility
  Status: "Active" | "Inactive";
  Description: string; // Make required instead of optional
  Category?: string;
  Price?: number;
  price?: number; // Lowercase for compatibility
  PrepTime?: number;
  CookTime?: number;
  Servings?: number;
  Difficulty?: "Easy" | "Medium" | "Hard";
  Instructions?: string;
  ImageUrl?: string;
  OptionValue: string[]; // Keep as string, not string[]
  OptionPrice: number[];
  IngredientValue: string[];
  IngredientPrice: number[];
  Priority: number;
  type?: "sub" | "final"; // Recipe type (sub/final)
  totalCost?: number; // Total cost for display
  ingredients?: any[]; // Lowercase for display compatibility
  Ingredients?: RecipeIngredient[];
}

export interface Ingredient {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Threshold: number;
  Priority: number;
}

export interface RecipeIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot?: string;
  quantity: number;
  unit: string;
  costPerUnit?: number; // Cost per unit for this ingredient
  convertToUnit?: string;
  notes?: string;
  // Legacy fields for backwards compatibility
  ingredientId?: string;
}

export interface ToastMessage {
  message: string;
  type: "success" | "error";
}

export interface FilterOptions {
  searchTerm: string;
  statusFilter: "" | "Active" | "Inactive";
  categoryFilter: string;
}

export interface ModalState {
  isOpen: boolean;
  editingItem: RecipeOption | null;
}

export interface SelectionState {
  selectedItems: number[];
  isAllSelected: boolean;
}

export interface LoadingState {
  loading: boolean;
  actionLoading: boolean;
}

// API Response types
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
  field: keyof RecipeOption;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Constants
export const RECIPE_STATUS = ["Active", "Inactive"] as const;
export const RECIPE_DIFFICULTY = ["Easy", "Medium", "Hard"] as const;

export const RECIPE_CATEGORIES = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Beverages",
  "Salads",
  "Soups",
  "Sides",
  "Snacks"
] as const;

export type RecipeStatus = typeof RECIPE_STATUS[number];
export type RecipeDifficulty = typeof RECIPE_DIFFICULTY[number];
export type RecipeCategory = typeof RECIPE_CATEGORIES[number];

// Variant types for inline creation - matching Postman API
export interface RecipeVariantInline {
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "addon" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  ingredients?: RecipeIngredient[];
  isActive: boolean;
  crustType?: string;
  _id?: string; // For editing existing variants
  id?: string;
}

// Recipe creation/update payload - use the same structure as RecipeOption without ID
export interface RecipePayload extends Omit<RecipeOption, "ID"> {
  variations?: RecipeVariantInline[]; // Support inline variants
}