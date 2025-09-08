// hooks/usePaymentFilters.ts
import { useState, useMemo } from "react";
import { PaymentMethod } from "../../types/payment";

export const usePaymentFilters = (paymentMethods: PaymentMethod[]) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "" | "Cash" | "Card" | "Online"
    >("");
    const [taxTypeFilter, setTaxTypeFilter] = useState("");

    const filteredItems = useMemo(() => {
        return paymentMethods.filter((item) => {
            const q = searchTerm.trim().toLowerCase();
            const matchesQuery =
                q === "" ||
                item.Name.toLowerCase().includes(q) ||
                item.ID.toString().includes(q) ||
                item.TaxType.toLowerCase().includes(q);
            const matchesStatus = statusFilter
                ? item.PaymentType === statusFilter
                : true;
            const matchesTaxType = taxTypeFilter
                ? item.TaxType === taxTypeFilter
                : true;
            return matchesQuery && matchesStatus && matchesTaxType;
        });
    }, [paymentMethods, searchTerm, statusFilter, taxTypeFilter]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        taxTypeFilter,
        setTaxTypeFilter,
        filteredItems,
    };
};
