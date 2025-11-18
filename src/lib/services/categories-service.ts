// src/lib/services/categories-service.ts

import { buildHeaders } from "@/lib/util/service-helpers";

// ==================== Types ====================

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
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

// ==================== Categories Service ====================

export const CategoriesService = {
  // List categories
  async listCategories(params?: {
    q?: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<ApiResponse<Category[]>> {
    const q = params?.q ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 100;

    let url = buildUrl(`/t/inventory/categories?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    if (params?.isActive !== undefined) url += `&isActive=${params.isActive}`;
    if (params?.sort) url += `&sort=${params.sort}`;
    if (params?.order) url += `&order=${params.order}`;

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List categories failed (${res.status})` };
    }

    const categories: Category[] = data?.items ?? data?.result ?? data?.data ?? [];
    return { success: true, data: categories };
  },

  // Get single category
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const url = buildUrl(`/t/inventory/categories/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get category failed (${res.status})` };
    }

    const category: Category = data?.result ?? data?.data ?? data;
    return { success: true, data: category };
  },

  // Create category
  async createCategory(payload: {
    name: string;
    description?: string;
    displayOrder?: number;
    isActive?: boolean;
  }): Promise<ApiResponse<Category>> {
    const url = buildUrl(`/t/inventory/categories`);

    const apiPayload = {
      name: payload.name,
      description: payload.description || "",
      displayOrder: payload.displayOrder || 0,
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

    const category: Category = data?.result ?? data?.data ?? data;
    return { success: true, data: category };
  },

  // Update category
  async updateCategory(id: string, payload: Partial<Category>): Promise<ApiResponse<Category>> {
    const url = buildUrl(`/t/inventory/categories/${id}`);

    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.slug !== undefined) apiPayload.slug = payload.slug;
    if (payload.description !== undefined) apiPayload.description = payload.description;
    if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;
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

    const category: Category = data?.result ?? data?.data ?? data;
    return { success: true, data: category };
  },

  // Delete category
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`/t/inventory/categories/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete category failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
