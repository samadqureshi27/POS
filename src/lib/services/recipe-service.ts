// Real Recipe Service using proxy-helpers (similar to inventory-service)

import AuthService from "@/lib/auth-service";

export interface RecipeIngredient {
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot?: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id?: string;
  name: string;
  type: "sub" | "final";
  description?: string;
  ingredients: RecipeIngredient[];
  isActive?: boolean;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
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
      console.error("Error fetching recipes:", error);
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
      console.error("Error fetching recipe:", error);
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
      console.error("Error creating recipe:", error);
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
      console.error("Error updating recipe:", error);
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
      console.error("Error deleting recipe:", error);
      return {
        success: false,
        message: error.message || "Failed to delete recipe",
      };
    }
  }
}
