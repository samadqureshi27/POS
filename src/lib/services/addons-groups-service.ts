// src/lib/services/addons-groups-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

// ==================== Types ====================

export interface AddonGroup {
  _id?: string;
  id?: string;
  categoryId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ==================== Add-ons Groups Service ====================

export const AddonsGroupsService = {
  // List groups by category
  async listGroups(params?: {
    categoryId?: string;
  }): Promise<ApiResponse<AddonGroup[]>> {
    try {
      let path = `/t/addons/groups`;
      if (params?.categoryId) {
        path += `?categoryId=${encodeURIComponent(params.categoryId)}`;
      }

      const response = await api.get(path);
      const normalized = normalizeApiResponse<AddonGroup[]>(response);

      // Handle different API response structures
      let groups = normalized.data;
      if (response.items) {
        groups = response.items;
      } else if (response.result) {
        groups = response.result;
      } else if (response.data) {
        groups = response.data;
      }

      return {
        success: normalized.success,
        data: groups,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error listing addon groups", error, {
        component: "AddonsGroupsService",
        action: "listGroups",
      });
      return {
        success: false,
        message: error.message || "Failed to list addon groups",
      };
    }
  },

  // Get single group
  async getGroup(id: string): Promise<ApiResponse<AddonGroup>> {
    try {
      const response = await api.get(`/t/addons/groups/${id}`);
      const normalized = normalizeApiResponse<AddonGroup>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error getting addon group", error, {
        component: "AddonsGroupsService",
        action: "getGroup",
        groupId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to get addon group",
      };
    }
  },

  // Create group
  async createGroup(payload: {
    categoryId: string;
    name: string;
    description?: string;
    isActive?: boolean;
    displayOrder?: number;
  }): Promise<ApiResponse<AddonGroup>> {
    try {
      const apiPayload = {
        categoryId: payload.categoryId,
        name: payload.name,
        description: payload.description || "",
        isActive: payload.isActive ?? true,
        displayOrder: payload.displayOrder ?? 0,
      };

      const response = await api.post(`/t/addons/groups`, apiPayload);
      const normalized = normalizeApiResponse<AddonGroup>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Addon group created successfully",
      };
    } catch (error: any) {
      logError("Error creating addon group", error, {
        component: "AddonsGroupsService",
        action: "createGroup",
      });
      return {
        success: false,
        message: error.message || "Failed to create addon group",
      };
    }
  },

  // Update group
  async updateGroup(id: string, payload: Partial<AddonGroup>): Promise<ApiResponse<AddonGroup>> {
    try {
      const apiPayload: any = {};
      if (payload.name !== undefined) apiPayload.name = payload.name;
      if (payload.description !== undefined) apiPayload.description = payload.description;
      if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
      if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;

      const response = await api.put(`/t/addons/groups/${id}`, apiPayload);
      const normalized = normalizeApiResponse<AddonGroup>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Addon group updated successfully",
      };
    } catch (error: any) {
      logError("Error updating addon group", error, {
        component: "AddonsGroupsService",
        action: "updateGroup",
        groupId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update addon group",
      };
    }
  },

  // Delete group
  async deleteGroup(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/t/addons/groups/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Addon group deleted successfully",
        data: null,
      };
    } catch (error: any) {
      logError("Error deleting addon group", error, {
        component: "AddonsGroupsService",
        action: "deleteGroup",
        groupId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to delete addon group",
      };
    }
  },
};
