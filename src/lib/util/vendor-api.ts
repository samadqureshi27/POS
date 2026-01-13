import { VendorItem } from "@/lib/types/vendors";

/**
 * Vendor API - Mock implementation for vendor management
 */
export class VendorAPI {
    private static mockData: VendorItem[] = [
        {
            ID: 1,
            Company_Name: "Al-1",
            Name: "Abdul Rahman",
            Contact: "03001234567",
            Address: "#777, Block G1, Johartown",
            Email: "abd@gmail.com",
            Branch_ID_fk: 1,
        },
        {
            ID: 2,
            Company_Name: "Water Inc",
            Name: "Ahmad Ali",
            Contact: "03001231234",
            Address: "#777, Block G1, Johartown",
            Email: "csd@gmail.com",
            Branch_ID_fk: 1,
        },
        {
            ID: 3,
            Company_Name: "Salt Inc",
            Name: "Hassan Ahmed",
            Contact: "03007897891",
            Address: "#777, Block G1, Johartown",
            Email: "yul@gmail.com",
            Branch_ID_fk: 2,
        },
        {
            ID: 4,
            Company_Name: "Food Supplies Co",
            Name: "Muhammad Khan",
            Contact: "03009876543",
            Address: "#123, Block A2, DHA Phase 1",
            Email: "mkhan@foodsupplies.com",
            Branch_ID_fk: 2,
        },
        {
            ID: 5,
            Company_Name: "Fresh Mart",
            Name: "Ali Hassan",
            Contact: "03005432109",
            Address: "#456, Gulberg III",
            Email: "ali@freshmart.com",
            Branch_ID_fk: 3,
        },
        {
            ID: 6,
            Company_Name: "Tech Solutions",
            Name: "Usman Ali",
            Contact: "03001122334",
            Address: "#89, Model Town",
            Email: "usman@techsol.com",
            Branch_ID_fk: 1,
        },
    ];

    private static nextId = 7;

    // GET /api/vendors/branch/{branchId}
    static async getVendorItemsByBranch(branchId: number) {
        try {
            const items = this.mockData.filter(item => item.Branch_ID_fk === branchId);
            return { success: true, data: items };
        } catch (error) {
            return { success: false, error: "Failed to fetch vendors" };
        }
    }

    // POST /api/vendors/branch/{branchId}
    static async createVendorItem(
        item: Omit<VendorItem, "ID">,
        branchId: number
    ) {
        try {
            const newItem: VendorItem = {
                ...item,
                ID: this.nextId++,
                Branch_ID_fk: branchId,
            };
            this.mockData.push(newItem);
            return { success: true, data: newItem };
        } catch (error) {
            return { success: false, error: "Failed to create vendor" };
        }
    }

    // PUT /api/vendors/{id}/
    static async updateVendorItem(
        id: number,
        item: Partial<VendorItem>
    ) {
        try {
            const index = this.mockData.findIndex(v => v.ID === id);
            if (index === -1) {
                return { success: false, error: "Vendor not found" };
            }
            this.mockData[index] = { ...this.mockData[index], ...item };
            return { success: true, data: this.mockData[index] };
        } catch (error) {
            return { success: false, error: "Failed to update vendor" };
        }
    }

    // DELETE /api/vendors/{id}/
    static async deleteVendorItem(id: number, branchId: number) {
        try {
            const index = this.mockData.findIndex(v => v.ID === id);
            if (index === -1) {
                return { success: false, error: "Vendor not found" };
            }
            this.mockData.splice(index, 1);
            return { success: true, message: "Vendor deleted successfully" };
        } catch (error) {
            return { success: false, error: "Failed to delete vendor" };
        }
    }

    // DELETE /api/vendors/branch/{branchId}/bulk-delete/
    static async bulkDeleteVendorItems(
        ids: number[],
        branchId: number
    ) {
        try {
            this.mockData = this.mockData.filter(v => !ids.includes(v.ID));
            return { success: true, message: `Deleted ${ids.length} vendors` };
        } catch (error) {
            return { success: false, error: "Failed to bulk delete vendors" };
        }
    }
}
