import { PaymentMethod, ApiResponse } from '@/types/payment';

export class PaymentAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    // Mock data for PaymentMethod
    private static mockData: PaymentMethod[] = [
        {
            ID: 1,
            Name: "Cash Payment",
            PaymentType: "Cash",
            TaxType: "GST",
            TaxPercentage: 16,
            Status: "Active",
            CreatedDate: "2024-01-15",
            LastUsed: "2024-08-20",
        },
        {
            ID: 2,
            Name: "Credit Card",
            PaymentType: "Card",
            TaxType: "GST",
            TaxPercentage: 16,
            Status: "Active",
            CreatedDate: "2024-01-15",
            LastUsed: "2024-08-21",
        },
        {
            ID: 3,
            Name: "Online Transfer",
            PaymentType: "Online",
            TaxType: "VAT",
            TaxPercentage: 5,
            Status: "Active",
            CreatedDate: "2024-02-01",
            LastUsed: "2024-08-19",
        },
        {
            ID: 4,
            Name: "Debit Card",
            PaymentType: "Card",
            TaxType: "GST",
            TaxPercentage: 16,
            Status: "Inactive",
            CreatedDate: "2024-03-10",
            LastUsed: "2024-07-15",
        },
        {
            ID: 5,
            Name: "Mobile Payment",
            PaymentType: "Online",
            TaxType: "Service Tax",
            TaxPercentage: 8,
            Status: "Active",
            CreatedDate: "2024-04-05",
            LastUsed: "2024-08-20",
        },
    ];

    // ✅ GET /api/payment-methods/
    static async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
        await this.delay(800);
        return {
            success: true,
            data: [...this.mockData],
            message: "Payment methods fetched successfully",
        };
    }

    // ✅ POST /api/payment-methods/
    static async createPaymentMethod(
        method: Omit<PaymentMethod, "ID">
    ): Promise<ApiResponse<PaymentMethod>> {
        await this.delay(1000);
        const newId = this.mockData.length > 0 ? Math.max(...this.mockData.map(i => i.ID)) + 1 : 1;
        const newMethod: PaymentMethod = {
            ...method,
            ID: newId,
        };
        this.mockData.push(newMethod);
        return {
            success: true,
            data: newMethod,
            message: "Payment method created successfully",
        };
    }

    // ✅ PUT /api/payment-methods/{id}/
    static async updatePaymentMethod(
        id: number,
        method: Partial<PaymentMethod>
    ): Promise<ApiResponse<PaymentMethod>> {
        await this.delay(800);
        const index = this.mockData.findIndex((i) => i.ID === id);
        if (index === -1) throw new Error("Payment method not found");

        this.mockData[index] = { ...this.mockData[index], ...method };
        return {
            success: true,
            data: this.mockData[index],
            message: "Payment method updated successfully",
        };
    }

    // ✅ DELETE /api/payment-methods/{id}/
    static async deletePaymentMethod(id: number): Promise<ApiResponse<null>> {
        await this.delay(600);
        const index = this.mockData.findIndex((i) => i.ID === id);
        if (index === -1) throw new Error("Payment method not found");

        this.mockData.splice(index, 1);

        // Reassign IDs sequentially
        this.mockData = this.mockData.map((item, idx) => ({
            ...item,
            ID: idx + 1,
        }));

        return {
            success: true,
            data: null,
            message: "Payment method deleted successfully",
        };
    }

    // ✅ DELETE /api/payment-methods/bulk-delete/
    static async bulkDeletePaymentMethod(
        ids: number[]
    ): Promise<ApiResponse<null>> {
        await this.delay(1000);
        this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

        // Reassign IDs sequentially
        this.mockData = this.mockData.map((item, idx) => ({
            ...item,
            ID: idx + 1,
        }));

        return {
            success: true,
            data: null,
            message: `${ids.length} payment methods deleted successfully`,
        };
    }
}