// types/customer.ts
export interface CustomerItem {
    Customer_ID: number;
    Name: string;
    Contact: string;
    Email: string;
    Address: string;
    Feedback_Rating: number;
    Total_Orders: number;
    Birthdate: string;
    Registration_Date: string;
    Profile_Creation_Date: string;
    Card_Status: "Active" | "Inactive";
}

export interface OrderItem {
    Customer_fk_ID: number;
    Order_ID: string;
    Order_Number: string;
    Type: "Dine in" | "Takeaway" | "Delivery";
    Date: string;
    Total: number;
    Status: "Completed" | "Pending" | "Cancelled";
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}