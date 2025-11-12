// lib/types/recipe-options.ts
// All recipe-related types in one file

// Recipe Variant Ingredient interface based on API structure
export interface RecipeVariantIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
}

// Recipe Variant Metadata interface
export interface RecipeVariantMetadata {
  menuDisplayName?: string;
  availability?: string[];
}

// Main Recipe Variant interface based on API structure
export interface RecipeVariant {
  _id?: string;
  ID?: number;
  recipeId: string;
  recipeName?: string;        // For display purposes
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  crustType?: string;
  ingredients: RecipeVariantIngredient[];
  metadata?: RecipeVariantMetadata;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy RecipeOption interface for backward compatibility
export interface RecipeOption {
  ID: number;
  _id?: string;               // MongoDB ID for API operations
  Name: string;
  name?: string;              // Lowercase name for compatibility
  Status: string;
  Description?: string;
  Category?: string;
  price: number;              // Your table expects lowercase 'price'
  PrepTime?: number;
  CookTime?: number;
  Servings?: number;
  Difficulty?: string;
  Instructions?: string;
  OptionValue: string;
  OptionPrice: number;
  IngredientValue: string;
  IngredientPrice: number;
  Priority?: number;
  Price?: number;             // Add uppercase Price for compatibility if needed
  type?: string;              // Recipe type (sub/final)
  totalCost?: number;         // Total cost for display
  Ingredients?: Array<{
    ingredientId: string;
    quantity: number;
    unit: string;
    notes?: string;
  }>;
}

// Toast state interface
export interface ToastState {
  message: string;
  type: "success" | "error";
}

// Form data types
export type RecipeFormData = Omit<RecipeOption, "ID">;
export type RecipeVariantFormData = Omit<RecipeVariant, "_id" | "ID" | "createdAt" | "updatedAt">;

// Display filter types
export type DisplayFilterType = "all" | "size" | "flavor" | "crust" | "custom" | "active" | "inactive" | string;

// For useRecipeOptions hook
export interface UseRecipeOptionsReturn {
  items: RecipeOption[];
  loading: boolean;
  error: string | null;
  selectedItems: number[];
  searchTerm: string;
  displayFilter: string;
  editingItem: RecipeOption | null;
  isModalOpen: boolean;
  actionLoading: boolean;
  toast: ToastState | null;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setDisplayFilter: (filter: string) => void;
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (itemId: number, checked: boolean) => void;
  handleAddNew: () => void;
  handleEdit: (item: RecipeOption) => void;
  handleDelete: () => void;
  handleModalClose: () => void;
  handleModalSubmit: (data: RecipeFormData) => void;
  dismissToast: () => void;
}

// For useRecipeVariants hook
export interface UseRecipeVariantsReturn {
  items: RecipeVariant[];
  loading: boolean;
  error: string | null;
  selectedItems: string[];  // Changed to string[] for _id
  searchTerm: string;
  displayFilter: string;
  editingItem: RecipeVariant | null;
  isModalOpen: boolean;
  actionLoading: boolean;
  toast: ToastState | null;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setDisplayFilter: (filter: string) => void;
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (itemId: string, checked: boolean) => void;
  handleAddNew: () => void;
  handleEdit: (item: RecipeVariant) => void;
  handleDelete: () => void;
  handleModalClose: () => void;
  handleModalSubmit: (data: RecipeVariantFormData) => void;
  dismissToast: () => void;
}

// For API and filtering
export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  difficulty?: string;
  type?: string;        // Added for Recipe Variant filtering
  recipeId?: string;    // Added for filtering by recipe
}

// API Payload interfaces
export interface RecipePayload {
  Name: string;
  Status: string;
  Description?: string;
  Category?: string;
  Price: number;              // API expects uppercase Price
  PrepTime?: number;
  CookTime?: number;
  Servings?: number;
  Difficulty?: string;
  Instructions?: string;
  OptionValue: string;
  OptionPrice: number;
  IngredientValue: string;
  IngredientPrice: number;
  Priority?: number;
  Ingredients?: Array<{
    ingredientId: string;
    quantity: number;
    unit: string;
    notes?: string;
  }>;
}

export interface RecipeVariantPayload {
  recipeId: string;
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  crustType?: string;
  ingredients: RecipeVariantIngredient[];
  metadata?: RecipeVariantMetadata;
}

// Page Props interfaces
export interface RecipePageProps {
  items: RecipeOption[];
  selectedItems: number[];
  searchTerm: string;
  displayFilter: string;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onEditItem: (item: RecipeOption) => void;
}

export interface RecipeVariantPageProps {
  items: RecipeVariant[];
  selectedItems: string[];
  searchTerm: string;
  displayFilter: string;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onEditItem: (item: RecipeVariant) => void;
}

// Modal Props interfaces
export interface RecipeModalProps {
  isOpen: boolean;
  editingItem?: RecipeOption | null;
  onClose: () => void;
  onSubmit: (data: RecipeFormData) => void;
  loading?: boolean;
}

export interface RecipeVariantModalProps {
  isOpen: boolean;
  editingItem?: RecipeVariant | null;
  onClose: () => void;
  onSubmit: (data: RecipeVariantFormData) => void;
  loading?: boolean;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
}