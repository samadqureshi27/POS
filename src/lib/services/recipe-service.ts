// Recipe Service
import { buildHeaders } from "@/lib/util/service-helpers";
import { logError } from "@/lib/util/logger";
import { handleApiError, ParsedError } from "@/lib/util/error-handler";

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
  error?: ParsedError;
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
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'fetch recipes'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
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

      console.log("📋 RecipeService.listRecipes - Raw API response:", data);
      console.log("📋 RecipeService.listRecipes - Extracted recipes:", recipes);
      console.log("📋 RecipeService.listRecipes - Recipe count:", Array.isArray(recipes) ? recipes.length : 0);
      if (Array.isArray(recipes) && recipes.length > 0) {
        console.log("📋 RecipeService.listRecipes - First recipe:", recipes[0]);
        console.log("📋 RecipeService.listRecipes - Sub recipes:", recipes.filter((r: any) => r.type === "sub").length);
      }

      return {
        success: true,
        data: recipes,
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'fetch recipes');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  }

  /**
   * Get single recipe by ID with variants
   */
  static async getRecipe(id: string, includeVariants: boolean = true): Promise<ApiResponse<any>> {
    try {
      // Use the with-variants endpoint if variants are requested
      const url = includeVariants
        ? `/api/recipes/with-variants/${id}`
        : `/api/recipes/${id}`;

      console.log(`📖 Fetching recipe ${id} with includeVariants=${includeVariants} from ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'fetch recipe'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      // The with-variants endpoint returns: {status, message, result: {recipe, variants, count, page, limit}}
      let recipe = data;
      let variants = [];

      if (data.result) {
        recipe = data.result.recipe || data.result;
        variants = data.result.variants || [];
      } else if (data.data) {
        recipe = data.data.recipe || data.data;
        variants = data.data.variants || [];
      }

      console.log(`✅ Recipe fetched successfully. Variants count: ${variants.length}`);

      return {
        success: true,
        data: {
          recipe,
          variants: includeVariants ? variants : undefined,
        },
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'fetch recipe');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
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
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'create recipe'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      // Handle different API response structures
      let createdRecipe = data;
      if (data.result) {
        createdRecipe = data.result;
      } else if (data.data) {
        createdRecipe = data.data;
      }

      // If the response has recipe property (with-variants endpoint), extract just the recipe
      if (createdRecipe.recipe) {
        createdRecipe = createdRecipe.recipe;
      }

      return {
        success: true,
        data: createdRecipe,
        message: data.message || "Recipe created successfully",
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'create recipe');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
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
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'create recipe with variants'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      // Handle different API response structures
      let createdRecipe = data;
      if (data.result) {
        createdRecipe = data.result;
      } else if (data.data) {
        createdRecipe = data.data;
      }

      // If the response has recipe property (with-variants endpoint), extract just the recipe
      if (createdRecipe.recipe) {
        createdRecipe = createdRecipe.recipe;
      }

      return {
        success: true,
        data: createdRecipe,
        message: data.message || "Recipe with variants created successfully",
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'create recipe with variants');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  }

  /**
   * Update existing recipe with variants
   */
  static async updateRecipe(id: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    try {
      const isFinalRecipe = updates.type === "final";
      const hasVariations = updates.variations && updates.variations.length > 0;

      console.log(`🔄 Updating recipe ${id}`, {
        isFinalRecipe,
        hasVariations,
        variationsCount: hasVariations ? updates.variations?.length : 0,
        recipeType: updates.type,
      });

      // Always use with-variants endpoint for final recipes to ensure variants are properly handled
      const endpoint = isFinalRecipe
        ? `/api/recipes/with-variants/${id}`
        : `/api/recipes/${id}`;

      console.log(`📡 Using endpoint: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'update recipe'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      // Handle different API response structures
      let updatedRecipe = data;
      if (data.result) {
        updatedRecipe = data.result;
      } else if (data.data) {
        updatedRecipe = data.data;
      }

      // If the response has recipe property, extract just the recipe
      if (updatedRecipe.recipe) {
        updatedRecipe = updatedRecipe.recipe;
      }

      return {
        success: true,
        data: updatedRecipe,
        message: data.message || "Recipe updated successfully",
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'update recipe');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  }

  /**
   * Update recipe with variants using the dedicated endpoint
   */
  static async updateRecipeWithVariants(id: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    try {
      console.log(`🔄 Updating recipe with variants ${id}`, {
        variationsCount: updates.variations?.length || 0,
      });

      const response = await fetch(`/api/recipes/with-variants/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'update recipe with variants'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      // Handle different API response structures
      let updatedRecipe = data;
      if (data.result) {
        updatedRecipe = data.result;
      } else if (data.data) {
        updatedRecipe = data.data;
      }

      // If the response has recipe property, extract just the recipe
      if (updatedRecipe.recipe) {
        updatedRecipe = updatedRecipe.recipe;
      }

      return {
        success: true,
        data: updatedRecipe,
        message: data.message || "Recipe with variants updated successfully",
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'update recipe with variants');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  }

  /**
   * Update recipe with variants using the dedicated endpoint
   */
  static async updateRecipeWithVariants(id: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe>> {
    try {
      console.log(`🔄 Updating recipe with variants ${id}`, {
        variationsCount: updates.variations?.length || 0,
      });

      const response = await fetch(`/api/recipes/with-variants/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update recipe with variants",
        };
      }

      // Handle different API response structures
      let updatedRecipe = data;
      if (data.result) {
        updatedRecipe = data.result;
      } else if (data.data) {
        updatedRecipe = data.data;
      }

      // If the response has recipe property, extract just the recipe
      if (updatedRecipe.recipe) {
        updatedRecipe = updatedRecipe.recipe;
      }

      return {
        success: true,
        data: updatedRecipe,
        message: data.message || "Recipe with variants updated successfully",
      };
    } catch (error: any) {
      logError("Error updating recipe with variants", error, {
        component: "RecipeService",
        action: "updateRecipeWithVariants",
      });
      return {
        success: false,
        message: error.message || "Failed to update recipe with variants",
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
        const parsedError = handleApiError(
          { ...data, status: response.status },
          'delete recipe'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      return {
        success: true,
        message: data.message || "Recipe deleted successfully",
      };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'delete recipe');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  }
}
