// src/lib/services/category-service.ts

import AuthService from "@/lib/auth-service";
import { buildHeaders } from "@/lib/util/service-helpers";

export interface TenantCategory {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  sortIndex?: number;
  isActive?: boolean;
  // Extra fields from frontend (stubbed for now)
  description?: string;
  parent?: string;
  image?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const CATEGORIES_BASE = "/t/menu/categories";

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

export const CategoryService = {
  async listCategories(params?: { q?: string; status?: string; page?: number; limit?: number }): Promise<ApiListResponse<TenantCategory[]>> {
    const q = params?.q ?? "";
    const status = params?.status ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    const url = buildUrl(`${CATEGORIES_BASE}?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List categories failed (${res.status})` };
    }

    // Backend returns: { status, message, items: [...], count, page, limit }
    const items: TenantCategory[] = data?.items ?? data?.result ?? [];
    return { success: true, data: items };
  },

  async getCategory(id: string): Promise<ApiListResponse<TenantCategory>> {
    const url = buildUrl(`${CATEGORIES_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get category failed (${res.status})` };
    }

    const category: TenantCategory = data?.result ?? data;
    return { success: true, data: category };
  },

  async createCategory(payload: Partial<TenantCategory>): Promise<ApiListResponse<TenantCategory>> {
    const url = buildUrl(`${CATEGORIES_BASE}`);

    // Generate slug from name if not provided
    const slug = payload.slug || payload.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Map frontend fields to backend format
    const apiPayload = {
      name: payload.name,
      slug: slug,
      sortIndex: payload.sortIndex ?? 0,
      isActive: payload.isActive ?? true,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create category failed (${res.status})` };
    }

    const category: TenantCategory = data?.result ?? data;
    return { success: true, data: category };
  },

  async updateCategory(id: string, payload: Partial<TenantCategory>): Promise<ApiListResponse<TenantCategory>> {
    const url = buildUrl(`${CATEGORIES_BASE}/${id}`);

    // Map frontend fields to backend format (only include fields being updated)
    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.slug !== undefined) apiPayload.slug = payload.slug;
    if (payload.sortIndex !== undefined) apiPayload.sortIndex = payload.sortIndex;
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update category failed (${res.status})` };
    }

    const category: TenantCategory = data?.result ?? data;
    return { success: true, data: category };
  },

  async deleteCategory(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${CATEGORIES_BASE}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete category failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
