// Recipe Service

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

export interface RecipeIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot?: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  type?: "sub" | "final";
  isActive?: boolean;
  ingredients?: any[];
  instructions?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

export interface RecipePayload {
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  ingredients?: any[];
  instructions?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export class RecipeService {
  /**
   * Get all recipes
   */
  static async listRecipes(): Promise<ApiResponse<Recipe[]>> {
    try {
      const response = await api.get("/api/recipes");
      const normalized = normalizeApiResponse<Recipe[]>(response);

      // Handle different API response structures
      let recipes = normalized.data;
      if (response.recipes) {
        recipes = response.recipes;
      } else if (response.items) {
        recipes = response.items;
      }

      return {
        success: normalized.success,
        data: recipes,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching recipes", error, {
        component: "RecipeService",
        action: "listRecipes",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch recipes",
      };
    }
  }

  /**
   * Get single recipe by ID with variants
   */
  static async getRecipe(id: string, includeVariants: boolean = true): Promise<ApiResponse<any>> {
    try {
      // Use the new /with-variants endpoint if variants are requested
      let path = `/api/recipes/${id}`;
      if (includeVariants) {
        path += `?withVariants=1&activeOnly=true&page=1&limit=50`;
      }

      const response = await api.get(path);
      const normalized = normalizeApiResponse<any>(response);

      // The new endpoint returns: {status, message, result: {recipe, variants, count, page, limit}}
      let recipe = normalized.data;
      let variants = [];

      if (response.result) {
        recipe = response.result.recipe || response.result;
        variants = response.result.variants || [];
      } else if (response.data) {
        recipe = response.data.recipe || response.data;
        variants = response.data.variants || [];
      }

      return {
        success: normalized.success,
        data: {
          recipe,
          variants: includeVariants ? variants : undefined,
        },
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching recipe", error, {
        component: "RecipeService",
        action: "getRecipe",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch recipe",
      };
    }
  }

  /**
   * Create new recipe
   */
  static async createRecipe(recipe: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.post("/api/recipes", recipe);
      const normalized = normalizeApiResponse<Recipe>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Recipe created successfully",
      };
    } catch (error: any) {
      logError("Error creating recipe", error, {
        component: "RecipeService",
        action: "createRecipe",
      });
      return {
        success: false,
        message: error.message || "Failed to create recipe",
      };
    }
  }

  /**
   * Update existing recipe
   */
  static async updateRecipe(id: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.put(`/api/recipes/${id}`, updates);
      const normalized = normalizeApiResponse<Recipe>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Recipe updated successfully",
      };
    } catch (error: any) {
      logError("Error updating recipe", error, {
        component: "RecipeService",
        action: "updateRecipe",
      });
      return {
        success: false,
        message: error.message || "Failed to update recipe",
      };
    }
  }

  /**
   * Delete recipe
   */
  static async deleteRecipe(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/recipes/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Recipe deleted successfully",
      };
    } catch (error: any) {
      logError("Error deleting recipe", error, {
        component: "RecipeService",
        action: "deleteRecipe",
      });
      return {
        success: false,
        message: error.message || "Failed to delete recipe",
      };
    }
  }
}
