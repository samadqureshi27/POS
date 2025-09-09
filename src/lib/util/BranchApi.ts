// lib/utility/branchAPI.ts
import { BranchItem, ApiResponse } from "../../types/branch";

export class BranchAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: BranchItem[] = [
        {
            "Branch-ID": 1,
            Branch_Name: "Main Branch",
            Status: "Active",
            "Contact-Info": "03001234567",
            Address: "123 Main St.",
            email: "main@gmail.com",
            postalCode: "35346",
        },
        {
            "Branch-ID": 2,
            Branch_Name: "North Branch",
            Status: "Inactive",
            "Contact-Info": "03007654321",
            Address: "456 North Ave.",
            email: "north@gmail.com",
            postalCode: "2335346",
        },
        {
            "Branch-ID": 3,
            Branch_Name: "South Branch",
            Status: "Active",
            "Contact-Info": "03009876543",
            Address: "789 South Blvd.",
            email: "south@gmail.com",
            postalCode: "12345",
        },
    ];

    static async getBranchItems(): Promise<ApiResponse<BranchItem[]>> {
        await this.delay(800);
        return {
            success: true,
            data: [...this.mockData],
            message: "Branch items fetched successfully",
        };
    }

    static async createBranchItem(
        item: Omit<BranchItem, "Branch-ID">
    ): Promise<ApiResponse<BranchItem>> {
        await this.delay(1000);
        const newId = Math.max(...this.mockData.map((i) => i["Branch-ID"]), 0) + 1;
        const newItem: BranchItem = { ...item, "Branch-ID": newId };
        this.mockData.push(newItem);
        return {
            success: true,
            data: newItem,
            message: "Branch item created successfully",
        };
    }

    static async updateBranchItem(
        id: number,
        item: Partial<BranchItem>
    ): Promise<ApiResponse<BranchItem>> {
        await this.delay(800);
        const index = this.mockData.findIndex((i) => i["Branch-ID"] === id);
        if (index === -1) throw new Error("Item not found");
        this.mockData[index] = { ...this.mockData[index], ...item };
        return {
            success: true,
            data: this.mockData[index],
            message: "Branch item updated successfully",
        };
    }

    static async deleteBranchItem(id: number): Promise<ApiResponse<null>> {
        await this.delay(600);
        this.mockData = this.mockData
            .filter((i) => i["Branch-ID"] !== id)
            .map((item, idx) => ({ ...item, "Branch-ID": idx + 1 }));
        return {
            success: true,
            data: null,
            message: "Branch item deleted successfully",
        };
    }

    static async bulkDeleteBranchItems(
        ids: number[]
    ): Promise<ApiResponse<null>> {
        await this.delay(1000);
        this.mockData = this.mockData
            .filter((i) => !ids.includes(i["Branch-ID"]))
            .map((item, idx) => ({ ...item, "Branch-ID": idx + 1 }));
        return {
            success: true,
            data: null,
            message: `${ids.length} Branch items deleted successfully`,
        };
    }
}