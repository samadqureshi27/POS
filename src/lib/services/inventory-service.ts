// src/lib/services/inventory-service.ts

import AuthService from "@/lib/auth-service";

// ==================== Types ====================

export interface InventoryItem {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
  type: "stock" | "service";
  categoryId?: string; // API uses categoryId, not category
  baseUnit: string;
  purchaseUnit?: string;
  conversion?: number; // API uses simple number, not object
  trackStock?: boolean;
  reorderPoint?: number;
  barcode?: string;
  taxCategory?: string;
  currentStock?: number;
  image?: string;
  isActive?: boolean; // API uses isActive, not active
  createdAt?: string;
  updatedAt?: string;
}

export interface Unit {
  _id?: string;
  id?: string;
  name: string;
  symbol: string;
  type: "mass" | "volume" | "count" | "length" | "custom";
  active?: boolean;
}

export interface Conversion {
  _id?: string;
  id?: string;
  fromUnit: string;
  toUnit: string;
  factor: number;
  active?: boolean;
}

export interface StockAdjustment {
  type: "receive" | "waste" | "transfer" | "adjustment";
  branchId: string;
  lines: {
    itemId: string;
    qty: number;
    unit: string;
    note?: string;
  }[];
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

// ==================== Inventory Items Service ====================

export const InventoryService = {
  // List inventory items
  async listItems(params?: {
    q?: string;
    page?: number;
    limit?: number;
    type?: "stock" | "service";
    categoryId?: string;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<ApiResponse<InventoryItem[]>> {
    const q = params?.q ?? "";
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 100;

    let url = buildUrl(`/t/inventory/items?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    if (params?.type) url += `&type=${params.type}`;
    if (params?.categoryId) url += `&categoryId=${encodeURIComponent(params.categoryId)}`;
    if (params?.sort) url += `&sort=${params.sort}`;
    if (params?.order) url += `&order=${params.order}`;

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List items failed (${res.status})` };
    }

    const items: InventoryItem[] = data?.items ?? data?.result ?? data?.data ?? [];
    return { success: true, data: items };
  },

  // Get single inventory item
  async getItem(id: string): Promise<ApiResponse<InventoryItem>> {
    const url = buildUrl(`/t/inventory/items/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Get item failed (${res.status})` };
    }

    const item: InventoryItem = data?.result ?? data;
    return { success: true, data: item };
  },

  // Create inventory item
  async createItem(payload: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> {
    const url = buildUrl(`/t/inventory/items`);

    const apiPayload: any = {
      name: payload.name,
      type: payload.type || "stock",
      baseUnit: payload.baseUnit || "pc",
      isActive: payload.isActive ?? true,
    };

    // Optional fields - only include if provided
    if (payload.sku) apiPayload.sku = payload.sku;
    if (payload.categoryId) apiPayload.categoryId = payload.categoryId;
    if (payload.purchaseUnit) apiPayload.purchaseUnit = payload.purchaseUnit;
    if (payload.conversion !== undefined) apiPayload.conversion = payload.conversion;
    if (payload.reorderPoint !== undefined) apiPayload.reorderPoint = payload.reorderPoint;
    if (payload.barcode) apiPayload.barcode = payload.barcode;
    if (payload.taxCategory) apiPayload.taxCategory = payload.taxCategory;

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create item failed (${res.status})` };
    }

    const item: InventoryItem = data?.result ?? data?.data ?? data;
    return { success: true, data: item };
  },

  // Update inventory item
  async updateItem(id: string, payload: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> {
    const url = buildUrl(`/t/inventory/items/${id}`);

    const apiPayload: any = {};
    if (payload.name !== undefined) apiPayload.name = payload.name;
    if (payload.sku !== undefined) apiPayload.sku = payload.sku;
    if (payload.type !== undefined) apiPayload.type = payload.type;
    if (payload.categoryId !== undefined) apiPayload.categoryId = payload.categoryId;
    if (payload.baseUnit !== undefined) apiPayload.baseUnit = payload.baseUnit;
    if (payload.purchaseUnit !== undefined) apiPayload.purchaseUnit = payload.purchaseUnit;
    if (payload.conversion !== undefined) apiPayload.conversion = payload.conversion;
    if (payload.reorderPoint !== undefined) apiPayload.reorderPoint = payload.reorderPoint;
    if (payload.barcode !== undefined) apiPayload.barcode = payload.barcode;
    if (payload.taxCategory !== undefined) apiPayload.taxCategory = payload.taxCategory;
    if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Update item failed (${res.status})` };
    }

    const item: InventoryItem = data?.result ?? data?.data ?? data;
    return { success: true, data: item };
  },

  // Delete inventory item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`/t/inventory/items/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete item failed (${res.status})` };
    }

    return { success: true, data: null };
  },

  // Adjust stock
  async adjustStock(payload: StockAdjustment): Promise<ApiResponse<any>> {
    const url = buildUrl(`/t/inventory/txns`);

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Stock adjustment failed (${res.status})` };
    }

    return { success: true, data: data?.result ?? data };
  },
};

// ==================== Units Service ====================

export const UnitsService = {
  // List units
  async listUnits(params?: { type?: string }): Promise<ApiResponse<Unit[]>> {
    let url = buildUrl(`/t/inventory/units`);
    if (params?.type) url += `?type=${params.type}`;

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List units failed (${res.status})` };
    }

    const units: Unit[] = data?.items ?? data?.result ?? data?.data ?? [];
    return { success: true, data: units };
  },

  // Create unit
  async createUnit(payload: Partial<Unit>): Promise<ApiResponse<Unit>> {
    const url = buildUrl(`/t/inventory/units`);

    const apiPayload = {
      name: payload.name,
      symbol: payload.symbol,
      type: payload.type || "custom",
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create unit failed (${res.status})` };
    }

    const unit: Unit = data?.result ?? data;
    return { success: true, data: unit };
  },

  // Delete unit
  async deleteUnit(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`/t/inventory/units/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete unit failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};

// ==================== Conversions Service ====================

export const ConversionsService = {
  // List conversions
  async listConversions(): Promise<ApiResponse<Conversion[]>> {
    const url = buildUrl(`/t/inventory/conversions`);

    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `List conversions failed (${res.status})` };
    }

    const conversions: Conversion[] = data?.items ?? data?.result ?? [];
    return { success: true, data: conversions };
  },

  // Create conversion
  async createConversion(payload: Partial<Conversion>): Promise<ApiResponse<Conversion>> {
    const url = buildUrl(`/t/inventory/conversions`);

    const apiPayload = {
      fromUnit: payload.fromUnit,
      toUnit: payload.toUnit,
      factor: payload.factor,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(apiPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || `Create conversion failed (${res.status})` };
    }

    const conversion: Conversion = data?.result ?? data;
    return { success: true, data: conversion };
  },

  // Delete conversion
  async deleteConversion(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`/t/inventory/conversions/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || `Delete conversion failed (${res.status})` };
    }

    return { success: true, data: null };
  },
};
