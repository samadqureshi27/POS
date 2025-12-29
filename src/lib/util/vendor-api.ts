import { VendorItem } from "@/lib/types/vendors";
import { BaseMockAPI } from "./base-mock-api";

/**
 * Vendor API - Refactored to use BaseMockAPI
 *
 * This eliminates ~100 lines of duplicate CRUD code by inheriting
 * from the generic BaseMockAPI class.
 */
export class VendorAPI extends BaseMockAPI<VendorItem> {
    protected static override mockData: VendorItem[] = [
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

    // Specify the ID and Branch ID field names for this entity
    protected static override idField = "ID" as const;
    protected static override branchIdField = "Branch_ID_fk" as const;

    // Public API methods that delegate to BaseMockAPI

    // GET /api/vendors/branch/{branchId}
    static async getVendorItemsByBranch(branchId: number) {
        return this.getItemsByBranch(branchId);
    }

    // POST /api/vendors/branch/{branchId}
    static async createVendorItem(
        item: Omit<VendorItem, "ID">,
        branchId: number
    ) {
        return this.createItem(item, branchId);
    }

    // PUT /api/vendors/{id}/
    static async updateVendorItem(
        id: number,
        item: Partial<VendorItem>
    ) {
        return this.updateItem(id, item);
    }

    // DELETE /api/vendors/{id}/
    static async deleteVendorItem(id: number, branchId: number) {
        return this.deleteItem(id);
    }

    // DELETE /api/vendors/branch/{branchId}/bulk-delete/
    static async bulkDeleteVendorItems(
        ids: number[],
        branchId: number
    ) {
        return this.bulkDeleteItems(ids);
    }
}
