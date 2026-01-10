// src/lib/services/branch-inventory-service.ts

import { buildHeaders } from "@/lib/util/service-helpers";
import { handleApiError, ParsedError } from "@/lib/util/error-handler";

// ==================== Types ====================

export interface BranchInventoryItem {
  _id?: string;
  id?: string;
  branchId: string;
  itemId: string | {  // Can be populated as an object
    _id: string;
    name: string;
    sku: string;
    type: string;
    [key: string]: any;
  };
  itemName?: string;
  itemNameSnapshot?: string;
  skuSnapshot?: string;
  quantity: number;
  reorderPoint?: number;
  minStock?: number;
  maxStock?: number;
  costPerUnit?: number;
  sellingPrice?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Nested objects from API
  branch?: {
    _id: string;
    name: string;
    code: string;
    status: string;
    [key: string]: any;
  };
  item?: {  // Alternative nested field name
    _id: string;
    name: string;
    sku: string;
    type: string;
    [key: string]: any;
  };
  // Frontend calculated fields
  stockStatus?: "Low" | "Medium" | "High";
}

export interface BranchInventoryStats {
  totalItems: number;
  lowStock: number;
  mediumStock: number;
  highStock: number;
  outOfStock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  stats?: BranchInventoryStats;
  error?: ParsedError;
}

// ==================== Configuration ====================

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

// ==================== Helper Functions ====================

function calculateStockStatus(item: BranchInventoryItem): "Low" | "Medium" | "High" {
  const { quantity, reorderPoint, minStock } = item;
  const threshold = reorderPoint || minStock || 0;

  if (quantity === 0) return "Low";
  if (quantity <= threshold) return "Low";
  if (quantity <= threshold * 2) return "Medium";
  return "High";
}

function calculateStats(items: BranchInventoryItem[]): BranchInventoryStats {
  const totalItems = items.length;
  const outOfStock = items.filter(i => i.quantity === 0).length;
  const lowStock = items.filter(i => {
    const threshold = i.reorderPoint || i.minStock || 0;
    return i.quantity > 0 && i.quantity <= threshold;
  }).length;
  const mediumStock = items.filter(i => {
    const threshold = i.reorderPoint || i.minStock || 0;
    return i.quantity > threshold && i.quantity <= threshold * 2;
  }).length;
  const highStock = items.filter(i => {
    const threshold = i.reorderPoint || i.minStock || 0;
    return i.quantity > threshold * 2;
  }).length;

  return {
    totalItems,
    lowStock,
    mediumStock,
    highStock,
    outOfStock
  };
}

// ==================== Branch Inventory Service ====================

export const BranchInventoryService = {
  // Get branch inventory statistics
  async getStats(branchId: number | string): Promise<ApiResponse<BranchInventoryStats>> {
    try {
      // Fetch all items and calculate stats client-side
      const itemsResponse = await this.listItems({ branchId: String(branchId) });

      if (!itemsResponse.success || !itemsResponse.data) {
        return { success: false, message: itemsResponse.message || "Failed to fetch items for stats" };
      }

      const stats = calculateStats(itemsResponse.data);
      return { success: true, data: stats };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'getting branch inventory stats');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  },

  // List branch inventory items
  async listItems(params: {
    branchId: string;
    page?: number;
    limit?: number;
    q?: string;
    status?: "Active" | "Inactive" | "";
  }): Promise<ApiResponse<BranchInventoryItem[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('branchId', params.branchId);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.q) queryParams.append('q', params.q);
      if (params.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const url = buildUrl(`/t/branch-inventory/items${queryString ? `?${queryString}` : ''}`);

      const res = await fetch(url, { headers: buildHeaders() });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const parsedError = handleApiError(
          { ...data, status: res.status },
          'list items'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      let items: BranchInventoryItem[] = data?.items ?? data?.result ?? data?.data ?? [];

      // Add calculated stock status to each item
      items = items.map(item => ({
        ...item,
        stockStatus: calculateStockStatus(item)
      }));

      return { success: true, data: items };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'listing branch inventory items');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  },

  // Get single branch inventory item
  async getItem(id: string): Promise<ApiResponse<BranchInventoryItem>> {
    try {
      const url = buildUrl(`/t/branch-inventory/items/${id}`);
      const res = await fetch(url, { headers: buildHeaders() });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const parsedError = handleApiError(
          { ...data, status: res.status },
          'get item'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      const item: BranchInventoryItem = data?.result ?? data?.data ?? data;
      item.stockStatus = calculateStockStatus(item);

      return { success: true, data: item };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'getting branch inventory item');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  },

  // Create branch inventory item
  async createItem(payload: Partial<BranchInventoryItem>): Promise<ApiResponse<BranchInventoryItem>> {
    try {
      const url = buildUrl(`/t/branch-inventory/items`);

      const apiPayload: any = {
        branchId: payload.branchId,
        itemId: payload.itemId,
        quantity: payload.quantity ?? 0,
        isActive: payload.isActive ?? true,
      };

      // Optional fields
      if (payload.reorderPoint !== undefined) apiPayload.reorderPoint = payload.reorderPoint;
      if (payload.minStock !== undefined) apiPayload.minStock = payload.minStock;
      if (payload.maxStock !== undefined) apiPayload.maxStock = payload.maxStock;
      if (payload.costPerUnit !== undefined) apiPayload.costPerUnit = payload.costPerUnit;
      if (payload.sellingPrice !== undefined) apiPayload.sellingPrice = payload.sellingPrice;


      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const parsedError = handleApiError(
          { ...data, status: res.status },
          'create item'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }


      const item: BranchInventoryItem = data?.result ?? data?.data ?? data;

      if (typeof item.itemId === 'object') {
      }

      item.stockStatus = calculateStockStatus(item);

      return { success: true, data: item };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'creating branch inventory item');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  },

  // Update branch inventory item
  async updateItem(id: string, payload: Partial<BranchInventoryItem>): Promise<ApiResponse<BranchInventoryItem>> {
    try {
      const url = buildUrl(`/t/branch-inventory/items/${id}`);

      const apiPayload: any = {};
      if (payload.quantity !== undefined) apiPayload.quantity = payload.quantity;
      if (payload.reorderPoint !== undefined) apiPayload.reorderPoint = payload.reorderPoint;
      if (payload.minStock !== undefined) apiPayload.minStock = payload.minStock;
      if (payload.maxStock !== undefined) apiPayload.maxStock = payload.maxStock;
      if (payload.costPerUnit !== undefined) apiPayload.costPerUnit = payload.costPerUnit;
      if (payload.sellingPrice !== undefined) apiPayload.sellingPrice = payload.sellingPrice;
      if (payload.isActive !== undefined) apiPayload.isActive = payload.isActive;

      const res = await fetch(url, {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const parsedError = handleApiError(
          { ...data, status: res.status },
          'update item'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      const item: BranchInventoryItem = data?.result ?? data?.data ?? data;
      item.stockStatus = calculateStockStatus(item);

      return { success: true, data: item };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'updating branch inventory item');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  },

  // Delete branch inventory item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    try {
      const url = buildUrl(`/t/branch-inventory/items/${id}`);
      const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const parsedError = handleApiError(
          { ...data, status: res.status },
          'delete item'
        );
        return {
          success: false,
          message: parsedError.message,
          error: parsedError,
        };
      }

      return { success: true, data: null };
    } catch (error: any) {
      const parsedError = handleApiError(error, 'deleting branch inventory item');
      return {
        success: false,
        message: parsedError.message,
        error: parsedError,
      };
    }
  },
};
