// services/ingredientsApi.ts

import { 
  InventoryItem, 
  ApiResponse, 
  PaginatedResponse,
  FilterOptions 
} from '../types/ingredients';

// Mock API delay
const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock data for development
const mockData: InventoryItem[] = [
  {
    ID: "#001",
    Name: "Bread",
    Status: "Active",
    Description: "Fresh bread for daily use",
    Unit: "Kilograms (Kg's)",
    Priority: 1,
  },
  {
    ID: "#002",
    Name: "Oat Bread",
    Status: "Active",
    Description: "Healthy oat bread option",
    Unit: "Kilograms (Kg's)",
    Priority: 2,
  },
  {
    ID: "#003",
    Name: "French Bread",
    Status: "Inactive",
    Description: "Traditional French bread",
    Unit: "Kilograms (Kg's)",
    Priority: 3,
  },
];

/**
 * Ingredients API Service
 * This service can be easily replaced with real API calls
 */
export class IngredientsApiService {
  private static instance: IngredientsApiService;
  private baseUrl: string;
  private mockData: InventoryItem[] = [...mockData];

  constructor(baseUrl: string = '/api/ingredients') {
    this.baseUrl = baseUrl;
  }

  static getInstance(baseUrl?: string): IngredientsApiService {
    if (!IngredientsApiService.instance) {
      IngredientsApiService.instance = new IngredientsApiService(baseUrl);
    }
    return IngredientsApiService.instance;
  }

  /**
   * Fetch all ingredients with optional filtering
   */
  async getIngredients(
    filters?: Partial<FilterOptions>,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<InventoryItem>> {
    await mockDelay();

    try {
      let filteredData = [...this.mockData];

      // Apply filters
      if (filters) {
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          filteredData = filteredData.filter(item =>
            item.Name.toLowerCase().includes(searchTerm) ||
            item.ID.toLowerCase().includes(searchTerm) ||
            item.Unit.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.statusFilter) {
          filteredData = filteredData.filter(item => 
            item.Status === filters.statusFilter
          );
        }

        if (filters.unitFilter) {
          filteredData = filteredData.filter(item => 
            item.Unit === filters.unitFilter
          );
        }
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch ingredients');
    }
  }

  /**
   * Get a single ingredient by ID
   */
  async getIngredientById(id: string): Promise<ApiResponse<InventoryItem>> {
    await mockDelay();

    try {
      const item = this.mockData.find(item => item.ID === id);
      
      if (!item) {
        return {
          success: false,
          data: {} as InventoryItem,
          message: 'Ingredient not found'
        };
      }

      return {
        success: true,
        data: item
      };
    } catch (error) {
      throw new Error('Failed to fetch ingredient');
    }
  }

  /**
   * Create a new ingredient
   */
  async createIngredient(
    ingredient: Omit<InventoryItem, 'ID'>
  ): Promise<ApiResponse<InventoryItem>> {
    await mockDelay();

    try {
      // Generate new ID
      const maxId = this.mockData.reduce((max, item) => {
        const num = parseInt(item.ID.replace('#', ''));
        return num > max ? num : max;
      }, 0);
      
      const newId = `#${String(maxId + 1).padStart(3, '0')}`;
      
      const newIngredient: InventoryItem = {
        ...ingredient,
        ID: newId
      };

      this.mockData.push(newIngredient);

      return {
        success: true,
        data: newIngredient,
        message: 'Ingredient created successfully'
      };
    } catch (error) {
      throw new Error('Failed to create ingredient');
    }
  }

  /**
   * Update an existing ingredient
   */
  async updateIngredient(
    id: string,
    updates: Partial<Omit<InventoryItem, 'ID'>>
  ): Promise<ApiResponse<InventoryItem>> {
    await mockDelay();

    try {
      const index = this.mockData.findIndex(item => item.ID === id);
      
      if (index === -1) {
        return {
          success: false,
          data: {} as InventoryItem,
          message: 'Ingredient not found'
        };
      }

      this.mockData[index] = {
        ...this.mockData[index],
        ...updates
      };

      return {
        success: true,
        data: this.mockData[index],
        message: 'Ingredient updated successfully'
      };
    } catch (error) {
      throw new Error('Failed to update ingredient');
    }
  }

  /**
   * Delete ingredients by IDs
   */
  async deleteIngredients(ids: string[]): Promise<ApiResponse<string[]>> {
    await mockDelay();

    try {
      const deletedIds: string[] = [];
      
      this.mockData = this.mockData.filter(item => {
        if (ids.includes(item.ID)) {
          deletedIds.push(item.ID);
          return false;
        }
        return true;
      });

      // Reassign IDs sequentially
      this.mockData = this.mockData.map((item, index) => ({
        ...item,
        ID: `#${String(index + 1).padStart(3, '0')}`
      }));

      return {
        success: true,
        data: deletedIds,
        message: `${deletedIds.length} ingredient(s) deleted successfully`
      };
    } catch (error) {
      throw new Error('Failed to delete ingredients');
    }
  }

  /**
   * Get ingredient usage statistics
   */
  async getIngredientStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    mostUsed: InventoryItem | null;
    leastUsed: InventoryItem | null;
  }>> {
    await mockDelay();

    try {
      const total = this.mockData.length;
      const active = this.mockData.filter(item => item.Status === 'Active').length;
      const inactive = this.mockData.filter(item => item.Status === 'Inactive').length;

      // Handle empty data case
      if (this.mockData.length === 0) {
        return {
          success: true,
          data: {
            total: 0,
            active: 0,
            inactive: 0,
            mostUsed: null,
            leastUsed: null
          }
        };
      }

      // Generate random usage data for demo
      const itemsWithUsage = this.mockData.map(item => ({
        ...item,
        usageCount: Math.floor(Math.random() * 100)
      }));

      const mostUsed = itemsWithUsage.reduce((max, item) => 
        item.usageCount > max.usageCount ? item : max,
        itemsWithUsage[0]
      );

      const leastUsed = itemsWithUsage.reduce((min, item) => 
        item.usageCount < min.usageCount ? item : min,
        itemsWithUsage[0]
      );

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          mostUsed,
          leastUsed
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch ingredient statistics');
    }
  }

  /**
   * Reset mock data (for testing)
   */
  resetMockData(): void {
    this.mockData = [...mockData];
  }
}

// Export singleton instance
export const ingredientsApi = IngredientsApiService.getInstance();