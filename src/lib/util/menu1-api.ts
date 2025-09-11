export interface MenuItem {
  ID: number;
  Name: string;
  Price: number;
  Category: string;
  StockQty: string;
  Status: "Active" | "Inactive";
  Description?: string;
  MealType?: string;
  Priority?: number;
  MinimumQuantity?: number;
  ShowOnMenu?: "Active" | "Inactive";
  Featured?: "Active" | "Inactive";
  StaffPick?: "Active" | "Inactive";
  DisplayType?: string;
  Displaycat?: string;
  SpecialStartDate?: string;
  SpecialEndDate?: string;
  SpecialPrice?: number;
  OptionValue?: string[];
  OptionPrice?: number[];
  MealValue?: string[];
  MealPrice?: number[];
  PName?: string[];
  PPrice?: number[];
  OverRide?: ("Active" | "Inactive")[];
  ShowOnMain?: "Active" | "Inactive";
  SubTBE?: "Active" | "Inactive";
  Deal?: "Active" | "Inactive";
  Special?: "Active" | "Inactive";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  public static mockData: MenuItem[] = [
    {
      ID: 1,
      Name: "Margherita Pizza",
      Price: 23,
      Category: "Pizza",
      StockQty: "25",
      Status: "Active",
      Description: "Fresh tomatoes, mozzarella, and basil",
      MealType: "Evening",
      Priority: 1,
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Slice", "Whole Cake"],
      MealPrice: [0, 25],
      PName: ["Regular", "With Ice Cream"],
      PPrice: [0, 3],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
      SubTBE: "Inactive",
    },
    {
      ID: 2,
      Name: "Caesar Salad",
      Price: 54,
      Displaycat: "Var",
      Category: "Salads",
      StockQty: "15",
      Status: "Active",
      Description: "Crisp romaine lettuce with parmesan",
      MealType: "Afternoon",
      Priority: 2,
      MinimumQuantity: 3,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "2025-06-01",
      SpecialEndDate: "2025-08-31",
      SpecialPrice: 45,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Light", "Full"],
      MealPrice: [0, 10],
      PName: ["Standard", "Deluxe"],
      PPrice: [0, 12],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 3,
      Name: "Beef Burger",
      Price: 7,
      Category: "Burgers",
      StockQty: "30",
      Status: "Active",
      Description: "Juicy beef patty with fresh vegetables",
      MealType: "Evening",
      Priority: 1,
      MinimumQuantity: 2,
      Displaycat: "Var",
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Checkbox",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Solo", "Meal Deal"],
      MealPrice: [0, 6],
      PName: ["Regular", "Gourmet"],
      PPrice: [0, 5],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 4,
      Name: "Chicken Wings",
      Price: 8,
      Category: "Appetizers",
      StockQty: "20",
      Status: "Active",
      Description: "Crispy chicken wings with special sauce",
      MealType: "Evening",
      Priority: 3,
      MinimumQuantity: 6,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      SpecialStartDate: "2025-03-01",
      SpecialEndDate: "2025-05-31",
      SpecialPrice: 6,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["6 pieces", "12 pieces"],
      MealPrice: [0, 8],
      PName: ["Mild", "Hot", "BBQ"],
      PPrice: [0, 1, 2],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      Displaycat: "Var",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 5,
      Name: "Chocolate Cake",
      Price: 8,
      Category: "Desserts",
      StockQty: "12",
      Status: "Active",
      Displaycat: "Var",
      Description: "Rich chocolate cake with ganache",
      MealType: "Afternoon",
      Priority: 2,
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Slice", "Whole Cake"],
      MealPrice: [0, 25],
      PName: ["Regular", "With Ice Cream"],
      PPrice: [0, 3],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
      SubTBE: "Inactive",
    },
    {
      ID: 6,
      Name: "Grilled Salmon",
      Price: 78,
      Category: "Main Course",
      StockQty: "18",
      Displaycat: "Var",
      Description: "Fresh Atlantic salmon grilled to perfection",
      MealType: "Evening",
      Priority: 1,
      Status: "Active",
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      SpecialStartDate: "2025-04-15",
      SpecialEndDate: "2025-06-15",
      SpecialPrice: 65,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Fillet", "Whole Fish"],
      MealPrice: [0, 20],
      PName: ["Plain", "Herb Crusted", "Teriyaki"],
      PPrice: [0, 5, 8],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 7,
      Name: "Cappuccino",
      Price: 89,
      Category: "Beverages",
      StockQty: "50",
      Displaycat: "Var",
      Status: "Active",
      Description: "Rich espresso with steamed milk foam",
      MealType: "Morning",
      Priority: 1,
      MinimumQuantity: 1,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Select",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Regular", "Decaf"],
      MealPrice: [0, 0],
      PName: ["No Sugar", "1 Sugar", "2 Sugars"],
      PPrice: [0, 0, 0],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
    {
      ID: 8,
      Name: "French Fries",
      Price: 8,
      Category: "Sides",
      StockQty: "40",
      Displaycat: "Var",
      Status: "Active",
      Description: "Crispy golden potato fries",
      MealType: "Afternoon",
      Priority: 3,
      MinimumQuantity: 10,
      ShowOnMenu: "Active",
      Featured: "Active",
      StaffPick: "Active",
      DisplayType: "Radio",
      SpecialStartDate: "",
      SpecialEndDate: "",
      SpecialPrice: 0,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [5.99, 7.99, 9.99],
      MealValue: ["Plain", "Seasoned"],
      MealPrice: [0, 1],
      PName: ["Regular", "Sweet Potato"],
      PPrice: [0, 2],
      OverRide: ["Inactive", "Active", "Inactive"],
      ShowOnMain: "Inactive",
      SubTBE: "Inactive",
      Deal: "Inactive",
      Special: "Inactive",
    },
  ];

  static async getMenuItems(): Promise<ApiResponse<MenuItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  static async createMenuItem(item: Omit<MenuItem, "ID">): Promise<ApiResponse<MenuItem>> {
    await this.delay(1000);
    const newId = this.mockData.length > 0 ? Math.max(...this.mockData.map((i) => i.ID)) + 1 : 1;
    const newItem: MenuItem = {
      ...item,
      ID: newId,
      OptionValue: item.OptionValue || ["Regular"],
      OptionPrice: item.OptionPrice || [0],
      MealValue: item.MealValue || [],
      MealPrice: item.MealPrice || [],
      PName: item.PName || [],
      PPrice: item.PPrice || [],
      SpecialStartDate: item.SpecialStartDate || "",
      SpecialEndDate: item.SpecialEndDate || "",
      SpecialPrice: item.SpecialPrice || 0,
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  static async updateMenuItem(id: number, item: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> {
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

  static async deleteMenuItem(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");
    this.mockData.splice(index, 1);
    this.mockData = this.mockData.map((item, idx) => ({ ...item, ID: idx + 1 }));
    return {
      success: true,
      data: null,
      message: "Menu item deleted successfully",
    };
  }

  static async bulkDeleteMenuItem(ids: number[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));
    this.mockData = this.mockData.map((item, idx) => ({ ...item, ID: idx + 1 }));
    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`,
    };
  }
}

export default MenuAPI;