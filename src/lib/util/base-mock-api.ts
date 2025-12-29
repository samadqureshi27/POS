/**
 * Generic Mock API Base Class
 *
 * Provides common CRUD operations for mock API classes with branch filtering.
 * Eliminates duplicate code across vendor-api, report-api, payment-api, etc.
 *
 * @example
 * export class VendorAPI extends BaseMockAPI<VendorItem> {
 *   protected static mockData: VendorItem[] = [...]
 *   protected static idField = "ID" as const;
 *   protected static branchIdField = "Branch_ID_fk" as const;
 * }
 */

import { ApiResponse } from "@/lib/types/common";

export interface BranchFilterable {
  [key: string]: any; // Must have a branch ID field
}

export interface Identifiable {
  [key: string]: any; // Must have an ID field
}

/**
 * Base Mock API Class - Production-level pattern for reducing duplication
 */
export abstract class BaseMockAPI<TItem extends BranchFilterable & Identifiable> {
  // Subclasses must provide mock data
  protected static mockData: any[] = [];

  // Subclasses must specify ID field name (e.g., "Staff_ID", "ID", etc.)
  protected static idField: string = "ID";

  // Subclasses must specify branch ID field name
  protected static branchIdField: string = "Branch_ID_fk";

  /**
   * Simulate network delay for realistic mock API behavior
   */
  protected static delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Get next available ID for creating new items
   */
  protected static getNextId(): string | number {
    const items = this.mockData;
    if (items.length === 0) return 1;

    const idField = this.idField;
    const ids = items.map((item) => {
      const id = item[idField];
      return typeof id === "string" ? parseInt(id, 10) : id;
    });
    const maxId = Math.max(...ids);
    return maxId + 1;
  }

  /**
   * GET items by branch ID
   */
  protected static async getItemsByBranch(
    branchId: string | number
  ): Promise<ApiResponse<any[]>> {
    await this.delay(800);

    const branchIdField = this.branchIdField;
    const filteredData = this.mockData.filter(
      (item) => item[branchIdField] == branchId // Use == for loose comparison
    );

    return {
      success: true,
      data: filteredData,
      message: `Items for branch ${branchId} fetched successfully`,
    };
  }

  /**
   * POST - Create new item
   */
  protected static async createItem(
    item: Omit<any, typeof BaseMockAPI.idField>,
    branchId?: string | number
  ): Promise<ApiResponse<any>> {
    await this.delay(1000);

    const idField = this.idField;
    const branchIdField = this.branchIdField;

    const newItem = {
      ...item,
      [idField]: this.getNextId().toString(),
      [branchIdField]: branchId || item[branchIdField],
    };

    this.mockData.push(newItem);

    return {
      success: true,
      data: newItem,
      message: "Item created successfully",
    };
  }

  /**
   * PUT - Update existing item
   */
  protected static async updateItem(
    id: string | number,
    updates: Partial<any>
  ): Promise<ApiResponse<any>> {
    await this.delay(1000);

    const idField = this.idField;
    const index = this.mockData.findIndex((item) => item[idField] == id);

    if (index === -1) {
      return {
        success: false,
        data: null as any,
        message: "Item not found",
      };
    }

    this.mockData[index] = { ...this.mockData[index], ...updates };

    return {
      success: true,
      data: this.mockData[index],
      message: "Item updated successfully",
    };
  }

  /**
   * DELETE - Delete single item
   */
  protected static async deleteItem(
    id: string | number
  ): Promise<ApiResponse<null>> {
    await this.delay(800);

    const idField = this.idField;
    const initialLength = this.mockData.length;

    this.mockData = this.mockData.filter((item) => item[idField] != id);

    const wasDeleted = this.mockData.length < initialLength;

    return {
      success: wasDeleted,
      data: null,
      message: wasDeleted ? "Item deleted successfully" : "Item not found",
    };
  }

  /**
   * DELETE - Bulk delete items
   */
  protected static async bulkDeleteItems(
    ids: (string | number)[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1200);

    const idField = this.idField;
    const initialLength = this.mockData.length;

    this.mockData = this.mockData.filter(
      (item) => !ids.some((id) => item[idField] == id)
    );

    const deletedCount = initialLength - this.mockData.length;

    return {
      success: deletedCount > 0,
      data: null,
      message: `${deletedCount} item(s) deleted successfully`,
    };
  }

  /**
   * GET - Get all items (no branch filter)
   */
  protected static async getAllItems(): Promise<ApiResponse<any[]>> {
    await this.delay(800);

    return {
      success: true,
      data: [...this.mockData],
      message: "All items fetched successfully",
    };
  }

  /**
   * GET - Get single item by ID
   */
  protected static async getItemById(
    id: string | number
  ): Promise<ApiResponse<any>> {
    await this.delay(500);

    const idField = this.idField;
    const item = this.mockData.find((item) => item[idField] == id);

    if (!item) {
      return {
        success: false,
        data: null as any,
        message: "Item not found",
      };
    }

    return {
      success: true,
      data: item,
      message: "Item fetched successfully",
    };
  }
}
