// src/lib/services/menu-item-service.ts

import AuthService from "@/lib/auth-service";

export interface ItemVariant {
  name: string;
  price: number;
  _id?: string;
}

export interface ItemModifier {
  groupId: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface TenantMenuItem {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  categoryIds?: string[];
  imageUrl?: string;
  description?: string;
  variants?: ItemVariant[];
  modifiers?: ItemModifier[];
  isActive?: boolean;
  featured?: boolean;
  priority?: number;
  // Stock tracking fields
  trackStock?: boolean;
  stockQty?: number;
  minStockThreshold?: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const ITEMS_BASE = "/t/catalog/items";

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

export const MenuItemService = {
  async listItems(params?: {
    q?: string;
    page?: number;
    limit?: number;
    categoryId?: string;
    status?: string;
  }): Promise<ApiListResponse<TenantMenuItem[]>> {
    const q = params?.q ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    const categoryId = params?.categoryId ?? "";
    const status = params?.status ?? "";

    let url = buildUrl(`${ITEMS_BASE}?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    if (categoryId) url += `&categoryId=${encodeURIComponent(categoryId)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List items failed (${res.status})` };
    }

    // Backend returns: { status, message, items: [...], count, page, limit }
    const items: TenantMenuItem[] = data?.items ?? data?.result ?? [];
    return { success: true, data: items };
  },

  async getItem(id: string): Promise<ApiListResponse<TenantMenuItem>> {
    const url = buildUrl(`${ITEMS_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get item failed (${res.status})` };
    }

    const item: TenantMenuItem = data?.result ?? data;
    return { success: true, data: item };
  },

  async createItem(payload: Partial<TenantMenuItem>): Promise<ApiListResponse<TenantMenuItem>> {
    const url = buildUrl(`${ITEMS_BASE}`);

    // Generate slug from name if not provided
    const slug = payload.slug || payload.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Map to API format
    const apiPayload = {
      name: payload.name,
      slug: slug,
      categoryIds: payload.categoryIds ?? [],
      imageUrl: payload.imageUrl ?? "",
      description: payload.description ?? "",
      variants: payload.variants ?? [],
      modifiers: payload.modifiers ?? [],
      isActive: payload.isActive ?? true,
      featured: payload.featured ?? false,
      priority: payload.priority ?? 0,
      trackStock: payload.trackStock ?? false,
      stockQty: payload.stockQty ?? 0,
      minStockThreshold: payload.minStockThreshold ?? 0,
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

    const item: TenantMenuItem = data?.result ?? data;
    return { success: true, data: item };
  },

  async updateItem(id: string, payload: Partial<TenantMenuItem>): Promise<ApiListResponse<TenantMenuItem>> {
    const url = buildUrl(`${ITEMS_BASE}/${id}`);

    // Only include fields being updated
    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.slug !== undefined) apiPayload.slug = payload.slug;
    if (payload.categoryIds !== undefined) apiPayload.categoryIds = payload.categoryIds;
    if (payload.imageUrl !== undefined) apiPayload.imageUrl = payload.imageUrl;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    if (payload.variants !== undefined) apiPayload.variants = payload.variants;
    if (payload.modifiers !== undefined) apiPayload.modifiers = payload.modifiers;
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
    if (payload.featured !== undefined) apiPayload.featured = payload.featured;
    if (payload.priority !== undefined) apiPayload.priority = payload.priority;
    if (payload.trackStock !== undefined) apiPayload.trackStock = payload.trackStock;
    if (payload.stockQty !== undefined) apiPayload.stockQty = payload.stockQty;
    if (payload.minStockThreshold !== undefined) apiPayload.minStockThreshold = payload.minStockThreshold;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update item failed (${res.status})` };
    }

    const item: TenantMenuItem = data?.result ?? data;
    return { success: true, data: item };
  },

  async deleteItem(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${ITEMS_BASE}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete item failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
