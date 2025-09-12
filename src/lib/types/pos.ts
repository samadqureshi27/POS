export interface PosItem {
    Branch_ID_fk: string;
    POS_ID: string;
    POS_Name: string;
    Status: "Active" | "Inactive";
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

export interface PosModalFormData extends Omit<PosItem, "POS_ID"> { }

export interface PosTableProps {
    posItems: PosItem[];
    filteredItems: PosItem[];
    selectedItems: (string | number)[];
    statusFilter: "" | "Active" | "Inactive";
    onStatusFilterChange: (filter: "" | "Active" | "Inactive") => void;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (id: string, checked: boolean) => void;
    onEditItem: (item: PosItem) => void;
    isAllSelected: boolean;
}