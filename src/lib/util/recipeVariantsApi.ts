// lib/util/recipeVariantsApi.ts
// Recipe Variants API Service

import {
  RecipeVariant,
  RecipeVariantFormData,
  ApiResponse,
  PaginatedResponse,
  VariantFilterOptions,
} from '../types/recipe-variants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3297';
const TENANT = 'demo-tenant'; // This should come from auth context in production

/**
 * Recipe Variants API Service
 * Implements all endpoints from the Postman collection
 */
export class RecipeVariantsApiService {
  private static instance: RecipeVariantsApiService;
  private baseUrl: string;

  constructor(baseUrl: string = `${API_BASE_URL}/t/recipe-variants`) {
    this.baseUrl = baseUrl;
  }

  static getInstance(): RecipeVariantsApiService {
    if (!RecipeVariantsApiService.instance) {
      RecipeVariantsApiService.instance = new RecipeVariantsApiService();
    }
    return RecipeVariantsApiService.instance;
  }

  /**
   * Get all recipe variants with optional filtering and pagination
   * GET /t/recipe-variants
   */
  async getRecipeVariants(
    filters?: VariantFilterOptions
  ): Promise<PaginatedResponse<RecipeVariant>> {
    try {
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.order) params.append('order', filters.order);
      if (filters?.recipeId) params.append('recipeId', filters.recipeId);

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recipe variants: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('Error fetching recipe variants:', error);
      throw error;
    }
  }

  /**
   * Get a single recipe variant by ID
   * GET /t/recipe-variants/:id
   */
  async getRecipeVariantById(id: string): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recipe variant: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('Error fetching recipe variant:', error);
      throw error;
    }
  }

  /**
   * Get all variants for a specific recipe
   * GET /t/recipe-variants?recipeId={recipeId}
   */
  async getVariantsByRecipeId(recipeId: string): Promise<ApiResponse<RecipeVariant[]>> {
    try {
      const response = await fetch(`${this.baseUrl}?recipeId=${recipeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch variants for recipe: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('Error fetching variants by recipe:', error);
      throw error;
    }
  }

  /**
   * Create a new recipe variant
   * POST /t/recipe-variants
   */
  async createRecipeVariant(
    variantData: RecipeVariantFormData
  ): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variantData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create recipe variant: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Recipe variant created successfully',
      };
    } catch (error) {
      console.error('Error creating recipe variant:', error);
      throw error;
    }
  }

  /**
   * Update an existing recipe variant
   * PUT /t/recipe-variants/:id
   */
  async updateRecipeVariant(
    id: string,
    variantData: Partial<RecipeVariantFormData>
  ): Promise<ApiResponse<RecipeVariant>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variantData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update recipe variant: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Recipe variant updated successfully',
      };
    } catch (error) {
      console.error('Error updating recipe variant:', error);
      throw error;
    }
  }

  /**
   * Delete a recipe variant
   * DELETE /t/recipe-variants/:id
   */
  async deleteRecipeVariant(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete recipe variant: ${response.statusText}`);
      }

      return {
        success: true,
        data: undefined as any,
        message: 'Recipe variant deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting recipe variant:', error);
      throw error;
    }
  }
}

// Create default instance for easy import
const RecipeVariantsAPI = {
  getRecipeVariants: (filters?: VariantFilterOptions) =>
    RecipeVariantsApiService.getInstance().getRecipeVariants(filters),
  getRecipeVariantById: (id: string) =>
    RecipeVariantsApiService.getInstance().getRecipeVariantById(id),
  getVariantsByRecipeId: (recipeId: string) =>
    RecipeVariantsApiService.getInstance().getVariantsByRecipeId(recipeId),
  createRecipeVariant: (variantData: RecipeVariantFormData) =>
    RecipeVariantsApiService.getInstance().createRecipeVariant(variantData),
  updateRecipeVariant: (id: string, variantData: Partial<RecipeVariantFormData>) =>
    RecipeVariantsApiService.getInstance().updateRecipeVariant(id, variantData),
  deleteRecipeVariant: (id: string) =>
    RecipeVariantsApiService.getInstance().deleteRecipeVariant(id),
};

export default RecipeVariantsAPI;
