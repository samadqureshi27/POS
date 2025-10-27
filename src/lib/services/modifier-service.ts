// src/lib/services/modifier-service.ts

import AuthService from "@/lib/auth-service";

export interface ModifierOption {
  name: string;
  price?: number;
}

export interface TenantModifier {
  _id?: string;
  id?: string;
  name: string;
  key?: string; // slug/key
  selection?: "single" | "multiple";
  min?: number;
  max?: number;
  options?: ModifierOption[];
  isActive?: boolean;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const MODIFIERS_BASE = "/t/catalog/modifiers";

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

export const ModifierService = {
  async listModifiers(params?: { q?: string; page?: number; limit?: number }): Promise<ApiListResponse<TenantModifier[]>> {
    const q = params?.q ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    const url = buildUrl(`${MODIFIERS_BASE}?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List modifiers failed (${res.status})` };
    }

    // Backend returns: { status, message, items: [...], count, page, limit }
    const items: TenantModifier[] = data?.items ?? data?.result ?? [];
    return { success: true, data: items };
  },

  async getModifier(id: string): Promise<ApiListResponse<TenantModifier>> {
    const url = buildUrl(`${MODIFIERS_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get modifier failed (${res.status})` };
    }

    const modifier: TenantModifier = data?.result ?? data;
    return { success: true, data: modifier };
  },

  async createModifier(payload: Partial<TenantModifier>): Promise<ApiListResponse<TenantModifier>> {
    const url = buildUrl(`${MODIFIERS_BASE}`);

    // Generate key from name if not provided
    const key = payload.key || payload.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Map to API format
    const apiPayload = {
      name: payload.name,
      key: key,
      selection: payload.selection ?? "single",
      min: payload.min ?? 0,
      max: payload.max ?? 1,
      options: payload.options ?? [],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create modifier failed (${res.status})` };
    }

    const modifier: TenantModifier = data?.result ?? data;
    return { success: true, data: modifier };
  },

  async updateModifier(id: string, payload: Partial<TenantModifier>): Promise<ApiListResponse<TenantModifier>> {
    const url = buildUrl(`${MODIFIERS_BASE}/${id}`);

    // Only include fields being updated
    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.key !== undefined) apiPayload.key = payload.key;
    if (payload.selection !== undefined) apiPayload.selection = payload.selection;
    if (payload.min !== undefined) apiPayload.min = payload.min;
    if (payload.max !== undefined) apiPayload.max = payload.max;
    if (payload.options !== undefined) apiPayload.options = payload.options;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update modifier failed (${res.status})` };
    }

    const modifier: TenantModifier = data?.result ?? data;
    return { success: true, data: modifier };
  },

  async deleteModifier(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${MODIFIERS_BASE}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete modifier failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
