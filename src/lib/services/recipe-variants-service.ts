// Recipe Variants Service using proper auth headers (similar to recipe-service)

import AuthService from "@/lib/auth-service";

export interface VariantIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
}

export interface RecipeVariant {
  _id?: string;
  recipeId: string;
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
    [key: string]: any;
  };
  isActive?: boolean;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

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
    [key: string]: any;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to get auth token
function getToken(): string | null {
  const t = AuthService.getToken();
  if (t) return t;
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      null
    );
  }
  return null;
}

// Helper function to get tenant info
function getTenantInfo(): { id: string | null; slug: string | null } {
  if (typeof window === "undefined") {
    return { id: null, slug: null };
  }
  const id = localStorage.getItem("tenant_id") || sessionStorage.getItem("tenant_id");
  const slug = localStorage.getItem("tenant_slug") || sessionStorage.getItem("tenant_slug");
  return { id, slug };
}

// Build headers with auth and tenant
function buildHeaders(includeContentType: boolean = true): HeadersInit {
  const token = getToken();
  const { id, slug } = getTenantInfo();

  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (id) headers["x-tenant-id"] = id;
  else if (slug) headers["x-tenant-id"] = slug;

  return headers;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export class RecipeVariantsService {
  /**
   * Get all recipe variants with pagination support
   */
  static async listVariants(params?: PaginationParams): Promise<PaginatedResponse<RecipeVariant>> {
    try {
      // Build query string with pagination params
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.sort) queryParams.append("sort", params.sort);
      if (params?.order) queryParams.append("order", params.order);

      const queryString = queryParams.toString();
      const url = `/api/recipe-variations${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch recipe variants",
        };
      }

      // Handle different API response structures
      let variants = data;
      let pagination = data.pagination || null;

      // If wrapped in a data property
      if (data.data) {
        variants = data.data;
      }

      // If it's a paginated response
      if (data.variants) {
        variants = data.variants;
      }

      // If response has items property
      if (data.items) {
        variants = data.items;
      }

      return {
        success: true,
        data: variants,
        pagination: pagination,
      };
    } catch (error: any) {
      console.error("Error fetching recipe variants:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch recipe variants",
      };
    }
  }

  /**
   * Get single recipe variant by ID
   */
  static async getVariant(id: string): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch(`/api/recipe-variations/${id}`, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch recipe variant",
        };
      }

      // Handle different API response structures
      let variant = data;

      // If wrapped in a result property (backend format)
      if (data.result) {
        variant = data.result;
      }
      // If wrapped in a data property
      else if (data.data) {
        variant = data.data;
      }

      return {
        success: true,
        data: variant,
      };
    } catch (error: any) {
      console.error("Error fetching recipe variant:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch recipe variant",
      };
    }
  }

  /**
   * Create a new recipe variant
   */
  static async createVariant(variantData: RecipeVariantFormData): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch("/api/recipe-variations", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(variantData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create recipe variant",
        };
      }

      // Handle different API response structures
      let variant = data;

      // If wrapped in a data property
      if (data.data) {
        variant = data.data;
      }

      return {
        success: true,
        data: variant,
        message: data.message || "Recipe variant created successfully",
      };
    } catch (error: any) {
      console.error("Error creating recipe variant:", error);
      return {
        success: false,
        message: error.message || "Failed to create recipe variant",
      };
    }
  }

  /**
   * Update an existing recipe variant
   */
  static async updateVariant(id: string, variantData: Partial<RecipeVariantFormData>): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch(`/api/recipe-variations/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(variantData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update recipe variant",
        };
      }

      // Handle different API response structures
      let variant = data;

      // If wrapped in a data property
      if (data.data) {
        variant = data.data;
      }

      return {
        success: true,
        data: variant,
        message: data.message || "Recipe variant updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating recipe variant:", error);
      return {
        success: false,
        message: error.message || "Failed to update recipe variant",
      };
    }
  }

  /**
   * Delete a recipe variant
   */
  static async deleteVariant(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/recipe-variations/${id}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete recipe variant",
        };
      }

      return {
        success: true,
        message: data.message || "Recipe variant deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting recipe variant:", error);
      return {
        success: false,
        message: error.message || "Failed to delete recipe variant",
      };
    }
  }

  /**
   * Get variants for a specific recipe
   */
  static async getVariantsByRecipeId(recipeId: string): Promise<ApiResponse<RecipeVariant[]>> {
    try {
      const response = await fetch(`/api/recipe-variations?recipeId=${recipeId}`, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch recipe variants",
        };
      }

      // Handle different API response structures
      let variants = data;

      // If wrapped in a data property
      if (data.data) {
        variants = data.data;
      }

      return {
        success: true,
        data: variants,
      };
    } catch (error: any) {
      console.error("Error fetching recipe variants:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch recipe variants",
      };
    }
  }
}
