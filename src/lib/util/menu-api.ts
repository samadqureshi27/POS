import { CategoryItem, ApiResponse } from '@/lib/types/category';

export class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: CategoryItem[] = [
    {
      ID: 1,
      Name: "Pizza",
      Status: "Inactive",
      Description: "Delicious Italian pizzas with various toppings.",
      Parent: "None",
      Priority: 1,
      Image: "",
    },
    {
      ID: 2,
      Name: "Salads",
      Status: "Active",
      Description: "Fresh and healthy salads.",
      Parent: "None",
      Priority: 2,
      Image: "",
    },
    {
      ID: 3,
      Name: "Burgers",
      Status: "Active",
      Description: "Juicy burgers with beef, chicken, or veggie patties.",
      Parent: "None",
      Priority: 3,
      Image: "",
    },
    {
      ID: 4,
      Name: "Appetizers",
      Status: "Inactive",
      Description: "Tasty starters to begin your meal.",
      Parent: "None",
      Priority: 4,
      Image: "",
    },
    {
      ID: 5,
      Name: "Desserts",
      Status: "Active",
      Description: "Sweet treats to finish your meal.",
      Parent: "None",
      Priority: 5,
      Image: "",
    },
    {
      ID: 6,
      Name: "Main Course",
      Status: "Active",
      Description: "Hearty main dishes for lunch or dinner.",
      Parent: "None",
      Priority: 6,
      Image: "",
    },
    {
      ID: 7,
      Name: "Beverages",
      Status: "Active",
      Description: "Refreshing drinks and beverages.",
      Parent: "None",
      Priority: 7,
      Image: "",
    },
    {
      ID: 8,
      Name: "Sides",
      Status: "Inactive",
      Description: "Perfect sides to complement your meal.",
      Parent: "None",
      Priority: 8,
      Image: "",
    },
    {
      ID: 9,
      Name: "Soups",
      Status: "Active",
      Description: "Warm and comforting soups.",
      Parent: "None",
      Priority: 9,
      Image: "",
    },
    {
      ID: 10,
      Name: "Kids Menu",
      Status: "Inactive",
      Description: "Special menu items for kids.",
      Parent: "None",
      Priority: 10,
      Image: "",
    },
  ];

  // GET /api/menu-items/
  static async getCategoryItems(): Promise<ApiResponse<CategoryItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Category items fetched successfully",
    };
  }

  // POST /api/menu-items/
  static async createCategoryItem(
    item: Omit<CategoryItem, "ID">
  ): Promise<ApiResponse<CategoryItem>> {
    await this.delay(1000);
    const newId = this.mockData.length + 1;
    const newItem: CategoryItem = {
      ...item,
      ID: newId,
      Image: item.Image || "",
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Category item created successfully",
    };
  }

  // PUT /api/menu-items/{id}/
  static async updateCategoryItem(
    id: number,
    item: Partial<CategoryItem>
  ): Promise<ApiResponse<CategoryItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Category item updated successfully",
    };
  }

  // DELETE /api/menu-items/{id}/
  static async deleteCategoryItem(id: number): Promise<ApiResponse<null>> {
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
      message: "Category item deleted successfully",
    };
  }

  // DELETE /api/menu-items/bulk-delete/
  static async bulkDeleteCategoryItems(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} Category items deleted successfully`,
    };
  }
}