// utils/paymentUtils.ts
import { PaymentMethod } from "@/lib/types/payment";

export const calculatePaymentStats = (paymentMethods: PaymentMethod[]) => {
    const activeMethodsCount = paymentMethods.filter(m => m.Status === "Active").length;

    const mostUsedTaxType = paymentMethods.reduce((acc, method) => {
        acc[method.TaxType] = (acc[method.TaxType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topTaxType = Object.entries(mostUsedTaxType).sort(([, a], [, b]) => b - a)[0];

    return {
        activeMethodsCount,
        topTaxType
    };
};