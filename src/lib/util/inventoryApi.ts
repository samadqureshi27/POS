// src/lib/util/inventoryApi.ts

export interface Unit {
  ID: number;
  name: string;
  symbol: string;
  type: "mass" | "volume" | "count" | "length" | "custom";
  Status: "Active" | "Inactive";
}

export interface Conversion {
  ID: number;
  fromUnit: string;
  toUnit: string;
  factor: number;
  Status: "Active" | "Inactive";
}

export interface Vendor {
  ID: number;
  Company_Name: string;
  Name: string;
  Contact: string;
  Address: string;
  Email: string;
}

export interface Branch {
  ID: number;
  name: string;
  location: string;
}

export interface InventoryItem {
  ID: number;
  name: string;
  sku?: string;
  type: "stock" | "service";
  baseUnit: string;
  purchaseUnit?: string;
  conversionFactor?: number;
  trackStock: boolean;
  category?: string;
  reorderPoint?: number;
  barcode?: string;
  taxCategory?: string;
  quantity?: number;
  Status: "Active" | "Inactive";
  Priority: number;
  vendors?: number[]; // Array of vendor IDs
  branches?: { branchId: number; quantity: number }[]; // Branch distribution
}

// Mock delay
const mockDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Mock Units Data
let mockUnits: Unit[] = [
  { ID: 1, name: "Gram", symbol: "g", type: "mass", Status: "Active" },
  { ID: 2, name: "Kilogram", symbol: "kg", type: "mass", Status: "Active" },
  { ID: 3, name: "Milliliter", symbol: "ml", type: "volume", Status: "Active" },
  { ID: 4, name: "Liter", symbol: "l", type: "volume", Status: "Active" },
  { ID: 5, name: "Piece", symbol: "pc", type: "count", Status: "Active" },
  { ID: 6, name: "Dozen", symbol: "dz", type: "count", Status: "Active" },
  { ID: 7, name: "Pound", symbol: "lb", type: "mass", Status: "Active" },
  { ID: 8, name: "Ounce", symbol: "oz", type: "mass", Status: "Active" },
];

// Mock Conversions Data
let mockConversions: Conversion[] = [
  { ID: 1, fromUnit: "kg", toUnit: "g", factor: 1000, Status: "Active" },
  { ID: 2, fromUnit: "l", toUnit: "ml", factor: 1000, Status: "Active" },
  { ID: 3, fromUnit: "dz", toUnit: "pc", factor: 12, Status: "Active" },
  { ID: 4, fromUnit: "lb", toUnit: "g", factor: 453.592, Status: "Active" },
  { ID: 5, fromUnit: "lb", toUnit: "oz", factor: 16, Status: "Active" },
];

// Mock Vendors Data
let mockVendors: Vendor[] = [
  { ID: 1, Company_Name: "Fresh Foods Supplies", Name: "John Doe", Contact: "+1-555-0101", Address: "123 Market St, NYC", Email: "john@freshfoods.com" },
  { ID: 2, Company_Name: "Quality Meats Co.", Name: "Jane Smith", Contact: "+1-555-0102", Address: "456 Butcher Ln, Chicago", Email: "jane@qualitymeats.com" },
  { ID: 3, Company_Name: "Dairy Farms Ltd", Name: "Bob Wilson", Contact: "+1-555-0103", Address: "789 Farm Rd, Wisconsin", Email: "bob@dairyfarms.com" },
  { ID: 4, Company_Name: "Spice World Inc", Name: "Alice Brown", Contact: "+1-555-0104", Address: "321 Spice Ave, LA", Email: "alice@spiceworld.com" },
];

// Mock Branches Data
let mockBranches: Branch[] = [
  { ID: 1, name: "Main Branch", location: "Downtown" },
  { ID: 2, name: "North Branch", location: "Uptown" },
  { ID: 3, name: "East Branch", location: "East Side" },
  { ID: 4, name: "West Branch", location: "West Side" },
];

// Mock Categories (mutable for adding new categories)
export let mockCategories = [
  "raw-protein",
  "dairy",
  "vegetables",
  "fruits",
  "sauces",
  "spices",
  "oils",
  "beverages",
  "bakery",
  "frozen",
];

// Mock Inventory Items Data
let mockInventoryItems: InventoryItem[] = [
  {
    ID: 1,
    name: "Chicken Breast",
    sku: "CHICK-BRST",
    type: "stock",
    baseUnit: "g",
    purchaseUnit: "kg",
    conversionFactor: 1000,
    trackStock: true,
    category: "raw-protein",
    reorderPoint: 5000,
    barcode: "1234567890",
    taxCategory: "food",
    quantity: 8000,
    Status: "Active",
    Priority: 1,
    vendors: [1, 2],
    branches: [
      { branchId: 1, quantity: 5000 },
      { branchId: 2, quantity: 3000 },
    ],
  },
  {
    ID: 2,
    name: "Tomato Sauce",
    sku: "TOM-SAUCE",
    type: "stock",
    baseUnit: "ml",
    purchaseUnit: "l",
    conversionFactor: 1000,
    trackStock: true,
    category: "sauces",
    reorderPoint: 2000,
    quantity: 5500,
    Status: "Active",
    Priority: 2,
  },
  {
    ID: 3,
    name: "Mozzarella Cheese",
    sku: "MOZ-CHEESE",
    type: "stock",
    baseUnit: "g",
    purchaseUnit: "kg",
    conversionFactor: 1000,
    trackStock: true,
    category: "dairy",
    reorderPoint: 3000,
    quantity: 1500,
    Status: "Active",
    Priority: 3,
  },
  {
    ID: 4,
    name: "Extra Shot",
    sku: "ADD-ESP-SHOT",
    type: "service",
    baseUnit: "pc",
    trackStock: false,
    taxCategory: "beverage",
    Status: "Active",
    Priority: 4,
  },
  {
    ID: 5,
    name: "Salt",
    sku: "SALT",
    type: "stock",
    baseUnit: "g",
    trackStock: true,
    category: "spices",
    reorderPoint: 500,
    quantity: 0,
    Status: "Active",
    Priority: 5,
  },
  {
    ID: 6,
    name: "Olive Oil",
    sku: "OLIVE-OIL",
    type: "stock",
    baseUnit: "ml",
    purchaseUnit: "l",
    conversionFactor: 1000,
    trackStock: true,
    category: "oils",
    reorderPoint: 1000,
    quantity: 3200,
    Status: "Inactive",
    Priority: 6,
  },
];

export const InventoryAPI = {
  // Vendors
  async getVendors(): Promise<{ success: boolean; data: Vendor[] }> {
    await mockDelay();
    return { success: true, data: [...mockVendors] };
  },

  async createVendor(vendor: Omit<Vendor, "ID">): Promise<{ success: boolean; data: Vendor; message: string }> {
    await mockDelay();
    const maxId = mockVendors.reduce((max, v) => (v.ID > max ? v.ID : max), 0);
    const newVendor: Vendor = { ...vendor, ID: maxId + 1 };
    mockVendors.push(newVendor);
    return { success: true, data: newVendor, message: "Vendor created successfully" };
  },

  async deleteVendor(id: number): Promise<{ success: boolean; message: string }> {
    await mockDelay();
    mockVendors = mockVendors.filter(v => v.ID !== id);
    return { success: true, message: "Vendor deleted successfully" };
  },

  // Branches
  async getBranches(): Promise<{ success: boolean; data: Branch[] }> {
    await mockDelay();
    return { success: true, data: [...mockBranches] };
  },

  // Categories
  async getCategories(): Promise<{ success: boolean; data: string[] }> {
    await mockDelay();
    return { success: true, data: [...mockCategories] };
  },

  async createCategory(category: string): Promise<{ success: boolean; data: string; message: string }> {
    await mockDelay();
    const trimmedCategory = category.trim().toLowerCase();

    if (!trimmedCategory) {
      return { success: false, data: "", message: "Category name cannot be empty" };
    }

    if (mockCategories.includes(trimmedCategory)) {
      return { success: false, data: trimmedCategory, message: "Category already exists" };
    }

    mockCategories.push(trimmedCategory);
    return { success: true, data: trimmedCategory, message: "Category created successfully" };
  },

  // Units
  async getUnits(): Promise<{ success: boolean; data: Unit[] }> {
    await mockDelay();
    return { success: true, data: [...mockUnits] };
  },

  async createUnit(unit: Omit<Unit, "ID">): Promise<{ success: boolean; data: Unit; message: string }> {
    await mockDelay();
    const maxId = mockUnits.reduce((max, u) => (u.ID > max ? u.ID : max), 0);
    const newUnit: Unit = { ...unit, ID: maxId + 1 };
    mockUnits.push(newUnit);
    return { success: true, data: newUnit, message: "Unit created successfully" };
  },

  async deleteUnit(id: number): Promise<{ success: boolean; message: string }> {
    await mockDelay();
    mockUnits = mockUnits.filter(u => u.ID !== id);
    return { success: true, message: "Unit deleted successfully" };
  },

  // Conversions
  async getConversions(): Promise<{ success: boolean; data: Conversion[] }> {
    await mockDelay();
    return { success: true, data: [...mockConversions] };
  },

  async createConversion(conversion: Omit<Conversion, "ID">): Promise<{ success: boolean; data: Conversion; message: string }> {
    await mockDelay();
    const maxId = mockConversions.reduce((max, c) => (c.ID > max ? c.ID : max), 0);
    const newConversion: Conversion = { ...conversion, ID: maxId + 1 };
    mockConversions.push(newConversion);
    return { success: true, data: newConversion, message: "Conversion created successfully" };
  },

  async deleteConversion(id: number): Promise<{ success: boolean; message: string }> {
    await mockDelay();
    mockConversions = mockConversions.filter(c => c.ID !== id);
    return { success: true, message: "Conversion deleted successfully" };
  },

  // Inventory Items
  async getInventoryItems(filters?: {
    q?: string;
    type?: "stock" | "service";
    category?: string;
    status?: "Active" | "Inactive";
  }): Promise<{ success: boolean; data: InventoryItem[] }> {
    await mockDelay();

    let filtered = [...mockInventoryItems];

    if (filters) {
      if (filters.q) {
        const search = filters.q.toLowerCase();
        filtered = filtered.filter(
          item =>
            item.name.toLowerCase().includes(search) ||
            item.sku?.toLowerCase().includes(search) ||
            item.barcode?.toLowerCase().includes(search)
        );
      }

      if (filters.type) {
        filtered = filtered.filter(item => item.type === filters.type);
      }

      if (filters.category) {
        filtered = filtered.filter(item => item.category === filters.category);
      }

      if (filters.status) {
        filtered = filtered.filter(item => item.Status === filters.status);
      }
    }

    return { success: true, data: filtered };
  },

  async createInventoryItem(item: Omit<InventoryItem, "ID">): Promise<{ success: boolean; data: InventoryItem; message: string }> {
    await mockDelay();
    const maxId = mockInventoryItems.reduce((max, i) => (i.ID > max ? i.ID : max), 0);
    const newItem: InventoryItem = { ...item, ID: maxId + 1 };
    mockInventoryItems.push(newItem);
    return { success: true, data: newItem, message: "Item created successfully" };
  },

  async updateInventoryItem(id: number, updates: Partial<InventoryItem>): Promise<{ success: boolean; data: InventoryItem; message: string }> {
    await mockDelay();
    const index = mockInventoryItems.findIndex(item => item.ID === id);

    if (index === -1) {
      return { success: false, data: {} as InventoryItem, message: "Item not found" };
    }

    mockInventoryItems[index] = { ...mockInventoryItems[index], ...updates };
    return { success: true, data: mockInventoryItems[index], message: "Item updated successfully" };
  },

  async deleteInventoryItem(id: number): Promise<{ success: boolean; message: string }> {
    await mockDelay();
    mockInventoryItems = mockInventoryItems.filter(item => item.ID !== id);
    return { success: true, message: "Item deleted successfully" };
  },
};
