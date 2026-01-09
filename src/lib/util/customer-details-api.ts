// services/customerApi.ts
import { CustomerItem, ApiResponse } from '@/lib/types/customer-details';

export class CustomerAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: CustomerItem[] = [
        {
            Customer_ID: 1,
            Name: "Ahmed Ali",
            Contact: "03001234567",
            Email: "ahmed.ali@gmail.com",
            Address: "123 Main Street, Lahore",
            Feedback_Rating: 5,
            Total_Orders: 12,
            Birthdate: "09/13/1995",
            Registration_Date: "2024-01-15",
            Profile_Creation_Date: "01/15/2024 09:30",
            Device: "Apple Pay"
        },
        {
            Customer_ID: 2,
            Name: "Fatima Khan",
            Contact: "03009876543",
            Email: "fatima.khan@gmail.com",
            Address: "456 Park Avenue, Karachi",
            Feedback_Rating: 4,
            Total_Orders: 8,
            Birthdate: "05/22/1988",
            Registration_Date: "2024-02-20",
            Profile_Creation_Date: "02/20/2024 14:45",
            Device: "Apple Pay"
        },
        {
            Customer_ID: 3,
            Name: "Muhammad Hassan",
            Contact: "03001111111",
            Email: "hassan@gmail.com",
            Address: "789 Garden Road, Islamabad",
            Feedback_Rating: 3,
            Total_Orders: 15,
            Birthdate: "12/08/1992",
            Registration_Date: "2023-12-10",
            Profile_Creation_Date: "12/10/2023 11:20",
            Device: "Apple Pay"
        },
        {
            Customer_ID: 12,
            Name: "Mariam Qureshi",
            Contact: "03001010101",
            Email: "mariam.qureshi@yahoo.com",
            Address: "112 F-6 Sector, Islamabad",
            Feedback_Rating: 5,
            Total_Orders: 18,
            Birthdate: "04/07/1989",
            Registration_Date: "2023-10-30",
            Profile_Creation_Date: "10/30/2023 11:55",
            Device: "Google Pay"
        },
    ];

    static async getCustomerItems(): Promise<ApiResponse<CustomerItem[]>> {
        await this.delay(800);
        return {
            success: true,
            data: [...this.mockData],
            message: "Customer items fetched successfully",
        };
    }

    static async getCustomersByDateRange(startDate: string, endDate: string): Promise<ApiResponse<CustomerItem[]>> {
        await this.delay(500);
        const filtered = this.mockData.filter(customer => {
            const registrationDate = new Date(customer.Registration_Date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return registrationDate >= start && registrationDate <= end;
        });

        return {
            success: true,
            data: filtered,
            message: "Filtered customer items fetched successfully",
        };
    }
}