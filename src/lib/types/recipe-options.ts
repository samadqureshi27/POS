// lib/types/recipe-options.ts
// All recipe-related types in one file

// Base RecipeOption interface that matches your existing components
export interface RecipeOption {
  ID: number;
  Name: string;
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

// Form data type
export type RecipeFormData = Omit<RecipeOption, "ID">;

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

// For API and filtering
export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  difficulty?: string;
}

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

export type DisplayFilterType = "all" | "active" | "inactive" | string;

// Page component props
export interface RecipePageProps {
  items: RecipeOption[];
  selectedItems: number[];
  searchTerm: string;
  displayFilter: string;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onEditItem: (item: RecipeOption) => void;
}

// Modal props
export interface RecipeModalProps {
  isOpen: boolean;
  editingItem?: RecipeOption | null;
  onClose: () => void;
  onSubmit: (data: Omit<RecipeOption, "ID">) => void;
  actionLoading?: boolean;
}

// API response types
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