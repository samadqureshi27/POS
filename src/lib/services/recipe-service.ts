// Recipe Service
import { buildHeaders } from "@/lib/util/service-helpers";
import { logError } from "@/lib/util/logger";

export interface Recipe {
  _id?: string;
  id?: string;
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
}

export class RecipeService {
  /**
   * Get all recipes
   */
  static async listRecipes(): Promise<ApiResponse<Recipe[]>> {
    try {
      const response = await fetch("/api/recipes", {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch recipes",
        };
      }

      // Handle different API response structures
      let recipes = data;

      // If wrapped in a data property
      if (data.data) {
        recipes = data.data;
      }

      // If it's a paginated response
      if (data.recipes) {
        recipes = data.recipes;
      }

      // If response has items property
      if (data.items) {
        recipes = data.items;
      }

      return {
        success: true,
        data: recipes,
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
      let url = `/api/recipes/${id}`;
      if (includeVariants) {
        url += `?withVariants=1&activeOnly=true&page=1&limit=50`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch recipe",
        };
      }

      // The new endpoint returns: {status, message, result: {recipe, variants, count, page, limit}}
      let recipe = data;
      let variants = [];

      if (data.result) {
        recipe = data.result.recipe || data.result;
        variants = data.result.variants || [];
      } else if (data.data) {
        recipe = data.data.recipe || data.data;
        variants = data.data.variants || [];
      }

      return {
        success: true,
        data: {
          recipe,
          variants: includeVariants ? variants : undefined,
        },
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
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(recipe),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create recipe",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Recipe created successfully",
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
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update recipe",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Recipe updated successfully",
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
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete recipe",
        };
      }

      return {
        success: true,
        message: data.message || "Recipe deleted successfully",
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
