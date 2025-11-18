// Recipe Variants Service using proper auth headers (similar to recipe-service)

import { api, normalizeApiResponse } from "@/lib/util/api-client";

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
      const path = `/api/recipe-variations${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<RecipeVariant[]>(response);

      // Handle different API response structures
      let variants = normalized.data;
      let pagination = response.pagination || null;

      if (response.variants) {
        variants = response.variants;
      } else if (response.items) {
        variants = response.items;
      }

      return {
        success: normalized.success,
        data: variants,
        pagination: pagination,
        message: normalized.message,
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
      const response = await api.get(`/api/recipe-variations/${id}`);
      const normalized = normalizeApiResponse<RecipeVariant>(response);

      // Handle different API response structures
      let variant = normalized.data;
      if (response.result) {
        variant = response.result;
      }

      return {
        success: normalized.success,
        data: variant,
        message: normalized.message,
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
      const response = await api.post("/api/recipe-variations", variantData);
      const normalized = normalizeApiResponse<RecipeVariant>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Recipe variant created successfully",
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
      const response = await api.put(`/api/recipe-variations/${id}`, variantData);
      const normalized = normalizeApiResponse<RecipeVariant>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Recipe variant updated successfully",
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
      const response = await api.delete(`/api/recipe-variations/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Recipe variant deleted successfully",
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
      const response = await api.get(`/api/recipe-variations?recipeId=${recipeId}`);
      const normalized = normalizeApiResponse<RecipeVariant[]>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
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
