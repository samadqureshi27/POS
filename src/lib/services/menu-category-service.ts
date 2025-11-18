// Menu Category Service

import { MenuCategory, MenuCategoryPayload, ApiResponse } from "@/lib/types/menu";
import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

export class MenuCategoryService {
  /**
   * Get all menu categories
   */
  static async listCategories(params?: {
    q?: string;
    parentId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }): Promise<ApiResponse<MenuCategory[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.q) queryParams.append("q", params.q);
      if (params?.parentId) queryParams.append("parentId", params.parentId);
      if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.sort) queryParams.append("sort", params.sort);
      if (params?.order) queryParams.append("order", params.order);

      const queryString = queryParams.toString();
      const path = `/menu/categories${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<MenuCategory[]>(response);

      // Handle different API response structures
      let categories = normalized.data;
      if (response.items) {
        categories = response.items;
      } else if (response.categories) {
        categories = response.categories;
      }

      return {
        success: normalized.success,
        data: categories,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching menu categories", error, {
        component: "MenuCategoryService",
        action: "listCategories",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch menu categories",
      };
    }
  }

  /**
   * Get single menu category by ID
   */
  static async getCategory(id: string): Promise<ApiResponse<MenuCategory>> {
    try {
      const response = await api.get(`/menu/categories/${id}`);
      const normalized = normalizeApiResponse<MenuCategory>(response);

      // Handle different API response structures
      let category = normalized.data;
      if (response.result) {
        category = response.result;
      }

      return {
        success: normalized.success,
        data: category,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching menu category", error, {
        component: "MenuCategoryService",
        action: "getCategory",
        categoryId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to fetch menu category",
      };
    }
  }

  /**
   * Create new menu category
   */
  static async createCategory(category: MenuCategoryPayload): Promise<ApiResponse<MenuCategory>> {
    try {
      const response = await api.post("/menu/categories", category);
      const normalized = normalizeApiResponse<MenuCategory>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Menu category created successfully",
      };
    } catch (error: any) {
      logError("Error creating menu category", error, {
        component: "MenuCategoryService",
        action: "createCategory",
      });
      return {
        success: false,
        message: error.message || "Failed to create menu category",
      };
    }
  }

  /**
   * Update existing menu category
   */
  static async updateCategory(id: string, updates: Partial<MenuCategoryPayload>): Promise<ApiResponse<MenuCategory>> {
    try {
      const response = await api.put(`/menu/categories/${id}`, updates);
      const normalized = normalizeApiResponse<MenuCategory>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Menu category updated successfully",
      };
    } catch (error: any) {
      logError("Error updating menu category", error, {
        component: "MenuCategoryService",
        action: "updateCategory",
        categoryId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update menu category",
      };
    }
  }

  /**
   * Delete menu category
   */
  static async deleteCategory(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/menu/categories/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Menu category deleted successfully",
      };
    } catch (error: any) {
      logError("Error deleting menu category", error, {
        component: "MenuCategoryService",
        action: "deleteCategory",
        categoryId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to delete menu category",
      };
    }
  }
}
