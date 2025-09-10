import { ReactNode } from "react";

// API and Data Types
export interface StaffItem {
    STAFF_ID: string;
    Name: string;
    Contact: string;
    Status: "Paid" | "Unpaid";
    Role: string;
    Salary: number;
    JoinDate: string;
    Branch_ID_fk: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Date Filter Types
export interface DateRange {
    startDate: Date;
    endDate: Date;
    key: string;
}

export interface DateFilterHook {
    activeTimePeriod: string;
    setActiveTimePeriod: (period: string) => void;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    customDateRange: DateRange[];
    setCustomDateRange: (range: DateRange[]) => void;
    calendarRef: React.RefObject<HTMLDivElement>;
    getDateRange: (period: string) => { start: Date; end: Date } | null;
    formatDisplayDate: (date: Date) => string;
    periods: string[];
}

// Staff Data Types
export interface StaffSummaryData {
    totalStaff: number;
    paidStaff: number;
    unpaidStaff: number;
    totalSalaries: number;
    paidSalaries: number;
    unpaidSalaries: number;
}

export interface StaffDataHook {
    staffItems: StaffItem[];
    loading: boolean;
    loadStaffItems: () => Promise<void>;
    summaryData: StaffSummaryData;
}

// Filter Types
export interface FiltersHook {
    // Search
    searchInput: string;
    setSearchInput: (input: string) => void;
    searchTerm: string;

    // Filters
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    roleFilter: string;
    setRoleFilter: (role: string) => void;

    // Dropdown states
    statusDropdownOpen: boolean;
    setStatusDropdownOpen: (open: boolean) => void;
    roleDropdownOpen: boolean;
    setRoleDropdownOpen: (open: boolean) => void;

    // Filtered data
    filteredItems: StaffItem[];
}

// Toast Types
export interface ToastData {
    message: string;
    type: "success" | "error";
}

export interface ToastHook {
    toast: ToastData | null;
    showToast: (message: string, type: "success" | "error") => void;
    hideToast: () => void;
}

// Component Props Types
export interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
}

export interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

export interface DateFilterProps {
    dateFilter: DateFilterHook;
}

export interface StaffTableProps {
    filteredItems: StaffItem[];
    staffItems: StaffItem[];
    filters: FiltersHook;
    branchId: string;
}