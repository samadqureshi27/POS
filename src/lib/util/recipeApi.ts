// services/recipeApi.ts

import {
  RecipeOption,
  Ingredient,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  RecipePayload
} from '../types/recipes';

// Mock API delay
const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock recipe data with all required fields
const mockRecipes: RecipeOption[] = [
  {
    ID: 1,
    Name: "Classic Margherita Pizza",
    Status: "Active",
    Description: "Traditional Italian pizza with fresh basil and mozzarella",
    Category: "Main Courses",
    Price: 18.99,
    PrepTime: 20,
    CookTime: 15,
    Servings: 2,
    Difficulty: "Medium",
    Instructions: "1. Prepare dough\n2. Add toppings\n3. Bake at 450°F",
    OptionValue: ["Large,Medium,Small"], // Fixed: string instead of null
    OptionPrice: [18.99],
    IngredientValue: ["Extra Cheese,Pepperoni,Mushrooms"],
    IngredientPrice: [12.00],
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
    PrepTime: 10,
    CookTime: 0,
    Servings: 1,
    Difficulty: "Easy",
    Instructions: "1. Wash and chop lettuce\n2. Prepare dressing\n3. Toss and serve",
    OptionValue: ["Regular,Large"],
    OptionPrice: [12.99],
    IngredientValue: ["Extra Croutons,Parmesan"],
    IngredientPrice: [8.00],
    Priority: 2
  },
  {
    ID: 3,
    Name: "Chocolate Lava Cake",
    Status: "Inactive",
    Description: "Decadent chocolate cake with molten center",
    Category: "Desserts",
    Price: 8.99,
    PrepTime: 15,
    CookTime: 12,
    Servings: 1,
    Difficulty: "Hard",
    Instructions: "1. Melt chocolate\n2. Mix batter\n3. Bake until edges are firm",
    OptionValue: ["Regular,Double Chocolate"],
    OptionPrice: [8.99],
    IngredientValue: ["Ice Cream,Whipped Cream"],
    IngredientPrice: [5.00],
    Priority: 3
  }
];

const mockIngredients: Ingredient[] = [
  {
    ID: 1,
    Name: "Pizza Dough",
    Unit: "Grams (g)",
    Status: "Active",
    Description: "Fresh pizza dough",
    Priority: 1
  },
  {
    ID: 2,
    Name: "Mozzarella Cheese",
    Unit: "Grams (g)",
    Status: "Active",
    Description: "Fresh mozzarella cheese",
    Priority: 2
  },
  {
    ID: 3,
    Name: "Romaine Lettuce",
    Unit: "Pieces",
    Status: "Active",
    Description: "Fresh romaine lettuce",
    Priority: 3
  }
];

/**
 * Enhanced Recipe API Service
 * Provides comprehensive recipe management functionality
 */
export class RecipeApiService {
  private static instance: RecipeApiService;
  private baseUrl: string;
  private mockRecipes: RecipeOption[] = [...mockRecipes];
  private mockIngredients: Ingredient[] = [...mockIngredients];

  constructor(baseUrl: string = '/api/recipes') {
    this.baseUrl = baseUrl;
  }

  static getInstance(baseUrl?: string): RecipeApiService {
    if (!RecipeApiService.instance) {
      RecipeApiService.instance = new RecipeApiService(baseUrl);
    }
    return RecipeApiService.instance;
  }

  /**
   * Get all recipes with optional filtering and pagination
   */
  async getRecipeOption(
    filters?: Partial<FilterOptions>,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<RecipeOption>> {
    await mockDelay();

    try {
      let filteredData = [...this.mockRecipes];

      // Apply filters
      if (filters) {
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          filteredData = filteredData.filter(recipe =>
            recipe.Name.toLowerCase().includes(searchTerm) ||
            (recipe.Description?.toLowerCase().includes(searchTerm)) ||
            (recipe.Category?.toLowerCase().includes(searchTerm))
          );
        }

        if (filters.statusFilter) {
          filteredData = filteredData.filter(recipe => 
            recipe.Status === filters.statusFilter
          );
        }

        if (filters.categoryFilter) {
          filteredData = filteredData.filter(recipe => 
            recipe.Category === filters.categoryFilter
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
      throw new Error('Failed to fetch recipes');
    }
  }

  /**
   * Get a single recipe by ID
   */
  async getRecipeById(id: number): Promise<ApiResponse<RecipeOption>> {
    await mockDelay();

    try {
      const recipe = this.mockRecipes.find(recipe => recipe.ID === id);
      
      if (!recipe) {
        return {
          success: false,
          data: {} as RecipeOption,
          message: 'Recipe not found'
        };
      }

      return {
        success: true,
        data: recipe
      };
    } catch (error) {
      throw new Error('Failed to fetch recipe');
    }
  }

  /**
   * Create a new recipe
   */
  async createRecipeOption(
    recipe: RecipePayload
  ): Promise<ApiResponse<RecipeOption>> {
    await mockDelay();

    try {
      // Generate new ID
      const maxId = this.mockRecipes.reduce((max, recipe) => 
        recipe.ID > max ? recipe.ID : max, 0
      );
      
      const newRecipe: RecipeOption = {
        ...recipe,
        ID: maxId + 1
      };

      this.mockRecipes.push(newRecipe);

      return {
        success: true,
        data: newRecipe,
        message: 'Recipe created successfully'
      };
    } catch (error) {
      throw new Error('Failed to create recipe');
    }
  }

  /**
   * Update an existing recipe
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
          message: 'Recipe not found'
        };
      }

      this.mockRecipes[index] = {
        ...this.mockRecipes[index],
        ...updates
      };

      return {
        success: true,
        data: this.mockRecipes[index],
        message: 'Recipe updated successfully'
      };
    } catch (error) {
      throw new Error('Failed to update recipe');
    }
  }

  /**
   * Delete multiple recipes
   */
  async bulkDeleteRecipeOption(ids: number[]): Promise<ApiResponse<number[]>> {
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
        message: `${deletedIds.length} recipe(s) deleted successfully`
      };
    } catch (error) {
      throw new Error('Failed to delete recipes');
    }
  }

  /**
   * Get all ingredients
   */
  async getIngredients(): Promise<ApiResponse<Ingredient[]>> {
    await mockDelay();

    try {
      return {
        success: true,
        data: [...this.mockIngredients]
      };
    } catch (error) {
      throw new Error('Failed to fetch ingredients');
    }
  }

  /**
   * Get recipe statistics
   */
  async getRecipeStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
    avgPrepTime: number;
    avgCookTime: number;
  }>> {
    await mockDelay();

    try {
      const total = this.mockRecipes.length;
      const active = this.mockRecipes.filter(recipe => recipe.Status === 'Active').length;
      const inactive = this.mockRecipes.filter(recipe => recipe.Status === 'Inactive').length;

      // Group by category
      const byCategory = this.mockRecipes.reduce((acc, recipe) => {
        if (recipe.Category) {
          acc[recipe.Category] = (acc[recipe.Category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Calculate average times
      const recipesWithTimes = this.mockRecipes.filter(r => r.PrepTime && r.CookTime);
      const avgPrepTime = recipesWithTimes.length > 0 
        ? recipesWithTimes.reduce((sum, r) => sum + (r.PrepTime || 0), 0) / recipesWithTimes.length
        : 0;
      const avgCookTime = recipesWithTimes.length > 0
        ? recipesWithTimes.reduce((sum, r) => sum + (r.CookTime || 0), 0) / recipesWithTimes.length
        : 0;

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          byCategory,
          avgPrepTime: Math.round(avgPrepTime),
          avgCookTime: Math.round(avgCookTime)
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch recipe statistics');
    }
  }

  /**
   * Search recipes by ingredients
   */
  async searchRecipesByIngredients(
    ingredientIds: string[]
  ): Promise<ApiResponse<RecipeOption[]>> {
    await mockDelay();

    try {
      const matchingRecipes = this.mockRecipes.filter(recipe =>
        recipe.Ingredients?.some(ing =>
          ingredientIds.includes(ing.ingredientId)
        )
      );

      return {
        success: true,
        data: matchingRecipes,
        message: `Found ${matchingRecipes.length} recipes with specified ingredients`
      };
    } catch (error) {
      throw new Error('Failed to search recipes by ingredients');
    }
  }

  /**
   * Reset mock data (for testing)
   */
  resetMockData(): void {
    this.mockRecipes = [...mockRecipes];
    this.mockIngredients = [...mockIngredients];
  }
}

// Create default instance that matches the original RecipeAPI interface
const RecipeAPI = {
  getRecipeOption: () => RecipeApiService.getInstance().getRecipeOption(),
  createRecipeOption: (recipe: RecipePayload) => 
    RecipeApiService.getInstance().createRecipeOption(recipe),
  updateRecipeOption: (id: number, updates: RecipePayload) => 
    RecipeApiService.getInstance().updateRecipeOption(id, updates),
  bulkDeleteRecipeOption: (ids: number[]) => 
    RecipeApiService.getInstance().bulkDeleteRecipeOption(ids),
  getIngredients: () => RecipeApiService.getInstance().getIngredients(),
};

export default RecipeAPI;