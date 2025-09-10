import { StaffItem, BranchInfo, ApiResponse } from "@/lib/types/staffManagement";

// Mock API with Branch Integration
export class StaffAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: StaffItem[] = [
        {
            Staff_ID: "1",
            Name: "Ali Raza",
            Contact: "03001231234",
            Address: "123 Main Street, Lahore",
            CNIC: "35202-1234567-8",
            Status: "Inactive",
            Role: "Waiter",
            Salary: "30000",
            Shift_Start_Time: "9:00",
            Shift_End_Time: "6:00",
            Branch_ID_fk: "1",
        },
        {
            Staff_ID: "2",
            Name: "Faraz Aslam",
            Contact: "03001234567",
            Address: "456 Park Avenue, Karachi",
            CNIC: "42101-9876543-2",
            Status: "Inactive",
            Role: "Cashier",
            Salary: "50000",
            Shift_Start_Time: "9:00",
            Shift_End_Time: "6:00",
            Branch_ID_fk: "1",
            Access_Code: "1234",
        },
        {
            Staff_ID: "3",
            Name: "Faris Shafi",
            Contact: "03001231238",
            Address: "789 Garden Road, Islamabad",
            CNIC: "61101-5555555-1",
            Status: "Active",
            Role: "Cleaner",
            Salary: "15000",
            Shift_Start_Time: "9:00",
            Shift_End_Time: "6:00",
            Branch_ID_fk: "2",
        },
        {
            Staff_ID: "4",
            Name: "Ahmed Khan",
            Contact: "03009876543",
            Address: "321 Business District, Lahore",
            CNIC: "35202-9876543-1",
            Status: "Active",
            Role: "Manager",
            Salary: "80000",
            Shift_Start_Time: "8:00",
            Shift_End_Time: "8:00",
            Branch_ID_fk: "1",
            Access_Code: "5678",
        },
        {
            Staff_ID: "5",
            Name: "Sara Ali",
            Contact: "03007777777",
            Address: "555 North Street, Karachi",
            CNIC: "42101-7777777-7",
            Status: "Active",
            Role: "Waiter",
            Salary: "25000",
            Shift_Start_Time: "10:00",
            Shift_End_Time: "7:00",
            Branch_ID_fk: "2",
        },
        {
            Staff_ID: "6",
            Name: "Usman Sheikh",
            Contact: "03008888888",
            Address: "666 South Avenue, Islamabad",
            CNIC: "61101-8888888-8",
            Status: "Active",
            Role: "Chef",
            Salary: "45000",
            Shift_Start_Time: "11:00",
            Shift_End_Time: "9:00",
            Branch_ID_fk: "3",
        },
    ];

    // Get staff items filtered by branch ID
    static async getStaffItemsByBranch(branchId: string): Promise<ApiResponse<StaffItem[]>> {
        await this.delay(800);
        const branchStaff = this.mockData.filter(staff => staff.Branch_ID_fk === branchId);
        return {
            success: true,
            data: branchStaff,
            message: `Staff items for branch ${branchId} fetched successfully`,
        };
    }

    // Get branch info by ID
    static async getBranchInfo(branchId: string): Promise<ApiResponse<BranchInfo>> {
        await this.delay(500);
        const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

        return {
            success: true,
            data: filteredData,
            message: "Branch info fetched successfully",
        };
    }

    static async createStaffItem(
        item: Omit<StaffItem, "Staff_ID">
    ): Promise<ApiResponse<StaffItem>> {
        await this.delay(1000);
        const newId = (this.mockData.length + 1).toString();
        const newItem: StaffItem = { ...item, Staff_ID: newId };
        this.mockData.push(newItem);
        return {
            success: true,
            data: newItem,
            message: "Staff item created successfully",
        };
    }

    static async updateStaffItem(
        id: string,
        item: Partial<StaffItem>
    ): Promise<ApiResponse<StaffItem>> {
        await this.delay(800);
        const index = this.mockData.findIndex((i) => i.Staff_ID === id);
        if (index === -1) throw new Error("Item not found");
        this.mockData[index] = { ...this.mockData[index], ...item };
        return {
            success: true,
            data: this.mockData[index],
            message: "Staff item updated successfully",
        };
    }

    static async deleteStaffItem(id: string): Promise<ApiResponse<null>> {
        await this.delay(600);
        const initialLength = this.mockData.length;
        this.mockData = this.mockData.filter((i) => i.Staff_ID !== id);

        if (this.mockData.length === initialLength) {
            throw new Error("Staff item not found");
        }

        return {
            success: true,
            data: null,
            message: "Staff item deleted successfully",
        };
    }

    static async bulkDeleteStaffItems(ids: string[]): Promise<ApiResponse<null>> {
        await this.delay(1000);
        this.mockData = this.mockData.filter((i) => !ids.includes(i.Staff_ID));
        return {
            success: true,
            data: null,
            message: `${ids.length} Staff items deleted successfully`,
        };
    }
}