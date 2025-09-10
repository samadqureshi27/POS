// utils/vendorUtils.ts
import { VendorItem, VendorItemWithUsage } from "@/types/vendors";

export const generateUsageData = (items: VendorItem[]): VendorItemWithUsage[] => {
    return items.map((item) => {
        const seed = item.ID;
        const usageCount = Math.floor((seed * 17 + 23) % 100);
        return {
            ...item,
            usageCount,
        };
    });
};

export const findMostOrderedVendor = (items: VendorItemWithUsage[]): VendorItemWithUsage | null => {
    if (items.length === 0) return null;
    return items.reduce((max, item) =>
        item.usageCount > max.usageCount ? item : max
    );
};

export const findLeastOrderedVendor = (items: VendorItemWithUsage[]): VendorItemWithUsage | null => {
    if (items.length === 0) return null;
    return items.reduce((min, item) =>
        item.usageCount < min.usageCount ? item : min
    );
};

export const filterVendors = (items: VendorItem[], searchTerm: string): VendorItem[] => {
    if (!searchTerm.trim()) return items;

    const q = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
        return (
            item.Name.toLowerCase().includes(q) ||
            item.ID.toString().includes(q) ||
            item.Company_Name.toLowerCase().includes(q) ||
            item.Email.toLowerCase().includes(q) ||
            item.Contact.includes(q)
        );
    });
};

export const validateVendorForm = (data: { Name: string; Company_Name: string; Email: string; Contact: string }): string | null => {
    if (!data.Name.trim() || !data.Company_Name.trim() || !data.Email.trim() || !data.Contact.trim()) {
        return "Please fill in all required fields";
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.Email)) {
        return "Please enter a valid email address";
    }

    return null;
};