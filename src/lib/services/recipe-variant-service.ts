// Recipe Variant Service using proxy-helpers (similar to recipe-service)

import AuthService from "@/lib/auth-service";
import { RecipeVariant, RecipeVariantIngredient, RecipeVariantPayload } from "@/lib/types/recipe-options";

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

export class RecipeVariantService {
  /**
   * Get all recipe variants
   */
  static async listRecipeVariants(): Promise<ApiResponse<RecipeVariant[]>> {
    try {
      const response = await fetch("/api/recipe-variants", {
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
      const response = await fetch(`/api/recipe-variants?recipeId=${recipeId}`, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch recipe variants for recipe",
        };
      }

      // Handle different API response structures
      let variants = data;

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
      const response = await fetch(`/api/recipe-variants/${id}`, {
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

      // If wrapped in result property
      if (data.result) {
        variant = data.result;
      }
      // If wrapped in data property
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
   * Create new recipe variant
   */
  static async createRecipeVariant(variant: RecipeVariantPayload): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch("/api/recipe-variants", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(variant),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create recipe variant",
        };
      }

      return {
        success: true,
        data: data.data || data,
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
   * Update existing recipe variant
   */
  static async updateRecipeVariant(id: string, updates: Partial<RecipeVariantPayload>): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch(`/api/recipe-variants/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update recipe variant",
        };
      }

      return {
        success: true,
        data: data.data || data,
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
   * Delete recipe variant
   */
  static async deleteRecipeVariant(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/recipe-variants/${id}`, {
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