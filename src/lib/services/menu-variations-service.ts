// Menu Variations Service - Links menu items to recipe variants
import { buildHeaders } from "@/lib/util/service-helpers";
import { logError } from "@/lib/util/logger";

// Menu Variation matching Postman API
export interface MenuVariation {
  _id?: string;
  id?: string;
  menuItemId: string;
  recipeVariantId: string;
  name: string;
  type: "size" | "addon" | "custom";
  priceDelta: number; // Price difference from base menu item price
  sizeMultiplier?: number;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuVariationPayload {
  menuItemId: string;
  recipeVariantId: string;
  name: string;
  type: "size" | "addon" | "custom";
  priceDelta: number;
  sizeMultiplier?: number;
  isDefault?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const VARIATIONS_BASE = "/t/menu/variations";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

export class MenuVariationsService {
  /**
   * Get all menu variations (optionally filter by menu item)
   */
  static async listVariations(menuItemId?: string): Promise<PaginatedResponse<MenuVariation>> {
    try {
      let url = buildUrl(VARIATIONS_BASE);
      if (menuItemId) {
        url += `?menuItemId=${encodeURIComponent(menuItemId)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch menu variations",
        };
      }

      // Handle different API response structures
      let variations = data.items || data.result || data.data || data;
      const pagination = data.pagination || null;

      return {
        success: true,
        data: Array.isArray(variations) ? variations : [variations],
        pagination,
      };
    } catch (error: any) {
      logError("Error fetching menu variations", error, {
        component: "MenuVariationsService",
        action: "listVariations",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch menu variations",
      };
    }
  }

  /**
   * Get single menu variation by ID
   */
  static async getVariation(id: string): Promise<ApiResponse<MenuVariation>> {
    try {
      const response = await fetch(buildUrl(`${VARIATIONS_BASE}/${id}`), {
        method: "GET",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch menu variation",
        };
      }

      const variation = data.result || data.data || data;

      return {
        success: true,
        data: variation,
      };
    } catch (error: any) {
      logError("Error fetching menu variation", error, {
        component: "MenuVariationsService",
        action: "getVariation",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch menu variation",
      };
    }
  }

  /**
   * Create a new menu variation
   */
  static async createVariation(payload: MenuVariationPayload): Promise<ApiResponse<MenuVariation>> {
    try {
      const response = await fetch(buildUrl(VARIATIONS_BASE), {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create menu variation",
        };
      }

      const variation = data.result || data.data || data;

      return {
        success: true,
        data: variation,
        message: data.message || "Menu variation created successfully",
      };
    } catch (error: any) {
      logError("Error creating menu variation", error, {
        component: "MenuVariationsService",
        action: "createVariation",
      });
      return {
        success: false,
        message: error.message || "Failed to create menu variation",
      };
    }
  }

  /**
   * Update an existing menu variation
   */
  static async updateVariation(id: string, payload: Partial<MenuVariationPayload>): Promise<ApiResponse<MenuVariation>> {
    try {
      const response = await fetch(buildUrl(`${VARIATIONS_BASE}/${id}`), {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update menu variation",
        };
      }

      const variation = data.result || data.data || data;

      return {
        success: true,
        data: variation,
        message: data.message || "Menu variation updated successfully",
      };
    } catch (error: any) {
      logError("Error updating menu variation", error, {
        component: "MenuVariationsService",
        action: "updateVariation",
      });
      return {
        success: false,
        message: error.message || "Failed to update menu variation",
      };
    }
  }

  /**
   * Delete a menu variation
   */
  static async deleteVariation(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(buildUrl(`${VARIATIONS_BASE}/${id}`), {
        method: "DELETE",
        headers: buildHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete menu variation",
        };
      }

      return {
        success: true,
        message: data.message || "Menu variation deleted successfully",
      };
    } catch (error: any) {
      logError("Error deleting menu variation", error, {
        component: "MenuVariationsService",
        action: "deleteVariation",
      });
      return {
        success: false,
        message: error.message || "Failed to delete menu variation",
      };
    }
  }
}
