// src/lib/services/addons-groups-service.ts

import AuthService from "@/lib/auth-service";
import { buildHeaders } from "@/lib/util/service-helpers";

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

// ==================== Configuration ====================

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

function getToken(): string | null {
  const t = AuthService.getToken();
  if (t) return t;
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      null
    );
  }
  return null;
}

function getTenantSlug(): string | null {
  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || "";
  if (envSlug) return envSlug;
  if (typeof window !== "undefined") {
    return localStorage.getItem("tenant_slug") || null;
  }
  return null;
}

function getTenantId(): string | null {
  const envId = process.env.NEXT_PUBLIC_TENANT_ID || "";
  if (envId) return envId;
  if (typeof window !== "undefined") {
    return localStorage.getItem("tenant_id") || null;
  }
  return null;
}

function buildHeaders(extra?: Record<string, string>) {
  const token = getToken();
  const slug = getTenantSlug();
  const id = getTenantId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (id) headers["x-tenant-id"] = id;
  else if (slug) headers["x-tenant-id"] = slug;

  return { ...headers, ...(extra || {}) };
}

// ==================== Add-ons Groups Service ====================

export const AddonsGroupsService = {
  // List groups by category
  async listGroups(params?: {
    categoryId?: string;
  }): Promise<ApiResponse<AddonGroup[]>> {
    let url = buildUrl(`/t/addons/groups`);
    if (params?.categoryId) {
      url += `?categoryId=${encodeURIComponent(params.categoryId)}`;
    }

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List groups failed (${res.status})` };
    }

    const groups: AddonGroup[] = data?.items ?? data?.result ?? data?.data ?? [];
    return { success: true, data: groups };
  },

  // Get single group
  async getGroup(id: string): Promise<ApiResponse<AddonGroup>> {
    const url = buildUrl(`/t/addons/groups/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get group failed (${res.status})` };
    }

    const group: AddonGroup = data?.result ?? data?.data ?? data;
    return { success: true, data: group };
  },

  // Create group
  async createGroup(payload: {
    categoryId: string;
    name: string;
    description?: string;
    isActive?: boolean;
    displayOrder?: number;
  }): Promise<ApiResponse<AddonGroup>> {
    const url = buildUrl(`/t/addons/groups`);

    const apiPayload = {
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description || "",
      isActive: payload.isActive ?? true,
      displayOrder: payload.displayOrder ?? 0,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create group failed (${res.status})` };
    }

    const group: AddonGroup = data?.result ?? data?.data ?? data;
    return { success: true, data: group };
  },

  // Update group
  async updateGroup(id: string, payload: Partial<AddonGroup>): Promise<ApiResponse<AddonGroup>> {
    const url = buildUrl(`/t/addons/groups/${id}`);

    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
    if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update group failed (${res.status})` };
    }

    const group: AddonGroup = data?.result ?? data?.data ?? data;
    return { success: true, data: group };
  },

  // Delete group
  async deleteGroup(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`/t/addons/groups/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete group failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
