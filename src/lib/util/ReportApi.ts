import { ReportItem, ApiResponse } from "@/types/reports";

export class ReportsAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    // Updated dummy inventory data with branch foreign keys
    private static mockData: ReportItem[] = [
        {
            ID: 1,
            Branch_ID_fk: "1",
            Name: "Ketchup",
            Unit: "Kilograms (Kg's)",
            InitialStock: 12,
            Purchased: 50,
            Used: 25,
            Variance: 5,
            Wasteage: 5,
            ClosingStock: 27,
            Total_Value: 135,
        },
        {
            ID: 2,
            Branch_ID_fk: "1",
            Name: "Cheese",
            Unit: "Grams (g)",
            InitialStock: 500,
            Purchased: 200,
            Used: 300,
            Variance: 10,
            Wasteage: 5,
            ClosingStock: 385,
            Total_Value: 770,
        },
        {
            ID: 3,
            Branch_ID_fk: "1",
            Name: "Tomato Sauce",
            Unit: "Liters (L)",
            InitialStock: 10,
            Purchased: 15,
            Used: 20,
            Variance: 2,
            Wasteage: 1,
            ClosingStock: 2,
            Total_Value: 40,
        },
        {
            ID: 4,
            Branch_ID_fk: "2",
            Name: "Chicken Breast",
            Unit: "Kilograms (Kg's)",
            InitialStock: 20,
            Purchased: 30,
            Used: 40,
            Variance: 3,
            Wasteage: 2,
            ClosingStock: 5,
            Total_Value: 250,
        },
        {
            ID: 5,
            Branch_ID_fk: "2",
            Name: "Lettuce",
            Unit: "Pieces",
            InitialStock: 30,
            Purchased: 10,
            Used: 25,
            Variance: 1,
            Wasteage: 2,
            ClosingStock: 12,
            Total_Value: 24,
        },
        {
            ID: 6,
            Branch_ID_fk: "2",
            Name: "Beef Patties",
            Unit: "Pieces",
            InitialStock: 100,
            Purchased: 50,
            Used: 80,
            Variance: 5,
            Wasteage: 10,
            ClosingStock: 55,
            Total_Value: 275,
        },
        {
            ID: 7,
            Branch_ID_fk: "3",
            Name: "Flour",
            Unit: "Kilograms (Kg's)",
            InitialStock: 25,
            Purchased: 15,
            Used: 20,
            Variance: 2,
            Wasteage: 3,
            ClosingStock: 15,
            Total_Value: 75,
        },
        {
            ID: 8,
            Branch_ID_fk: "3",
            Name: "Milk",
            Unit: "Liters (L)",
            InitialStock: 40,
            Purchased: 20,
            Used: 35,
            Variance: 3,
            Wasteage: 2,
            ClosingStock: 20,
            Total_Value: 100,
        }
    ];

    // GET inventory items filtered by branch ID
    static async getInventoryItemsByBranch(branchId: string): Promise<ApiResponse<ReportItem[]>> {
        await this.delay(800);

        // Filter inventory items by branch ID
        const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

        return {
            success: true,
            data: filteredData,
            message: `Inventory items for branch ${branchId} fetched successfully`,
        };
    }
}