// src/lib/services/staff-service.ts

import { buildHeaders } from "@/lib/util/service-helpers";
import { logError } from "@/lib/util/logger";

// ==================== Types ====================

export interface RoleGrant {
  roleKey: string;
  scope: "tenant" | "branch";
  branchId?: string;
}

export interface TenantStaff {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  branchIds: string[];
  roles: string[];
  roleGrants?: RoleGrant[];
  pin?: string;
  position?: string;
  status?: "active" | "inactive" | "suspended";
  metadata?: Record<string, any>;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  items?: T;
  result?: T;
  count?: number;
  page?: number;
  limit?: number;
}

// ==================== Configuration ====================

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

// ==================== Staff Service ====================

export const StaffService = {
  // List staff members
  async listStaff(params: {
    page?: number;
    limit?: number;
    status?: "active" | "inactive" | "suspended" | "";
    branchId?: string;
    q?: string;
  }): Promise<ApiResponse<TenantStaff[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.branchId) queryParams.append('branchId', params.branchId);
      if (params.q) queryParams.append('q', params.q);

      const queryString = queryParams.toString();
      const url = buildUrl(`/t/staff${queryString ? `?${queryString}` : ''}`);

      const res = await fetch(url, { headers: buildHeaders() });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || `List staff failed (${res.status})` };
      }

      // Extract items from various possible response structures
      let items: TenantStaff[] = data?.result?.items ?? data?.items ?? data?.result ?? data?.data ?? data ?? [];

      // Ensure items is always an array
      if (!Array.isArray(items)) {
        items = [];
      }

      return {
        success: true,
        data: items,
        count: data?.count,
        page: data?.page,
        limit: data?.limit
      };
    } catch (error: any) {
      logError("Error listing staff", error, {
        component: "StaffService",
        action: "listStaff",
      });
      return { success: false, message: error.message };
    }
  },

  // Get single staff member by ID
  async getStaff(id: string): Promise<ApiResponse<TenantStaff>> {
    try {
      const url = buildUrl(`/t/staff/${id}`);
      const res = await fetch(url, { headers: buildHeaders() });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || `Get staff failed (${res.status})` };
      }

      const staff: TenantStaff = data?.result ?? data?.data ?? data;
      return { success: true, data: staff };
    } catch (error: any) {
      logError("Error getting staff", error, {
        component: "StaffService",
        action: "getStaff",
      });
      return { success: false, message: error.message };
    }
  },

  // Create staff member
  async createStaff(payload: Partial<TenantStaff>): Promise<ApiResponse<TenantStaff>> {
    try {
      const url = buildUrl(`/t/staff`);

      const apiPayload: any = {
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        branchIds: payload.branchIds || [],
        roles: payload.roles || [],
      };

      // Optional fields
      if (payload.roleGrants !== undefined) apiPayload.roleGrants = payload.roleGrants;
      if (payload.pin !== undefined) apiPayload.pin = payload.pin;
      if (payload.position !== undefined) apiPayload.position = payload.position;
      if (payload.metadata !== undefined) apiPayload.metadata = payload.metadata;
      if (payload.branchId !== undefined) apiPayload.branchId = payload.branchId;
      if (payload.status !== undefined) apiPayload.status = payload.status;

      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || data?.error?.message || `Create staff failed (${res.status})` };
      }

      const staff: TenantStaff = data?.result ?? data?.data ?? data;
      return { success: true, data: staff };
    } catch (error: any) {
      logError("Error creating staff", error, {
        component: "StaffService",
        action: "createStaff",
      });
      return { success: false, message: error.message };
    }
  },

  // Update staff member
  async updateStaff(id: string, payload: Partial<TenantStaff>): Promise<ApiResponse<TenantStaff>> {
    try {
      const url = buildUrl(`/t/staff/${id}`);

      const apiPayload: any = {};
      if (payload.fullName !== undefined) apiPayload.fullName = payload.fullName;
      if (payload.email !== undefined) apiPayload.email = payload.email;
      if (payload.password !== undefined) apiPayload.password = payload.password;
      if (payload.branchIds !== undefined) apiPayload.branchIds = payload.branchIds;
      if (payload.roles !== undefined) apiPayload.roles = payload.roles;
      if (payload.roleGrants !== undefined) apiPayload.roleGrants = payload.roleGrants;
      if (payload.position !== undefined) apiPayload.position = payload.position;
      if (payload.metadata !== undefined) apiPayload.metadata = payload.metadata;
      if (payload.branchId !== undefined) apiPayload.branchId = payload.branchId;
      if (payload.status !== undefined) apiPayload.status = payload.status;

      const res = await fetch(url, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || `Update staff failed (${res.status})` };
      }

      const staff: TenantStaff = data?.result ?? data?.data ?? data;
      return { success: true, data: staff };
    } catch (error: any) {
      logError("Error updating staff", error, {
        component: "StaffService",
        action: "updateStaff",
      });
      return { success: false, message: error.message };
    }
  },

  // Set PIN for staff member
  async setPin(id: string, pin: string, branchId?: string): Promise<ApiResponse<null>> {
    try {
      const url = buildUrl(`/t/staff/${id}/set-pin`);

      const apiPayload: any = { pin };
      if (branchId) apiPayload.branchId = branchId;

      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, message: data?.message || `Set PIN failed (${res.status})` };
      }

      return { success: true, data: null };
    } catch (error: any) {
      logError("Error setting PIN", error, {
        component: "StaffService",
        action: "setPin",
      });
      return { success: false, message: error.message };
    }
  },

  // Update staff status
  async updateStatus(id: string, status: "active" | "inactive" | "suspended", branchId?: string): Promise<ApiResponse<null>> {
    try {
      const url = buildUrl(`/t/staff/${id}/status`);

      const apiPayload: any = { status };
      if (branchId) apiPayload.branchId = branchId;

      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, message: data?.message || `Update status failed (${res.status})` };
      }

      return { success: true, data: null };
    } catch (error: any) {
      logError("Error updating status", error, {
        component: "StaffService",
        action: "updateStatus",
      });
      return { success: false, message: error.message };
    }
  },
};
