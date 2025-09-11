import { VendorItem, ApiResponse } from "@/lib/types/vendors";

export class VendorAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: VendorItem[] = [
        {
            ID: 1,
            Company_Name: "Al-1",
            Name: "Abdul Rahman",
            Contact: "03001234567",
            Address: "#777, Block G1, Johartown",
            Email: "abd@gmail.com",
            Branch_ID_fk: 1, // Fixed: changed branchId to Branch_ID_fk
        },
        {
            ID: 2,
            Company_Name: "Water Inc",
            Name: "Ahmad Ali",
            Contact: "03001231234",
            Address: "#777, Block G1, Johartown",
            Email: "csd@gmail.com",
            Branch_ID_fk: 1, // Fixed: changed branchId to Branch_ID_fk
        },
        {
            ID: 3,
            Company_Name: "Salt Inc",
            Name: "Hassan Ahmed",
            Contact: "03007897891",
            Address: "#777, Block G1, Johartown",
            Email: "yul@gmail.com",
            Branch_ID_fk: 2, // Fixed: changed branchId to Branch_ID_fk
        },
        {
            ID: 4,
            Company_Name: "Food Supplies Co",
            Name: "Muhammad Khan",
            Contact: "03009876543",
            Address: "#123, Block A2, DHA Phase 1",
            Email: "mkhan@foodsupplies.com",
            Branch_ID_fk: 2, // Fixed: changed branchId to Branch_ID_fk
        },
        {
            ID: 5,
            Company_Name: "Fresh Mart",
            Name: "Ali Hassan",
            Contact: "03005432109",
            Address: "#456, Gulberg III",
            Email: "ali@freshmart.com",
            Branch_ID_fk: 3, // Fixed: changed branchId to Branch_ID_fk
        },
        {
            ID: 6,
            Company_Name: "Tech Solutions",
            Name: "Usman Ali",
            Contact: "03001122334",
            Address: "#89, Model Town",
            Email: "usman@techsol.com",
            Branch_ID_fk: 1, // Fixed: changed branchId to Branch_ID_fk
        },
    ];

    // GET /api/vendors/branch/{branchId}
    static async getVendorItemsByBranch(branchId: number): Promise<ApiResponse<VendorItem[]>> {
        await this.delay(800);
        const filteredData = this.mockData.filter(vendor => vendor.Branch_ID_fk === branchId);
        return {
            success: true,
            data: filteredData,
            message: `Vendor items for branch ${branchId} fetched successfully`,
        };
    }

    // POST /api/vendors/branch/{branchId}
    static async createVendorItem(
        item: Omit<VendorItem, "ID">, // This expects Branch_ID_fk to be included
        branchId: number
    ): Promise<ApiResponse<VendorItem>> {
        await this.delay(1000);
        const newId = Math.max(...this.mockData.map(i => i.ID), 0) + 1;
        const newItem: VendorItem = {
            ...item,
            ID: newId,
            Branch_ID_fk: branchId,
        };
        this.mockData.push(newItem);
        return {
            success: true,
            data: newItem,
            message: "Vendor item created successfully",
        };
    }

    // PUT /api/vendors/{id}/
    static async updateVendorItem(
        id: number,
        item: Partial<VendorItem>
    ): Promise<ApiResponse<VendorItem>> {
        await this.delay(800);
        const index = this.mockData.findIndex((i) => i.ID === id);
        if (index === -1) throw new Error("Item not found");

        this.mockData[index] = { ...this.mockData[index], ...item };
        return {
            success: true,
            data: this.mockData[index],
            message: "Vendor item updated successfully",
        };
    }

    // DELETE /api/vendors/{id}/
    static async deleteVendorItem(id: number, branchId: number): Promise<ApiResponse<null>> {
        await this.delay(600);
        const index = this.mockData.findIndex((i) => i.ID === id);
        if (index === -1) throw new Error("Item not found");

        this.mockData.splice(index, 1);

        return {
            success: true,
            data: null,
            message: "Vendor item deleted successfully",
        };
    }

    // DELETE /api/vendors/branch/{branchId}/bulk-delete/
    static async bulkDeleteVendorItems(
        ids: number[],
        branchId: number
    ): Promise<ApiResponse<null>> {
        await this.delay(1000);
        this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

        return {
            success: true,
            data: null,
            message: `${ids.length} Vendor items deleted successfully`,
        };
    }
}