// Menu Item Service

import { MenuItem, MenuItemPayload, ApiResponse } from "@/lib/types/menu";
import { api, normalizeApiResponse } from "@/lib/util/api-client";

export class MenuService {
  /**
   * Get all menu items
   */
  static async listMenuItems(params?: {
    q?: string;
    categoryId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }): Promise<ApiResponse<MenuItem[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.q) queryParams.append("q", params.q);
      if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
      if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.sort) queryParams.append("sort", params.sort);
      if (params?.order) queryParams.append("order", params.order);

      const queryString = queryParams.toString();
      const path = `/menu/items${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<MenuItem[]>(response);

      // Handle different API response structures for items
      let items = normalized.data;
      if (response.items) {
        items = response.items;
      } else if (response.menuItems) {
        items = response.menuItems;
      }

      return {
        success: normalized.success,
        data: items,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error fetching menu items:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch menu items",
      };
    }
  }

  /**
   * Get single menu item by ID
   */
  static async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.get(`/menu/items/${id}`);
      const normalized = normalizeApiResponse<MenuItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error fetching menu item:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch menu item",
      };
    }
  }

  /**
   * Create new menu item
   */
  static async createMenuItem(item: MenuItemPayload): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.post("/menu/items", item);
      const normalized = normalizeApiResponse<MenuItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Menu item created successfully",
      };
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      return {
        success: false,
        message: error.message || "Failed to create menu item",
      };
    }
  }

  /**
   * Update existing menu item
   */
  static async updateMenuItem(id: string, updates: Partial<MenuItemPayload>): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.put(`/menu/items/${id}`, updates);
      const normalized = normalizeApiResponse<MenuItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Menu item updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating menu item:", error);
      return {
        success: false,
        message: error.message || "Failed to update menu item",
      };
    }
  }

  /**
   * Delete menu item
   */
  static async deleteMenuItem(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/menu/items/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Menu item deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      return {
        success: false,
        message: error.message || "Failed to delete menu item",
      };
    }
  }
}
