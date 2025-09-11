export interface VendorItem {
    ID: number;
    Company_Name: string;
    Name: string;
    Contact: string;
    Address: string;
    Email: string;
    Branch_ID_fk: number; // Changed from Branch_ID to Branch_ID_fk
    orderCount?: number; // Added optional orderCount field
}

export interface VendorItemWithUsage extends VendorItem {
    usageCount: number;
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

export interface VendorFormData extends Omit<VendorItem, "ID" | "Branch_ID_fk"> { 
    // This now automatically includes all fields except ID and Branch_ID_fk
}

export interface VendorTableProps {
    vendorItems: VendorItem[];
    filteredItems: VendorItem[];
    selectedItems: (number | string)[];
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (id: number, checked: boolean) => void;
    onEditItem: (vendor: VendorItem) => void;
    isAllSelected: boolean;
    branchId: number;
}

export interface VendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingItem: VendorItem | null;
    formData: VendorFormData;
    actionLoading: boolean;
    branchId: number;
    onSubmit: (data: VendorFormData) => void;
    onFormDataChange: (updates: Partial<VendorFormData>) => void;
}