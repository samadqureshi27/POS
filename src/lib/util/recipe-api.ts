export interface RecipeOption {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  OptionValue: string[];
  OptionPrice: number[];
  IngredientValue: string[];
  IngredientPrice: number[];
  Priority: number;
}

export interface Ingredient {
  ID: number;
  Name: string;
  Unit: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  public static mockData: RecipeOption[] = [
    {
      ID: 1,
      Name: "Cheese",
      Status: "Active",
      Description: "Bread",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 1,
    },
    {
      ID: 2,
      Name: "Pepperoni",
      Status: "Active",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 2,
    },
    {
      ID: 3,
      Name: "Mushrooms",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 4,
      Name: "Olives",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 5,
      Name: "Onions",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 4,
    },
    {
      ID: 6,
      Name: "Green Peppers",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 7,
      Name: "Bacon",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 8,
      Name: "Pineapple",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 9,
      Name: "Tomato",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 4,
    },
    {
      ID: 10,
      Name: "Spinach",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 4,
    },
  ];

  // Mock ingredients data with units
  public static mockIngredients: Ingredient[] = [
    { ID: 1, Name: "Tomato", Unit: "kg" },
    { ID: 2, Name: "Cheese", Unit: "g" },
    { ID: 3, Name: "Onion", Unit: "pieces" },
    { ID: 4, Name: "Lettuce", Unit: "g" },
    { ID: 5, Name: "Chicken", Unit: "kg" },
    { ID: 6, Name: "Beef", Unit: "kg" },
    { ID: 7, Name: "Flour", Unit: "g" },
    { ID: 8, Name: "Sugar", Unit: "g" },
    { ID: 9, Name: "Salt", Unit: "g" },
    { ID: 10, Name: "Pepper", Unit: "g" },
  ];

  static async getRecipeOption(): Promise<ApiResponse<RecipeOption[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  static async getIngredients(): Promise<ApiResponse<Ingredient[]>> {
    await this.delay(600);
    return {
      success: true,
      data: [...this.mockIngredients],
      message: "Ingredients fetched successfully",
    };
  }

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

  static async deleteRecipeOption(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);
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

  static async bulkDeleteRecipeOption(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
      OptionValue: item.OptionValue ?? [],
      OptionPrice: item.OptionPrice ?? [],
      IngredientValue: item.IngredientValue ?? [],
      IngredientPrice: item.IngredientPrice ?? [],
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`,
    };
  }
}

export default MenuAPI;