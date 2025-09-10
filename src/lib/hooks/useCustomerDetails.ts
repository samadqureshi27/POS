// hooks/useCustomers.ts
import { useState, useEffect, useMemo } from 'react';
import { CustomerItem, ToastState, CustomerSummaryData } from '@/types/customer-details';
import { CustomerAPI } from '../util/CustomerDetailsAPI';
import { filterCustomers, calculateCustomerSummary } from '../util/CustomerDetailsUtils';

export const useCustomers = () => {
    const [customerItems, setCustomerItems] = useState<CustomerItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCustomerItems = async () => {
        try {
            setLoading(true);
            const response = await CustomerAPI.getCustomerItems();
            if (!response.success) throw new Error(response.message);
            setCustomerItems(response.data);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to load customer items' };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomerItems();
    }, []);

    return {
        customerItems,
        loading,
        loadCustomerItems
    };
};

export const useCustomerFiltering = (customers: CustomerItem[]) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => setSearchTerm(searchInput), 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const filteredCustomers = useMemo(() => {
        return filterCustomers(customers, searchTerm);
    }, [customers, searchTerm]);

    return {
        searchInput,
        searchTerm,
        setSearchInput,
        setSearchTerm,
        filteredCustomers
    };
};

export const useCustomerSummary = (customers: CustomerItem[]): CustomerSummaryData => {
    return useMemo(() => {
        return calculateCustomerSummary(customers);
    }, [customers]);
};

export const useToast = () => {
    const [toast, setToast] = useState<ToastState | null>(null);

    // Auto-close toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    return {
        toast,
        showToast,
        hideToast: () => setToast(null)
    };
};