// src/lib/services/ingredient-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";

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

const INGREDIENTS_BASE = "/t/catalog/ingredients";

export const IngredientService = {
  async listIngredients(params?: { q?: string; status?: string; unit?: string; page?: number; limit?: number }): Promise<ApiListResponse<TenantIngredient[]>> {
    try {
      const q = params?.q ?? "";
      const status = params?.status ?? "";
      const unit = params?.unit ?? "";
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 50;
      const path = `${INGREDIENTS_BASE}?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&unit=${encodeURIComponent(unit)}&page=${page}&limit=${limit}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<TenantIngredient[]>(response);

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
      console.error("Error listing ingredients:", error);
      return {
        success: false,
        message: error.message || "Failed to list ingredients",
      };
    }
  },

  async getIngredient(id: string): Promise<ApiListResponse<TenantIngredient>> {
    try {
      const response = await api.get(`${INGREDIENTS_BASE}/${id}`);
      const normalized = normalizeApiResponse<TenantIngredient>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error getting ingredient:", error);
      return {
        success: false,
        message: error.message || "Failed to get ingredient",
      };
    }
  },

  async createIngredient(payload: Partial<TenantIngredient>): Promise<ApiListResponse<TenantIngredient>> {
    try {
      const apiPayload: any = {
        name: payload.name,
        sku: payload.sku,
        uom: payload.uom,
        isActive: payload.isActive ?? true,
        description: payload.description ?? payload.notes ?? "",
        minThreshold: payload.minThreshold ?? 0,
        costPerUom: payload.costPerUom ?? 0,
      };

      const response = await api.post(INGREDIENTS_BASE, apiPayload);
      const normalized = normalizeApiResponse<TenantIngredient>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Ingredient created successfully",
      };
    } catch (error: any) {
      console.error("Error creating ingredient:", error);
      return {
        success: false,
        message: error.message || "Failed to create ingredient",
      };
    }
  },

  async updateIngredient(id: string, payload: Partial<TenantIngredient>): Promise<ApiListResponse<TenantIngredient>> {
    try {
      const apiPayload: any = {};
      if (payload.name !== undefined) apiPayload.name = payload.name;
      if (payload.sku !== undefined) apiPayload.sku = payload.sku;
      if (payload.uom !== undefined) apiPayload.uom = payload.uom;
      if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;
      if (payload.description !== undefined) apiPayload.description = payload.description;
      if (payload.minThreshold !== undefined) apiPayload.minThreshold = payload.minThreshold;
      if (payload.costPerUom !== undefined) apiPayload.costPerUom = payload.costPerUom;

      const response = await api.put(`${INGREDIENTS_BASE}/${id}`, apiPayload);
      const normalized = normalizeApiResponse<TenantIngredient>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Ingredient updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating ingredient:", error);
      return {
        success: false,
        message: error.message || "Failed to update ingredient",
      };
    }
  },

  async deleteIngredient(id: string): Promise<ApiListResponse<null>> {
    try {
      const response = await api.delete(`${INGREDIENTS_BASE}/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Ingredient deleted successfully",
        data: null,
      };
    } catch (error: any) {
      console.error("Error deleting ingredient:", error);
      return {
        success: false,
        message: error.message || "Failed to delete ingredient",
      };
    }
  },
};