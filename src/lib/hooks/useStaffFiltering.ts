import { useState, useEffect, useMemo } from "react";
import { StaffItem } from "@/lib/types/staff-management";

export const useStaffFiltering = (staffItems: StaffItem[]) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
    const [roleFilter, setRoleFilter] = useState("");

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
                item.Role.toLowerCase().includes(s) ||
                item.Contact.toLowerCase().includes(s) ||
                item.Address.toLowerCase().includes(s) ||
                item.CNIC.toLowerCase().includes(s);
            const matchesStatus = statusFilter ? item.Status === statusFilter : true;
            const matchesRole = roleFilter ? item.Role === roleFilter : true;
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [staffItems, searchTerm, statusFilter, roleFilter]);

    return {
        searchInput,
        setSearchInput,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        filteredItems,
    };
};