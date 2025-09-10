// utils/customer-api.ts
import { CustomerItem, OrderItem, ApiResponse } from '@/lib/types/customerProfile';
export class CustomerAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockCustomers: CustomerItem[] = [
        {
            Customer_ID: 1,
            Name: "Ahmed Ali",
            Contact: "03001234567",
            Email: "ahmed.ali@gmail.com",
            Address: "123 Main Street, Lahore",
            Feedback_Rating: 5,
            Total_Orders: 3,
            Birthdate: "09/13/1995",
            Registration_Date: "2024-01-15",
            Profile_Creation_Date: "01/15/2024 09:30",
            Card_Status: "Active",
        },
        {
            Customer_ID: 2,
            Name: "Fatima Khan",
            Contact: "03009876543",
            Email: "fatima.khan@gmail.com",
            Address: "456 Park Avenue, Karachi",
            Feedback_Rating: 4,
            Total_Orders: 4,
            Birthdate: "05/22/1988",
            Registration_Date: "2024-02-20",
            Profile_Creation_Date: "02/20/2024 14:45",
            Card_Status: "Active",
        },
        {
            Customer_ID: 3,
            Name: "Muhammad Hassan",
            Contact: "03001111111",
            Email: "hassan@gmail.com",
            Address: "789 Garden Road, Islamabad",
            Feedback_Rating: 3,
            Total_Orders: 5,
            Birthdate: "12/08/1992",
            Registration_Date: "2023-12-10",
            Profile_Creation_Date: "12/10/2023 11:20",
            Card_Status: "Active",
        },
        {
            Customer_ID: 12,
            Name: "Mariam Qureshi",
            Contact: "03001010101",
            Email: "mariam.qureshi@yahoo.com",
            Address: "112 F-6 Sector, Islamabad",
            Feedback_Rating: 5,
            Total_Orders: 6,
            Birthdate: "03/15/1990",
            Registration_Date: "2022-01-15",
            Profile_Creation_Date: "01/15/2022 10:30",
            Card_Status: "Inactive",
        },
    ];

    private static mockOrders: { [customerId: number]: OrderItem[] } = {
        1: [
            {
                Customer_fk_ID: 1,
                Order_ID: "ORD001",
                Order_Number: "12345",
                Type: "Dine in",
                Date: "2024-08-25",
                Total: 850,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 1,
                Order_ID: "ORD002",
                Order_Number: "12346",
                Type: "Takeaway",
                Date: "2024-08-20",
                Total: 1200,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 1,
                Order_ID: "ORD003",
                Order_Number: "12347",
                Type: "Delivery",
                Date: "2024-08-15",
                Total: 950,
                Status: "Completed",
            },
        ],
        2: [
            {
                Customer_fk_ID: 2,
                Order_ID: "ORD007",
                Order_Number: "12351",
                Type: "Delivery",
                Date: "2024-08-22",
                Total: 650,
                Status: "Pending",
            },
            {
                Customer_fk_ID: 2,
                Order_ID: "ORD008",
                Order_Number: "12352",
                Type: "Dine in",
                Date: "2024-08-18",
                Total: 1100,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 2,
                Order_ID: "ORD009",
                Order_Number: "12353",
                Type: "Takeaway",
                Date: "2024-08-12",
                Total: 750,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 2,
                Order_ID: "ORD010",
                Order_Number: "12354",
                Type: "Delivery",
                Date: "2024-08-05",
                Total: 890,
                Status: "Cancelled",
            },
        ],
        3: [
            {
                Customer_fk_ID: 3,
                Order_ID: "ORD011",
                Order_Number: "12355",
                Type: "Dine in",
                Date: "2024-08-18",
                Total: 1100,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 3,
                Order_ID: "ORD012",
                Order_Number: "12356",
                Type: "Takeaway",
                Date: "2024-08-14",
                Total: 675,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 3,
                Order_ID: "ORD013",
                Order_Number: "12357",
                Type: "Delivery",
                Date: "2024-08-10",
                Total: 825,
                Status: "Pending",
            },
            {
                Customer_fk_ID: 3,
                Order_ID: "ORD014",
                Order_Number: "12358",
                Type: "Dine in",
                Date: "2024-08-06",
                Total: 1250,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 3,
                Order_ID: "ORD015",
                Order_Number: "12359",
                Type: "Takeaway",
                Date: "2024-08-01",
                Total: 550,
                Status: "Completed",
            },
        ],
        12: [
            {
                Customer_fk_ID: 12,
                Order_ID: "ORD016",
                Order_Number: "12360",
                Type: "Dine in",
                Date: "2024-08-25",
                Total: 850,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 12,
                Order_ID: "ORD017",
                Order_Number: "12361",
                Type: "Takeaway",
                Date: "2024-08-20",
                Total: 1200,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 12,
                Order_ID: "ORD018",
                Order_Number: "12362",
                Type: "Delivery",
                Date: "2024-08-15",
                Total: 750,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 12,
                Order_ID: "ORD019",
                Order_Number: "12363",
                Type: "Dine in",
                Date: "2024-08-10",
                Total: 950,
                Status: "Completed",
            },
            {
                Customer_fk_ID: 12,
                Order_ID: "ORD020",
                Order_Number: "12364",
                Type: "Takeaway",
                Date: "2024-08-05",
                Total: 650,
                Status: "Pending",
            },
            {
                Customer_fk_ID: 12,
                Order_ID: "ORD021",
                Order_Number: "12365",
                Type: "Delivery",
                Date: "2024-08-01",
                Total: 900,
                Status: "Cancelled",
            },
        ],
    };

    static async getCustomerById(id: number): Promise<ApiResponse<CustomerItem>> {
        await this.delay(500);
        console.log(`Looking for customer with ID: ${id}`);
        const customer = this.mockCustomers.find((c) => c.Customer_ID === id);

        if (!customer) {
            console.log(`Customer with ID ${id} not found`);
            return {
                success: false,
                data: {} as CustomerItem,
                message: "Customer not found",
            };
        }

        console.log(`Found customer:`, customer);
        return {
            success: true,
            data: customer,
            message: "Customer details fetched successfully",
        };
    }

    static async getCustomerOrders(
        customerId: number
    ): Promise<ApiResponse<OrderItem[]>> {
        await this.delay(600);
        const orders = this.mockOrders[customerId] || [];
        console.log(`Orders for customer ${customerId}:`, orders);
        return {
            success: true,
            data: orders,
            message: "Customer orders fetched successfully",
        };
    }
}