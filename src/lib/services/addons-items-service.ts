// src/lib/services/addons-items-service.ts

import AuthService from "@/lib/auth-service";

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

// ==================== Add-ons Items Service ====================

export const AddonsItemsService = {
  // List items by group
  async listItems(params?: {
    groupId?: string;
  }): Promise<ApiResponse<AddonItem[]>> {
    let url = buildUrl(`/t/addons/items`);
    if (params?.groupId) {
      url += `?groupId=${encodeURIComponent(params.groupId)}`;
    }

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List items failed (${res.status})` };
    }

    const items: AddonItem[] = data?.items ?? data?.result ?? data?.data ?? [];
    return { success: true, data: items };
  },

  // Get single item
  async getItem(id: string): Promise<ApiResponse<AddonItem>> {
    const url = buildUrl(`/t/addons/items/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get item failed (${res.status})` };
    }

    const item: AddonItem = data?.result ?? data?.data ?? data;
    return { success: true, data: item };
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
    const url = buildUrl(`/t/addons/items`);

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

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create item failed (${res.status})` };
    }

    const item: AddonItem = data?.result ?? data?.data ?? data;
    return { success: true, data: item };
  },

  // Bulk create items
  async bulkCreateItems(payload: BulkCreateAddonItemsPayload): Promise<ApiResponse<AddonItem[]>> {
    const url = buildUrl(`/t/addons/items/bulk`);

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Bulk create items failed (${res.status})` };
    }

    const items: AddonItem[] = data?.items ?? data?.result ?? data?.data ?? [];
    return { success: true, data: items };
  },

  // Update item
  async updateItem(id: string, payload: Partial<AddonItem>): Promise<ApiResponse<AddonItem>> {
    const url = buildUrl(`/t/addons/items/${id}`);

    const apiPayload: any = {};
    if (payload.price !== undefined) apiPayload.price = payload.price;
    if (payload.isRequired !== undefined) apiPayload.isRequired = payload.isRequired;
    if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;
    if (payload.nameSnapshot !== undefined) apiPayload.nameSnapshot = payload.nameSnapshot;
    if (payload.unit !== undefined) apiPayload.unit = payload.unit;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update item failed (${res.status})` };
    }

    const item: AddonItem = data?.result ?? data?.data ?? data;
    return { success: true, data: item };
  },

  // Delete item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`/t/addons/items/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete item failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
