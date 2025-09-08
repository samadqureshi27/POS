import { StaffItem, ApiResponse } from '@/types/payroll';

// Mock API - Updated to filter by branch
export class StaffAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: StaffItem[] = [
        {
            STAFF_ID: "1",
            Name: "John Smith",
            Contact: "+1-234-567-8901",
            Status: "Paid",
            Role: "Manager",
            Salary: 5000,
            JoinDate: "2025-08-28",
            Branch_ID_fk: "1",
        },
        {
            STAFF_ID: "2",
            Name: "Sarah Johnson",
            Contact: "+1-234-567-8902",
            Status: "Unpaid",
            Role: "Waiter",
            Salary: 2500,
            JoinDate: "2025-08-26",
            Branch_ID_fk: "1",
        },
        {
            STAFF_ID: "3",
            Name: "Mike Chen",
            Contact: "+1-234-567-8903",
            Status: "Paid",
            Role: "Cashier",
            Salary: 3000,
            JoinDate: "2025-08-15",
            Branch_ID_fk: "1",
        },
        {
            STAFF_ID: "4",
            Name: "Emily Davis",
            Contact: "+1-234-567-8904",
            Status: "Unpaid",
            Role: "Chef",
            Salary: 4000,
            JoinDate: "2025-08-05",
            Branch_ID_fk: "2",
        },
        {
            STAFF_ID: "5",
            Name: "Robert Wilson",
            Contact: "+1-234-567-8905",
            Status: "Paid",
            Role: "Cleaner",
            Salary: 2000,
            JoinDate: "2025-07-12",
            Branch_ID_fk: "2",
        },
        {
            STAFF_ID: "6",
            Name: "Lisa Anderson",
            Contact: "+1-234-567-8906",
            Status: "Unpaid",
            Role: "Waiter",
            Salary: 2500,
            JoinDate: "2025-06-18",
            Branch_ID_fk: "2",
        },
        {
            STAFF_ID: "7",
            Name: "David Brown",
            Contact: "+1-234-567-8907",
            Status: "Paid",
            Role: "Security",
            Salary: 2800,
            JoinDate: "2025-01-25",
            Branch_ID_fk: "3",
        },
        {
            STAFF_ID: "8",
            Name: "Maria Garcia",
            Contact: "+1-234-567-8908",
            Status: "Unpaid",
            Role: "Hostess",
            Salary: 2200,
            JoinDate: "2024-08-10",
            Branch_ID_fk: "3",
        },
    ];

    static async getStaffItemsByBranch(branchId: string): Promise<ApiResponse<StaffItem[]>> {
        await this.delay(800);

        // Filter staff items by branch ID
        const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

        return {
            success: true,
            data: filteredData,
            message: `Staff items for branch ${branchId} fetched successfully`,
        };
    }
}