import { useState, useEffect, useMemo } from 'react';
import { StaffItem, StaffSummaryData, StaffDataHook } from '@/types/payroll';
import { StaffAPI } from '../utility/staff-payroll-API';

export const useStaffData = (branchId: string | null): StaffDataHook => {
    const [staffItems, setStaffItems] = useState<StaffItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadStaffItems = async () => {
        if (!branchId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await StaffAPI.getStaffItemsByBranch(branchId);
            if (!response.success) throw new Error(response.message);
            setStaffItems(response.data);
        } catch (error) {
            throw error; // Let the parent component handle the error
        } finally {
            setLoading(false);
        }
    };

    // Load staff items when branchId is available
    useEffect(() => {
        if (branchId) {
            loadStaffItems().catch(() => {
                // Error handling will be done in the component
            });
        }
    }, [branchId]);

    // Calculate summary data - using filtered staff items for branch-specific data
    const summaryData = useMemo((): StaffSummaryData => {
        const totalStaff = staffItems.length;
        const paidStaff = staffItems.filter(item => item.Status === "Paid").length;
        const unpaidStaff = staffItems.filter(item => item.Status === "Unpaid").length;
        const totalSalaries = staffItems.reduce((sum, item) => sum + item.Salary, 0);
        const paidSalaries = staffItems
            .filter(item => item.Status === "Paid")
            .reduce((sum, item) => sum + item.Salary, 0);
        const unpaidSalaries = staffItems
            .filter(item => item.Status === "Unpaid")
            .reduce((sum, item) => sum + item.Salary, 0);

        return {
            totalStaff,
            paidStaff,
            unpaidStaff,
            totalSalaries,
            paidSalaries,
            unpaidSalaries,
        };
    }, [staffItems]);

    return {
        staffItems,
        loading,
        loadStaffItems,
        summaryData,
    };
};