export interface PosItem {
    Branch_ID_fk: string;
    POS_ID: string;
    POS_Name: string;
    Status: "active" | "inactive";
    machineId?: string;
    metadata?: Record<string, any>;
    currentTillSession?: TillSession;
}

export interface TillSession {
    _id: string;
    branchId: string;
    posId: string;
    openedBy: string;
    openedAt: string;
    closedAt?: string;
    closedBy?: string;
    openingAmount: number;
    declaredClosingAmount?: number;
    systemClosingAmount?: number;
    cashCounts?: Record<string, number>;
    notes?: string;
    status: "open" | "closed";
}

export interface OpenTillRequest {
    branchId: string;
    posId: string;
    openingAmount: number;
    cashCounts?: Record<string, number>;
    notes?: string;
}

export interface CloseTillRequest {
    branchId: string;
    posId: string;
    tillSessionId: string;
    declaredClosingAmount: number;
    systemClosingAmount: number;
    cashCounts?: Record<string, number>;
    notes?: string;
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
    statusFilter: "" | "active" | "inactive";
    onStatusFilterChange: (filter: "" | "active" | "inactive") => void;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (id: string, checked: boolean) => void;
    onEditItem: (item: PosItem) => void;
    isAllSelected: boolean;
}