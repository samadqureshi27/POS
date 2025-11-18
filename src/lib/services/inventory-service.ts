// src/lib/services/inventory-service.ts

import { api, normalizeApiResponse, buildApiUrl, buildApiHeaders } from "@/lib/util/api-client";

// ==================== Types ====================

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export interface InventoryItem {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
  type: "stock" | "service";
  categoryId?: string | Category; // Can be either string ID or populated Category object
  baseUnit: string;
  purchaseUnit?: string;
  conversion?: number; // API uses simple number, not object
  trackStock?: boolean;
  reorderPoint?: number;
  barcode?: string;
  taxCategory?: string;
  quantity?: number;
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
  type: "weight" | "volume" | "count" | "custom";
  active?: boolean;
}

// Static industry-standard units for POS/Restaurant systems
export const PREDEFINED_UNITS: Unit[] = [
  // Weight Units
  { name: "Milligram", symbol: "mg", type: "weight", active: true },
  { name: "Gram", symbol: "g", type: "weight", active: true },
  { name: "Kilogram", symbol: "kg", type: "weight", active: true },
  { name: "Ounce", symbol: "oz", type: "weight", active: true },
  { name: "Pound", symbol: "lb", type: "weight", active: true },

  // Volume Units
  { name: "Milliliter", symbol: "ml", type: "volume", active: true },
  { name: "Liter", symbol: "l", type: "volume", active: true },
  { name: "Gallon", symbol: "gal", type: "volume", active: true },
  { name: "Fluid Ounce", symbol: "fl oz", type: "volume", active: true },
  { name: "Cup", symbol: "cup", type: "volume", active: true },
  { name: "Tablespoon", symbol: "tbsp", type: "volume", active: true },
  { name: "Teaspoon", symbol: "tsp", type: "volume", active: true },

  // Count Units
  { name: "Piece", symbol: "pc", type: "count", active: true },
  { name: "Box", symbol: "box", type: "count", active: true },
  { name: "Pack", symbol: "pack", type: "count", active: true },
  { name: "Dozen", symbol: "doz", type: "count", active: true },
  { name: "Case", symbol: "case", type: "count", active: true },
  { name: "Unit", symbol: "unit", type: "count", active: true },
  { name: "Bag", symbol: "bag", type: "count", active: true },
  { name: "Bottle", symbol: "btl", type: "count", active: true },
  { name: "Can", symbol: "can", type: "count", active: true },
  { name: "Jar", symbol: "jar", type: "count", active: true },
];

// Custom units storage key
const CUSTOM_UNITS_STORAGE_KEY = 'pos_custom_units';

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
  stats?: InventoryStats;
}

export interface InventoryStats {
  totalItems: number;
  stockItems: number;
  serviceItems: number;
  lowStock: number;
  outOfStock: number;
  activeItems: number;
  inactiveItems: number;
}

// ==================== Inventory Items Service ====================

export const InventoryService = {
  // Get inventory statistics
  async getStats(params?: {
    categoryId?: string;
  }): Promise<ApiResponse<InventoryStats>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId);

      const queryString = queryParams.toString();
      const path = `/t/inventory/stats${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse(response);

      // Map API response format to our interface
      const apiStats = response?.result ?? response?.stats ?? normalized.data ?? response;
      const stats: InventoryStats = {
        totalItems: apiStats.total ?? 0,
        stockItems: apiStats.tracked ?? 0,
        serviceItems: apiStats.service ?? 0,
        lowStock: apiStats.low ?? 0,
        outOfStock: apiStats.outOfStock ?? 0,
        activeItems: apiStats.active ?? 0,
        inactiveItems: apiStats.inactive ?? 0,
      };

      return { success: true, data: stats };
    } catch (error: any) {
      console.error("Error getting inventory stats:", error);
      return { success: false, message: error.message };
    }
  },

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
    try {
      const queryParams = new URLSearchParams();

      if (params?.q) queryParams.append('q', params.q);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.order) queryParams.append('order', params.order);

      const queryString = queryParams.toString();
      const path = `/t/inventory/items${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(path);
      const normalized = normalizeApiResponse<InventoryItem[]>(response);

      // Handle different API response structures
      const items = response?.items ?? normalized.data ?? [];

      return { success: true, data: items };
    } catch (error: any) {
      console.error("Error listing inventory items:", error);
      return { success: false, message: error.message };
    }
  },

  // Get single inventory item
  async getItem(id: string): Promise<ApiResponse<InventoryItem>> {
    try {
      const response = await api.get(`/t/inventory/items/${id}`);
      const normalized = normalizeApiResponse<InventoryItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message,
      };
    } catch (error: any) {
      console.error("Error getting inventory item:", error);
      return { success: false, message: error.message };
    }
  },

  // Create inventory item
  async createItem(payload: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> {
    try {
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
      // trackStock: Let backend set default based on item type (stock items default to true)
      if (payload.quantity !== undefined) apiPayload.quantity = payload.quantity;

      const response = await api.post(`/t/inventory/items`, apiPayload);
      const normalized = normalizeApiResponse<InventoryItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Item created successfully",
      };
    } catch (error: any) {
      console.error("Error creating inventory item:", error);
      return { success: false, message: error.message };
    }
  },

  // Update inventory item
  async updateItem(id: string, payload: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> {
    try {
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
      if (payload.quantity !== undefined) apiPayload.quantity = payload.quantity;
      // Only include trackStock if explicitly being changed
      if (payload.trackStock !== undefined) apiPayload.trackStock = payload.trackStock;

      const response = await api.put(`/t/inventory/items/${id}`, apiPayload);
      const normalized = normalizeApiResponse<InventoryItem>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Item updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating inventory item:", error);
      return { success: false, message: error.message };
    }
  },

  // Delete inventory item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/t/inventory/items/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: null,
        message: normalized.message || "Item deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting inventory item:", error);
      return { success: false, message: error.message };
    }
  },

  // Adjust stock
  async adjustStock(payload: StockAdjustment): Promise<ApiResponse<any>> {
    try {
      const response = await api.post("/t/inventory/stock/adjust", payload);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Stock adjusted successfully",
      };
    } catch (error: any) {
      console.error("Error adjusting stock:", error);
      return { success: false, message: error.message };
    }
  },

  // ==================== Import/Export Methods ====================

  /**
   * Download CSV template for importing items
   * @param includeSample - Whether to include sample data in the template
   */
  async downloadImportTemplate(includeSample: boolean = true): Promise<ApiResponse<Blob>> {
    try {
      const url = buildApiUrl(`/t/inventory/items/import/template${includeSample ? '?sample=true' : ''}`);
      const headers = buildApiHeaders();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...headers,
          'Accept': 'text/csv, application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error: any) {
      console.error("Error downloading import template:", error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Import items from CSV/XLSX file
   * @param file - The CSV or XLSX file to import
   * @param duplicatePolicy - How to handle duplicate items ('skip' or 'update')
   */
  async importItems(file: File, duplicatePolicy: 'skip' | 'update' = 'skip'): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('duplicatePolicy', duplicatePolicy);

      const url = buildApiUrl("/t/inventory/items/import");
      const headers = buildApiHeaders(false); // Skip Content-Type for FormData

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      console.error("Error importing items:", error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Export items to CSV
   * @param params - Optional filters for export
   */
  async exportItems(params?: {
    q?: string;
    categoryId?: string;
  }): Promise<ApiResponse<Blob>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.q) searchParams.append('q', params.q);
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);

      const queryString = searchParams.toString();
      const url = buildApiUrl(`/t/inventory/items/export.csv${queryString ? `?${queryString}` : ''}`);
      const headers = buildApiHeaders();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...headers,
          'Accept': 'text/csv, application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error: any) {
      console.error("Error exporting items:", error);
      return { success: false, message: error.message };
    }
  },
};

// ==================== Units Service ====================

export const UnitsService = {
  // Get custom units from localStorage
  getCustomUnits(): Unit[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CUSTOM_UNITS_STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  // Save custom units to localStorage
  saveCustomUnits(units: Unit[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CUSTOM_UNITS_STORAGE_KEY, JSON.stringify(units));
  },

  // List all units (predefined + custom)
  async listUnits(params?: { type?: string }): Promise<ApiResponse<Unit[]>> {
    try {
      const customUnits = this.getCustomUnits();
      let allUnits = [...PREDEFINED_UNITS, ...customUnits];

      // Filter by type if specified
      if (params?.type) {
        allUnits = allUnits.filter(unit => unit.type === params.type);
      }

      // Filter only active units
      allUnits = allUnits.filter(unit => unit.active !== false);

      return { success: true, data: allUnits };
    } catch (error: any) {
      console.error("Error listing units:", error);
      return { success: false, message: error.message };
    }
  },

  // Create custom unit
  async createUnit(payload: Partial<Unit>): Promise<ApiResponse<Unit>> {
    try {
      if (!payload.name || !payload.symbol) {
        return { success: false, message: "Name and symbol are required" };
      }

      const customUnits = this.getCustomUnits();

      // Check for duplicate symbol
      const allUnits = [...PREDEFINED_UNITS, ...customUnits];
      if (allUnits.some(u => u.symbol.toLowerCase() === payload.symbol?.toLowerCase())) {
        return { success: false, message: "A unit with this symbol already exists" };
      }

      const newUnit: Unit = {
        id: Date.now().toString(),
        name: payload.name,
        symbol: payload.symbol,
        type: payload.type || "custom",
        active: true,
      };

      customUnits.push(newUnit);
      this.saveCustomUnits(customUnits);

      return { success: true, data: newUnit };
    } catch (error: any) {
      console.error("Error creating unit:", error);
      return { success: false, message: error.message };
    }
  },

  // Delete custom unit (can't delete predefined units)
  async deleteUnit(id: string): Promise<ApiResponse<null>> {
    try {
      const customUnits = this.getCustomUnits();
      const index = customUnits.findIndex(u => u.id === id || u._id === id);

      if (index === -1) {
        return { success: false, message: "Cannot delete predefined units" };
      }

      customUnits.splice(index, 1);
      this.saveCustomUnits(customUnits);

      return { success: true, data: null };
    } catch (error: any) {
      console.error("Error deleting unit:", error);
      return { success: false, message: error.message };
    }
  },
};

// ==================== Conversions Service ====================

export const ConversionsService = {
  // List conversions
  async listConversions(): Promise<ApiResponse<Conversion[]>> {
    try {
      const response = await api.get(`/t/inventory/conversions`);
      const normalized = normalizeApiResponse<Conversion[]>(response);

      // Handle different API response structures
      const conversions = response?.items ?? normalized.data ?? [];

      return { success: true, data: conversions };
    } catch (error: any) {
      console.error("Error listing conversions:", error);
      return { success: false, message: error.message };
    }
  },

  // Create conversion
  async createConversion(payload: Partial<Conversion>): Promise<ApiResponse<Conversion>> {
    try {
      const apiPayload = {
        fromUnit: payload.fromUnit,
        toUnit: payload.toUnit,
        factor: payload.factor,
      };

      const response = await api.post(`/t/inventory/conversions`, apiPayload);
      const normalized = normalizeApiResponse<Conversion>(response);

      return {
        success: normalized.success,
        data: normalized.data,
        message: normalized.message || "Conversion created successfully",
      };
    } catch (error: any) {
      console.error("Error creating conversion:", error);
      return { success: false, message: error.message };
    }
  },

  // Delete conversion
  async deleteConversion(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/t/inventory/conversions/${id}`);
      const normalized = normalizeApiResponse(response);

      return {
        success: normalized.success,
        data: null,
        message: normalized.message || "Conversion deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting conversion:", error);
      return { success: false, message: error.message };
    }
  },
};
