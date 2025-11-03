// lib/types/recipe-variants.ts
// Recipe Variant types based on API structure

// Ingredient structure for variants
export interface VariantIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
}

// Recipe Variant interface matching API structure
export interface RecipeVariant {
  _id?: string;
  recipeId: string | string[]; // Support both single and multiple recipes
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  crustType?: string;
  ingredients: VariantIngredient[];
  metadata?: {
    menuDisplayName?: string;
    availability?: string[];
    appliesTo?: string[]; // List of recipe IDs this variant applies to
    [key: string]: any;
  };
  isActive?: boolean;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

// For display in the UI
export interface RecipeVariantDisplay extends RecipeVariant {
  ID?: number; // For compatibility with existing UI components
  Name?: string; // For compatibility
  Status?: "Active" | "Inactive"; // For compatibility
}

// Form data type for creating/updating variants
export interface RecipeVariantFormData {
  recipeId: string | string[]; // Can be single string or array of recipe IDs
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  crustType?: string;
  ingredients: VariantIngredient[];
  metadata?: {
    menuDisplayName?: string;
    availability?: string[];
    appliesTo?: string[]; // List of recipe IDs
    [key: string]: any;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter options
export interface VariantFilterOptions {
  recipeId?: string;
  type?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// For hook return type
export interface UseRecipeVariantsReturn {
  items: RecipeVariant[];
  recipes: any[]; // Available recipes for selection
  ingredients: any[]; // Available inventory items
  loading: boolean;
  actionLoading: boolean;
  searchTerm: string;
  typeFilter: string;
  isModalOpen: boolean;
  editingItem: RecipeVariant | null;

  // Actions
  updateSearchTerm: (term: string) => void;
  updateTypeFilter: (filter: string) => void;
  openAddModal: () => void;
  openEditModal: (item: RecipeVariant) => void;
  closeModal: () => void;
  handleModalSubmit: (data: RecipeVariantFormData) => Promise<{ success: boolean }>;
  handleDelete: (id: string) => Promise<void>;
}
