// src/lib/services/branch-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

export interface TenantBranch {
  id?: string;
  _id?: string;
  name: string;
  code?: string;
  status?: "active" | "inactive";
  address?: { city?: string; country?: string; line?: string };
  timezone?: string;
  currency?: string;
  tax?: { mode?: string; rate?: number };
  posConfig?: Record<string, any>;
  isDefault?: boolean;
  contactEmail?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const BranchService = {
  async listBranches(params?: { q?: string; status?: "active" | "inactive"; page?: number; limit?: number }): Promise<ApiListResponse<TenantBranch[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.q) queryParams.append("q", params.q);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));

      const queryString = queryParams.toString();
      const path = `/t/branches${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<TenantBranch[]>(response);

      // Handle different API response structures for items
      let items = normalized.data;
      if (response.items) {
        items = response.items;
      } else if (response.result?.items) {
        items = response.result.items;
      } else if (response.result) {
        items = response.result;
      }

      return {
        success: normalized.success,
        data: items,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching branches", error, {
        component: "BranchService",
        action: "listBranches",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch branches",
      };
    }
  },

  async getBranch(id: string): Promise<ApiListResponse<TenantBranch>> {
    try {
      const response = await api.get(`/t/branches/${id}`);
      const normalized = normalizeApiResponse<TenantBranch>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching branch", error, {
        component: "BranchService",
        action: "getBranch",
        branchId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to fetch branch",
      };
    }
  },

  async createBranch(payload: Partial<TenantBranch>): Promise<ApiListResponse<TenantBranch>> {
    try {
      const response = await api.post("/t/branches", payload);
      const normalized = normalizeApiResponse<TenantBranch>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Branch created successfully",
      };
    } catch (error: any) {
      logError("Error creating branch", error, {
        component: "BranchService",
        action: "createBranch",
      });
      return {
        success: false,
        message: error.message || "Failed to create branch",
      };
    }
  },

  async updateBranch(id: string, payload: Partial<TenantBranch>): Promise<ApiListResponse<TenantBranch>> {
    try {
      const response = await api.put(`/t/branches/${id}`, payload);
      const normalized = normalizeApiResponse<TenantBranch>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Branch updated successfully",
      };
    } catch (error: any) {
      logError("Error updating branch", error, {
        component: "BranchService",
        action: "updateBranch",
        branchId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update branch",
      };
    }
  },

  async deleteBranch(id: string): Promise<ApiListResponse<null>> {
    try {
      const response = await api.delete(`/t/branches/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: null,
        message: normalized.message || "Branch deleted successfully",
      };
    } catch (error: any) {
      logError("Error deleting branch", error, {
        component: "BranchService",
        action: "deleteBranch",
        branchId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to delete branch",
      };
    }
  },

  async setDefault(id: string): Promise<ApiListResponse<null>> {
    try {
      const response = await api.put(`/t/branches/${id}/default`, {});
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: null,
        message: normalized.message || "Default branch set successfully",
      };
    } catch (error: any) {
      logError("Error setting default branch", error, {
        component: "BranchService",
        action: "setDefault",
        branchId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to set default branch",
      };
    }
  },

  async getSettings(id: string): Promise<ApiListResponse<any>> {
    try {
      const response = await api.get(`/t/branches/${id}/settings`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching branch settings", error, {
        component: "BranchService",
        action: "getSettings",
        branchId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to fetch branch settings",
      };
    }
  },

  async updateSettings(id: string, payload: Record<string, any>): Promise<ApiListResponse<any>> {
    try {
      const response = await api.put(`/t/branches/${id}/settings`, payload);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Branch settings updated successfully",
      };
    } catch (error: any) {
      logError("Error updating branch settings", error, {
        component: "BranchService",
        action: "updateSettings",
        branchId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update branch settings",
      };
    }
  },

  async attachUser(id: string, userId: string): Promise<ApiListResponse<any>> {
    try {
      const response = await api.post(`/t/branches/${id}/users/${userId}`, {});
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "User attached successfully",
      };
    } catch (error: any) {
      logError("Error attaching user", error, {
        component: "BranchService",
        action: "attachUser",
        branchId: id,
        userId,
      });
      return {
        success: false,
        message: error.message || "Failed to attach user",
      };
    }
  },

  async detachUser(id: string, userId: string): Promise<ApiListResponse<any>> {
    try {
      const response = await api.delete(`/t/branches/${id}/users/${userId}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "User detached successfully",
      };
    } catch (error: any) {
      logError("Error detaching user", error, {
        component: "BranchService",
        action: "detachUser",
        branchId: id,
        userId,
      });
      return {
        success: false,
        message: error.message || "Failed to detach user",
      };
    }
  },
};