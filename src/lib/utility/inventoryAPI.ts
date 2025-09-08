import { InventoryItem, ApiResponse } from "../../types/inventory";

// Function to calculate status based on threshold
export const calculateStatus = (
    updatedStock: number,
    threshold: number
): "Low" | "Medium" | "High" => {
    if (updatedStock <= threshold) {
        return "Low";
    } else if (updatedStock <= threshold * 1.25) {
        return "Medium";
    } else {
        return "High";
    }
};

export class InventoryAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    // Extended mock data with branch assignments
    private static mockData: InventoryItem[] = [
        // Branch 1 items
        {
            ID: 1,
            Name: "Espresso Beans",
            Unit: "Kilograms (Kg's)",
            Status: "High",
            InitialStock: 20,
            AddedStock: 5,
            UpdatedStock: 25,
            Threshold: 10,
            supplier: "Premium Coffee Co.",
            BranchID: 1,
        },
        {
            ID: 2,
            Name: "Milk",
            Unit: "Liters",
            Status: "Medium",
            InitialStock: 30,
            AddedStock: 10,
            UpdatedStock: 40,
            Threshold: 15,
            supplier: "Dairy Fresh Ltd",
            BranchID: 1,
        },
        {
            ID: 3,
            Name: "Sugar",
            Unit: "Kilograms (Kg's)",
            Status: "Low",
            InitialStock: 8,
            AddedStock: 2,
            UpdatedStock: 10,
            supplier: "Sweet Supply Inc",
            Threshold: 12,
            BranchID: 1,
        },
        // Branch 2 items
        {
            ID: 4,
            Name: "Croissants",
            Unit: "Pieces",
            Status: "Medium",
            InitialStock: 50,
            AddedStock: 20,
            supplier: "Bakery Express",
            UpdatedStock: 70,
            Threshold: 30,
            BranchID: 2,
        },
        {
            ID: 5,
            Name: "Tea Bags",
            Unit: "Boxes",
            supplier: "Tea Masters",
            Status: "High",
            InitialStock: 15,
            AddedStock: 5,
            UpdatedStock: 20,
            Threshold: 5,
            BranchID: 2,
        },
        // Branch 3 items
        {
            ID: 6,
            Name: "Chocolate Syrup",
            Unit: "Bottles",
            Status: "Low",
            InitialStock: 3,
            AddedStock: 2,
            UpdatedStock: 5,
            Threshold: 6,
            supplier: "Sweet Treats Co",
            BranchID: 3,
        },
        {
            ID: 7,
            Name: "Whipped Cream",
            Unit: "Cans",
            Status: "Medium",
            InitialStock: 10,
            AddedStock: 5,
            UpdatedStock: 15,
            Threshold: 8,
            supplier: "Cream Factory",
            BranchID: 3,
        },
        // Additional items for all branches
        {
            ID: 8,
            Name: "Paper Cups",
            Unit: "Packs",
            Status: "High",
            InitialStock: 40,
            AddedStock: 10,
            UpdatedStock: 50,
            Threshold: 20,
            supplier: "Packaging Plus",
            BranchID: 1,
        },
        {
            ID: 9,
            Name: "Vanilla Syrup",
            Unit: "Bottles",
            Status: "Medium",
            InitialStock: 7,
            AddedStock: 3,
            UpdatedStock: 10,
            Threshold: 5,
            supplier: "Flavor World",
            BranchID: 2,
        },
        {
            ID: 10,
            Name: "Butter",
            Unit: "Kilograms (Kg's)",
            Status: "Low",
            InitialStock: 4,
            AddedStock: 1,
            UpdatedStock: 5,
            Threshold: 6,
            supplier: "Dairy Best",
            BranchID: 3,
        },
    ].map((item) => ({
        ...item,
        Status: calculateStatus(item.UpdatedStock, item.Threshold),
    }));

    static async getInventoryItems(branchId: number): Promise<ApiResponse<InventoryItem[]>> {
        await this.delay(800);
        const branchItems = this.mockData.filter(item => item.BranchID === branchId);
        return {
            success: true,
            data: [...branchItems],
            message: `Inventory items for Branch #${branchId} fetched successfully`,
        };
    }

    static async createInventoryItem(
        item: Omit<InventoryItem, "ID">,
        branchId: number
    ): Promise<ApiResponse<InventoryItem>> {
        await this.delay(1000);
        const branchItems = this.mockData.filter(i => i.BranchID === branchId);
        const newId = branchItems.length > 0
            ? Math.max(...branchItems.map(i => i.ID)) + 1
            : Math.max(...this.mockData.map(i => i.ID)) + 1;

        const updatedStock = item.InitialStock + item.AddedStock;
        const newItem: InventoryItem = {
            ...item,
            ID: newId,
            UpdatedStock: updatedStock,
            Status: calculateStatus(updatedStock, item.Threshold),
            BranchID: branchId,
        };
        this.mockData.push(newItem);
        return {
            success: true,
            data: newItem,
            message: `Inventory item created successfully for Branch #${branchId}`,
        };
    }

    static async updateInventoryItem(
        id: number,
        item: Partial<InventoryItem>,
        branchId: number
    ): Promise<ApiResponse<InventoryItem>> {
        await this.delay(800);
        const index = this.mockData.findIndex((i) => i.ID === id && i.BranchID === branchId);
        if (index === -1) throw new Error("Item not found in this branch");

        const updatedStock = (item.InitialStock || 0) + (item.AddedStock || 0);
        const updatedItem = {
            ...this.mockData[index],
            ...item,
            UpdatedStock: updatedStock,
            Status: calculateStatus(
                updatedStock,
                item.Threshold || this.mockData[index].Threshold
            ),
            BranchID: branchId,
        };

        this.mockData[index] = updatedItem;
        return {
            success: true,
            data: this.mockData[index],
            message: `Inventory item updated successfully for Branch #${branchId}`,
        };
    }

    static async deleteInventoryItem(id: number, branchId: number): Promise<ApiResponse<null>> {
        await this.delay(600);
        const index = this.mockData.findIndex((i) => i.ID === id && i.BranchID === branchId);
        if (index === -1) throw new Error("Item not found in this branch");

        this.mockData.splice(index, 1);
        return {
            success: true,
            data: null,
            message: `Inventory item deleted successfully from Branch #${branchId}`,
        };
    }

    static async bulkDeleteInventoryItems(
        ids: number[],
        branchId: number
    ): Promise<ApiResponse<null>> {
        await this.delay(1000);
        this.mockData = this.mockData.filter(
            (item) => !(ids.includes(item.ID) && item.BranchID === branchId)
        );

        return {
            success: true,
            data: null,
            message: `${ids.length} inventory items deleted successfully from Branch #${branchId}`,
        };
    }
}