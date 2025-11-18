// hooks/useOrderFilters.ts
import { useState, useMemo } from 'react';
import { OrderItem } from '@/lib/types/customer-profile';
import { useParams } from 'next/navigation';

export const useOrderFilters = (orders: OrderItem[]) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const params = useParams();
    
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.Order_ID.toLowerCase().includes(term) ||
                    order.Order_Number.toLowerCase().includes(term) ||
                    order.Type.toLowerCase().includes(term)
            );
        }

        if (typeFilter) {
            filtered = filtered.filter((order) => order.Type === typeFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter((order) => order.Status === statusFilter);
        }

        return filtered;
    }, [orders, searchTerm, typeFilter, statusFilter]);

    const customerId = useMemo(() => {
        const param = params["customer-profile"];

        if (!param) {
            return null;
        }

        const id = parseInt(param as string);
        return isNaN(id) ? null : id;
    }, [params]);
    return {
        searchTerm,
        setSearchTerm,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        filteredOrders,
        customerId
    };
};