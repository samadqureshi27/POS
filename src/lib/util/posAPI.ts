import { PosItem, ApiResponse } from "../../types/pos";

export class PosAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: PosItem[] = [
        { Branch_ID_fk: "1", POS_ID: "1", POS_Name: "POS 1", Status: "Active" },
        { Branch_ID_fk: "1", POS_ID: "2", POS_Name: "POS 2", Status: "Inactive" },
        { Branch_ID_fk: "1", POS_ID: "3", POS_Name: "POS 3", Status: "Active" },
        { Branch_ID_fk: "2", POS_ID: "4", POS_Name: "POS 1", Status: "Active" },
        { Branch_ID_fk: "2", POS_ID: "5", POS_Name: "POS 2", Status: "Inactive" },
        { Branch_ID_fk: "3", POS_ID: "6", POS_Name: "POS 1", Status: "Active" },
    ];

    static async getPosItemsByBranch(branchId: string): Promise<ApiResponse<PosItem[]>> {
        await this.delay(800);
        const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);
        return {
            success: true,
            data: filteredData,
            message: `POS items for branch ${branchId} fetched successfully`,
        };
    }

    static async createPosItem(item: Omit<PosItem, "POS_ID">): Promise<ApiResponse<PosItem>> {
        await this.delay(1000);
        const newId = (this.mockData.length + 1).toString();
        const newItem: PosItem = { ...item, POS_ID: newId };
        this.mockData.push(newItem);
        return {
            success: true,
            data: newItem,
            message: "POS item created successfully",
        };
    }

    static async updatePosItem(id: string, item: Partial<PosItem>): Promise<ApiResponse<PosItem>> {
        await this.delay(800);
        const index = this.mockData.findIndex((i) => i.POS_ID === id);
        if (index === -1) throw new Error("Item not found");
        this.mockData[index] = { ...this.mockData[index], ...item };
        return {
            success: true,
            data: this.mockData[index],
            message: "POS item updated successfully",
        };
    }

    static async deletePosItem(id: string): Promise<ApiResponse<null>> {
        await this.delay(600);
        const itemToDelete = this.mockData.find(i => i.POS_ID === id);
        if (!itemToDelete) throw new Error("Item not found");
        this.mockData = this.mockData.filter((i) => i.POS_ID !== id);
        return {
            success: true,
            data: null,
            message: "POS item deleted successfully",
        };
    }

    static async bulkDeletePosItems(ids: string[]): Promise<ApiResponse<null>> {
        await this.delay(1000);
        this.mockData = this.mockData.filter((i) => !ids.includes(i.POS_ID));
        return {
            success: true,
            data: null,
            message: `${ids.length} POS items deleted successfully`,
        };
    }
}