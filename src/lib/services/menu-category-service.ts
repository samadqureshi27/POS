// Menu Category Service
import { MenuCategory, MenuCategoryPayload, ApiResponse } from "@/lib/types/menu";
import { buildHeaders } from "@/lib/util/service-helpers";
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
      const url = `/api/menu/categories${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch menu categories",
        };
      }

      // Handle different API response structures
      let categories = data;

      // If wrapped in a data property
      if (data.data) {
        categories = data.data;
      }

      // If it's a paginated response
      if (data.categories) {
        categories = data.categories;
      }

      // If response has items property
      if (data.items) {
        categories = data.items;
      }

      return {
        success: true,
        data: categories,
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
      const response = await fetch(`/api/menu/categories/${id}`, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch menu category",
        };
      }

      // Handle different API response structures
      let category = data;

      // If wrapped in result property
      if (data.result) {
        category = data.result;
      }
      // If wrapped in data property
      else if (data.data) {
        category = data.data;
      }

      return {
        success: true,
        data: category,
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
      const response = await fetch("/api/menu/categories", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(category),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create menu category",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Menu category created successfully",
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
      const response = await fetch(`/api/menu/categories/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update menu category",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Menu category updated successfully",
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
      const response = await fetch(`/api/menu/categories/${id}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete menu category",
        };
      }

      return {
        success: true,
        message: data.message || "Menu category deleted successfully",
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
