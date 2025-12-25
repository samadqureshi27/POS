// Recipe Service
import { buildHeaders } from "@/lib/util/service-helpers";
import { logError } from "@/lib/util/logger";

// Recipe Ingredient structure matching Postman API
export interface RecipeIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot?: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
  convertToUnit?: string;
}

// Recipe Variant structure for inline creation
export interface RecipeVariantInline {
  name: string;
  description?: string;
  type: "size" | "flavor" | "crust" | "addon" | "custom";
  sizeMultiplier?: number;
  baseCostAdjustment?: number;
  ingredients?: RecipeIngredient[];
  isActive: boolean;
  crustType?: string;
}

export interface Recipe {
  _id?: string;
  id?: string;
  name: string;
  type: "sub" | "final";
  description?: string;
  isActive?: boolean;
  ingredients?: RecipeIngredient[];
  yield?: number; // How many portions/units this recipe produces
  totalCost?: number;
  variations?: RecipeVariantInline[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipePayload {
  name: string;
  type: "sub" | "final";
  description?: string;
  isActive?: boolean;
  ingredients?: RecipeIngredient[];
  yield?: number;
  variations?: RecipeVariantInline[]; // Support inline variants
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
   * Create new recipe (with optional variants)
   */
  static async createRecipe(recipe: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    try {
      // Use with-variants endpoint if variations are provided
      const hasVariations = recipe.variations && recipe.variations.length > 0;
      const endpoint = hasVariations ? "/api/recipes/with-variants" : "/api/recipes";

      const response = await fetch(endpoint, {
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
   * Create recipe with variants using the dedicated endpoint
   */
  static async createRecipeWithVariants(recipe: Partial<Recipe>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/recipes/with-variants", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(recipe),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create recipe with variants",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Recipe with variants created successfully",
      };
    } catch (error: any) {
      logError("Error creating recipe with variants", error, {
        component: "RecipeService",
        action: "createRecipeWithVariants",
      });
      return {
        success: false,
        message: error.message || "Failed to create recipe with variants",
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
