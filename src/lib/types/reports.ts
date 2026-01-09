import { ApiResponse, ToastState } from "./common";

// Re-export ApiResponse for consumers of this module
export type { ApiResponse };

export interface ReportItem {
    ID: number;
    Branch_ID_fk: string;
    Name: string;
    Unit: string;
    InitialStock: number;
    Purchased: number;
    Used: number;
    Variance: number;
    Wasteage: number;
    ClosingStock: number;
    Total_Value: number;
}

export interface ToastProps extends ToastState {
    onClose: () => void;
}

export interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
}

export interface ReportsTableProps {
    reportItems: ReportItem[];
    filteredItems: ReportItem[];
    unitFilter: string;
    onUnitFilterChange: (filter: string) => void;
}