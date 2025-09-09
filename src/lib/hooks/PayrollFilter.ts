import { useState, useEffect, useMemo } from 'react';
import { StaffItem, DateFilterHook, FiltersHook } from '@/types/payroll';

export const useFilters = (
    staffItems: StaffItem[],
    dateFilter: DateFilterHook
): FiltersHook => {
    // Debounced search
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Dropdown states
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => setSearchTerm(searchInput), 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Memoized filtering
    const filteredItems = useMemo(() => {
        const s = searchTerm.toLowerCase();
        return staffItems.filter((item) => {
            const matchesSearch =
                item.Name.toLowerCase().includes(s) ||
                item.Contact.toLowerCase().includes(s) ||
                item.Role.toLowerCase().includes(s) ||
                item.STAFF_ID.toLowerCase().includes(s);

            const matchesStatus = statusFilter ? item.Status === statusFilter : true;
            const matchesRole = roleFilter ? item.Role === roleFilter : true;

            // Date filtering based on time period
            let matchesDate = true;
            const dateRange = dateFilter.getDateRange(dateFilter.activeTimePeriod);

            if (dateRange) {
                const itemDate = new Date(item.JoinDate);
                matchesDate = itemDate >= dateRange.start && itemDate <= dateRange.end;
            }

            return matchesSearch && matchesStatus && matchesRole && matchesDate;
        });
    }, [staffItems, searchTerm, statusFilter, roleFilter, dateFilter.activeTimePeriod, dateFilter.customDateRange]);

    return {
        searchInput,
        setSearchInput,
        searchTerm,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        statusDropdownOpen,
        setStatusDropdownOpen,
        roleDropdownOpen,
        setRoleDropdownOpen,
        filteredItems,
    };
};