// Recipe Variant Service using proxy-helpers (similar to recipe-service)

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { RecipeVariant, RecipeVariantIngredient, RecipeVariantPayload } from "@/lib/types/recipe-options";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class RecipeVariantService {
  /**
   * Get all recipe variants
   */
  static async listRecipeVariants(): Promise<ApiResponse<RecipeVariant[]>> {
    try {
      const response = await api.get("/api/recipe-variants");
      const normalized = normalizeApiResponse<RecipeVariant[]>(response);

      // Handle different API response structures
      let variants = normalized.data;
      if (response.variants) {
        variants = response.variants;
      } else if (response.items) {
        variants = response.items;
      }

      return {
        success: normalized.success,
        data: variants,
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
   * Get recipe variants for a specific recipe
   */
  static async listVariantsForRecipe(recipeId: string): Promise<ApiResponse<RecipeVariant[]>> {
    try {
      const response = await api.get(`/api/recipe-variants?recipeId=${recipeId}`);
      const normalized = normalizeApiResponse<RecipeVariant[]>(response);

      // Handle different API response structures
      let variants = normalized.data;
      if (response.variants) {
        variants = response.variants;
      } else if (response.items) {
        variants = response.items;
      }

      return {
        success: normalized.success,
        data: variants,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error fetching recipe variants for recipe:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch recipe variants for recipe",
      };
    }
  }

  /**
   * Get single recipe variant by ID
   */
  static async getRecipeVariant(id: string): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await api.get(`/api/recipe-variants/${id}`);
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
   * Create new recipe variant
   */
  static async createRecipeVariant(variant: RecipeVariantPayload): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await api.post("/api/recipe-variants", variant);
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
   * Update existing recipe variant
   */
  static async updateRecipeVariant(id: string, updates: Partial<RecipeVariantPayload>): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await api.put(`/api/recipe-variants/${id}`, updates);
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
   * Delete recipe variant
   */
  static async deleteRecipeVariant(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/recipe-variants/${id}`);
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
   * Delete multiple recipe variants
   */
  static async deleteMultipleRecipeVariants(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const deletePromises = ids.map(id => this.deleteRecipeVariant(id));
      const results = await Promise.all(deletePromises);
      
      const failedDeletes = results.filter(result => !result.success);
      
      if (failedDeletes.length > 0) {
        return {
          success: false,
          message: `Failed to delete ${failedDeletes.length} recipe variant(s)`,
        };
      }

      return {
        success: true,
        message: `Successfully deleted ${ids.length} recipe variant(s)`,
      };
    } catch (error: any) {
      console.error("Error deleting multiple recipe variants:", error);
      return {
        success: false,
        message: error.message || "Failed to delete recipe variants",
      };
    }
  }
}