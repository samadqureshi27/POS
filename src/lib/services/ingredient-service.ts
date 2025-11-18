// src/lib/services/ingredient-service.ts

import AuthService from "@/lib/auth-service";
import { buildHeaders } from "@/lib/util/service-helpers";

export interface TenantIngredient {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
  uom?: string; // e.g., g, l, pc
  isActive?: boolean; // mirrors category/modifier pattern (if backend supports)
  description?: string;
  minThreshold?: number; // minimum stock/alert threshold
  costPerUom?: number;
  priority?: number; // display order (frontend only unless backend supports)
  notes?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const INGREDIENTS_BASE = "/t/catalog/ingredients";

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

export const IngredientService = {
  async listIngredients(params?: { q?: string; status?: string; unit?: string; page?: number; limit?: number }): Promise<ApiListResponse<TenantIngredient[]>> {
    const q = params?.q ?? "";
    const status = params?.status ?? "";
    const unit = params?.unit ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    const url = buildUrl(`${INGREDIENTS_BASE}?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&unit=${encodeURIComponent(unit)}&page=${page}&limit=${limit}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List ingredients failed (${res.status})` };
    }

    const items: TenantIngredient[] = data?.items ?? data?.result ?? [];
    return { success: true, data: items };
  },

  async getIngredient(id: string): Promise<ApiListResponse<TenantIngredient>> {
    const url = buildUrl(`${INGREDIENTS_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Get ingredient failed (${res.status})` };
    }
    const ingredient: TenantIngredient = data?.result ?? data;
    return { success: true, data: ingredient };
  },

  async createIngredient(payload: Partial<TenantIngredient>): Promise<ApiListResponse<TenantIngredient>> {
    const url = buildUrl(`${INGREDIENTS_BASE}`);

    const apiPayload: any = {
      name: payload.name,
      sku: payload.sku,
      uom: payload.uom,
      isActive: payload.isActive ?? true,
      description: payload.description ?? payload.notes ?? "",
      minThreshold: payload.minThreshold ?? 0,
      costPerUom: payload.costPerUom ?? 0,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Create ingredient failed (${res.status})` };
    }
    const ingredient: TenantIngredient = data?.result ?? data;
    return { success: true, data: ingredient };
  },

  async updateIngredient(id: string, payload: Partial<TenantIngredient>): Promise<ApiListResponse<TenantIngredient>> {
    const url = buildUrl(`${INGREDIENTS_BASE}/${id}`);

    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.sku !== undefined) apiPayload.sku = payload.sku;
    if (payload.uom !== undefined) apiPayload.uom = payload.uom;
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    if (payload.minThreshold !== undefined) apiPayload.minThreshold = payload.minThreshold;
    if (payload.costPerUom !== undefined) apiPayload.costPerUom = payload.costPerUom;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Update ingredient failed (${res.status})` };
    }
    const ingredient: TenantIngredient = data?.result ?? data;
    return { success: true, data: ingredient };
  },

  async deleteIngredient(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${INGREDIENTS_BASE}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete ingredient failed (${res.status})` };
    }
    return { success: true, data: null };
  },
};