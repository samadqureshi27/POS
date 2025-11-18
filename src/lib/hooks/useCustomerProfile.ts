// hooks/useCustomerProfile.ts
import { useState, useEffect, useMemo } from 'react';
import { CustomerItem, OrderItem } from '@/lib/types/customer-profile';
import { CustomerAPI } from '../util/customer-profile-api';

export const useCustomerProfile = (customerId: number | null) => {
    const [customer, setCustomer] = useState<CustomerItem | null>(null);
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCustomerData = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const [customerResponse, ordersResponse] = await Promise.all([
                CustomerAPI.getCustomerById(id),
                CustomerAPI.getCustomerOrders(id),
            ]);


            if (customerResponse.success) {
                setCustomer(customerResponse.data);
            } else {
                setError(customerResponse.message || "Customer not found");
            }

            if (ordersResponse.success) {
                setOrders(ordersResponse.data);
            }
        } catch (error) {
            console.error("Failed to load customer data", error);
            setError("Failed to load customer data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (customerId !== null) {
            loadCustomerData(customerId);
        } else {
            setError("Invalid customer ID");
            setLoading(false);
        }
    }, [customerId]);

    // Calculate metrics
    const totalSpent = useMemo(() => {
        return orders.reduce((sum, order) => sum + order.Total, 0);
    }, [orders]);

    const averageOrderValue = useMemo(() => {
        return orders.length > 0 ? Math.round(totalSpent / orders.length) : 0;
    }, [totalSpent, orders.length]);

    return {
        customer,
        orders,
        loading,
        error,
        totalSpent,
        averageOrderValue,
        refetch: () => customerId && loadCustomerData(customerId)
    };
};