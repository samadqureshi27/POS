// services/recipe-options-api.ts

import {
  RecipeOption,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  RecipePayload
} from '../types/recipe-options';

// Mock API delay
const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock recipe data
const mockRecipes: RecipeOption[] = [
  {
    ID: 1,
    Name: "Classic Margherita Pizza",
    Status: "Active",
    Description: "Traditional Italian pizza with fresh basil and mozzarella",
    Category: "Main Courses",
    Price: 18.99,
    price: 18.99,  // Add lowercase price for component compatibility
    PrepTime: 20,
    CookTime: 15,
    Servings: 2,
    Difficulty: "Medium",
    Instructions: "1. Prepare dough\n2. Add toppings\n3. Bake at 450°F",
    OptionValue: "Large,Medium,Small",
    OptionPrice: 18.99,
    IngredientValue: "Extra Cheese,Pepperoni,Mushrooms",
    IngredientPrice: 12.00,
    Priority: 1,
    Ingredients: [
      { ingredientId: "#001", quantity: 200, unit: "g", notes: "Fresh dough" },
      { ingredientId: "#002", quantity: 150, unit: "g", notes: "Fresh mozzarella" }
    ]
  },
  {
    ID: 2,
    Name: "Caesar Salad",
    Status: "Active",
    Description: "Crisp romaine lettuce with Caesar dressing",
    Category: "Salads",
    Price: 12.99,
    price: 12.99,  // Add lowercase price
    PrepTime: 10,
    CookTime: 0,
    Servings: 1,
    Difficulty: "Easy",
    Instructions: "1. Wash and chop lettuce\n2. Prepare dressing\n3. Toss and serve",
    OptionValue: "Regular,Large",
    OptionPrice: 12.99,
    IngredientValue: "Extra Croutons,Parmesan",
    IngredientPrice: 8.00,
    Priority: 2
  },
  {
    ID: 3,
    Name: "Chocolate Lava Cake",
    Status: "Inactive",
    Description: "Decadent chocolate cake with molten center",
    Category: "Desserts",
    Price: 8.99,
    price: 8.99,  // Add lowercase price
    PrepTime: 15,
    CookTime: 12,
    Servings: 1,
    Difficulty: "Hard",
    Instructions: "1. Melt chocolate\n2. Mix batter\n3. Bake until edges are firm",
    OptionValue: "Regular,Double Chocolate",
    OptionPrice: 8.99,
    IngredientValue: "Ice Cream,Whipped Cream",
    IngredientPrice: 5.00,
    Priority: 3
  }
];

/**
 * Recipe Options API Service
 */
export class RecipeOptionsApiService {
  private static instance: RecipeOptionsApiService;
  private baseUrl: string;
  private mockRecipes: RecipeOption[] = [...mockRecipes];

  constructor(baseUrl: string = '/api/recipe-options') {
    this.baseUrl = baseUrl;
  }

  static getInstance(baseUrl?: string): RecipeOptionsApiService {
    if (!RecipeOptionsApiService.instance) {
      RecipeOptionsApiService.instance = new RecipeOptionsApiService(baseUrl);
    }
    return RecipeOptionsApiService.instance;
  }

  /**
   * Get all recipe options with optional filtering and pagination
   */
  async getRecipeOptions(
    filters?: Partial<FilterOptions>,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<RecipeOption>> {
    await mockDelay();

    try {
      let filteredData = [...this.mockRecipes];

      // Apply filters
      if (filters) {
        // Fix: Use correct property names from FilterOptions interface
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredData = filteredData.filter(recipe =>
            recipe.Name.toLowerCase().includes(searchTerm) ||
            (recipe.Description?.toLowerCase().includes(searchTerm)) ||
            (recipe.Category?.toLowerCase().includes(searchTerm))
          );
        }

        if (filters.status) {
          filteredData = filteredData.filter(recipe => 
            recipe.Status === filters.status
          );
        }

        if (filters.category) {
          filteredData = filteredData.filter(recipe => 
            recipe.Category === filters.category
          );
        }

        if (filters.difficulty) {
          filteredData = filteredData.filter(recipe => 
            recipe.Difficulty === filters.difficulty
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
      throw new Error('Failed to fetch recipe options');
    }
  }

  /**
   * Get a single recipe option by ID
   */
  async getRecipeOptionById(id: number): Promise<ApiResponse<RecipeOption>> {
    await mockDelay();

    try {
      const recipe = this.mockRecipes.find(recipe => recipe.ID === id);
      
      if (!recipe) {
        return {
          success: false,
          data: {} as RecipeOption,
          message: 'Recipe option not found'
        };
      }

      return {
        success: true,
        data: recipe
      };
    } catch (error) {
      throw new Error('Failed to fetch recipe option');
    }
  }

  /**
   * Helper function to convert RecipePayload to RecipeOption
   */
  private payloadToRecipeOption(payload: RecipePayload, id: number): RecipeOption {
    return {
      ...payload,
      ID: id,
      price: payload.Price  // Map uppercase Price to lowercase price
    };
  }

  /**
   * Create a new recipe option
   */
  async createRecipeOption(
    recipe: RecipePayload
  ): Promise<ApiResponse<RecipeOption>> {
    await mockDelay();

    try {
      const maxId = this.mockRecipes.reduce((max, recipe) => 
        recipe.ID > max ? recipe.ID : max, 0
      );
      
      const newRecipe: RecipeOption = this.payloadToRecipeOption(recipe, maxId + 1);
      this.mockRecipes.push(newRecipe);

      return {
        success: true,
        data: newRecipe,
        message: 'Recipe option created successfully'
      };
    } catch (error) {
      throw new Error('Failed to create recipe option');
    }
  }

  /**
   * Update an existing recipe option
   */
  async updateRecipeOption(
    id: number,
    updates: RecipePayload
  ): Promise<ApiResponse<RecipeOption>> {
    await mockDelay();

    try {
      const index = this.mockRecipes.findIndex(recipe => recipe.ID === id);
      
      if (index === -1) {
        return {
          success: false,
          data: {} as RecipeOption,
          message: 'Recipe option not found'
        };
      }

      this.mockRecipes[index] = {
        ...this.mockRecipes[index],
        ...updates,
        price: updates.Price  // Ensure price is mapped correctly
      };

      return {
        success: true,
        data: this.mockRecipes[index],
        message: 'Recipe option updated successfully'
      };
    } catch (error) {
      throw new Error('Failed to update recipe option');
    }
  }

  /**
   * Delete multiple recipe options
   */
  async bulkDeleteRecipeOptions(ids: number[]): Promise<ApiResponse<number[]>> {
    await mockDelay();

    try {
      const deletedIds: number[] = [];
      
      this.mockRecipes = this.mockRecipes.filter(recipe => {
        if (ids.includes(recipe.ID)) {
          deletedIds.push(recipe.ID);
          return false;
        }
        return true;
      });

      // Reassign IDs sequentially
      this.mockRecipes = this.mockRecipes.map((recipe, index) => ({
        ...recipe,
        ID: index + 1
      }));

      return {
        success: true,
        data: deletedIds,
        message: `${deletedIds.length} recipe option(s) deleted successfully`
      };
    } catch (error) {
      throw new Error('Failed to delete recipe options');
    }
  }

  /**
   * Reset mock data (for testing)
   */
  resetMockData(): void {
    this.mockRecipes = [...mockRecipes];
  }
}

// Create API instance
export const recipeOptionsApi = RecipeOptionsApiService.getInstance();