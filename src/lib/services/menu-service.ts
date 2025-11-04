// Menu Item Service

import AuthService from "@/lib/auth-service";
import { MenuItem, MenuItemPayload, ApiResponse } from "@/lib/types/menu";

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
      const url = `/api/menu/items${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();
      console.log("🔍 MenuService.listMenuItems - Raw API response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch menu items",
        };
      }

      // Handle different API response structures
      let items = data;

      // If wrapped in a data property
      if (data.data) {
        items = data.data;
      }

      // If it's a paginated response
      if (data.items) {
        items = data.items;
      }

      // If response has menuItems property
      if (data.menuItems) {
        items = data.menuItems;
      }

      console.log("✅ MenuService.listMenuItems - Extracted items:", Array.isArray(items) ? items.length : typeof items);

      return {
        success: true,
        data: items,
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
      const response = await fetch(`/api/menu/items/${id}`, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();
      console.log("🔍 MenuService.getMenuItem - Raw API response:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch menu item",
        };
      }

      // Handle different API response structures
      let item = data;

      // If wrapped in result property
      if (data.result) {
        item = data.result;
      }
      // If wrapped in data property
      else if (data.data) {
        item = data.data;
      }

      console.log("✅ MenuService.getMenuItem - Extracted item:", item);

      return {
        success: true,
        data: item,
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
      const response = await fetch("/api/menu/items", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(item),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create menu item",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Menu item created successfully",
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
      const response = await fetch(`/api/menu/items/${id}`, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update menu item",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Menu item updated successfully",
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
      const response = await fetch(`/api/menu/items/${id}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete menu item",
        };
      }

      return {
        success: true,
        message: data.message || "Menu item deleted successfully",
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
