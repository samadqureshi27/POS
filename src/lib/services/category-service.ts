// src/lib/services/category-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";

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

export const CategoryService = {
  async listCategories(params?: { q?: string; status?: string; page?: number; limit?: number }): Promise<ApiListResponse<TenantCategory[]>> {
    try {
      const q = params?.q ?? "";
      const status = params?.status ?? "";
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 50;
      const path = `/t/menu/categories?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<TenantCategory[]>(response);

      // Handle different API response structures
      let items = normalized.data;
      if (response.items) {
        items = response.items;
      } else if (response.result) {
        items = response.result;
      }

      return {
        success: normalized.success,
        data: items,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch categories",
      };
    }
  },

  async getCategory(id: string): Promise<ApiListResponse<TenantCategory>> {
    try {
      const response = await api.get(`/t/menu/categories/${id}`);
      const normalized = normalizeApiResponse<TenantCategory>(response);

      // Handle different API response structures
      let category = normalized.data;
      if (response.result) {
        category = response.result;
      }

      return {
        success: normalized.success,
        data: category,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error fetching category:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch category",
      };
    }
  },

  async createCategory(payload: Partial<TenantCategory>): Promise<ApiListResponse<TenantCategory>> {
    try {
      // Generate slug from name if not provided
      const slug = payload.slug || payload.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Map frontend fields to backend format
      const apiPayload = {
        name: payload.name,
        slug: slug,
        sortIndex: payload.sortIndex ?? 0,
        isActive: payload.isActive ?? true,
      };

      const response = await api.post("/t/menu/categories", apiPayload);
      const normalized = normalizeApiResponse<TenantCategory>(response);

      // Handle different API response structures
      let category = normalized.data;
      if (response.result) {
        category = response.result;
      }

      return {
        success: normalized.success,
        data: category,
        message: normalized.message || "Category created successfully",
      };
    } catch (error: any) {
      console.error("Error creating category:", error);
      return {
        success: false,
        message: error.message || "Failed to create category",
      };
    }
  },

  async updateCategory(id: string, payload: Partial<TenantCategory>): Promise<ApiListResponse<TenantCategory>> {
    try {
      // Map frontend fields to backend format (only include fields being updated)
      const apiPayload: any = {};
      if (payload.name !== undefined) apiPayload.name = payload.name;
      if (payload.slug !== undefined) apiPayload.slug = payload.slug;
      if (payload.sortIndex !== undefined) apiPayload.sortIndex = payload.sortIndex;
      if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;

      const response = await api.put(`/t/menu/categories/${id}`, apiPayload);
      const normalized = normalizeApiResponse<TenantCategory>(response);

      // Handle different API response structures
      let category = normalized.data;
      if (response.result) {
        category = response.result;
      }

      return {
        success: normalized.success,
        data: category,
        message: normalized.message || "Category updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating category:", error);
      return {
        success: false,
        message: error.message || "Failed to update category",
      };
    }
  },

  async deleteCategory(id: string): Promise<ApiListResponse<null>> {
    try {
      const response = await api.delete(`/t/menu/categories/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: null,
        message: normalized.message || "Category deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        message: error.message || "Failed to delete category",
      };
    }
  },
};
