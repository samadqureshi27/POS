// src/lib/services/addons-items-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

// ==================== Types ====================

export interface AddonItem {
  _id?: string;
  id?: string;
  groupId: string;
  categoryId: string;
  sourceType: "inventory" | "recipe";
  sourceId: string;
  nameSnapshot: string;
  price: number;
  unit?: string;
  isRequired?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkCreateAddonItemsPayload {
  groupId: string;
  categoryId: string;
  items: Array<{
    sourceType: "inventory" | "recipe";
    sourceId: string;
    nameSnapshot: string;
    price: number;
    unit?: string;
    isRequired?: boolean;
    displayOrder?: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ==================== Add-ons Items Service ====================

export const AddonsItemsService = {
  // List items by group
  async listItems(params?: {
    groupId?: string;
  }): Promise<ApiResponse<AddonItem[]>> {
    try {
      let path = `/t/addons/items`;
      if (params?.groupId) {
        path += `?groupId=${encodeURIComponent(params.groupId)}`;
      }

      const response = await api.get(path);
      const normalized = normalizeApiResponse<AddonItem[]>(response);

      // Handle different API response structures
      let items = normalized.data;
      if (response.items) {
        items = response.items;
      } else if (response.result) {
        items = response.result;
      } else if (response.data) {
        items = response.data;
      }

      return {
        success: normalized.success,
        data: items,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error listing addon items", error, {
        component: "AddonsItemsService",
        action: "listItems",
      });
      return {
        success: false,
        message: error.message || "Failed to list addon items",
      };
    }
  },

  // Get single item
  async getItem(id: string): Promise<ApiResponse<AddonItem>> {
    try {
      const response = await api.get(`/t/addons/items/${id}`);
      const normalized = normalizeApiResponse<AddonItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error getting addon item", error, {
        component: "AddonsItemsService",
        action: "getItem",
        itemId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to get addon item",
      };
    }
  },

  // Create single item
  async createItem(payload: {
    groupId: string;
    categoryId: string;
    sourceType: "inventory" | "recipe";
    sourceId: string;
    nameSnapshot: string;
    price: number;
    unit?: string;
    isRequired?: boolean;
    displayOrder?: number;
  }): Promise<ApiResponse<AddonItem>> {
    try {
      const apiPayload = {
        groupId: payload.groupId,
        categoryId: payload.categoryId,
        sourceType: payload.sourceType,
        sourceId: payload.sourceId,
        nameSnapshot: payload.nameSnapshot,
        price: payload.price,
        unit: payload.unit || "unit",
        isRequired: payload.isRequired ?? false,
        displayOrder: payload.displayOrder ?? 0,
      };

      const response = await api.post(`/t/addons/items`, apiPayload);
      const normalized = normalizeApiResponse<AddonItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Addon item created successfully",
      };
    } catch (error: any) {
      logError("Error creating addon item", error, {
        component: "AddonsItemsService",
        action: "createItem",
      });
      return {
        success: false,
        message: error.message || "Failed to create addon item",
      };
    }
  },

  // Bulk create items
  async bulkCreateItems(payload: BulkCreateAddonItemsPayload): Promise<ApiResponse<AddonItem[]>> {
    try {
      const response = await api.post(`/t/addons/items/bulk`, payload);
      const normalized = normalizeApiResponse<AddonItem[]>(response);

      // Handle different API response structures
      let items = normalized.data;
      if (response.items) {
        items = response.items;
      } else if (response.result) {
        items = response.result;
      } else if (response.data) {
        items = response.data;
      }

      return {
        success: normalized.success,
        data: items,
        message: normalized.message || "Addon items created successfully",
      };
    } catch (error: any) {
      logError("Error bulk creating addon items", error, {
        component: "AddonsItemsService",
        action: "bulkCreateItems",
      });
      return {
        success: false,
        message: error.message || "Failed to bulk create addon items",
      };
    }
  },

  // Update item
  async updateItem(id: string, payload: Partial<AddonItem>): Promise<ApiResponse<AddonItem>> {
    try {
      const apiPayload: any = {};
      if (payload.price !== undefined) apiPayload.price = payload.price;
      if (payload.isRequired !== undefined) apiPayload.isRequired = payload.isRequired;
      if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;
      if (payload.nameSnapshot !== undefined) apiPayload.nameSnapshot = payload.nameSnapshot;
      if (payload.unit !== undefined) apiPayload.unit = payload.unit;

      const response = await api.put(`/t/addons/items/${id}`, apiPayload);
      const normalized = normalizeApiResponse<AddonItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Addon item updated successfully",
      };
    } catch (error: any) {
      logError("Error updating addon item", error, {
        component: "AddonsItemsService",
        action: "updateItem",
        itemId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update addon item",
      };
    }
  },

  // Delete item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/t/addons/items/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Addon item deleted successfully",
        data: null,
      };
    } catch (error: any) {
      logError("Error deleting addon item", error, {
        component: "AddonsItemsService",
        action: "deleteItem",
        itemId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to delete addon item",
      };
    }
  },
};
