interface RecipeOption {
  ID: number;
  Name: string;
  price: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: RecipeOption[] = [
    {
      ID: 1,
      Name: "Cheese",
      price: 1.5,
    },
    {
      ID: 2,
      Name: "Pepperoni",
      price: 2.0,
    },
    {
      ID: 3,
      Name: "Mushrooms",
      price: 1.2,
    },
    {
      ID: 4,
      Name: "Olives",
      price: 1.0,
    },
    {
      ID: 5,
      Name: "Onions",
      price: 0.8,
    },
    {
      ID: 6,
      Name: "Green Peppers",
      price: 1.1,
    },
    {
      ID: 7,
      Name: "Bacon",
      price: 2.5,
    },
    {
      ID: 8,
      Name: "Pineapple",
      price: 1.7,
    },
    {
      ID: 9,
      Name: "Tomato",
      price: 0.9,
    },
    {
      ID: 10,
      Name: "Spinach",
      price: 1.3,
    },
  ];

  // ✅ GET /api/menu-items/
  static async getRecipeOption(): Promise<ApiResponse<RecipeOption[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  // ✅ POST /api/menu-items/
  static async createRecipeOption(
    item: Omit<RecipeOption, "ID">
  ): Promise<ApiResponse<RecipeOption>> {
    await this.delay(1000);
    const newId =
      this.mockData.length > 0
        ? Math.max(...this.mockData.map((i) => i.ID)) + 1
        : 1;
    const newItem: RecipeOption = {
      ...item,
      ID: newId,
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  // ✅ PUT /api/menu-items/{id}/
  static async updateRecipeOption(
    id: number,
    item: Partial<RecipeOption>
  ): Promise<ApiResponse<RecipeOption>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Menu item updated successfully",
    };
  }

  // ✅ DELETE /api/menu-items/{id}/
  static async deleteRecipeOption(id: number): Promise<ApiResponse<null>> {
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
  static async bulkDeleteRecipeOption(
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
      message: `${ids.length} menu items deleted successfully`,
    };
  }
}

export { MenuAPI };
export type { RecipeOption, ApiResponse };