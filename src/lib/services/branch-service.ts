// src/lib/services/branch-service.ts

import AuthService from "@/lib/auth-service";

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

// Use the user's provided env var name for base URL and support local proxy routing
const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true"; // default to proxy
const BRANCHES_BASE = "/t/branches"; // client-side proxy path
function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

function getToken(): string | null {
  // Try AuthService first, then common localStorage keys
  const t = AuthService.getToken();
  console.log('🔍 getToken - AuthService.getToken():', t ? `${t.substring(0, 20)}...` : 'null');
  if (t) return t;
  if (typeof window !== "undefined") {
    const token1 = localStorage.getItem("token");
    const token2 = localStorage.getItem("accessToken");
    console.log('🔍 getToken - localStorage.token:', token1 ? `${token1.substring(0, 20)}...` : 'null');
    console.log('🔍 getToken - localStorage.accessToken:', token2 ? `${token2.substring(0, 20)}...` : 'null');
    return token1 || token2 || null;
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

  console.log('🔍 Branch Service - buildHeaders:', {
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
    slug,
    id
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Always use x-tenant-id (slug or id value)
  if (id) headers["x-tenant-id"] = id;
  else if (slug) headers["x-tenant-id"] = slug;

  console.log('📤 Final headers:', headers);

  return { ...headers, ...(extra || {}) };
}

export const BranchService = {
  async listBranches(params?: { q?: string; status?: "active" | "inactive"; page?: number; limit?: number }): Promise<ApiListResponse<TenantBranch[]>> {
    const q = params?.q ?? "";
    const status = params?.status ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const url = buildUrl(`${BRANCHES_BASE}?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    console.log('📦 List Branches Response:', { status: res.status, ok: res.ok, data });
    console.log('📦 Response keys:', Object.keys(data));
    console.log('📦 data.data:', data?.data);
    console.log('📦 data.result:', data?.result);
    console.log('📦 data.result.items:', data?.result?.items);

    if (!res.ok) {
      return { success: false, message: data?.message || `List branches failed (${res.status})` };
    }
    // Backend returns: { status, message, items: [...], count, page, limit }
    const items: TenantBranch[] = data?.items ?? data?.data ?? data?.result?.items ?? data?.result ?? [];
    console.log('📋 Parsed branches count:', items.length);
    console.log('📋 Parsed branches:', items);
    return { success: true, data: items };
  },

  async getBranch(id: string): Promise<ApiListResponse<TenantBranch>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Get branch failed (${res.status})` };
    }
    // Backend likely returns: { status, message, result: {...} } or { status, message, ...branch }
    const branch: TenantBranch = data?.result ?? data?.data ?? data;
    return { success: true, data: branch };
  },

  async createBranch(payload: Partial<TenantBranch>): Promise<ApiListResponse<TenantBranch>> {
    const url = buildUrl(`${BRANCHES_BASE}`);
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Create branch failed (${res.status})` };
    }
    // Backend returns: { status, message, result: {...} }
    const branch: TenantBranch = data?.result ?? data?.data ?? data;
    return { success: true, data: branch };
  },

  async updateBranch(id: string, payload: Partial<TenantBranch>): Promise<ApiListResponse<TenantBranch>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Update branch failed (${res.status})` };
    }
    // Backend returns: { status, message, result: {...} }
    const branch: TenantBranch = data?.result ?? data?.data ?? data;
    return { success: true, data: branch };
  },

  async deleteBranch(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete branch failed (${res.status})` };
    }
    return { success: true, data: null };
  },

  async setDefault(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}/default`);
    const res = await fetch(url, { method: "PUT", headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Set default branch failed (${res.status})` };
    }
    return { success: true, data: null };
  },

  async getSettings(id: string): Promise<ApiListResponse<any>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}/settings`);
    const res = await fetch(url, { headers: buildHeaders({ "x-branch-id": id }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Get branch settings failed (${res.status})` };
    }
    return { success: true, data: data?.result ?? data?.data ?? data };
  },

  async updateSettings(id: string, payload: Record<string, any>): Promise<ApiListResponse<any>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}/settings`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders({ "x-branch-id": id }),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Update branch settings failed (${res.status})` };
    }
    return { success: true, data: data?.result ?? data?.data ?? data };
  },

  async attachUser(id: string, userId: string): Promise<ApiListResponse<any>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}/users/${userId}`);
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Attach user failed (${res.status})` };
    }
    return { success: true, data: data?.result ?? data?.data ?? data };
  },

  async detachUser(id: string, userId: string): Promise<ApiListResponse<any>> {
    const url = buildUrl(`${BRANCHES_BASE}/${id}/users/${userId}`);
    const res = await fetch(url, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || `Detach user failed (${res.status})` };
    }
    return { success: true, data: data?.result ?? data?.data ?? data };
  },
};