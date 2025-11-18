// src/lib/services/combo-service.ts

import AuthService from "@/lib/auth-service";
import { buildHeaders } from "@/lib/util/service-helpers";

export interface ComboCourse {
  name: string;
  min: number;
  max: number;
  source: "category" | "items";
  categoryId?: string;
  itemIds?: string[];
}

export interface TenantCombo {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  priceMode?: "fixed" | "additive";
  basePrice?: number;
  currency?: string;
  courses?: ComboCourse[];
  branchIds?: string[];
  active?: boolean;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const COMBOS_BASE = "/t/catalog/combos";

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

export const ComboService = {
  async listCombos(params?: { q?: string; page?: number; limit?: number; active?: boolean }): Promise<ApiListResponse<TenantCombo[]>> {
    const q = params?.q ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    const active = params?.active;

    let url = buildUrl(`${COMBOS_BASE}?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    if (active !== undefined) url += `&active=${active}`;

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List combos failed (${res.status})` };
    }

    // Backend returns: { status, message, items: [...], count, page, limit }
    const items: TenantCombo[] = data?.items ?? data?.result ?? [];
    return { success: true, data: items };
  },

  async getCombo(id: string): Promise<ApiListResponse<TenantCombo>> {
    const url = buildUrl(`${COMBOS_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get combo failed (${res.status})` };
    }

    const combo: TenantCombo = data?.result ?? data;
    return { success: true, data: combo };
  },

  async createCombo(payload: Partial<TenantCombo>): Promise<ApiListResponse<TenantCombo>> {
    const url = buildUrl(`${COMBOS_BASE}`);

    // Generate slug from name if not provided
    const slug = payload.slug || payload.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Map to API format
    const apiPayload = {
      name: payload.name,
      slug: slug,
      priceMode: payload.priceMode ?? "fixed",
      basePrice: payload.basePrice ?? 0,
      currency: payload.currency ?? "PKR",
      courses: payload.courses ?? [],
      branchIds: payload.branchIds ?? [],
      active: payload.active ?? true,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create combo failed (${res.status})` };
    }

    const combo: TenantCombo = data?.result ?? data;
    return { success: true, data: combo };
  },

  async updateCombo(id: string, payload: Partial<TenantCombo>): Promise<ApiListResponse<TenantCombo>> {
    const url = buildUrl(`${COMBOS_BASE}/${id}`);

    // Only include fields being updated
    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.slug !== undefined) apiPayload.slug = payload.slug;
    if (payload.priceMode !== undefined) apiPayload.priceMode = payload.priceMode;
    if (payload.basePrice !== undefined) apiPayload.basePrice = payload.basePrice;
    if (payload.currency !== undefined) apiPayload.currency = payload.currency;
    if (payload.courses !== undefined) apiPayload.courses = payload.courses;
    if (payload.branchIds !== undefined) apiPayload.branchIds = payload.branchIds;
    if (payload.active !== undefined) apiPayload.active = payload.active;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update combo failed (${res.status})` };
    }

    const combo: TenantCombo = data?.result ?? data;
    return { success: true, data: combo };
  },

  async deleteCombo(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${COMBOS_BASE}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete combo failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
