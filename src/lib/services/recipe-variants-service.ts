// Recipe Variants Service (Paginated)

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";
import type {
  RecipeVariant,
  RecipeVariantFormData,
  VariantIngredient,
} from "@/lib/types/recipe-variants";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
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
      logError("Error fetching recipe variants", error, {
        component: "RecipeVariantsService",
        action: "listVariants",
      });
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
      logError("Error fetching recipe variant", error, {
        component: "RecipeVariantsService",
        action: "getVariant",
      });
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
      logError("Error creating recipe variant", error, {
        component: "RecipeVariantsService",
        action: "createVariant",
      });
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
      logError("Error updating recipe variant", error, {
        component: "RecipeVariantsService",
        action: "updateVariant",
      });
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
      logError("Error deleting recipe variant", error, {
        component: "RecipeVariantsService",
        action: "deleteVariant",
      });
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
      logError("Error fetching recipe variants", error, {
        component: "RecipeVariantsService",
        action: "getVariantsByRecipeId",
        recipeId,
      });
      return {
        success: false,
        message: error.message || "Failed to fetch recipe variants",
      };
    }
  }
}
