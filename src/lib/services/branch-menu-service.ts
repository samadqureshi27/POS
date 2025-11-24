// src/lib/services/branch-menu-service.ts

import { buildHeaders } from "@/lib/util/service-helpers";
import { logError } from "@/lib/util/logger";

// ==================== Types ====================

export interface BranchMenuConfig {
  _id?: string;
  id?: string;
  branchId: string;
  menuItemId: string;
  isAvailable: boolean;
  isVisibleInPOS: boolean;
  isVisibleInOnline: boolean;
  sellingPrice?: number;
  priceIncludesTax?: boolean;
  displayOrder?: number;
  isFeatured?: boolean;
  isRecommended?: boolean;
  labels?: string[];
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface EffectiveMenuItem {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category?: string;
  categoryId?: string;
  basePrice: number;
  currency?: string;
  status?: string;
  imageUrl?: string;
  tags?: string[];
  recipe?: string;
  // Branch-specific overrides
  branchConfig?: BranchMenuConfig;
  effectivePrice?: number;
  isAvailableInBranch?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  items?: T;
  result?: T;
}

// ==================== Configuration ====================

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

// ==================== Branch Menu Service ====================

export const BranchMenuService = {
  // Get effective branch menu (merged menu with overrides)
  async getEffectiveMenu(params: {
    branchId: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<EffectiveMenuItem[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('branchId', params.branchId);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = buildUrl(`/t/branch-menu/effective${queryString ? `?${queryString}` : ''}`);

      console.log("📤 Fetching effective menu:", { url, branchId: params.branchId });

      const res = await fetch(url, { headers: buildHeaders() });
      const data = await res.json().catch(() => ({}));

      console.log("📥 Effective menu response:", { status: res.status, ok: res.ok, data });

      if (!res.ok) {
        return { success: false, message: data?.message || `Get effective menu failed (${res.status})` };
      }

      // Extract items from various possible response structures
      let rawItems: any[] = data?.items ?? data?.result ?? data?.data ?? data ?? [];

      // Ensure items is always an array
      if (!Array.isArray(rawItems)) {
        console.warn("⚠️ API response is not an array, wrapping in array:", rawItems);
        rawItems = [];
      }

      // Transform API response to EffectiveMenuItem format
      const items: EffectiveMenuItem[] = rawItems.map((item: any) => {
        // Extract menuItem details
        const menuItem = item.menuItem || {};
        const pricing = menuItem.pricing || {};
        const category = menuItem.category || {};
        const effective = item.effective || {};

        return {
          _id: menuItem.id || menuItem._id || item.menuItemId,
          id: menuItem.id || menuItem._id || item.menuItemId,
          name: menuItem.name || "Unnamed Item",
          description: menuItem.description || "",
          category: category.name || "",
          categoryId: category._id || category.id || "",
          basePrice: pricing.basePrice || 0,
          currency: pricing.currency || "USD",
          status: menuItem.isActive ? "active" : "inactive",
          imageUrl: menuItem.imageUrl || menuItem.image?.url || "",
          tags: menuItem.tags || [],
          recipe: menuItem.recipe || "",
          // Branch config (null/undefined if not assigned to this branch)
          // Keep it explicitly undefined if branchConfig is null or doesn't exist
          branchConfig: (item.branchConfig && typeof item.branchConfig === 'object' && Object.keys(item.branchConfig).length > 0) ? {
            _id: item.branchConfig._id || item.branchConfig.id,
            id: item.branchConfig.id || item.branchConfig._id,
            branchId: item.branchId,
            menuItemId: item.menuItemId,
            isAvailable: item.branchConfig.isAvailable ?? effective.isAvailable ?? true,
            isVisibleInPOS: item.branchConfig.isVisibleInPOS ?? effective.isVisibleInPOS ?? true,
            isVisibleInOnline: item.branchConfig.isVisibleInOnline ?? effective.isVisibleInOnline ?? true,
            sellingPrice: item.branchConfig.sellingPrice ?? effective.price ?? pricing.basePrice,
            priceIncludesTax: item.branchConfig.priceIncludesTax ?? effective.priceIncludesTax ?? pricing.priceIncludesTax ?? false,
            displayOrder: item.branchConfig.displayOrder ?? effective.displayOrder ?? 0,
            isFeatured: item.branchConfig.isFeatured ?? false,
            isRecommended: item.branchConfig.isRecommended ?? false,
            labels: item.branchConfig.labels || [],
            metadata: item.branchConfig.metadata || {},
            createdAt: item.branchConfig.createdAt,
            updatedAt: item.branchConfig.updatedAt,
          } : undefined,
          effectivePrice: effective.price ?? pricing.basePrice ?? 0,
          isAvailableInBranch: effective.isAvailable ?? true,
        };
      });

      console.log("✅ Transformed", items.length, "menu items");
      console.log("First 2 items:", items.slice(0, 2).map(i => ({
        name: i.name,
        hasBranchConfig: !!i.branchConfig,
        branchConfig: i.branchConfig,
      })));

      return { success: true, data: items };
    } catch (error: any) {
      logError("Error getting effective branch menu", error, {
        component: "BranchMenuService",
        action: "getEffectiveMenu",
      });
      return { success: false, message: error.message };
    }
  },

  // List branch menu configs (raw configurations)
  async listConfigs(params: {
    branchId: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<BranchMenuConfig[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('branchId', params.branchId);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = buildUrl(`/t/branch-menu${queryString ? `?${queryString}` : ''}`);

      const res = await fetch(url, { headers: buildHeaders() });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || `List configs failed (${res.status})` };
      }

      // Extract items from various possible response structures
      let items: BranchMenuConfig[] = data?.items ?? data?.result ?? data?.data ?? data ?? [];

      // Ensure items is always an array
      if (!Array.isArray(items)) {
        console.warn("⚠️ API response is not an array, wrapping in array:", items);
        items = [];
      }

      return { success: true, data: items };
    } catch (error: any) {
      logError("Error listing branch menu configs", error, {
        component: "BranchMenuService",
        action: "listConfigs",
      });
      return { success: false, message: error.message };
    }
  },

  // Create or upsert branch menu config
  async createConfig(payload: Partial<BranchMenuConfig>): Promise<ApiResponse<BranchMenuConfig>> {
    try {
      const url = buildUrl(`/t/branch-menu`);

      const apiPayload: any = {
        branchId: payload.branchId,
        menuItemId: payload.menuItemId,
        isAvailable: payload.isAvailable ?? true,
        isVisibleInPOS: payload.isVisibleInPOS ?? true,
        isVisibleInOnline: payload.isVisibleInOnline ?? true,
      };

      // Optional fields
      if (payload.sellingPrice !== undefined) apiPayload.sellingPrice = payload.sellingPrice;
      if (payload.priceIncludesTax !== undefined) apiPayload.priceIncludesTax = payload.priceIncludesTax;
      if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;
      if (payload.isFeatured !== undefined) apiPayload.isFeatured = payload.isFeatured;
      if (payload.isRecommended !== undefined) apiPayload.isRecommended = payload.isRecommended;
      if (payload.labels !== undefined) apiPayload.labels = payload.labels;
      if (payload.metadata !== undefined) apiPayload.metadata = payload.metadata;

      console.log("📤 Creating branch menu config with payload:", apiPayload);

      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("❌ API Error Response:", data);
        return { success: false, message: data?.message || data?.error?.message || `Create config failed (${res.status})` };
      }

      console.log("✅ Successfully created branch menu config:", data);

      const item: BranchMenuConfig = data?.result ?? data?.data ?? data;

      return { success: true, data: item };
    } catch (error: any) {
      logError("Error creating branch menu config", error, {
        component: "BranchMenuService",
        action: "createConfig",
      });
      return { success: false, message: error.message };
    }
  },

  // Update branch menu config
  async updateConfig(id: string, payload: Partial<BranchMenuConfig>): Promise<ApiResponse<BranchMenuConfig>> {
    try {
      const url = buildUrl(`/t/branch-menu/${id}`);

      const apiPayload: any = {};
      if (payload.isAvailable !== undefined) apiPayload.isAvailable = payload.isAvailable;
      if (payload.isVisibleInPOS !== undefined) apiPayload.isVisibleInPOS = payload.isVisibleInPOS;
      if (payload.isVisibleInOnline !== undefined) apiPayload.isVisibleInOnline = payload.isVisibleInOnline;
      if (payload.sellingPrice !== undefined) apiPayload.sellingPrice = payload.sellingPrice;
      if (payload.priceIncludesTax !== undefined) apiPayload.priceIncludesTax = payload.priceIncludesTax;
      if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;
      if (payload.isFeatured !== undefined) apiPayload.isFeatured = payload.isFeatured;
      if (payload.isRecommended !== undefined) apiPayload.isRecommended = payload.isRecommended;
      if (payload.labels !== undefined) apiPayload.labels = payload.labels;
      if (payload.metadata !== undefined) apiPayload.metadata = payload.metadata;

      const res = await fetch(url, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || `Update config failed (${res.status})` };
      }

      const item: BranchMenuConfig = data?.result ?? data?.data ?? data;

      return { success: true, data: item };
    } catch (error: any) {
      logError("Error updating branch menu config", error, {
        component: "BranchMenuService",
        action: "updateConfig",
      });
      return { success: false, message: error.message };
    }
  },

  // Delete branch menu config
  async deleteConfig(id: string): Promise<ApiResponse<null>> {
    try {
      const url = buildUrl(`/t/branch-menu/${id}`);
      const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, message: data?.message || `Delete config failed (${res.status})` };
      }

      return { success: true, data: null };
    } catch (error: any) {
      logError("Error deleting branch menu config", error, {
        component: "BranchMenuService",
        action: "deleteConfig",
      });
      return { success: false, message: error.message };
    }
  },
};
