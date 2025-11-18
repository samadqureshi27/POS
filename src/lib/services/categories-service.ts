// src/lib/services/categories-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

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
    try {
      const q = params?.q ?? "";
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 100;

      let path = `/t/inventory/categories?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
      if (params?.isActive !== undefined) path += `&isActive=${params.isActive}`;
      if (params?.sort) path += `&sort=${params.sort}`;
      if (params?.order) path += `&order=${params.order}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<Category[]>(response);

      // Handle different API response structures
      let categories = normalized.data;
      if (response.items) {
        categories = response.items;
      } else if (response.result) {
        categories = response.result;
      }

      return {
        success: normalized.success,
        data: categories,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error fetching categories", error, {
        component: "CategoriesService",
        action: "listCategories",
      });
      return {
        success: false,
        message: error.message || "Failed to fetch categories",
      };
    }
  },

  // Get single category
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    try {
      const response = await api.get(`/t/inventory/categories/${id}`);
      const normalized = normalizeApiResponse<Category>(response);

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
      logError("Error fetching category", error, {
        component: "CategoriesService",
        action: "getCategory",
        categoryId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to fetch category",
      };
    }
  },

  // Create category
  async createCategory(payload: {
    name: string;
    description?: string;
    displayOrder?: number;
    isActive?: boolean;
  }): Promise<ApiResponse<Category>> {
    try {
      const apiPayload = {
        name: payload.name,
        description: payload.description || "",
        displayOrder: payload.displayOrder || 0,
        isActive: payload.isActive ?? true,
      };

      const response = await api.post("/t/inventory/categories", apiPayload);
      const normalized = normalizeApiResponse<Category>(response);

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
      logError("Error creating category", error, {
        component: "CategoriesService",
        action: "createCategory",
      });
      return {
        success: false,
        message: error.message || "Failed to create category",
      };
    }
  },

  // Update category
  async updateCategory(id: string, payload: Partial<Category>): Promise<ApiResponse<Category>> {
    try {
      const apiPayload: any = {};
      if (payload.name !== undefined) apiPayload.name = payload.name;
      if (payload.slug !== undefined) apiPayload.slug = payload.slug;
      if (payload.description !== undefined) apiPayload.description = payload.description;
      if (payload.displayOrder !== undefined) apiPayload.displayOrder = payload.displayOrder;
      if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;

      const response = await api.put(`/t/inventory/categories/${id}`, apiPayload);
      const normalized = normalizeApiResponse<Category>(response);

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
      logError("Error updating category", error, {
        component: "CategoriesService",
        action: "updateCategory",
        categoryId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update category",
      };
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/t/inventory/categories/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: null,
        message: normalized.message || "Category deleted successfully",
      };
    } catch (error: any) {
      logError("Error deleting category", error, {
        component: "CategoriesService",
        action: "deleteCategory",
        categoryId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to delete category",
      };
    }
  },
};
