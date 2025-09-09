export interface InventoryItem {
    ID: number;
    Name: string;
    Unit: string;
    Status: "Low" | "Medium" | "High";
    InitialStock: number;
    AddedStock: number;
    UpdatedStock: number;
    Threshold: number;
    supplier: string;
    BranchID: number;
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

export interface InventoryModalFormData extends Omit<InventoryItem, "ID" | "BranchID"> { }

export interface InventoryTableProps {
    inventoryItems: InventoryItem[];
    filteredItems: InventoryItem[];
    selectedItems: (string | number)[];
    statusFilter: "" | "Low" | "Medium" | "High";
    unitFilter: string;
    onStatusFilterChange: (filter: "" | "Low" | "Medium" | "High") => void;
    onUnitFilterChange: (filter: string) => void;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (id: number, checked: boolean) => void;
    onEditItem: (item: InventoryItem) => void;
    isAllSelected: boolean;
}