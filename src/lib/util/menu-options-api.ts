// utils/MenuAPI.ts
import { MenuItemOptions, ApiResponse } from '@/lib/types/interfaces';

export class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: MenuItemOptions[] = [
    {
      ID: 1,
      Name: "Cheese Type",
      DisplayType: "Radio",
      Priority: 1,
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
    },
    {
      ID: 2,
      Name: "Toppings",
      DisplayType: "Checkbox",
      Priority: 2,
      OptionValue: ["Olives", "Mushrooms", "Pepperoni", "Onions"],
      OptionPrice: [0.5, 0.5, 1, 0.3],
    },
    {
      ID: 3,
      Name: "Cold Drink",
      DisplayType: "Select",
      Priority: 3,
      OptionValue: ["Coke", "Sprite", "Fanta"],
      OptionPrice: [1.5, 1.5, 1.5],
    },
    {
      ID: 4,
      Name: "Bread Type",
      DisplayType: "Radio",
      Priority: 4,
      OptionValue: ["White", "Whole Wheat", "Multigrain"],
      OptionPrice: [0, 0.2, 0.3],
    },
    {
      ID: 5,
      Name: "Sauce",
      DisplayType: "Checkbox",
      Priority: 5,
      OptionValue: ["Tomato", "Barbecue", "Garlic", "Pesto"],
      OptionPrice: [0, 0.5, 0.3, 0.7],
    },
    {
      ID: 6,
      Name: "Spice Level",
      DisplayType: "Select",
      Priority: 6,
      OptionValue: ["Mild", "Medium", "Hot"],
      OptionPrice: [0, 0, 0],
    },
    {
      ID: 7,
      Name: "Add-ons",
      DisplayType: "Checkbox",
      Priority: 7,
      OptionValue: ["Extra Cheese", "Bacon", "Avocado"],
      OptionPrice: [1, 1.5, 2],
    },
    {
      ID: 8,
      Name: "Cooking Preference",
      DisplayType: "Radio",
      Priority: 8,
      OptionValue: ["Rare", "Medium", "Well Done"],
      OptionPrice: [0, 0, 0],
    },
    {
      ID: 9,
      Name: "Side Dish",
      DisplayType: "Select",
      Priority: 9,
      OptionValue: ["Fries", "Salad", "Coleslaw"],
      OptionPrice: [2, 2.5, 2],
    },
    {
      ID: 10,
      Name: "Serving Size",
      DisplayType: "Radio",
      Priority: 10,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [0, 1, 2],
    },
  ];

  // ✅ GET /api/menu-items/
  static async getMenuItemOptions(): Promise<ApiResponse<MenuItemOptions[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  // ✅ POST /api/menu-items/
  static async createMenuItemOptions(
    item: Omit<MenuItemOptions, "ID">
  ): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(1000);

    // Validation
    if (!item.Name || item.Name.trim().length === 0) {
      throw new Error("Name is required");
    }

    if (!["Radio", "Select", "Checkbox"].includes(item.DisplayType)) {
      throw new Error("Invalid DisplayType");
    }

    if (!item.Priority || item.Priority < 1) {
      throw new Error("Priority must be at least 1");
    }

    // Check for duplicate priority
    if (this.mockData.some(existing => existing.Priority === item.Priority)) {
      throw new Error("Priority already exists");
    }

    // Ensure OptionValue and OptionPrice arrays have same length
    if (item.OptionValue.length !== item.OptionPrice.length) {
      throw new Error("OptionValue and OptionPrice arrays must have the same length");
    }

    // Validate option values are not empty
    if (item.OptionValue.some(val => !val || val.trim().length === 0)) {
      throw new Error("All option values must be non-empty");
    }

    // Validate prices are non-negative
    if (item.OptionPrice.some(price => price < 0)) {
      throw new Error("All prices must be non-negative");
    }

    const newId =
      this.mockData.length > 0
        ? Math.max(...this.mockData.map((i) => i.ID)) + 1
        : 1;
    const newItem: MenuItemOptions = {
      ...item,
      ID: newId,
      Name: item.Name.trim(),
      OptionValue: item.OptionValue.filter(v => v.trim() !== "").map(v => v.trim()),
      OptionPrice: item.OptionPrice.filter((_, index) => item.OptionValue[index] && item.OptionValue[index].trim() !== ""),
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  // ✅ PUT /api/menu-items/{id}/
  static async updateMenuItemOptions(
    id: number,
    item: Partial<MenuItemOptions>
  ): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    // Validation
    if (item.Name !== undefined) {
      if (!item.Name || item.Name.trim().length === 0) {
        throw new Error("Name is required");
      }
    }

    if (item.DisplayType !== undefined) {
      if (!["Radio", "Select", "Checkbox"].includes(item.DisplayType)) {
        throw new Error("Invalid DisplayType");
      }
    }

    if (item.Priority !== undefined) {
      if (!item.Priority || item.Priority < 1) {
        throw new Error("Priority must be at least 1");
      }
      // Check for duplicate priority (excluding current item)
      if (this.mockData.some(existing => existing.ID !== id && existing.Priority === item.Priority)) {
        throw new Error("Priority already exists");
      }
    }

    if (item.OptionValue && item.OptionPrice) {
      // Ensure arrays have same length
      if (item.OptionValue.length !== item.OptionPrice.length) {
        throw new Error("OptionValue and OptionPrice arrays must have the same length");
      }

      // Validate option values are not empty
      if (item.OptionValue.some(val => !val || val.trim().length === 0)) {
        throw new Error("All option values must be non-empty");
      }

      // Validate prices are non-negative
      if (item.OptionPrice.some(price => price < 0)) {
        throw new Error("All prices must be non-negative");
      }
    }

    // Clean data
    if (item.OptionValue) {
      item.OptionValue = item.OptionValue.filter((v) => v.trim() !== "").map(v => v.trim());
    }
    if (item.OptionPrice) {
      item.OptionPrice = item.OptionPrice.filter((p) => p >= 0);
    }
    if (item.Name) {
      item.Name = item.Name.trim();
    }

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Menu item updated successfully",
    };
  }

  // ✅ DELETE /api/menu-items/{id}/
  static async deleteMenuItemOptions(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: "Menu item deleted successfully",
    };
  }

  // ✅ DELETE /api/menu-items/bulk-delete/
  static async bulkDeleteMenuItemOptions(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);

    if (!ids || ids.length === 0) {
      throw new Error("No items selected for deletion");
    }

    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`,
    };
  }

  // ✅ GET /api/menu-items/{id}/
  static async getMenuItemOptionsById(id: number): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(500);
    const item = this.mockData.find((i) => i.ID === id);
    if (!item) throw new Error("Item not found");

    return {
      success: true,
      data: item,
      message: "Menu item fetched successfully",
    };
  }

  // ✅ PUT /api/menu-items/reorder/
  static async reorderMenuItemOptions(
    reorderedItems: { ID: number; Priority: number }[]
  ): Promise<ApiResponse<MenuItemOptions[]>> {
    await this.delay(800);

    // Update priorities
    reorderedItems.forEach(({ ID, Priority }) => {
      const item = this.mockData.find(i => i.ID === ID);
      if (item) {
        item.Priority = Priority;
      }
    });

    // Sort by priority
    this.mockData.sort((a, b) => a.Priority - b.Priority);

    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items reordered successfully",
    };
  }
}