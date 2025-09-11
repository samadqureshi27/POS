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
    Device: "Google Pay" | "Apple Pay";
    Registration_Date: string;
    Profile_Creation_Date: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ToastState {
    message: string;
    type: "success" | "error";
}

export interface DateRangeState {
    startDate: string;
    endDate: string;
}

export interface CustomerSummaryData {
    totalCustomers: number;
    totalOrders: number;
    bestCustomer: CustomerItem | null;
    averageRating: number;
}