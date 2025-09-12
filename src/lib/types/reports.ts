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

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ToastProps {
    message: string;
    type: "success" | "error";
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