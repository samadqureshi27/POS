// src/lib/services/combo-service.ts

import { api, normalizeApiResponse } from "@/lib/util/api-client";
import { logError } from "@/lib/util/logger";

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

const COMBOS_BASE = "/t/catalog/combos";

export const ComboService = {
  async listCombos(params?: { q?: string; page?: number; limit?: number; active?: boolean }): Promise<ApiListResponse<TenantCombo[]>> {
    try {
      const q = params?.q ?? "";
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 50;
      const active = params?.active;

      let path = `${COMBOS_BASE}?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
      if (active !== undefined) path += `&active=${active}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<TenantCombo[]>(response);

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
      logError("Error listing combos", error, {
        component: "ComboService",
        action: "listCombos",
      });
      return {
        success: false,
        message: error.message || "Failed to list combos",
      };
    }
  },

  async getCombo(id: string): Promise<ApiListResponse<TenantCombo>> {
    try {
      const response = await api.get(`${COMBOS_BASE}/${id}`);
      const normalized = normalizeApiResponse<TenantCombo>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      logError("Error getting combo", error, {
        component: "ComboService",
        action: "getCombo",
        comboId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to get combo",
      };
    }
  },

  async createCombo(payload: Partial<TenantCombo>): Promise<ApiListResponse<TenantCombo>> {
    try {
      // Generate slug from name if not provided
      const slug = payload.slug || payload.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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

      const response = await api.post(COMBOS_BASE, apiPayload);
      const normalized = normalizeApiResponse<TenantCombo>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Combo created successfully",
      };
    } catch (error: any) {
      logError("Error creating combo", error, {
        component: "ComboService",
        action: "createCombo",
      });
      return {
        success: false,
        message: error.message || "Failed to create combo",
      };
    }
  },

  async updateCombo(id: string, payload: Partial<TenantCombo>): Promise<ApiListResponse<TenantCombo>> {
    try {
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

      const response = await api.put(`${COMBOS_BASE}/${id}`, apiPayload);
      const normalized = normalizeApiResponse<TenantCombo>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Combo updated successfully",
      };
    } catch (error: any) {
      logError("Error updating combo", error, {
        component: "ComboService",
        action: "updateCombo",
        comboId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to update combo",
      };
    }
  },

  async deleteCombo(id: string): Promise<ApiListResponse<null>> {
    try {
      const response = await api.delete(`${COMBOS_BASE}/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        message: normalized.message || "Combo deleted successfully",
        data: null,
      };
    } catch (error: any) {
      logError("Error deleting combo", error, {
        component: "ComboService",
        action: "deleteCombo",
        comboId: id,
      });
      return {
        success: false,
        message: error.message || "Failed to delete combo",
      };
    }
  },
};
